import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import BaseController from '../BaseController';
import 'dotenv/config';
import { RouteDefinition } from '../../types/RouteDefinition';
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { db } from '../../lib/prisma.db';

import { roles } from '../../config/data';
import { User } from '@prisma/client';

// import cron from "node-cron";
/**
 * Auth controller
 */
export default class AuthUserController extends BaseController {
	// base path
	public basePath = 'auth';

	/**
	 *
	 */
	public routes(): RouteDefinition[] {
		return [
			{
				path: '/login',
				method: 'post',
				handler: this.postLogin.bind(this),
			},
			{
				path: '/register',
				method: 'post',
				handler: this.registerUserHandler.bind(this),
			},
			{
				path: '/verification',
				method: 'post',
				handler: this.verificationHandler.bind(this),
			},
			{
				path: '/error',
				method: 'get',
				handler: this.getError.bind(this),
			},
			// These are the examples added here to follow if we need to create a different type of HTTP method.
			{ path: '/', method: 'post', handler: this.getError.bind(this) },
			{ path: '/', method: 'put', handler: this.getError.bind(this) },
			{ path: '/', method: 'patch', handler: this.getError.bind(this) },
			{ path: '/', method: 'delete', handler: this.getError.bind(this) },
		];
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async postLogin(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {

			const { email, password } = req.body

			let user: User;

			if (password.length > 13) {

				user = await db.user.findUnique({
					where: {
						email: email.toLowerCase(),
						password: password as string
					},
				})
				if (!user) {
					// return new AppError(400, 'Invalid email or password');
					throw new ApiError('Invalid email or password', StatusCodes.UNAUTHORIZED);
				}



			} else {
				user = await db.user.findUnique({
					where: {
						email: email.toLowerCase(),
					},
				})
				if (!user || !(await bcrypt.compare(password, user?.password))) {
					// return new AppError(400, 'Invalid email or password');
					throw new ApiError('Invalid email or password', StatusCodes.UNAUTHORIZED);
				}
			}

			const role =
				user.roleId &&
				(await db.role.findFirst({
					where: {
						id: user.roleId,
					},
					include: {
						clientPermissions: {
							select: {
								menu: true,
								sort: true,
								path: true,
								name: true,
							},
						},
					},
				}))

			// if (!role) return getErrorResponse('Role not found', 404)

			const routes = role.clientPermissions

			interface Route {
				menu?: string
				name?: string
				path?: string
				open?: boolean
				sort?: number
			}
			interface RouteChildren extends Route {
				children?: { menu?: string; name?: string; path?: string }[] | any
			}
			const formatRoutes = (routes: Route[]) => {
				const formattedRoutes: RouteChildren[] = []

				routes.forEach((route) => {
					if (route.menu === 'hidden') return null
					if (route.menu === 'profile') return null

					if (route.menu === 'normal') {
						formattedRoutes.push({
							name: route.name,
							path: route.path,
							sort: route.sort,
						})
					} else {
						const found = formattedRoutes.find((r) => r.name === route.menu)
						if (found) {
							found.children.push({ name: route.name, path: route.path })
						} else {
							formattedRoutes.push({
								name: route.menu,
								sort: route.sort,
								open: false,
								children: [{ name: route.name, path: route.path }],
							})
						}
					}
				})

				return formattedRoutes
			}

			const sortMenu: any = (menu: any[]) => {
				const sortedMenu = menu.sort((a, b) => {
					if (a.sort === b.sort) {
						if (a.name < b.name) {
							return -1
						} else {
							return 1
						}
					} else {
						return a.sort - b.sort
					}
				})

				return sortedMenu.map((m) => {
					if (m.children) {
						return {
							...m,
							children: sortMenu(m.children),
						}
					} else {
						return m
					}
				})
			}

			const config = await db.configure.findFirst();

			// const sessionToken = jwt.sign(user.id, process.env.JWT_SECRET);

			await db.session.upsert({
				where: {
					userId: user.id as string,
				},
				update: {},
				create: {
					userId: user.id as string,
					sessionToken: jwt.sign(user.id, process.env.JWT_SECRET),
					expires: new Date(Date.now() + (1 * 20 * 3600 * 1000))   // 20 ชั่งโมง
				},
			})

			const response = {
				id: user.id,
				userKey: user.userKey,
				name: user.name,
				email: user.email,
				status: user.status,
				image: user.image,
				role: role.type,
				routes,
				logo: config?.hospital_logo,
				menu: sortMenu(formatRoutes(routes) as any[]),
				token: jwt.sign(user.id, process.env.JWT_SECRET),
				message: 'User has been logged in successfully',
			}

			res.locals.data = response;
			// call base class method
			super.send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async registerUserHandler(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_API_URL } = process.env;
			const { name, email, password } = await req.body


			const user = email && (await db.user.findFirst({ where: { email: email.toLowerCase() } }));
			if (user) {
				if (user.email === email.toLowerCase())
					throw new ApiError('อีเมล์นี้ถูกใช้งานไปแล้ว', StatusCodes.FORBIDDEN);
				// if (user.status === 'INACTIVE')
				// 	throw new ApiError('User is inactive', StatusCodes.FORBIDDEN);
				// if (user.status === 'ACTIVE')
				// throw new ApiError('User is inactive', StatusCodes.CONFLICT);
			}

			const hashedPassword = await bcrypt.hash(password, 12);
			const verifyCode = crypto.randomBytes(32).toString('hex');
			const verificationCode = crypto
				.createHash('sha256')
				.update(verifyCode)
				.digest('hex');
			const resetPasswordExpire = Date.now() + 10 * (60 * 1000)
			const roleId = roles.find((item) => item.type === 'AUTHENTICATED')?.id
			await db.user.upsert({
				where: { email: email.toLowerCase() },
				create: {
					name,
					qrCode: password && (`${NEXT_PUBLIC_API_URL}/auth/login?email=${email.toLowerCase()}&password=${hashedPassword}`),
					email: email.toLowerCase(),
					address: 'Udonthani Hospital',
					status: 'PENDING_VERIFICATION',
					roleId: `${roleId}`,
					image: `${NEXT_PUBLIC_APP_URL}/udh/avatar.png`,
					password: hashedPassword,
					resetPasswordToken: verificationCode,
					resetPasswordExpire: resetPasswordExpire,
				},
				update: {
					qrCode: password && (`${NEXT_PUBLIC_API_URL}/auth/login?email=${email.toLowerCase()}&password=${hashedPassword}`),
					status: 'PENDING_VERIFICATION',
					resetPasswordToken: verificationCode,
					resetPasswordExpire: resetPasswordExpire,
					password: hashedPassword,
				},
			})
			const response = {
				confirm: `${NEXT_PUBLIC_APP_URL}/auth/verification/${verifyCode}`,
				message: 'User has been register in successfully',
			}

			res.locals.data = response;
			// call base class method
			super.send(res);
		} catch (error) {
			// from here error handler will get call
			next(error);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async verificationHandler(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { verificationToken } = await req.body

			if (!verificationToken) throw new ApiError('nvalid request', StatusCodes.UNAUTHORIZED);
			const resetPasswordToken = crypto.createHash('sha256').update(verificationToken).digest('hex')

			const user =
				resetPasswordToken &&
				(await db.user.findFirst({
					where: {
						resetPasswordToken,
						resetPasswordExpire: { gt: Date.now() },
					},
				}))

			if (!user)
				throw new ApiError('Invalid token or expired, please register your account again', StatusCodes.UNAUTHORIZED);

			await db.user.update({
				where: { id: user.id },
				data: {
					resetPasswordToken: null,
					resetPasswordExpire: null,
					status: 'ACTIVE',
				},
			})
			const response = {
				message: 'Account has been verified successfully',
			}

			res.locals.data = response;
			// call base class method
			super.send(res);
		} catch (error) {
			// from here error handler will get call
			next(error);
		}
	}


	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getError(req: Request, res: Response, next: NextFunction): void {
		try {
			throw new ApiError(null, StatusCodes.BAD_REQUEST);
		} catch (error) {
			// from here error handler will get call
			next(error);
		}
	}

}
