import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import BaseController from '../BaseController';

import { RouteDefinition } from '../../types/RouteDefinition';
import { dayjsEndDate, dayjsStartDate } from '../../lib/date';
import { db } from '../../lib/prisma.db';
import axios from 'axios';
import { publishMessage } from '../../lib/mqttservice';

/**
 * Status controller
 */
export default class UdhAutoloadController extends BaseController {
	// base path
	public basePath = 'autoload';

	/**
	 *
	 */
	public routes(): RouteDefinition[] {
		return [
			{
				path: '/',
				method: 'get',
				handler: this.getAutoload.bind(this),
			},
			// {
			// 	path: '/:id',
			// 	method: 'get',
			// 	handler: this.idAutoload.bind(this),
			// },
			{
				path: '/prescription',
				method: 'get',
				handler: this.getPrescription.bind(this),
			},
			{
				path: '/prescription',
				method: 'post',
				handler: this.PostPrescription.bind(this),
			},
			{
				path: '/basket',
				method: 'post',
				handler: this.postBasket.bind(this),
			},
			{
				path: '/cabinet',
				method: 'post',
				handler: this.postCabinet.bind(this),
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
	 * @param nextprisma
	 */
	public async getAutoload(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const autoLoadObj = await db.autoLoad.findFirst({
				include: {
					prescrip: {
						select: {
							hnCode: true,
							vnCode: true,
							full_name: true,
							queue_code: true,
							medicine_total: true,
							urgent: true,
						},
					},
					basket: {
						select: {
							qrCode: true,
							basket_color: true,
						},
					},
				},
			});

			const response = {
				autoLoadObj,
				message: 'Autoload has been updated successfully',
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
	 * @param nextprisma
	 */
	public async idAutoload(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const autoLoadObj = await db.autoLoad.findFirst({
				where: { load_number: Number(req.params.id) },
				include: {
					prescrip: {
						select: {
							hnCode: true,
							vnCode: true,
							full_name: true,
							queue_code: true,
							medicine_total: true,
							urgent: true,
						},
					},
					basket: {
						select: {
							qrCode: true,
							basket_color: true,
						},
					},
				},
			});

			const response = {
				autoLoadObj,
				message: 'Autoload has been updated successfully',
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
	 * @param nextprisma
	 */
	public async getPrescription(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const [typeA, typeC] = await Promise.all([
				 await db.prescription.findMany({
					where: { queue_type: 'A', 
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ basketId: null },
							{ queue_random: null },
							{ prescrip_status: 'รอจับคู่ตะกร้า' },
						]
					},
					select: {
						id: true,
						queue_type: true,
						hnCode: true,
						queue_code: true,
						queue_num: true,
						queue_random: true
					},
					take: 7,
					orderBy: [{ urgent: 'desc' }, { queue_code: 'asc' }, { createdAt: 'asc' }],
				}),
				await db.prescription.findMany({
					where: { queue_type: 'C',
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ basketId: null },
							{ queue_random: null },
							{ prescrip_status: 'รอจับคู่ตะกร้า' },
						]
					},
					select: {
						id: true,
						queue_type: true,
						hnCode: true,
						queue_code: true,
						queue_num: true,
						queue_random: true
					},
					take: 3,
					orderBy: [{ urgent: 'desc' }, { queue_code: 'asc' }, { createdAt: 'asc' }],
				})
			])
			if (typeA && typeC) {
				await Promise.all([
					typeA.map(async (item, index) => {
						await db.prescription.update({
							where: { id: item.id },
							data: {
								queue_random: String(new Date().getTime() + index)
							}
						})
					}),
					typeC.map(async (item, index) => {
						await db.prescription.update({
							where: { id: item.id },
							data: {
								queue_random: String(new Date().getTime() + index)
							}
						})
					})
				])
			}

			const response = {
				data: { typeA, typeC } ,
				message: 'Auto queue has been updated successfully',
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
 * @param nextprisma
 */
	public async PostPrescription(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {

			const { id, channel } = await req.body;

			await db.prescription.update({
				where: { id, dateQueue: new Date() },
				data: { channel: Number(channel) },
			});

			const response = {
				message: 'Autoload has been updated successfully',
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
	public async postBasket(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			try {
				let response: {}
				const { basketId, ipaddress } = await req.body
				// ชุดปล่อยตะกร้า
				if (ipaddress === '100') {
					const basket = await db.basket.findFirst({
						where: { qrCode: basketId, basket_match: false },
					});
					if (!basket) throw new ApiError('Basket not found', StatusCodes.INTERNAL_SERVER_ERROR);
					const prescriptionLoadObj = await db.prescription.findFirst({
						select: {
							id: true,
							full_name: true,
							hnCode: true,
							queue_code: true,
							basketId: true,
							medicine_total: true,
							queue_num: true,
							queue_type: true,
							createdAt: true,
							doctor_names: true,
							lap_name: true,
							dept_name: true,
							drug_allergy: true,
							pay_type: true,
							arranged: {
								include: {
									medicine: true,
								},
							},
						},
						take: 1,
						where: {
							AND: [
								{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
								{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
								{ basketId: null },
								{ prescrip_status: 'รอจับคู่ตะกร้า' },
							]
						},
						orderBy: [{ urgent: 'desc' }, { queue_random: 'asc' }, { queue_code: 'asc' }, { createdAt: 'asc' }],
					});

					if (!prescriptionLoadObj) {
						throw new ApiError('Prescription not found', StatusCodes.INTERNAL_SERVER_ERROR);
					}

					if (prescriptionLoadObj?.queue_type === basket.basket_type) {
						await Promise.all([
							await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/medicine/nodeprint`, { prescriptionLoadObj })
								.then(async (response) => {
									// เช็คค่าผลลัพธ์จาก API ว่าการพิมพ์สำเร็จหรือไม่
									if (response.status === 200) {
										publishMessage('UDH/PRINT', JSON.stringify({ status: 'success', queue_type: prescriptionLoadObj?.queue_type, hnCode: prescriptionLoadObj?.hnCode }));
									} else {
										// ส่งข้อมูลพิมพ์ใหม่
										await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/medicine/nodeprint`, prescriptionLoadObj)
											.then((response) => {
												if (response.status === 200) {
													publishMessage('UDH/PRINT', JSON.stringify({ status: 'success', queue_type: prescriptionLoadObj?.queue_type, hnCode: prescriptionLoadObj?.hnCode }));
												}
											})
											.catch((error) => {
												throw new ApiError(`Error retrying print:${error}`, StatusCodes.INTERNAL_SERVER_ERROR);
											});
									}

								})
								.catch((error) => {
									console.error('Error sending data to /api/nodeprint:', error);
									throw new ApiError(`Error sending data to /api/nodeprint:${error}`, StatusCodes.INTERNAL_SERVER_ERROR);
								}),
							await db.prescription.update({
								where: { id: prescriptionLoadObj?.id as string },
								data: {
									basketId: basket.id as string,
								},
							}),
							await db.arranged.updateMany({
								where: { prescripId: prescriptionLoadObj?.id as string },
								data: {
									basketId: basket.id as string,
								},
							}),
							await db.basket.update({
								where: { id: basket?.id as string },
								data: {
									basket_match: false, // อย่าลืมเปลี่ยนเป็น true
								},
							})
						])
						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					}
				} else {
					const basket = await db.basket.findFirst({
						where: { qrCode: basketId, basket_match: false }, // แก้ไขตอนขึ้น server เป็น true
					});

					if (!basket) {
						throw new ApiError('basket not found', StatusCodes.INTERNAL_SERVER_ERROR);
					}

					const prescriptionObj = await db.prescription.findFirst({
						select: {
							id: true,
							hnCode: true,
							basketId: true,
							medicine_total: true,
							queue_num: true,
							queue_type: true,
							createdAt: true,
						},
						take: 1,
						where: {
							AND: [
								{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
								{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
								{ basketId: basketId as string },
								{ prescrip_status: 'รอจับคู่ตะกร้า' },
							]
						},
						orderBy: [{ createdAt: 'asc' }],
					});

					if (!prescriptionObj) {
						throw new ApiError('prescription not found', StatusCodes.INTERNAL_SERVER_ERROR);
					}
					if (ipaddress === '101') {
						const autoload = await db.autoLoad.findFirst({
							where: { load_number: Number(1) },
						});
						await Promise.all([
							await db.autoLoad.update({
								where: { id: autoload?.id as string },
								data: {
									orderId: prescriptionObj?.id as string,
									basketId: basket?.id as string,
									drug_count: prescriptionObj?.medicine_total,
								},
							}),

							await db.prescription.update({
								where: { id: prescriptionObj?.id as string },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									prescrip_status: 'กำลังจัดยา',
								}
							}),

							await db.arranged.updateMany({
								where: { prescripId: prescriptionObj?.id },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									arrang_status: 'กำลังจัดยา',
								}
							})
						])

						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '102') {
						const autoload = await db.autoLoad.findFirst({
							where: { load_number: Number(2) },
						});
						await Promise.all([
							await db.autoLoad.update({
								where: { id: autoload?.id as string },
								data: {
									orderId: prescriptionObj?.id as string,
									basketId: basket?.id as string,
									drug_count: prescriptionObj?.medicine_total,
								},
							}),

							await db.prescription.update({
								where: { id: prescriptionObj?.id as string },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									prescrip_status: 'กำลังจัดยา',
								}
							}),

							await db.arranged.updateMany({
								where: { prescripId: prescriptionObj?.id },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									arrang_status: 'กำลังจัดยา',
								}
							})
						])

						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '103') {
						const autoload = await db.autoLoad.findFirst({
							where: { load_number: Number(3) },
						});
						await Promise.all([
							await db.autoLoad.update({
								where: { id: autoload?.id as string },
								data: {
									orderId: prescriptionObj?.id as string,
									basketId: basket?.id as string,
									drug_count: prescriptionObj?.medicine_total,
								},
							}),

							await db.prescription.update({
								where: { id: prescriptionObj?.id as string },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									prescrip_status: 'กำลังจัดยา',
								}
							}),

							await db.arranged.updateMany({
								where: { prescripId: prescriptionObj?.id },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									arrang_status: 'กำลังจัดยา',
								}
							})
						])

						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '104') {
						const autoload = await db.autoLoad.findFirst({
							where: { load_number: Number(4) },
						});
						await Promise.all([
							await db.autoLoad.update({
								where: { id: autoload?.id as string },
								data: {
									orderId: prescriptionObj?.id as string,
									basketId: basket?.id as string,
									drug_count: prescriptionObj?.medicine_total,
								},
							}),

							await db.prescription.update({
								where: { id: prescriptionObj?.id as string },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									prescrip_status: 'กำลังจัดยา',
								}
							}),

							await db.arranged.updateMany({
								where: { prescripId: prescriptionObj?.id },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									arrang_status: 'กำลังจัดยา',
								}
							})
						])

						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '105') {
						const autoload = await db.autoLoad.findFirst({
							where: { load_number: Number(5) },
						});
						await Promise.all([
							await db.autoLoad.update({
								where: { id: autoload?.id as string },
								data: {
									orderId: prescriptionObj?.id as string,
									basketId: basket?.id as string,
									drug_count: prescriptionObj?.medicine_total,
								},
							}),

							await db.prescription.update({
								where: { id: prescriptionObj?.id as string },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									prescrip_status: 'กำลังจัดยา',
								}
							}),

							await db.arranged.updateMany({
								where: { prescripId: prescriptionObj?.id },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									arrang_status: 'กำลังจัดยา',
								}
							})
						])

						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '106') {
						const autoload = await db.autoLoad.findFirst({
							where: { load_number: Number(6) },
						});
						await Promise.all([
							await db.autoLoad.update({
								where: { id: autoload?.id as string },
								data: {
									orderId: prescriptionObj?.id as string,
									basketId: basket?.id as string,
									drug_count: prescriptionObj?.medicine_total,
								},
							}),

							await db.prescription.update({
								where: { id: prescriptionObj?.id as string },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									prescrip_status: 'กำลังจัดยา',
								}
							}),

							await db.arranged.updateMany({
								where: { prescripId: prescriptionObj?.id },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									arrang_status: 'กำลังจัดยา',
								}
							})
						])

						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '107') {
						const autoload = await db.autoLoad.findFirst({
							where: { load_number: Number(7) },
						});
						await Promise.all([
							await db.autoLoad.update({
								where: { id: autoload?.id as string },
								data: {
									orderId: prescriptionObj?.id as string,
									basketId: basket?.id as string,
									drug_count: prescriptionObj?.medicine_total,
								},
							}),

							await db.prescription.update({
								where: { id: prescriptionObj?.id as string },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									prescrip_status: 'กำลังจัดยา',
								}
							}),

							await db.arranged.updateMany({
								where: { prescripId: prescriptionObj?.id },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									arrang_status: 'กำลังจัดยา',
								}
							})
						])

						response = {
							status: 200,
							message: `This basket is match successfully`,
						}

					} else if (ipaddress === '108') {
						const autoload = await db.autoLoad.findFirst({
							where: { load_number: Number(8) },
						});
						await Promise.all([
							await db.autoLoad.update({
								where: { id: autoload?.id as string },
								data: {
									orderId: prescriptionObj?.id as string,
									basketId: basket?.id as string,
									drug_count: prescriptionObj?.medicine_total,
								},
							}),

							await db.prescription.update({
								where: { id: prescriptionObj?.id as string },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									prescrip_status: 'กำลังจัดยา',
								}
							}),

							await db.arranged.updateMany({
								where: { prescripId: prescriptionObj?.id },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									arrang_status: 'กำลังจัดยา',
								}
							})
						])

						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '109') {
						const autoload = await db.autoLoad.findFirst({
							where: { load_number: Number(9) },
						});
						await Promise.all([
							await db.autoLoad.update({
								where: { id: autoload?.id as string },
								data: {
									orderId: prescriptionObj?.id as string,
									basketId: basket?.id as string,
									drug_count: prescriptionObj?.medicine_total,
								},
							}),

							await db.prescription.update({
								where: { id: prescriptionObj?.id as string },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									prescrip_status: 'กำลังจัดยา',
								}
							}),

							await db.arranged.updateMany({
								where: { prescripId: prescriptionObj?.id },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									arrang_status: 'กำลังจัดยา',
								}
							})
						])

						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '110') {
						const autoload = await db.autoLoad.findFirst({
							where: { load_number: Number(0) },
						});
						await Promise.all([
							await db.autoLoad.update({
								where: { id: autoload?.id as string },
								data: {
									orderId: prescriptionObj?.id as string,
									basketId: basket?.id as string,
									drug_count: prescriptionObj?.medicine_total,
								},
							}),

							await db.prescription.update({
								where: { id: prescriptionObj?.id as string },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									prescrip_status: 'กำลังจัดยา',
								}
							}),

							await db.arranged.updateMany({
								where: { prescripId: prescriptionObj?.id },
								data: {
									basketId: basket?.id as string,
									autoLoad: autoload?.id as string,
									arrang_status: 'กำลังจัดยา',
								}
							})
						])
						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '111') {
						const out = await db.prescription.findFirst({
							where: {
								// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
								basketId: basketId,
								channel: Number(1),
							}
						});
						if (!out) {
							throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
						}
						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '112') {
						const out = await db.prescription.findFirst({
							where: {
								// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
								basketId: basketId,
								channel: Number(2),
							}
						});
						if (!out) {
							throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
						}
						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '113') {
						const out = await db.prescription.findFirst({
							where: {
								// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
								basketId: basketId,
								channel: Number(3),
							}
						});
						if (!out) {
							throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
						}
						response = {
							status: 200,
							message: `This basket is match successfully`,
						}
					} else if (ipaddress === '114') {
						const out = await db.prescription.findFirst({
							where: {
								// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
								basketId: basketId,
								channel: Number(4),
							}
						});
						if (!out) {
							throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
						}
						response = {
							status: 200,
							message: `This basket is match successfully`,
						}

					} else {
						throw new ApiError('Not found', StatusCodes.INTERNAL_SERVER_ERROR);
					}

				}

				res.locals.data = response;
				// call base class method
				super.send(res);
			} catch (error) {
				// from here error handler will get call
				next(error);
				// throw new ApiError('Not found', StatusCodes.INTERNAL_SERVER_ERROR);
			}

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
	public async postCabinet(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			try {
				const { cabinetType, address, ID, person, u_ip } = req.body;
				if(cabinetType === 'SMD') {
					const smdID = await db.arranged.findUnique({
						where: {id: ID}
					})

					if(smdID){
						db.arranged.update({
							data: { user_arrang: person},
							where: { id: ID}
						})
					}
				}

				if(cabinetType === 'HYB') {
					const hybID = await db.arranged.findUnique({
						where: {id: ID}
					})

					if(hybID && person === 'OK'){
						db.arranged.update({
							data: { user_arrang: ''},  /// เอารหัส User Login มาใส่
							where: { id: ID}
						})
					}
				}
				const response = {
					status: req.body,
					message: `This cabinet is send successfully`,
				}
				res.locals.data = response;
				// call base class method
				super.send(res);
			} catch (error) {
				// from here error handler will get call
				next(error);
				// throw new ApiError('Not found', StatusCodes.INTERNAL_SERVER_ERROR);
			}

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
			throw new ApiError('null', StatusCodes.BAD_REQUEST);
		} catch (error) {
			// from here error handler will get call
			next(error);
		}
	}

}
