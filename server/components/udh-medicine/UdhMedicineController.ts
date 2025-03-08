import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import BaseController from '../BaseController';
import { CharacterSet, printer as ThermalPrinter, types as PrinterTypes } from 'node-thermal-printer';
import { RouteDefinition } from '../../types/RouteDefinition';
import { endOfDay, startOfDay } from 'date-fns';

// import { dayjsEndDate, dayjsStartDate } from '../../lib/date';
import { db, QueryMode } from '../../lib/prisma.db';
import { Item, PrintData } from './UdhMedicineTypes';
import { DateLongTH } from '../../lib/dateTime';
import dayjs from 'dayjs';
import { PrismaPromise } from '@prisma/client';

/**
 * Status controller
 */
export default class UdhMedicineController extends BaseController {
	// base path
	public basePath = 'medicine';

	/**
	 *
	 */
	public routes(): RouteDefinition[] {
		return [
			{
				path: '/',
				method: 'get',
				handler: this.getPrescription.bind(this),
			},
			{
				path: '/udh-med',
				method: 'get',
				handler: this.getUdhmed.bind(this),
			},
			{
				path: '/udh-station',
				method: 'get',
				handler: this.getUdhstation.bind(this),
			},
			{
				path: '/nodeprint',
				method: 'post',
				handler: this.postNodeprint.bind(this),
			},
			{
				path: '/prescription/:id',
				method: 'get',
				handler: this.getPrescriptionId.bind(this),
			},
			{
				path: '/prescription',
				method: 'post',
				handler: this.postPrescription.bind(this),
			},
			{
				path: '/prescription/:id',
				method: 'put',
				handler: this.putPrescription.bind(this),
			},
			{
				path: '/prescription/:id',
				method: 'delete',
				handler: this.deletePrescription.bind(this),
			},
			{
				path: '/prescription/arranged/:id',
				method: 'get',
				handler: this.getArrangedId.bind(this),
			},
			{
				path: '/prescription/arranged',
				method: 'post',
				handler: this.postArranged.bind(this),
			},
			{
				path: '/prescription/arranged/:id',
				method: 'put',
				handler: this.putArranged.bind(this),
			},
			{
				path: '/prescription/arranged/:id',
				method: 'delete',
				handler: this.deleteArranged.bind(this),
			},
			{
				path: '/prescription/station/:id',
				method: 'get',
				handler: this.getStationId.bind(this),
			},
			{
				path: '/prescription/station/drug/:id',
				method: 'get',
				handler: this.getdrugId.bind(this),
			},
			{
				path: '/product',
				method: 'post',
				handler: this.postProduct.bind(this),
			},
			{
				path: '/product/:id',
				method: 'put',
				handler: this.putProduct.bind(this),
			},
			{
				path: '/product/:id',
				method: 'delete',
				handler: this.deleteProduct.bind(this),
			},
			{
				path: '/drug/:id',
				method: 'get',
				handler: this.getDrugId.bind(this),
			},
			{
				path: '/drug',
				method: 'post',
				handler: this.postDrug.bind(this),
			},
			{
				path: '/drug/:id',
				method: 'put',
				handler: this.putDrug.bind(this),
			},
			{
				path: '/drug/:id',
				method: 'delete',
				handler: this.deleteDrug.bind(this),
			},
			{
				path: '/configures',
				method: 'post',
				handler: this.postConfigures.bind(this),
			},
			{
				path: '/configures/:id',
				method: 'put',
				handler: this.putConfigures.bind(this),
			},
			{
				path: '/configures/:id',
				method: 'delete',
				handler: this.deleteConfigures.bind(this),
			},
			{
				path: '/cabinet-medicine',
				method: 'post',
				handler: this.postCabinetmedicine.bind(this),
			},
			{
				path: '/cabinet-medicine/:id',
				method: 'put',
				handler: this.putCabinetmedicine.bind(this),
			},
			{
				path: '/cabinet-medicine/:id',
				method: 'delete',
				handler: this.deleteCabinetmedicine.bind(this),
			},
			{
				path: '/cabinet',
				method: 'post',
				handler: this.postCabinet.bind(this),
			},
			{
				path: '/cabinet/:id',
				method: 'put',
				handler: this.putCabinet.bind(this),
			},
			{
				path: '/cabinet/:id',
				method: 'delete',
				handler: this.deleteCabinet.bind(this),
			},
			{
				path: '/basket',
				method: 'post',
				handler: this.postBasket.bind(this),
			},
			{
				path: '/basket/:id',
				method: 'put',
				handler: this.putBasket.bind(this),
			},
			{
				path: '/basket/:id',
				method: 'delete',
				handler: this.deleteBasket.bind(this),
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
	public async getUdhstation(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const dayjsNow = dayjs();
		const dayjsStartDate = dayjsNow.startOf('day');
		const dayjsEndDate = dayjsNow.endOf('day');
		try {
			// ตรวจสอบข้อมูลในฐานข้อมูล
			const checkData = await db.prescription.findMany({
				where: {
					prescrip_status: 'กำลังจัดยา',

					AND: [
						{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
					],

				},
				include: {
					arranged: true
				},
			});

			const withUserArrangTime = checkData.filter(prescription =>
				prescription.arranged.every(arr => arr.user_arrang_time !== null)
			);

			const someHaveUserArrangTime = checkData.filter(prescription =>
				prescription.arranged.some(arr => arr.user_arrang_time !== null)
			);

			const withoutUserArrangTime = checkData.filter(prescription =>
				prescription.arranged.every(arr => arr.user_arrang_time === null)
			);
			if (withUserArrangTime.length > 0) {
				console.log('📌 พบ prescription ที่มี user_arrang_time:', withUserArrangTime.map(p => p.id));
				await db.prescription.updateMany({
					where: {
						id: { in: withUserArrangTime.map(p => p.id) } // อัปเดตเฉพาะไอดีที่พบ
					},
					data: {
						prescrip_status: 'กำลังตรวจสอบ',
					}
				});

				console.log('✅ อัปเดต prescription เสร็จสิ้น');
			}
			if (someHaveUserArrangTime.length > 0) {
				console.log('⚠️ Prescription ที่มีบางตัวมี user_arrang_time:', someHaveUserArrangTime.map(p => p.id));
			}

			if (withoutUserArrangTime.length > 0) {
				console.log('⚠️ nook - prescription ที่ไม่มี user_arrang_time:', withoutUserArrangTime.map(p => p.id));
			}

			// checkData.forEach((prescription) => {
			// 	if (prescription.arranged.some(arr => arr.user_arrang_time !== null)) {
			// 		console.log('พบข้อมูลที่มี user_arrang_time:', prescription);
			// 	} else {
			// 		console.log('ยังไม่ได้ยืนยัน');
			// 	}
			// });
			const response = {
				data: checkData,
				// message: 'Hospital has been get successfully',
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
	public async getUdhmed(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const dayjsNow = dayjs();
		const dayjsStartDate = dayjsNow.startOf('day');
		const dayjsEndDate = dayjsNow.endOf('day');
		try {
			// const url = 'http://172.16.2.254:3000/v1/udh/med-hn';
			// const details = 'http://172.16.2.254:3000/v1/udh/med-pay';
			const url = 'http://localhost:8000/med-hn';
			const details = 'http://localhost:8001/med-pay';
			const [response1, ress] = await Promise.all([
				fetch(url, { cache: 'no-cache' }),
				fetch(details, { cache: 'no-cache' }),
			]);

			if (!response1.ok || !ress.ok) {
				throw new Error(`Fetch error: ${response1.status}, ${ress.status}`);
			}
			const data = (await response1.json())?.data || [];
			const detail1 = (await ress.json())?.data || [];
			const matchedData = await Promise.all(
				data
					.filter((item: any, index: number, self: any[]) => {
						// สร้าง Set เพื่อเก็บข้อมูลที่ไม่ซ้ำ
						const uniqueKey = `${item.hn[0]}-${item.regNo}-${item.qMedNo}`;
						return self.findIndex((i: any) => `${i.hn[0]}-${i.regNo}-${i.qMedNo}` === uniqueKey) === index;
					})
					.map(async (item: any) => {
						const matchingDetails = detail1.filter((d: any) =>
							d.hn.includes(item.hn[0]) && d.deptCode[0].includes(item.deptCode),
						);
						const matchingCount = matchingDetails.length;
						if (matchingCount > 0) {
							// ตรวจสอบข้อมูลในฐานข้อมูล
							const checkData = await db.prescription.findFirst({
								where: {
									hnCode: item.hn[0]?.trim(),
									queue_code: item.qMedNo?.trim(),
									prescripCode: item.regNo?.trim(),

									AND: [
										{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
										{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
									],

								},
							});

							if (!checkData) {
								const queue: any = await db.configure.findFirst();

								if (DateLongTH(queue?.hospital_date) !== DateLongTH(new Date())) {
									await db.configure.update({
										data: {
											hospital_date: new Date(),
											hospital_queue_day: 1,
										},
										where: { id: queue?.id },
									});
								} else {
									await db.configure.update({
										where: { id: queue?.id },
										data: {
											hospital_date: new Date(),
											hospital_queue_day: Number(queue?.hospital_queue_day) + 1,
										},
									});
								}

								const QueueNum = await db.configure.findFirst();
								const allergy = await db.medicine.findFirst({
									where: {
										medicineCode: item.medCode || '',
									},
								});
								const queueT = item.qMedNo?.slice(0, 1) || '';

								let Qtype: string;
								if (queueT === 'F') {
									Qtype = 'B';
									// return null;
								} else {
									Qtype = 'A';
								}
								//   const prescripStatus = ['A', 'B', 'C', 'D'].includes(Qtype) ? process.env.NEXT_STATUS1 : process.env.NEXT_STATUS0;
								// const prescripStatus = ['A', 'C', 'D'].includes(Qtype) ? 'รอจับคู่ตะกร้า' : 'จ่ายยาสำเร็จ';
								// const queuetypes = ['000', '0101', '019', '031', '032', '040', '050', '054', '055', '059', '060', '070', '090', '091', '110', '124', '135'].includes(item.deptCode?.trim()) ? 'C' : Qtype;
								const finalQueueType = ['090', '091'].includes(item.deptCode?.trim())
									? 'D'
									: (['000', '001', '0101', '019', '031', '032', '040', '0411', '042', '043', '045', '046', '049', '050', '0501', '0503', '0504', '0506', '0508', '052', '053', '054', '055', '056', '057', '058', '059', '0591', '060', '061', '070', '071', '110', '124', '135'].includes(item.deptCode?.trim()) ? 'C' : Qtype);
								const prescripStatus = ['A', 'B', 'C', 'D'].includes(Qtype) ? 'รอจับคู่ตะกร้า' : 'จ่ายยาสำเร็จ';
								let firstIssTime7 = matchingDetails[0]?.firstIssTime || null;

								if (firstIssTime7) {
									const date7 = new Date(firstIssTime7); // แปลงเป็น Date object
									date7.setHours(date7.getHours() - 7); // ลด 7 ชั่วโมง
									firstIssTime7 = date7.toISOString(); // แปลงกลับเป็น string ในรูปแบบ ISO
								}
								// สร้างข้อมูลใหม่
								await db.prescription.create({
									data: {
										urgent: Qtype === 'B' || Qtype === 'D',
										hnCode: item.hn[0]?.trim() || '',
										full_name: item.fullname?.trim() || '',
										// queue_type: Qtype,
										// queue_type: Qtype,
										queue_type: finalQueueType,
										queue_num: String(QueueNum?.hospital_queue_day),
										queue_code: item.qMedNo?.trim() || '',
										prescripCode: item.regNo?.trim() || '',
										// prescrip_status: 'รอคัดกรอง',
										prescrip_status: prescripStatus,
										delivery: 'โรงพยาบาล',
										medicine_total: matchingCount || '',
										doctor_names: item.doctor_name?.trim() || '',
										pay_type: item.pay_typedes?.trim() || '',
										dept_name: item.deptDesc?.trim() || '',
										age: item.age || '',
										dept_code: item.deptCode?.trim() || '',
										drug_allergy: `${item.medCode?.trim() || ''}${','}${allergy?.name || ''}${' '} ${item.alergyNote?.trim() || ''}`,
										//  ${item.alergyNote?.trim() || ''}
										// firstIssTime: matchingDetails.map((detail: any) => detail?.firstIssTime[0]?.trim()).join(', ') || '',
										firstIssTime: firstIssTime7 || null,
										userconfirm:matchingDetails[0]?.userConfirm,
										confirmTime:matchingDetails[0]?.lastConfirm,
										arranged: {
											create: await Promise.all(matchingDetails.map(async (detail: any, index: number) => {
												const medicine = await db.medicine.findUnique({
													where: {
														medicineCode: detail?.invCode.trim() || '',
													},
												});
												let cabinet = null;
												if (medicine) {
													cabinet = await db.cabinet.findFirst({
														where: {
															medicineId: medicine.id,
														},
													});
												}

												let medicineName = detail?.gen_name?.trim() || '';
												if (!medicine) {
													medicineName += ' (ยาไม่มีในระบบ)';
												} else if (medicine?.medicinetype === 'E' && !cabinet) {
													medicineName += ' (เวชภัณฑ์ ไม่มีในตู้)';
												} else if (!cabinet) {
													medicineName += ' (ไม่มียาในตู้)';
												}
												return {
													labelNo: `${String(index + 1)}/${String(matchingDetails.length)}`,
													...(medicine && {
														medicine: {
															connect: { id: medicine.id },
														},
													}),
													medicineCode: detail?.invCode.trim() || '',
													medicine_name: medicineName,
													medicineFrequencyEn: detail?.AUXDES?.trim() || '',
													medicinePackageSize: detail?.unit || '',
													medicine_amount: detail?.accQty || 0,
													med_detail1: detail?.med_detail?.trim() || '',
													med_detail: `${detail?.lamed_name?.trim() || ''} ${detail?.lamedQty?.trim() || ''} ${detail?.lamed_name_unit?.trim() || ''} ${detail?.lamedTimeText?.trim() || ''}`,
													medicine_advice: detail?.lamedText?.trim() || '',
													prod_type: detail?.prod_type?.trim() || '',
													medicineUnitEatingEn: detail?.addr?.trim() || '',
													dispcause: detail?.dispCause || '',
													medsts: detail?.medSts || '',
													lastDisp: detail?.lastDispense || '',
												};
											})),
										},
									},
									include: {
										arranged: true,
									},
								});
							}
							return item;
						}
						return null;
					}),
			);

			// กรองข้อมูล null ออก
			const filteredMatchedData = matchedData.filter(Boolean);
			const response = {
				data: filteredMatchedData,
				// message: 'Hospital has been get successfully',
			}
			res.locals.data = response;
			// call base class method
			super.send(res);
		} catch (err) {
			next(err);
		}
	}
	///ปริ้น
	/**
	 *
	 * @param req
	 * @param res
	 * @param nextprisma
	 */
	public async postNodeprint(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {

			const datatosend = await req.body;

			// // ตรวจสอบข้อมูลที่ได้รับ
			if (!datatosend || !Array.isArray(datatosend.item) || datatosend.item.length === 0) {
				//   return NextResponse.json({ success: false, message: 'Invalid data provided.' }, { status: 400 });
			}

			// เรียกใช้การพิมพ์
			const result = await executePrintJob(datatosend);

			// ส่งผลลัพธ์กลับไป
			// return NextResponse.json(result, { status: result.success ? 200 : 500 });
			// console.log(datatosend);
			const response = {
				data: datatosend,
				message: { status: result.success ? 200 : 500 },
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

			const [result] = await Promise.all([
				db.prescription.findMany({}),
			])

			const response = {
				data: result,
				message: 'Hospital has been get successfully',
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
			throw new ApiError('null', StatusCodes.BAD_REQUEST);
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
	public async getPrescriptionId(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {

			const presciptionObj = await db.prescription.findFirst({
				where: { id: req.params.id },
			});
			if (!presciptionObj) throw new ApiError('Invalid prescription', StatusCodes.BAD_REQUEST);
			const response = {
				...presciptionObj,
				message: 'Prescription has been GET successfully',
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
	public async postPrescription(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// const { NEXT_PUBLIC_API_URL } = process.env;
			// const values = await req.body;
			const {
				hnCode,
				vnCode,
				queueCode,
				queueType,
				fullName,
				arranged,
			} = await req.body;
			const queue: any = await db.configure.findFirst();
			// const presciptionObj = await db.prescription.findUnique({
			// 	where: { id: req.params.id },
			// });
			if (DateLongTH(queue?.hospital_date) !== DateLongTH(new Date())) {
				await db.configure.update({
					data: {
						hospital_date: new Date(),
						hospital_queue_day: 1,
					},
					where: { id: queue?.id },
				});
			} else {
				await db.configure.update({
					where: { id: queue?.id },
					data: {
						hospital_date: new Date(),
						hospital_queue_day: Number(queue?.hospital_queue_day) + 1,
					},

				});
			}

			const QueueNum = await db.configure.findFirst();

			const queueT = queueCode.slice(0, 1);
			let Qtype: string;
			if (queueT === 'A' || queueT === 'B' || queueT === 'C' || queueT === 'D' || queueT === 'F') {
				Qtype = queueT.slice(0, 1);
			} else {
				Qtype = queueType;
			}

			const prescriptionObj = await db.prescription.create({
				data: {
					// userId: req.auth.user?.id,
					// hospitalId: user?.hospital_initial,
					hnCode,
					vnCode,
					full_name: fullName,
					queue_type: Qtype || '',
					queue_code: queueCode as string,
					queue_num: String(QueueNum?.hospital_queue_day),
					// medicine_total: Number(medicineTotal),
					// medicine_price: Number(medicinePrice),
					delivery: 'โรงพยาบาล',
					prescrip_status: 'รอจับคู่ตะกร้า',
					arranged: {
						create: arranged,
					},
				},
				include: {
					arranged: true,
				},
			});

			// console.log(req.body);
			const response = {
				// ...presciptionObj,
				prescriptionObj,
				message: `Presciption has been create successfully`,
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
	public async putPrescription(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// const { NEXT_PUBLIC_API_URL } = process.env;
			// const values = await req.body;
			const {
				hnCode,
				vnCode,
				queueCode,
				queueType,
				queueNum,
				fullName,
				queueStatus,
				// medicineTotal,
				// medicinePrice,
				delivery,
				basketId,
				urgent,
				station,
				arrangTime,
				userDoubleCheck,
				checkTime,
				userId,
				medicine_service,
				pay_type,
			} = await req.body;
			const presciptionObj = await db.prescription.findUnique({
				where: { id: req.params.id },
			});
			if (!presciptionObj) throw new ApiError('Invalid prescription', StatusCodes.BAD_REQUEST);
			if (station === true) {
				await db.prescription.update({
					where: { id: req.params.id },
					data: {
						medicine_service,
						prescrip_status: queueStatus as string,

					},
				});
			} else {
				await db.prescription.update({
					where: { id: req.params.id },
					data: {
						hnCode,
						vnCode,
						queue_num: queueNum,
						full_name: fullName as string,
						queue_code: queueCode as string,
						queue_type: queueType, // queueCode.slice(0, 1),
						prescrip_status: queueStatus as string,
						delivery,
						basketId: basketId as string,
						urgent: Boolean(urgent),
						arrangTime,
						userDoubleCheck,
						checkTime,
						userId,
						medicine_service,
						pay_type,
					},
				});
			}
			// console.log(req.body);
			const response = {
				...presciptionObj,
				message: `Presciption has been updated successfully`,
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
	public async deletePrescription(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// const { NEXT_PUBLIC_API_URL } = process.env;
			// const values = await req.body;
			const presciptionObj = await db.prescription.delete({
				where: { id: req.params.id },
			});
			if (!presciptionObj) throw new ApiError('Presciption not found', StatusCodes.BAD_REQUEST);
			// console.log(req.body);
			const response = {
				...presciptionObj,
				message: 'Presciption has been removed successfully',
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
	public async getArrangedId(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// const { NEXT_PUBLIC_API_URL } = process.env;
			// const values = await req.body;

			const [result] = await Promise.all([
				db.arranged.findMany({
					where: { id: req.params.id },
					include: {
						medicine: {
							include: {
								cabinet: true,
							},
						},
					},

					orderBy: { createdAt: 'desc' },
				}),

			]);
			// console.log(req.body);
			const response = {
				data: result,
				message: `Arranged has been GET BY ID successfully`,
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
	public async postArranged(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// const { NEXT_PUBLIC_API_URL } = process.env;
			// const values = await req.body;
			const {
				medicineId,
				medicineAmount,
				medicineFrequencyEn,
				medicineAdvice,
				med_detail,
				medicinePackageSize,
				prescripId,
			} = await req.body;
			const argObj = await db.arranged.create({
				data: {
					medicineId,
					medicine_amount: medicineAmount,
					medicineFrequencyEn,
					medicine_advice: medicineAdvice,
					med_detail,
					medicinePackageSize,
					prescripId,
				},
			});

			console.log(req.body);
			const response = {
				// ...presciptionObj,
				argObj,
				message: `Arranged has been create successfully`,
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
	public async putArranged(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				medicineId,
				medicineAmount,
				medicineMethod,
				medicineCondition,
				medicineUnitEating,
				medicineFrequency,
				medicineFrequencyEn,
				medicineAdvice,
				arrang_status,
				print_status,
				barcode,
				error00,
				error01,
				error02,
				error03,
				error04,
				error05,
				error06,
				error07,
				error08,
				error09,
				error10,
				checkComment,
				user_arrang,
				user_arrang_time,
				user_check_time,
				user_double_check,
				med_detail,
				userId,
				medicineAdviceEn,
			} = await req.body;
			const ArrangedObj = await db.arranged.findUnique({
				where: { id: req.params.id },
			});
			if (!ArrangedObj) throw new ApiError('Invalid prescription', StatusCodes.BAD_REQUEST);

			await db.arranged.update({
				where: { id: req.params.id },
				data: {
					medicineId,
					medicine_amount: medicineAmount,
					medicine_method: medicineMethod,
					medicine_condition: medicineCondition,
					medicine_unit_eating: medicineUnitEating,
					medicine_frequency: medicineFrequency,
					medicineFrequencyEn: medicineFrequencyEn,
					medicine_advice: medicineAdvice,
					arrang_status,
					print_status,
					error00,
					error01,
					error02,
					error03,
					error04,
					error05,
					error06,
					error07,
					error08,
					error09,
					error10,
					checkComment,
					user_arrang,
					user_arrang_time,
					user_check_time,
					barcode,
					user_double_check,
					med_detail: med_detail,
					userId,
					medicineAdviceEn,
				},
			});
			// console.log(req.body);
			const response = {
				...ArrangedObj,
				message: 'Arranged has been updated successfully',
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
	public async deleteArranged(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const ArrangedObj = await db.arranged.delete({
				where: { id: req.params.id },
			});
			if (!ArrangedObj) throw new ApiError('Presciption not found', StatusCodes.BAD_REQUEST);
			// console.log(req.body);
			const response = {
				...ArrangedObj,
				message: 'Arranged has been removed successfully',
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
	public async getStationId(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// const { NEXT_PUBLIC_API_URL } = process.env;
			// const values = await req.body;
			const myArray: any = [];
			const myDetail: any = [];
			if (!req.params.id) throw new ApiError('Invalid Station', StatusCodes.BAD_REQUEST);
			const arrangeds = await db.prescription.findMany({
				where: {
					prescrip_status: 'กำลังจัดยา',
					// createdAt: {
					//   gte: todayStart, // ตั้งแต่เวลาเริ่มต้นของวัน
					//   lte: todayEnd, // จนถึงเวลาสิ้นสุดของวัน
					// },

					autoLoad: {
						not: null, // เช็คว่า autoLoad ไม่เป็น null หรือค่าว่าง
					},
				},
				include: {
					arranged: {
						where: {
							user_arrang_time: null,
						},
						include: {
							medicine: {
								include: {
									cabinet:
									{
										where: { storage_station: req.params.id },

									},
								},
							},
						},
					},
				},
			});
			if (arrangeds) {
				arrangeds.map(async (obj) => {
					// console.log(obj);
					obj.arranged.map(async (arrang) => {
						const num = arrang?.medicine?.cabinet?.length;

						// console.log(arrang);
						if (num) {
							myArray.push(arrang.prescripId);
							myDetail.push(arrang.medicineId);
						}
					});
				});
			}

			let master: any = [];
			let medicine: any = [];

			if (myArray && myDetail) {
				master = await db.prescription.findMany({
					where: { id: { in: myArray } },
					include: {
						arranged: {
							where: { user_arrang_time: null }, // เงื่อนไขเดิมที่ต้องการ
							include: {
								autoload: {
									select: {
										load_number: true,
									},
								},
							},

						},

					},
					orderBy: { urgent: 'desc' },
				});

				medicine = await db.arranged.findMany({
					where: { prescripId: { in: myArray }, medicineId: { in: myDetail }, user_arrang_time: null },
					include: {
						autoload: {
							select: {
								load_number: true,
							},
						},
						medicine: {
							include: {
								cabinet: {
									where: { storage_station: req.params?.id as string },
								},
							},
						},
					},
				});
			}
			// console.log(req.body);
			const response = {
				data: master,
				detail: medicine,
				message: `Station has been GET BY ID successfully`,
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
	public async getdrugId(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const myArray: any = [];
			// if (req.auth) {
			const station = await db.configure.findFirst({
				where: { hospital_initial: 'UDH' },
			});

			if (!station) throw new ApiError('drug not found', StatusCodes.BAD_REQUEST);
			// console.log(req.body);
			const arrangeds = await db.prescription.findMany({
				where: { id: req.params.id },
				include: {
					arranged: {
						include: {
							medicine: {
								include: {
									cabinet: {
										where: { storage_station: station.hospital_station },
									},
								},
							},
						},
					},
				},
			});

			arrangeds.map(async (obj) => {
				obj.arranged.map(async (arrang) => {
					const num = arrang?.medicine?.cabinet.length;
					if (num) {
						myArray.push(arrang);
						// console.log('okkk', num, arrang);
					}
				});
			});
			const response = {
				data: myArray,
				message: `Drug has been GET BY ID successfully`,
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
	public async postProduct(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				hospitalId,
				userId,
				cabinet,
				house_id,
				cabinet_size,
				userLevel,
				storage_station,
				storage_location,
				storage_position,
				cabinet_note,
				medicineId,
				storageMin,
				storageMax,
			} = await req.body;
			const userObj = await db.cabinet.create({
				data: {
					hospitalId,
					userId,
					mqtt_topic: `UDH/${storage_station}/${storage_location}/${storage_position}`,
					cabinet,
					HouseId: house_id as string,
					cabinet_size,
					userLevel: userLevel as string,
					storage_station,
					storage_location,
					storage_position,
					cabinet_note,
					medicineId: medicineId as string,
					storageMin: Number(storageMin),
					storageMax: Number(storageMax),
				},
			});

			// console.log(req.body);
			const response = {
				// ...presciptionObj,
				userObj,
				message: 'Cabinet has been created successfully',
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
	public async putProduct(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				hospitalId,
				userId,
				mqtt_topic,
				cabinet,
				house_id,
				cabinet_size,
				userLevel,
				storage_station,
				storage_location,
				storage_position,
				cabinet_note,
				medicineId,
				storageMin,
				storageMax,
				storageAdd,
			} = await req.body;
			const CabinetObj = await db.cabinet.findUnique({
				where: { id: req.params.id },
			});
			if (!CabinetObj) throw new ApiError('Invalid prescription', StatusCodes.BAD_REQUEST);
			await db.cabinet.update({
				where: { id: req.params.id },
				data: {
					hospitalId,
					userId,
					mqtt_topic,
					cabinet,
					HouseId: house_id as string,
					cabinet_size: cabinet_size as string,
					userLevel: userLevel as string,
					storage_station,
					storage_location,
					storage_position,
					cabinet_note,
					medicineId: medicineId as string,
					storageMin: Number(storageMin),
					storageMax: Number(storageMax),
					storageAdd: Number(storageAdd),
				},
			});
			// console.log(req.body);
			const response = {
				...CabinetObj,
				message: 'Cabinet has been updated successfully',
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
	public async deleteProduct(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const CabinetObj = await db.cabinet.delete({
				where: { id: req.params.id },
			});
			if (!CabinetObj) throw new ApiError('Presciption not found', StatusCodes.BAD_REQUEST);
			// console.log(req.body);
			const response = {
				...CabinetObj,
				message: 'Cabinets has been removed successfully',
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
	public async getDrugId(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {

			const drugObj = await db.medicine.findMany({
				where: { id: req.params.id as string },
			});

			if (!drugObj) throw new ApiError('Invalid prescription', StatusCodes.BAD_REQUEST);
			const response = {
				drugObj,
				message: 'Drug has been get successfully',
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
	public async postDrug(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// const { NEXT_PUBLIC_API_URL } = process.env;
			// const values = await req.body;
			const {
				medicineCode,
				medicineImage1,
				medicineImage2,
				medicineImage3,
				name,
				medicineName_en,
				medicinePackageSize,
			} = await req.body;

			// console.log(medicineImage1);
			const MedicineObj = await db.medicine.create({
				data: {
					medicineCode,
					medicineImage1,
					medicineImage2,
					medicineImage3,
					name,
					medicineName_en,
					medicinePackageSize,
				},
			});

			// console.log(req.body);
			const response = {
				// ...presciptionObj,
				MedicineObj,
				message: 'Drug has been created successfully',
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
	public async putDrug(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				name,
				medicineName_th,
				medicineName_en,
				medicinePackageSize,
				medicineCode,
				medicineImage1,
				medicineImage2,
				medicineImage3,
				medicineNote,
			} = await req.body;

			await db.medicine.upsert({
				// where: { medicineCode: params.id },
				where: { medicineCode: req.params.id },
				create: {
					medicineCode: (req.params.id),
					name,
					medicineName_th,
					medicineName_en,
					medicinePackageSize,

				},
				update: {
					name,
					medicineName_th,
					medicineName_en,
					medicinePackageSize,
					medicineCode,
					medicineImage1,
					medicineImage2,
					medicineImage3,
					medicineNote,
				},
			});
			// console.log(req.body);
			const response = {
				// ...presciptionObj,
				message: 'Drug has been updated successfully',
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
	public async deleteDrug(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const DurgObj = await db.medicine.delete({
				where: { id: req.params.id },
			});
			if (!DurgObj) throw new ApiError('Presciption not found', StatusCodes.BAD_REQUEST);
			// console.log(req.body);
			const response = {
				...DurgObj,
				message: 'Drug has been removed successfully',
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
	public async postConfigures(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				hospitalCode,
				hospitalLogo,
				hospitalInitial,
				hospitalNameTh,
				hospitalNameEn,
				hospitalDate,
				hospitalTime,
				hospitalQueueDay,
				hospitalStatus,
				hospitalStation,
				hospitalCallMessage,
				hospitalMessage,
			} = await req.body;

			const ConfigObj = await db.configure.create({
				data: {
					hospital_code: hospitalCode,
					hospital_logo: hospitalLogo,
					hospital_initial: hospitalInitial,
					hospital_nameTH: hospitalNameTh,
					hospital_nameEN: hospitalNameEn,
					hospital_date: hospitalDate,
					hospital_time: hospitalTime,
					hospital_queue_day: Number(hospitalQueueDay),
					hospital_status: hospitalStatus,
					hospital_station: hospitalStation as string,
					hospital_call_message: hospitalCallMessage as string,
					hospital_message: hospitalMessage as string,
				},
			});

			// console.log(req.body);
			const response = {
				// ...presciptionObj,
				ConfigObj,
				message: 'Configured has been created successfully',
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
	public async putConfigures(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				hospitalCode,
				hospitalLogo,
				hospitalInitial,
				hospitalNameTh,
				hospitalNameEn,
				hospitalDate,
				hospitalTime,
				hospitalQueueDay,
				hospitalStatus,
				hospitalStation,
				hospitalCallMessage,
				hospitalMessage,

			} = await req.body;

			const ConfigObj = await db.configure.findUnique({
				where: { id: req.params.id },
			});
			if (!ConfigObj) throw new ApiError('Invalid Configures', StatusCodes.BAD_REQUEST);
			await db.configure.update({
				where: { id: req.params.id },
				data: {
					hospital_code: hospitalCode,
					hospital_logo: hospitalLogo,
					hospital_initial: hospitalInitial,
					hospital_nameTH: hospitalNameTh,
					hospital_nameEN: hospitalNameEn,
					hospital_date: new Date(hospitalDate),
					hospital_time: hospitalTime,
					hospital_queue_day: Number(hospitalQueueDay),
					hospital_status: Boolean(hospitalStatus),
					hospital_station: hospitalStation as string,
					hospital_call_message: hospitalCallMessage as string,
					hospital_message: hospitalMessage as string,
				},
			});
			// console.log(req.body);
			const response = {
				...ConfigObj,
				message: 'Configured has been updated successfully',
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
	public async deleteConfigures(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const ConfigObj = await db.configure.delete({
				where: { id: req.params.id },
			});
			if (!ConfigObj) throw new ApiError('Presciption not found', StatusCodes.BAD_REQUEST);
			// console.log(req.body);
			const response = {
				...ConfigObj,
				message: 'Configured has been removed successfully',
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
	public async postCabinetmedicine(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// const { NEXT_PUBLIC_API_URL } = process.env;
			// const values = await req.body;
			const {
				medicineCode,
				medicineImage1,
				medicineImage2,
				medicineImage3,
				name,
				medicineName_th,
				medicineName_en,
				medicinePackageSize,
				medicine_method,
				medicineMethodEn,
				medicine_condition,
				medicine_unit_eating,
				medicineUnitEatingEn,
				medicine_frequency,
				medicineFrequencyEn,
				medicine_advice,
				medicineAdviceEn,
				medicineNote,
			} = await req.body;

			// console.log(medicineImage1);
			const MedicineObj = await db.medicine.create({
				data: {
					medicineCode,
					medicineImage1,
					medicineImage2,
					medicineImage3,
					name,
					medicineName_th,
					medicineName_en,
					medicinePackageSize,
					medicine_method,
					medicineMethodEn,
					medicine_condition,
					medicine_unit_eating,
					medicineUnitEatingEn,
					medicine_frequency,
					medicineFrequencyEn,
					medicine_advice,
					medicineAdviceEn,
					medicineNote,
				},
			});

			// console.log(req.body);
			const response = {
				MedicineObj,
				message: 'Drug has been created successfully',
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
	public async putCabinetmedicine(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				medicineCode,
				medicineImage1,
				medicineImage2,
				medicineImage3,
				name,
				medicineName_th,
				medicineName_en,
				medicinePackageSize,
				medicine_method,
				medicineMethodEn,
				medicine_condition,
				medicine_unit_eating,
				medicineUnitEatingEn,
				medicine_frequency,
				medicineFrequencyEn,
				medicine_advice,
				medicineAdviceEn,
				medicineNote,
			} = await req.body;

			// console.log(medicineImage1);

			const MedicineObj = await db.medicine.findUnique({
				where: { id: req.params.id },
			});
			if (!MedicineObj) throw new ApiError('medicine not found', StatusCodes.BAD_REQUEST);
			await db.medicine.update({
				where: { id: req.params.id },
				data: {
					medicineCode,
					medicineImage1,
					medicineImage2,
					medicineImage3,
					name,
					medicineName_th,
					medicineName_en,
					medicinePackageSize,
					medicine_method,
					medicineMethodEn,
					medicine_condition,
					medicine_unit_eating,
					medicineUnitEatingEn,
					medicine_frequency,
					medicineFrequencyEn,
					medicine_advice,
					medicineAdviceEn,
					medicineNote,
				},
			});

			// console.log(req.body);
			const response = {
				...MedicineObj,
				message: 'Drug has been updated successfully',
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
	public async deleteCabinetmedicine(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const DurgObj = await db.medicine.delete({
				where: { id: req.params.id },
			});
			if (!DurgObj) throw new ApiError('Presciption not found', StatusCodes.BAD_REQUEST);
			// console.log(req.body);
			const response = {
				...DurgObj,
				message: 'Drug has been removed successfully',
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
	public async postCabinet(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				hospitalId,
				userId,
				cabinet,
				house_id,
				cabinet_size,
				userLevel,
				storage_station,
				storage_location,
				storage_position,
				cabinet_note,
				medicineId,
				storageMin,
				storageMax,
				plcId,
			} = await req.body;

			const userObj = await db.cabinet.create({
				data: {
					hospitalId,
					userId,
					mqtt_topic: `UDH/${storage_station}/${storage_location}/${storage_position}`,
					cabinet,
					HouseId: house_id as string,
					cabinet_size,
					userLevel: userLevel as string,
					storage_station,
					storage_location,
					storage_position,
					cabinet_note,
					medicineId: medicineId as string,
					storageMin: Number(storageMin),
					storageMax: Number(storageMax),
					plcId,
				},
			});

			// console.log(req.body);
			const response = {
				userObj,
				message: 'Cabinet has been created successfully',
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
	public async putCabinet(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				hospitalId,
				userId,
				mqtt_topic,
				cabinet,
				house_id,
				cabinet_size,
				userLevel,
				storage_station,
				storage_location,
				storage_position,
				cabinet_note,
				medicineId,
				storageMin,
				storageMax,
				storageAdd,
				medicineImage1,
				medicineImage2,
				medicineImage3,
				plcId,
			} = await req.body;

			// console.log('sdfjakldfjak', plcId);

			const CabinetObj = await db.cabinet.findUnique({
				where: { id: req.params.id },
			});
			if (!CabinetObj) throw new ApiError('medicine not found', StatusCodes.BAD_REQUEST);
			// await db.$transaction(async () => {
			// 	await db.cabinet.update({
			// 		where: { id: req.params.id },
			// 		data: {
			// 			hospitalId,
			// 			userId,
			// 			mqtt_topic,
			// 			cabinet,
			// 			HouseId: house_id as string,
			// 			cabinet_size: cabinet_size as string,
			// 			userLevel: userLevel as string,
			// 			storage_station,
			// 			storage_location,
			// 			storage_position,
			// 			cabinet_note,
			// 			medicineId: medicineId as string,
			// 			plcId,
			// 		},
			// 	});

			// 	if (medicineId) {
			// 		// console.log('sdkfjajsdfkaljf', medicineImage1, medicineImage2, medicineImage3);
			// 		await db.medicine.update({
			// 			where: { id: medicineId as string },
			// 			data: {
			// 				storageAdd: Number(storageAdd),
			// 				storageMin: Number(storageMin),
			// 				storageMax: Number(storageMax),
			// 				medicineImage1: medicineImage1 || null,
			// 				medicineImage2: medicineImage2 || null,
			// 				medicineImage3: medicineImage3 || null,
			// 			},
			// 		});
			// 	}
			// });
			const transactionQueries: PrismaPromise<any>[] = [
				db.cabinet.update({
				  where: { id: req.params.id },
				  data: {
					hospitalId,
					userId,
					mqtt_topic,
					cabinet,
					HouseId: house_id as string,
					cabinet_size: cabinet_size as string,
					userLevel: userLevel as string,
					storage_station,
					storage_location,
					storage_position,
					cabinet_note,
					medicineId: medicineId as string,
					plcId,
				  },
				}),
			  ];
			  
			  if (medicineId) {
				transactionQueries.push(
				  db.medicine.update({
					where: { id: medicineId as string },
					data: {
					  storageAdd: Number(storageAdd),
					  storageMin: Number(storageMin),
					  storageMax: Number(storageMax),
					  medicineImage1: medicineImage1 || null,
					  medicineImage2: medicineImage2 || null,
					  medicineImage3: medicineImage3 || null,
					},
				  })
				);
			  }
			  
			  await db.$transaction(transactionQueries);
			  
			// console.log(req.body);
			const response = {
				...CabinetObj,
				message: 'Cabinet has been updated successfully',
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
	public async deleteCabinet(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const CabinetObj = await db.cabinet.delete({
				where: { id: req.params.id },
			});
			if (!CabinetObj) throw new ApiError('Cabinets not found', StatusCodes.BAD_REQUEST);
			// console.log(req.body);
			const response = {
				...CabinetObj,
				message: 'Cabinets has been removed successfully',
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
	public async postBasket(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				hospitalId,
				qrCode,
				basket_color,
				basket_status,
				basket_type,
				basket_floor,
			} = await req.body;

			const basketObj = await db.basket.create({
				data: {
					hospitalId,
					// userId: 'clyy0oz9a0000w86ie1w2kui1',
					qrCode,
					basket_color,
					basket_status,
					basket_type,
					basket_floor: Number(basket_floor),
				},
			});

			// console.log(req.body);
			const response = {
				basketObj,
				message: 'Basket has been created successfully',
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
	public async putBasket(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const {
				hospitalId,
				userId,
				qrCode,
				basket_color,
				basket_status,
				basket_type,
				basket_floor,
				name,
			} = await req.body;

			const basketObj = await db.basket.findUnique({
				where: { id: req.params.id },
			});
			if (!basketObj) throw new ApiError('basket not found', StatusCodes.BAD_REQUEST);
			await db.basket.update({
				where: { id: req.params.id },
				data: {
					hospitalId,
					userId,
					qrCode,
					basket_color,
					basket_status,
					basket_type,
					basket_floor: Number(basket_floor),
					name,
				},
			});
			// console.log(req.body);
			const response = {
				...basketObj,
				message: 'Basket has been updated successfully',
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
	public async deleteBasket(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const BasketObj = await db.basket.delete({
				where: { id: req.params.id },
			});
			if (!BasketObj) throw new ApiError('basket not found', StatusCodes.BAD_REQUEST);
			// console.log(req.body);
			const response = {
				...BasketObj,
				message: 'Cabinets has been removed successfully',
			}


			res.locals.data = response;
			// call base class method
			super.send(res);
		} catch (err) {
			next(err);
		}
	}
}

///print
const PRINTER_CONFIG = {
	type: PrinterTypes.EPSON,
	interface: 'tcp://172.16.2.112:9100',
	width: 50,
	characterSet: CharacterSet.PC437_USA,
	removeSpecialCharacters: false,
	replaceSpecialCharacters: true,
};

// Utility function to format date and time
const getFormattedDateTime = () => {
	const now = new Date();
	const date = now.toLocaleDateString('th-TH');
	const time = now.toLocaleTimeString('th-TH');
	return { date, time };
};

// Helper function to print item details
function printItemDetails(printer: any, items: Item[]) {
	printer.alignLeft();
	const sortedItems = items.sort((a, b) => {
		const aLabel = Number.parseInt(a.labelNo?.split('/')[0] || '0', 10);
		const bLabel = Number.parseInt(b.labelNo?.split('/')[0] || '0', 10);
		return aLabel - bLabel;
	});
	function getMedStatus(medsts: string) {
		switch (medsts) {
			case '0':
				return 'ยาใหม่';
			case '1':
				return 'ลดขนาดยา';
			case '2':
				return 'เพิ่มขนาดยา';
			case '3':
				return 'ปรับเวลาใช้ยา';
			case '9':
				return 'ผู้ป่วยไม่ได้รับยา';
			case '4':
				return 'Offยา';
			default:
				return ''; // ถ้าไม่ตรงกับกรณีใดๆ
		}
	}

	// items.forEach((item, index) => {
	sortedItems.forEach((item) => {
		// const itemNumber = index + 1;
		// printer.println(`${itemNumber}.${item.name}`); // พิมพ์ชื่อยาและจำนวนในบรรทัดเดียวกัน
		// printer.println(`${item.labelNo?.split('/')[0]}.${item.name}${', '}${item.medsts === '0' ? 'ยาใหม่' : item.medsts || ''}${', '}${item?.dispcause || ''}`); // พิมพ์ชื่อยาและจำนวนในบรรทัดเดียวกัน
		printer.println(`${item.labelNo?.split('/')[0]}.${item.name}${', '}${getMedStatus(item.medsts) || ''}${', '}${item?.dispcause || ''}`);
		printer.println(`** ${item.quantity} ${item.packsize} *** ${item.med_details?.split('#')[0]}`); // พิมพ์ชื่อยาและจำนวนในบรรทัดเดียวกัน
		printer.println('');
		// พิมพ์รายละเอียดยา
		// พิมพ์รายละเอียดยา
		// if (item.med_details) {
		//   printer.println(item.med_details.trim());
		// }
	});
	printer.alignRight();
	printer.println(`รวมทั้งหมด ${items.length} รายการ`);
}

// Template for printing
function printTemplate(printer: any, data: PrintData) {
	const { date, time } = getFormattedDateTime();

	printer.alignCenter();
	// printer.printQR(data.HN);
	printer.printQR(data.HN, {
		cellSize: 6, // 1 - 8
		correction: 'M', // L(7%), M(15%), Q(25%), H(30%)
		model: 2, // 1 - Model 1
		// 2 - Model 2 (standard)
		// 3 - Micro QR
	});

	printer.setTextSize(2, 2);
	printer.bold(true); // ใช้ข้อความหนา
	printer.println(`คิวรับยา : ${data.type_q}${data.q_dep}`);
	printer.setTextQuadArea();
	printer.bold(true);
	printer.println(`HN : ${data.HN}`);
	printer.bold(false);
	printer.println(`ชื่อ: ${data.pname}`);

	printer.setTextNormal();
	printer.println('*'.repeat(48));
	printer.bold(true);
	printer.println(`สิทธิ์ : ${data.pay}`);
	printer.bold(false);
	printer.println('*'.repeat(48));

	printer.bold(true);
	printer.println('รายการยา');
	printer.bold(false);

	printItemDetails(printer, data.item);

	printer.alignLeft();
	printer.println('');
	printer.println(`อายุ:${data.age || ''}`);
	printer.println(`ห้องตรวจ:${data.dept || ''}`);
	printer.println(`ประวัติการแพ้ยา:${data.allergy || ''}`);
	printer.println(`ชื่อแพทย์/ผู้สั่งจ่าย:${data.doctor.trim()}`);
	printer.println(`โรงพยาบาลศูนย์อุดรธานี`);
	printer.println(`วันที่: ${date} ${time}`);

	printer.println('');
	printer.println(`ผู้ยืนยัน:${data.userconfirms.trim()}`);
	printer.println('');
	printer.println(`ผู้ตรวจสอบ:....................`);
	printer.println('');
	printer.println(`ผู้ส่งมอบ:.....................`);
	printer.alignCenter();
	printer.println('');
	printer.code128(data.HN, {
		width: 'MEDIUM', // "SMALL", "MEDIUM", "LARGE",
		height: 50, // 50 < x < 80
		text: 2, // 1 - No text
		// 2 - Text on bottom
		// 3 - No text inline
		// 4 - Text on bottom inline
	});
	printer.beep();
	printer.cut();
}
async function executePrintJob(data: PrintData) {
	try {
		// สร้าง Printer ใหม่ในแต่ละครั้ง
		const printer = new ThermalPrinter(PRINTER_CONFIG);

		// ตรวจสอบว่าเครื่องพิมพ์เชื่อมต่อหรือไม่
		const isConnected = await printer.isPrinterConnected();
		if (!isConnected) {
			throw new Error('Printer is not connected.');
		}

		// พิมพ์ข้อมูล
		printTemplate(printer, data);
		await printer.execute();

		// ตรวจสอบการพิมพ์สำเร็จ
		return { success: true, message: 'Print job completed!' };
	} catch (error) {
		// ถ้าเกิดข้อผิดพลาดในการพิมพ์
		console.error('Print error:', error);
		return { success: false, message: `Failed to print` };
	}
}