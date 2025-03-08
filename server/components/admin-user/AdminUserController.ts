import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import BaseController from '../BaseController';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { RouteDefinition } from '../../types/RouteDefinition';
import { db } from '../../lib/prisma.db';
import path from 'path';
import sharp from 'sharp';;

/**
 * Status controller
 */
export default class AdminUserController extends BaseController {
	// base path
	public basePath = 'users';

	/**
	 *
	 */
	public routes(): RouteDefinition[] {
		return [
			{
				path: '/',
				method: 'get',
				handler: this.getUser.bind(this),
			},
			{
				path: '/profile/:id',
				method: 'put',
				handler: this.putProfile.bind(this),
			},
			{
				path: '/uploads',
				method: 'post',
				handler: this.uploadFile.bind(this),
			},
			{
				path: '/edit/:id',
				method: 'put',
				handler: this.editUsers.bind(this),
			},
			// {
			// 	path: '/client-permissions/:id',
			// 	method: 'put',
			// 	handler: this.editClientPermissions.bind(this),
			// },
			{
				path: '/roles',
				method: 'post',
				handler: this.postRoles.bind(this),
			},
			{
				path: '/roles/:id',
				method: 'delete',
				handler: this.deleteRoles.bind(this),
			},
			{
				path: '/user',
				method: 'post',
				handler: this.postUser.bind(this),
			},
			{
				path: '/user/:id',
				method: 'put',
				handler: this.postUser.bind(this),
			},
			{
				path: '/user/:id',
				method: 'delete',
				handler: this.deleteUser.bind(this),
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
	public async getUser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const [session, users, userError,
				// sqlSelect, countArrang
			] = await Promise.all([
				db.session.findMany({
					select: {
						id: true,
						createdAt: true,
						expires: true,
						user: {
							select: {
								name: true,
								email: true,
								image: true,
								status: true,
								bio: true,
								role: {
									select: {
										name: true,
									}
								},
								_count: {
									select: {
										queue: { where: { userId: { not: null } } },
										prescription: { where: { userId: { not: null } } },
										arranged: {
											where: { userId: { not: null } },
										},

									},
								},
							},
						}
					}
				}),

				db.session.findMany({
					select: {
						id: true,
						createdAt: true,
						expires: true,
						user: {
							select: {
								name: true,
								email: true,
								image: true,
								status: true,
								bio: true,
								role: {
									select: {
										name: true,
									}
								},
								_count: {
									select: {
										queue: { where: { userId: { not: null } } },
										prescription: { where: { userId: { not: null } } },
										arranged: {
											where: {
												AND: [

													{ user_arrang: { not: null } }
												],
											}
										},

									},
								},
							},
						},

					},
					take: 5,
					// orderBy:{createdAt:'desc'}
					orderBy: {
						createdAt: 'desc',
					}
				}),

				db.session.findMany({
					select: {
						id: true,
						createdAt: true,
						expires: true,
						user: {
							select: {
								name: true,
								email: true,
								image: true,
								status: true,
								bio: true,
								role: {
									select: {
										name: true,
									}
								},
								_count: {
									select: {
										// queue: { where: { userId: { not: null } } },
										// prescription: { where: { userId: { not: null } } },
										arranged: {
											where: {
												userId: { not: null },
												OR: [
													{ error00: { not: null } },
													{ error01: { not: null } },
													{ error02: { not: null } },
													{ error03: { not: null } },
													{ error04: { not: null } },
													{ error05: { not: null } },
													{ error06: { not: null } },
													{ error07: { not: null } },
													{ error08: { not: null } },
													{ error09: { not: null } },
													{ error10: { not: null } },
												]
											},
										},

									},
								},
							},
						}
					}
				}),

				// db.$queryRaw`select count(*),  error01 from arrangeds where NOT(user_id is null) and (user_arrang is null) group by error01`,
				// db.$queryRaw`select count(*) from arrangeds where NOT(user_id is null) and NOT(user_arrang is null)`


			]);

			if (!session && !users) throw new ApiError('Invalid user login', StatusCodes.BAD_REQUEST);
			// const count = sqlSelect[0].count.toString();
			// const countArr = countArrang[0].count.toString();
			users.sort((a, b) => {
				// คำนวณการจัดเรียงตามจำนวน `arranged`
				const countA = a.user._count.arranged || 0;
				const countB = b.user._count.arranged || 0;
				return countB - countA; // เรียงจากมากไปน้อย
			});
			const response = {
				session,
				users,
				userError,
				// sqlSelect: [ count, sqlSelect[1] ],
				// countArrang: countArr,
				message: 'Session has been login successfully',
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
	public async putProfile(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { NEXT_PUBLIC_API_URL } = process.env;
			const { idCard, name, address, mobile, bio, image, password } = await req.body;

			const user = await db.user.findUnique({
				where: { id: req.params.id },
			})

			if (!user) throw new ApiError('Invalid user profile', StatusCodes.BAD_REQUEST);
			let hashedPassword = '';

			if (password) hashedPassword = await bcrypt.hash(password, 12);
			const result = await db.user.update({
				where: { id: req.params.id },
				data: {
					...(password && { password: hashedPassword, qrCode: password && (`${NEXT_PUBLIC_API_URL}/auth/login?email=${user.email}&password=${hashedPassword}`) }),
					idCard: idCard || user.idCard,
					name: name || user.name,
					mobile: String(mobile) || user.mobile as string,
					address: address || user.address,
					image: image || user.image,
					bio: bio || user.bio,
				},
			})

			const response = {
				qrCode: result.qrCode,
				idCard: result.idCard,
				name: result.name,
				email: result.email,
				image: result.image,
				mobile: result.mobile,
				message: 'Profile has been updated successfully',
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
	public async uploadFile(
		req: any,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { NEXT_PUBLIC_APP_URL } = process.env;
			const { type } = req.query;
			const files = req.files.file
			const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? '', 'public/udh/uploads');

			if (!req.files) throw new ApiError('Invalid user profile', StatusCodes.BAD_REQUEST);
			// const allowedImageTypes = ['.png', '.jpg', '.jpeg', '.gif']
			// const allowedDocumentTypes = ['.pdf', '.doc', '.docx', '.txt']
			// const allowedTypes = ['document', 'image']

			const filesOverLimit = []
			if (files.length > 0) {
				Object.keys(files).forEach(async key => {
					filesOverLimit.push({
						// 'name': files[key].name, 
						// 'size': files[key].size, 
						// 'type': files[key].mimetype, 
						'url': `${NEXT_PUBLIC_APP_URL}/udh/uploads/${files[key].name}`
					});
					await sharp(files[key].data)
						.resize(200)
						.toFile(`${UPLOAD_DIR}/${files[key].name}`);
				})
			} else {
				filesOverLimit.push({ 'url': `${NEXT_PUBLIC_APP_URL}/udh/uploads/${files.name}` })
				await sharp(files.data)
					.resize(200)
					.toFile(`${UPLOAD_DIR}/${files.name}`);
			}

			const response = {
				data: filesOverLimit,
				message: 'Upload has been successfully',
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
	public async editUsers(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { NEXT_PUBLIC_API_URL } = process.env;
			const { id } = req.params
			const { name, status, password, email, roleId } = req.body

			const role = roleId && (await db.role.findFirst({ where: { id: roleId } }))
			if (!role) throw new ApiError('Role not found', StatusCodes.FORBIDDEN);

			const user = email && id &&
				(await db.user.findFirst({
					where: { email: email.toLowerCase(), id: id },
				}))
			if (!user) throw new ApiError('User already exists', StatusCodes.CONFLICT);

			let newPassword: any
			let newQr: string | any
			if (password) {
				newPassword = await bcrypt.hash(password, 12);
				newQr = `${NEXT_PUBLIC_API_URL}/auth/login?email=${email.toLowerCase()}&password=${newPassword}`;
			}

			console.log(password)
			const userObj = await db.user.update({
				where: { id: id },
				data: {
					name,
					email: email.toLowerCase(),
					status,
					roleId: role.id,
					qrCode: password ? newQr : user.qrCode,
					password: password ? newPassword : user?.password
				},
			})
			if (!userObj) throw new ApiError('User not found', StatusCodes.NOT_FOUND);

			const response = {
				message: 'User has been updated successfully',
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
	public async postRoles(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				name,
				description,
				permissions: permissionRequest,
				clientPermissions: clientPermissionRequest,
			} = await req.body;

			let type
			let permission = []
			let clientPermission = []
			if (name) type = name.toUpperCase().trim().replace(/\s+/g, '_')

			if (permissionRequest) {
				if (Array.isArray(permissionRequest)) {
					permission = permissionRequest
				} else {
					permission = [permissionRequest]
				}
			}

			if (clientPermissionRequest) {
				if (Array.isArray(clientPermissionRequest)) {
					clientPermission = clientPermissionRequest
				} else {
					clientPermission = [clientPermissionRequest]
				}
			}

			permission = permission?.filter((per) => per)
			clientPermission = clientPermission?.filter((client) => client)

			const checkExistence =
				name &&
				(await db.role.findFirst({
					where: { name: { equals: name } },
				}))
			if (checkExistence) throw new ApiError('Role already exist', StatusCodes.BAD_REQUEST);

			const roleObj = await db.role.create({
				data: {
					name,
					description,
					type,
					permissions: {
						connect: permission?.map((pre) => ({ id: pre })),
					},
					clientPermissions: {
						connect: clientPermission?.map((client) => ({ id: client })),
					},
				},
			})
			// console.log(req.body);
			const response = {
				// ...presciptionObj,
				roleObj,
				message: `Role has been create successfully`,
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
	public async deleteRoles(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// const { NEXT_PUBLIC_API_URL } = process.env;
			// const values = await req.body;
			const roleObj = await db.role.delete({
				where: { id: req.params.id },
			});
			if (!roleObj) throw new ApiError('Role not found', StatusCodes.BAD_REQUEST);
			// console.log(req.body);
			const response = {
				...roleObj,
				message: 'Role has been removed successfully',
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
	public async postUser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_API_URL } = process.env;
			const { name, email, password, status, roleId } = await req.body;

			const role =
				roleId && (await db.role.findFirst({ where: { id: roleId } }))
			if (!role) throw new ApiError('Role not found', StatusCodes.NOT_FOUND);

			const user =
				email &&
				(await db.user.findFirst({
					where: { email: email.toLowerCase() },
				}))
			if (user) throw new ApiError('User already exists', StatusCodes.CONFLICT);
			const hashedPassword = await bcrypt.hash(password, 12);
			const userObj = await db.user.create({
				data: {
					name,
					qrCode: password && (`${NEXT_PUBLIC_API_URL}/auth/login?email=${email.toLowerCase()}&password=${hashedPassword}`),
					email: email.toLowerCase(),
					address: 'Udonthani Hospital',
					status,
					roleId: role.id,
					image: `${NEXT_PUBLIC_APP_URL}/udh/avatar.png`,
					password: hashedPassword,
				},
			})

			userObj.password = undefined as any
			// console.log(req.body);
			const response = {
				userObj,
				message: `User has been create successfully`,
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
	public async deleteUser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const userObj = await db.user.delete({
				where: { id: req.params.id },
				include: {
					role: {
						select: {
							type: true,
						},
					},
				},
			});
			// if (!userObj) return getErrorResponse('User not found', 404)
			if (!userObj) throw new ApiError('User not found', StatusCodes.NOT_FOUND);
			// if (userObj.role.type === 'SUPER_ADMIN')
			// 	// return getErrorResponse('You cannot delete a super admin', 403)
			// 	throw new ApiError('You cannot delete a super admin', StatusCodes.FORBIDDEN);
			const userRemove = await db.user.delete({
				where: {
					id: userObj.id,
				},
			})

			if (!userRemove) {
				// return getErrorResponse('User not removed', 404)
				throw new ApiError('User not removed', StatusCodes.NOT_FOUND);
			}

			userObj.password = undefined as any

			// console.log(req.body);
			const response = {
				...userObj,
				message: 'user has been removed successfully',
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
	public getError(req: Request, res: Response, next: NextFunction): void {
		try {
			throw new ApiError(null, StatusCodes.BAD_REQUEST);
		} catch (error) {
			// from here error handler will get call
			next(error);
		}
	}

}
