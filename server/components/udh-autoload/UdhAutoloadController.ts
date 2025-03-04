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
				path: '/randomprescription',
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
				path: '/cabinet/:id/:station',
				method: 'get',
				handler: this.getCabinet.bind(this),
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
			const [typeAB, typeCD] = await Promise.all([
				await db.prescription.findMany({
					where: {
						OR: [{ queue_type: 'A' }, { queue_type: 'B' }],
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
					take: 9,
					orderBy: [{ urgent: 'desc' }, { queue_code: 'asc' }, { createdAt: 'asc' }],
				}),
				await db.prescription.findMany({
					where: {
						OR: [{ queue_type: 'C' }, { queue_type: 'D' }],
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
					take: 1,
					orderBy: [{ urgent: 'desc' }, { queue_code: 'asc' }, { createdAt: 'asc' }],
				})

			])
			if (typeAB.length > 1 && typeCD.length > 1) {
				await Promise.all([
					typeAB.map(async (item, index) => {
						await db.prescription.update({
							where: { id: item.id },
							data: {
								queue_random: String(new Date().getTime() + index)
							}
						})
					}),
					typeCD.map(async (item, index) => {
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
				data: { typeAB, typeCD },
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
							age: true,
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
						const printData = prescriptionLoadObj;
						// จัดรูปแบบข้อมูลตามที่ต้องการ
						const dataToSend = {
							HN: `${printData?.hnCode}`,
							q_dep: `${printData?.queue_code}`,
							pname: `${printData?.full_name}`,
							age: `${printData.age}`,
							doctor: `${printData.doctor_names}`,
							pay: `${printData?.pay_type}`,
							lap: `${printData?.lap_name || ''}`,
							dept: `${printData?.dept_name || ''}`,
							allergy: `${printData?.drug_allergy || ''}`,
							type_q: `${printData?.queue_type || ''}`,
							item: printData?.arranged.map(arrange => ({
								name: arrange?.medicine_name,
								quantity: arrange?.medicine_amount,
								med_details: arrange?.med_detail1,
								packsize: arrange?.medicinePackageSize,
								labelNo: arrange?.labelNo,
								dispcause: arrange?.dispcause || '', /// F
								medsts: arrange?.medsts || '', // 0 ยาใหม่
							})),

						};
						await Promise.all([
							await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/medicine/nodeprint`, dataToSend)
								.then(async (response) => {
									// เช็คค่าผลลัพธ์จาก API ว่าการพิมพ์สำเร็จหรือไม่
									if (response.status === 200) {
										publishMessage('UDH/PRINT', JSON.stringify({ status: 'success', queue_type: prescriptionLoadObj?.queue_type, hnCode: prescriptionLoadObj?.hnCode }));
									} else {
										// ส่งข้อมูลพิมพ์ใหม่
										await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/medicine/nodeprint`, dataToSend)
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
							// createdAt: {
							//   gte: startOfDay, // มากกว่าหรือเท่ากับเวลาตอนเริ่มวัน
							//   lte: endOfDay, // น้อยกว่าหรือเท่ากับเวลาตอนสิ้นสุดวัน
							// },
							AND: [
								{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
								{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							],
							basketId: basket?.id as string,
							prescrip_status: 'รอจับคู่ตะกร้า',
							// AND: [
							// 	{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							// 	{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							// 	{ basketId: basketId as string },
							// 	{ prescrip_status: 'รอจับคู่ตะกร้า' },
							// ]
						},
						orderBy: [{ createdAt: 'asc' }],
					});
					console.log(basket);
					console.log(prescriptionObj);
					if (basket && prescriptionObj) {
						if (ipaddress === '101') { // ช่องตะกร้าเข้า 1
							await db.$transaction(async (db) => {
								const autoload = await db.autoLoad.findFirst({
									where: { load_number: Number(1) },
								});

								await db.autoLoad.update({
									where: { id: autoload?.id as string },
									data: {
										orderId: prescriptionObj?.id as string,
										basketId: basket?.id as string,
										drug_count: prescriptionObj?.medicine_total,
									},
								});

								await db.prescription.update({
									where: { id: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload?.id as string,
										prescrip_status: 'กำลังจัดยา',
									},
								});

								await db.arranged.updateMany({
									where: { prescripId: prescriptionObj?.id },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload?.id as string,
										arrang_status: 'กำลังจัดยา',
									},
								});
							});
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '102') { // ช่องตะกร้าเข้า 2
							await db.$transaction(async (db) => {
								const autoload2 = await db.autoLoad.findFirst({
									where: { load_number: Number(2) },
								});

								await db.autoLoad.update({
									where: { id: autoload2?.id as string },
									data: {
										orderId: prescriptionObj?.id as string,
										basketId: basket?.id as string,
										drug_count: Number(prescriptionObj?.medicine_total),
									},
								});

								await db.prescription.update({
									where: { id: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload2?.id as string,
										prescrip_status: 'กำลังจัดยา',
									},
								});

								await db.arranged.updateMany({
									where: { prescripId: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload2?.id as string,
										arrang_status: 'กำลังจัดยา',
									},
								});
							});
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '103') { // ช่องตะกร้าเข้า 3
							await db.$transaction(async () => {
								const autoload3 = await db.autoLoad.findFirst({
									where: { load_number: Number(3) },
								});

								await db.autoLoad.update({
									where: { id: autoload3?.id as string },
									data: {
										orderId: prescriptionObj?.id as string,
										basketId: basket?.id as string,
										drug_count: Number(prescriptionObj?.medicine_total),
									},
								});

								await db.prescription.update({
									where: { id: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload3?.id as string,
										prescrip_status: 'กำลังจัดยา',
									},
								});

								await db.arranged.updateMany({
									where: { prescripId: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload3?.id as string,
										arrang_status: 'กำลังจัดยา',
									},
								});
							});
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '104') { // ช่องตะกร้าเข้า 4
							await db.$transaction(async () => {
								const autoload4 = await db.autoLoad.findFirst({
									where: { load_number: Number(4) },
								});

								await db.autoLoad.update({
									where: { id: autoload4?.id as string },
									data: {
										orderId: prescriptionObj?.id as string,
										basketId: basket?.id as string,
										drug_count: Number(prescriptionObj?.medicine_total),
									},
								});

								await db.prescription.update({
									where: { id: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload4?.id as string,
										prescrip_status: 'กำลังจัดยา',
									},
								});

								await db.arranged.updateMany({
									where: { prescripId: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload4?.id as string,
										arrang_status: 'กำลังจัดยา',
									},
								});
							});
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '105') { // ช่องตะกร้าเข้า 5
							await db.$transaction(async () => {
								const autoload5 = await db.autoLoad.findFirst({
									where: { load_number: Number(5) },
								});

								await db.autoLoad.update({
									where: { id: autoload5?.id as string },
									data: {
										orderId: prescriptionObj?.id as string,
										basketId: basket?.id as string,
										drug_count: Number(prescriptionObj?.medicine_total),
									},
								});

								await db.prescription.update({
									where: { id: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload5?.id as string,
										prescrip_status: 'กำลังจัดยา',
									},
								});

								await db.arranged.updateMany({
									where: { prescripId: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload5?.id as string,
										arrang_status: 'กำลังจัดยา',
									},
								});
							});
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '106') { // ช่องตะกร้าเข้า 6
							await db.$transaction(async () => {
								const autoload6 = await db.autoLoad.findFirst({
									where: { load_number: Number(6) },
								});

								await db.autoLoad.update({
									where: { id: autoload6?.id as string },
									data: {
										orderId: prescriptionObj?.id as string,
										basketId: basket?.id as string,
										drug_count: Number(prescriptionObj?.medicine_total),
									},
								});

								await db.prescription.update({
									where: { id: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload6?.id as string,
										prescrip_status: 'กำลังจัดยา',
									},
								});

								await db.arranged.updateMany({
									where: { prescripId: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload6?.id as string,
										arrang_status: 'กำลังจัดยา',
									},
								});
							});
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '107') { // ช่องตะกร้าเข้า 7
							await db.$transaction(async () => {
								const autoload7 = await db.autoLoad.findFirst({
									where: { load_number: Number(7) },
								});

								await db.autoLoad.update({
									where: { id: autoload7?.id as string },
									data: {
										orderId: prescriptionObj?.id as string,
										basketId: basket?.id as string,
										drug_count: Number(prescriptionObj?.medicine_total),
									},
								});

								await db.prescription.update({
									where: { id: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload7?.id as string,
										prescrip_status: 'กำลังจัดยา',
									},
								});

								await db.arranged.updateMany({
									where: { prescripId: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload7?.id as string,
										arrang_status: 'กำลังจัดยา',
									},
								});
							});
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '108') { // ช่องตะกร้าเข้า 8
							await db.$transaction(async () => {
								const autoload8 = await db.autoLoad.findFirst({
									where: { load_number: Number(8) },
								});

								await db.autoLoad.update({
									where: { id: autoload8?.id as string },
									data: {
										orderId: prescriptionObj?.id as string,
										basketId: basket?.id as string,
										drug_count: Number(prescriptionObj?.medicine_total),
									},
								});

								await db.prescription.update({
									where: { id: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload8?.id as string,
										prescrip_status: 'กำลังจัดยา',
									},
								});

								await db.arranged.updateMany({
									where: { prescripId: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload8?.id as string,
										arrang_status: 'กำลังจัดยา',
									},
								});
							});
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '109') { // ช่องตะกร้าเข้า 9
							await db.$transaction(async () => {
								const autoload9 = await db.autoLoad.findFirst({
									where: { load_number: Number(9) },
								});

								await db.autoLoad.update({
									where: { id: autoload9?.id as string },
									data: {
										orderId: prescriptionObj?.id as string,
										basketId: basket?.id as string,
										drug_count: Number(prescriptionObj?.medicine_total),
									},
								});

								await db.prescription.update({
									where: { id: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload9?.id as string,
										prescrip_status: 'กำลังจัดยา',
									},
								});

								await db.arranged.updateMany({
									where: { prescripId: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload9?.id as string,
										arrang_status: 'กำลังจัดยา',
									},
								});
							});
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '110') { // ช่องตะกร้าเข้า 10
							await db.$transaction(async () => {
								const autoload10 = await db.autoLoad.findFirst({
									where: { load_number: Number(0) },
								});

								await db.autoLoad.update({
									where: { id: autoload10?.id as string },
									data: {
										orderId: prescriptionObj?.id as string,
										basketId: basket?.id as string,
										drug_count: Number(prescriptionObj?.medicine_total),
									},
								});

								await db.prescription.update({
									where: { id: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload10?.id as string,
										prescrip_status: 'กำลังจัดยา',
									},
								});

								await db.arranged.updateMany({
									where: { prescripId: prescriptionObj?.id as string },
									data: {
										basketId: basket?.id as string,
										autoLoad: autoload10?.id as string,
										arrang_status: 'กำลังจัดยา',
									},
								});
							});
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '111') { // ระกร้าออกช่อง 1
							const out = await db.prescription.findFirst({
								where: {
									// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
									basketId: basket.id,
									channel: Number(1),
								},
							});
							if (!out) {
								throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
							}
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '112') { // ระกร้าออกช่อง 2
							const out = await db.prescription.findFirst({
								where: {
									// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
									basketId: basket.id,
									channel: Number(2),
								},
							});
							if (!out) {
								throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
							}
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '113') { // ระกร้าออกช่อง 3
							const out = await db.prescription.findFirst({
								where: {
									// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
									basketId: basket.id,
									channel: Number(3),
								},
							});
							if (!out) {
								throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
							}
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						} else if (ipaddress === '114') { // ระกร้าออกช่อง 4
							const out = await db.prescription.findFirst({
								where: {
									// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
									basketId: basket.id,
									channel: Number(4),
								},
							});
							if (!out) {
								throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
							}
							response = {
								status: 200,
								message: `This basket is match successfully`,
							}
						}
					} else {
						response = {
							status: 500,
							message: `This basket & prescription is not match`,
						}
					}

					// return getErrorResponse('This basket & prescription is not match', 500);
					// throw new ApiError('This basket & prescription is not match', StatusCodes.INTERNAL_SERVER_ERROR);

				}
				// } else {
				// 	const basket = await db.basket.findFirst({
				// 		where: { qrCode: basketId, basket_match: false }, // แก้ไขตอนขึ้น server เป็น true
				// 	});

				// 	if (!basket) {
				// 		throw new ApiError('basket not found', StatusCodes.INTERNAL_SERVER_ERROR);
				// 	}

				// 	const prescriptionObj = await db.prescription.findFirst({
				// 		select: {
				// 			id: true,
				// 			hnCode: true,
				// 			basketId: true,
				// 			medicine_total: true,
				// 			queue_num: true,
				// 			queue_type: true,
				// 			createdAt: true,
				// 		},
				// 		take: 1,
				// 		where: {
				// 			// AND: [
				// 			// 	{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
				// 			// 	{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
				// 			// 	{ basketId: basketId as string },
				// 			// 	{ prescrip_status: 'รอจับคู่ตะกร้า' },
				// 			// ]
				// 			AND: [
				// 				{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
				// 				{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
				// 			],
				// 			basketId: basket?.id as string,
				// 			prescrip_status: 'รอจับคู่ตะกร้า',
				// 		},
				// 		orderBy: [{ createdAt: 'asc' }],
				// 	});

				// 	if (!prescriptionObj) {
				// 		throw new ApiError('prescription not found', StatusCodes.INTERNAL_SERVER_ERROR);
				// 	}
				// 	if (ipaddress === '101') {
				// 		const autoload = await db.autoLoad.findFirst({
				// 			where: { load_number: Number(1) },
				// 		});
				// 		await Promise.all([
				// 			await db.autoLoad.update({
				// 				where: { id: autoload?.id as string },
				// 				data: {
				// 					orderId: prescriptionObj?.id as string,
				// 					basketId: basket?.id as string,
				// 					drug_count: prescriptionObj?.medicine_total,
				// 				},
				// 			}),

				// 			await db.prescription.update({
				// 				where: { id: prescriptionObj?.id as string },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					prescrip_status: 'กำลังจัดยา',
				// 				}
				// 			}),

				// 			await db.arranged.updateMany({
				// 				where: { prescripId: prescriptionObj?.id },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					arrang_status: 'กำลังจัดยา',
				// 				}
				// 			})
				// 		])

				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '102') {
				// 		const autoload = await db.autoLoad.findFirst({
				// 			where: { load_number: Number(2) },
				// 		});
				// 		await Promise.all([
				// 			await db.autoLoad.update({
				// 				where: { id: autoload?.id as string },
				// 				data: {
				// 					orderId: prescriptionObj?.id as string,
				// 					basketId: basket?.id as string,
				// 					drug_count: prescriptionObj?.medicine_total,
				// 				},
				// 			}),

				// 			await db.prescription.update({
				// 				where: { id: prescriptionObj?.id as string },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					prescrip_status: 'กำลังจัดยา',
				// 				}
				// 			}),

				// 			await db.arranged.updateMany({
				// 				where: { prescripId: prescriptionObj?.id },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					arrang_status: 'กำลังจัดยา',
				// 				}
				// 			})
				// 		])

				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '103') {
				// 		const autoload = await db.autoLoad.findFirst({
				// 			where: { load_number: Number(3) },
				// 		});
				// 		await Promise.all([
				// 			await db.autoLoad.update({
				// 				where: { id: autoload?.id as string },
				// 				data: {
				// 					orderId: prescriptionObj?.id as string,
				// 					basketId: basket?.id as string,
				// 					drug_count: prescriptionObj?.medicine_total,
				// 				},
				// 			}),

				// 			await db.prescription.update({
				// 				where: { id: prescriptionObj?.id as string },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					prescrip_status: 'กำลังจัดยา',
				// 				}
				// 			}),

				// 			await db.arranged.updateMany({
				// 				where: { prescripId: prescriptionObj?.id },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					arrang_status: 'กำลังจัดยา',
				// 				}
				// 			})
				// 		])

				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '104') {
				// 		const autoload = await db.autoLoad.findFirst({
				// 			where: { load_number: Number(4) },
				// 		});
				// 		await Promise.all([
				// 			await db.autoLoad.update({
				// 				where: { id: autoload?.id as string },
				// 				data: {
				// 					orderId: prescriptionObj?.id as string,
				// 					basketId: basket?.id as string,
				// 					drug_count: prescriptionObj?.medicine_total,
				// 				},
				// 			}),

				// 			await db.prescription.update({
				// 				where: { id: prescriptionObj?.id as string },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					prescrip_status: 'กำลังจัดยา',
				// 				}
				// 			}),

				// 			await db.arranged.updateMany({
				// 				where: { prescripId: prescriptionObj?.id },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					arrang_status: 'กำลังจัดยา',
				// 				}
				// 			})
				// 		])

				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '105') {
				// 		const autoload = await db.autoLoad.findFirst({
				// 			where: { load_number: Number(5) },
				// 		});
				// 		await Promise.all([
				// 			await db.autoLoad.update({
				// 				where: { id: autoload?.id as string },
				// 				data: {
				// 					orderId: prescriptionObj?.id as string,
				// 					basketId: basket?.id as string,
				// 					drug_count: prescriptionObj?.medicine_total,
				// 				},
				// 			}),

				// 			await db.prescription.update({
				// 				where: { id: prescriptionObj?.id as string },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					prescrip_status: 'กำลังจัดยา',
				// 				}
				// 			}),

				// 			await db.arranged.updateMany({
				// 				where: { prescripId: prescriptionObj?.id },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					arrang_status: 'กำลังจัดยา',
				// 				}
				// 			})
				// 		])

				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '106') {
				// 		const autoload = await db.autoLoad.findFirst({
				// 			where: { load_number: Number(6) },
				// 		});
				// 		await Promise.all([
				// 			await db.autoLoad.update({
				// 				where: { id: autoload?.id as string },
				// 				data: {
				// 					orderId: prescriptionObj?.id as string,
				// 					basketId: basket?.id as string,
				// 					drug_count: prescriptionObj?.medicine_total,
				// 				},
				// 			}),

				// 			await db.prescription.update({
				// 				where: { id: prescriptionObj?.id as string },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					prescrip_status: 'กำลังจัดยา',
				// 				}
				// 			}),

				// 			await db.arranged.updateMany({
				// 				where: { prescripId: prescriptionObj?.id },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					arrang_status: 'กำลังจัดยา',
				// 				}
				// 			})
				// 		])

				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '107') {
				// 		const autoload = await db.autoLoad.findFirst({
				// 			where: { load_number: Number(7) },
				// 		});
				// 		await Promise.all([
				// 			await db.autoLoad.update({
				// 				where: { id: autoload?.id as string },
				// 				data: {
				// 					orderId: prescriptionObj?.id as string,
				// 					basketId: basket?.id as string,
				// 					drug_count: prescriptionObj?.medicine_total,
				// 				},
				// 			}),

				// 			await db.prescription.update({
				// 				where: { id: prescriptionObj?.id as string },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					prescrip_status: 'กำลังจัดยา',
				// 				}
				// 			}),

				// 			await db.arranged.updateMany({
				// 				where: { prescripId: prescriptionObj?.id },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					arrang_status: 'กำลังจัดยา',
				// 				}
				// 			})
				// 		])

				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}

				// 	} else if (ipaddress === '108') {
				// 		const autoload = await db.autoLoad.findFirst({
				// 			where: { load_number: Number(8) },
				// 		});
				// 		await Promise.all([
				// 			await db.autoLoad.update({
				// 				where: { id: autoload?.id as string },
				// 				data: {
				// 					orderId: prescriptionObj?.id as string,
				// 					basketId: basket?.id as string,
				// 					drug_count: prescriptionObj?.medicine_total,
				// 				},
				// 			}),

				// 			await db.prescription.update({
				// 				where: { id: prescriptionObj?.id as string },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					prescrip_status: 'กำลังจัดยา',
				// 				}
				// 			}),

				// 			await db.arranged.updateMany({
				// 				where: { prescripId: prescriptionObj?.id },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					arrang_status: 'กำลังจัดยา',
				// 				}
				// 			})
				// 		])

				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '109') {
				// 		const autoload = await db.autoLoad.findFirst({
				// 			where: { load_number: Number(9) },
				// 		});
				// 		await Promise.all([
				// 			await db.autoLoad.update({
				// 				where: { id: autoload?.id as string },
				// 				data: {
				// 					orderId: prescriptionObj?.id as string,
				// 					basketId: basket?.id as string,
				// 					drug_count: prescriptionObj?.medicine_total,
				// 				},
				// 			}),

				// 			await db.prescription.update({
				// 				where: { id: prescriptionObj?.id as string },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					prescrip_status: 'กำลังจัดยา',
				// 				}
				// 			}),

				// 			await db.arranged.updateMany({
				// 				where: { prescripId: prescriptionObj?.id },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					arrang_status: 'กำลังจัดยา',
				// 				}
				// 			})
				// 		])

				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '110') {
				// 		const autoload = await db.autoLoad.findFirst({
				// 			where: { load_number: Number(0) },
				// 		});
				// 		await Promise.all([
				// 			await db.autoLoad.update({
				// 				where: { id: autoload?.id as string },
				// 				data: {
				// 					orderId: prescriptionObj?.id as string,
				// 					basketId: basket?.id as string,
				// 					drug_count: prescriptionObj?.medicine_total,
				// 				},
				// 			}),

				// 			await db.prescription.update({
				// 				where: { id: prescriptionObj?.id as string },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					prescrip_status: 'กำลังจัดยา',
				// 				}
				// 			}),

				// 			await db.arranged.updateMany({
				// 				where: { prescripId: prescriptionObj?.id },
				// 				data: {
				// 					basketId: basket?.id as string,
				// 					autoLoad: autoload?.id as string,
				// 					arrang_status: 'กำลังจัดยา',
				// 				}
				// 			})
				// 		])
				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '111') {
				// 		const out = await db.prescription.findFirst({
				// 			where: {
				// 				// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
				// 				basketId: basketId,
				// 				channel: Number(1),
				// 			}
				// 		});
				// 		if (!out) {
				// 			throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
				// 		}
				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '112') {
				// 		const out = await db.prescription.findFirst({
				// 			where: {
				// 				// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
				// 				basketId: basketId,
				// 				channel: Number(2),
				// 			}
				// 		});
				// 		if (!out) {
				// 			throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
				// 		}
				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '113') {
				// 		const out = await db.prescription.findFirst({
				// 			where: {
				// 				// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
				// 				basketId: basketId,
				// 				channel: Number(3),
				// 			}
				// 		});
				// 		if (!out) {
				// 			throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
				// 		}
				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}
				// 	} else if (ipaddress === '114') {
				// 		const out = await db.prescription.findFirst({
				// 			where: {
				// 				// createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
				// 				basketId: basketId,
				// 				channel: Number(4),
				// 			}
				// 		});
				// 		if (!out) {
				// 			throw new ApiError('This basket is not match', StatusCodes.INTERNAL_SERVER_ERROR);
				// 		}
				// 		response = {
				// 			status: 200,
				// 			message: `This basket is match successfully`,
				// 		}

				// 	} else {
				// 		throw new ApiError('Not found', StatusCodes.INTERNAL_SERVER_ERROR);
				// 	}

				// }

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
	 * @param nextprisma
	 */
	public async getCabinet(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {

			// console.log('ok',req.params.id)
			const data: any = [];
			const cabinet = await db.prescription.findFirst({
				where: {
					id: req.params.id,
				},
				select: {
					arranged: {
						select: {
							id: true,
							medicine_name: true,
							medicineCode: true,
							medicine_amount: true,
							medicine: {
								select: {
									medicineCode: true,
									name: true,
									medicineName_en: true,
									cabinet: {
										where: { storage_station: req.params.station },
										select: {
											mqtt_topic: true,
											storage_position: true,
											cabinet: true,
											plcId: true,
										},
									},
								},
							},
						},
					},
				},

			});
			if (!cabinet) {
				throw new ApiError('No prescription found in the system', StatusCodes.BAD_REQUEST);
			}

			cabinet?.arranged.map(async (obj) => {


				obj.medicine?.cabinet.map(async (cabinets) => {
					if (cabinets.cabinet === 'HYB') {
						if (cabinets.plcId) {
							data.push({ type: 'HYB', ip: cabinets.plcId, id: obj.id, status: 1, count: obj.medicine_amount });
						}
					} else if (cabinets.cabinet === 'COOL') {
						const topicRegex = /^UDH\/E\/E(\d)\/(\d)\.(\d)$/;
						const match = cabinets.mqtt_topic?.match(topicRegex);

						if (match) {
							const x = Number.parseInt(match[1] || '', 10);
							const y = Number.parseInt(match[2] || '', 10);
							const z = Number.parseInt(match[3] || '', 10);

							let slave: number;
							if (x === 3) {
								if (z >= 1 && z <= 4) {
									slave = (y - 1) * 4 + z;
								} else if (z >= 5 && z <= 8) {
									slave = 16 + (y - 1) * 4 + z;
								} else if (z >= 9 && z <= 12) {
									slave = 32 + (y - 1) * 4 + z;
								}
							} else if (x === 4) {
								if (z >= 1 && z <= 4) {
									slave = 60 + (y - 1) * 4 + z;
								} else if (z >= 5 && z <= 8) {
									slave = 76 + (y - 1) * 4 + z;
								} else if (z >= 9 && z <= 12) {
									slave = 92 + (y - 1) * 4 + z;
								}
							}

							if (slave !== undefined) {
								const medicineName = obj.medicine_name
									? obj.medicine_name.length > 20
										? `${obj.medicine_name.slice(0, 20)}...`
										: obj.medicine_name
									: '';
								publishMessage(`${cabinets.mqtt_topic}`, JSON.stringify({
									mac: cabinets.plcId,
									slave: slave.toString(),
									data: `${obj.medicine_amount}${','}${medicineName}`,
								}));
							} else {
								console.error('Invalid value of x in topic:', cabinets.mqtt_topic);
							}
						}
					} else if (cabinets.cabinet === 'HAD') {
						const topicRegex = /^UDH\/E\/E(\d)\/(\d)\.(\d)$/;
						const match = cabinets.mqtt_topic?.match(topicRegex);
						if (match) {
							const x = Number.parseInt(match[1] || '', 10);
							const y = Number.parseInt(match[2] || '', 10);
							const z = Number.parseInt(match[3] || '', 10);

							let slave: number;
							if (x === 5) {
								slave = (y - 1) * 3 + z;
							} else if (x === 6) {
								slave = 27 + (y - 1) * 3 + z;
							} else if (x === 7) {
								slave = 54 + (y - 1) * 3 + z;
							} else if (x === 8) {
								slave = 81 + (y - 1) * 3 + z;
							}

							if (slave !== undefined) {
								const medicineName = obj.medicine_name
									? obj.medicine_name.length > 20
										? `${obj.medicine_name.slice(0, 20)}...`
										: obj.medicine_name
									: '';
								publishMessage(`${cabinets.mqtt_topic}`, JSON.stringify({
									mac: cabinets.plcId,
									slave: slave.toString(),
									data: `${obj.medicine_amount}${','}${medicineName}`,
								}));
							} else {
								console.error('Invalid value of x in topic:', cabinets.mqtt_topic);
							}
						}
					} else if (cabinets.cabinet === 'SMD') {
						if (cabinets.plcId) {

							// await axios.post(`http://172.16.2.254:1880/cabinet_command`,{ type: 'SMD', ip: cabinets.plcId, id: obj.id, status: 1, count: obj.medicine_amount }).then((res) => {
							// 	// eslint-disable-next-line no-console
							// 	console.log(res?.data);
							//   });
							data.push({ type: 'SMD', ip: cabinets.plcId, id: obj.id, status: 1, count: obj.medicine_amount });
						}
					}
					// console.log(data)
				});
			});
			// let data: [];
			// data.map(async (item, index) => {
			// 	// setTimeout(async () => {
			// 	// 	await axios.post(`http://172.16.2.254:1880/cabinet_command`,item).then((res) => {
			// 	// 		// eslint-disable-next-line no-console
			// 	// 		console.log(res?.data);
			// 	// 	  });
			// 	// },10000)

			// })
			// await axios.post(`http://172.16.2.254:1880/cabinet_command`, data).then((res) => {
			// 	// eslint-disable-next-line no-console
			// 	console.log(res.data);
			//   });
			const response = {
				data: data
				// message: 'Autoload has been updated successfully',
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
	public async postCabinet(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			try {
				const { cabinetType, address, ID, person, u_ip } = req.body;
				if (cabinetType === 'SMD') {
					const smdID = await db.arranged.findUnique({
						where: { id: ID }
					})

					if (smdID) {
						db.arranged.update({
							data: { user_arrang: person },
							where: { id: ID }
						})
					}
				}

				if (cabinetType === 'HYB') {
					const hybID = await db.arranged.findUnique({
						where: { id: ID }
					})

					if (hybID && person === 'OK') {
						db.arranged.update({
							data: { user_arrang: '' },  /// เอารหัส User Login มาใส่
							where: { id: ID }
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
