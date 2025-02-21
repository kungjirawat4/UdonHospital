import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import BaseController from '../BaseController';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { RouteDefinition } from '../../types/RouteDefinition';
import { db } from '../../lib/prisma.db';
import path from 'path';

import sharp from 'sharp';
import { hashedPassword } from '../../lib/helpers';

/**
 * Status controller
 */
export default class UdhErrorUserController extends BaseController {
	// base path
	public basePath = 'erroruser';

	/**
	 *
	 */
	public routes(): RouteDefinition[] {
		return [
			{
				path: '/',
				method: 'get',
				handler: this.getErroruser.bind(this),
			},
			// {
			// 	path: '/profile/:id',
			// 	method: 'put',
			// 	handler: this.putProfile.bind(this),
			// },
			// {
			// 	path: '/uploads',
			// 	method: 'post',
			// 	handler: this.uploadFile.bind(this),
			// },
			// {
			// 	path: '/edit/:id',
			// 	method: 'put',
			// 	handler: this.editUsers.bind(this),
			// },
			// {
			// 	path: '/client-permissions/:id',
			// 	method: 'put',
			// 	handler: this.editClientPermissions.bind(this),
			// },
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
	public async getErroruser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const [erroruser] = await Promise.all([
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


			]);
			if (!erroruser ) throw new ApiError('Invalid Erroruser', StatusCodes.BAD_REQUEST);

			const response = {
				erroruser,
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
	public getError(req: Request, res: Response, next: NextFunction): void {
		try {
			throw new ApiError(null, StatusCodes.BAD_REQUEST);
		} catch (error) {
			// from here error handler will get call
			next(error);
		}
	}

}
