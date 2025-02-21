// import { NextFunction, Request, Response } from 'express';
// import { StatusCodes } from 'http-status-codes';
// import ApiError from '../../abstractions/ApiError';
// import BaseController from '../BaseController';

// import { RouteDefinition } from '../../types/RouteDefinition';
// import sql from 'mssql';
// import config from '../../config/db.config';

// import dayjs from 'dayjs';
// import { db } from '../../lib/prisma.db';
// /**
//  * Status controller
//  */
// export default class UdhMedController extends BaseController {
// 	// base path
// 	public basePath = 'udh';

// 	/**
// 	 *
// 	 */
// 	public routes(): RouteDefinition[] {
// 		return [
// 			{
// 				path: '/info',
// 				method: 'get',
// 				handler: this.getSystemInfo.bind(this),
// 			},
// 			{
// 				path: '/med-time',
// 				method: 'get',
// 				handler: this.getDateInfo.bind(this),
// 			},
// 			{
// 				path: '/med-info',
// 				method: 'get',
// 				handler: this.getMedInfo.bind(this),
// 			},
// 			{
// 				path: '/med-info1',
// 				method: 'get',
// 				handler: this.getMedInfo1.bind(this),
// 			},
// 			{
// 				path: '/med-pay',
// 				method: 'get',
// 				handler: this.getMedPay.bind(this),
// 			},
// 			{
// 				path: '/med-hn',
// 				method: 'get',
// 				handler: this.getMedHn.bind(this),
// 			},
// 			// {
// 			// 	path: '/med-queue2',
// 			// 	method: 'get',
// 			// 	handler: this.getMedQueue2.bind(this),
// 			// },
// 			{
// 				path: '/drug-info',
// 				method: 'get',
// 				handler: this.getDrugInfo.bind(this),
// 			},
// 			{
// 				path: '/equip-info',
// 				method: 'get',
// 				handler: this.getEquipInfo.bind(this),
// 			},
// 			{
// 				path: '/quemed-info',
// 				method: 'get',
// 				handler: this.getQueMedInfo.bind(this),
// 			},
// 			{
// 				path: '/quemed-pay',
// 				method: 'get',
// 				handler: this.getQueMedPay.bind(this),
// 			},
// 			{
// 				path: '/med-queue',
// 				method: 'get',
// 				handler: this.getMedQueue.bind(this),
// 			},
// 			{
// 				path: '/med-queue',
// 				method: 'post',
// 				handler: this.postMedQueue.bind(this),
// 			},
// 			{
// 				path: '/med-qpay',
// 				method: 'post',
// 				handler: this.postMedQpay.bind(this),
// 			},
// 			{
// 				path: '/error',
// 				method: 'get',
// 				handler: this.getError.bind(this),
// 			},
// 			// These are the examples added here to follow if we need to create a different type of HTTP method.
// 			{ path: '/', method: 'post', handler: this.getError.bind(this) },
// 			{ path: '/', method: 'put', handler: this.getError.bind(this) },
// 			{ path: '/', method: 'patch', handler: this.getError.bind(this) },
// 			{ path: '/', method: 'delete', handler: this.getError.bind(this) },
// 		];
// 	}

// 	/**
// 	 *
// 	 * @param req
// 	 * @param res
// 	 * @param next
// 	 */
// 	public getSystemInfo(
// 		req: Request,
// 		res: Response,
// 		next: NextFunction,
// 	): void {
// 		try {

// 			res.locals.data = 'ok ครับ';
// 			// call base class method
// 			super.send(res);
// 		} catch (err) {
// 			next(err);
// 		}
// 	}

// 	/**
// 	 *
// 	 * @param req
// 	 * @param res
// 	 * @param next
// 	 */
// 	public async getDateInfo(
// 		req: Request,
// 		res: Response,
// 		next: NextFunction,
// 	): Promise<void> {
// 		try {
// 			// Connect to the database
// 			// await sql.connect(config);
// 			const response = new Date().toLocaleDateString('th-TH', {
// 				year: 'numeric',
// 				month: 'long',
// 				day: 'numeric',
// 				weekday: 'long',
// 				hour: 'numeric',
// 				minute: 'numeric',
// 				second: '2-digit'
// 			  })
// 			res.locals.data = response;
// 			super.send(res);
// 		} catch (err) {
// 			next(err); // Send error to error handler
// 		}
// 	}

// 		/**
// 	 *
// 	 * @param req
// 	 * @param res
// 	 * @param next
// 	 */
// 		public async getMedInfo(
// 			req: Request,
// 			res: Response,
// 			next: NextFunction,
// 		): Promise<void> {
// 			try {
// 				// Connect to the database
// 				await sql.connect(config);
// 				// const date = new Date()
// 				// const dd = date.getDate()
// 				// const mm = date.getMonth()+1
// 				// const yyyy = date.getFullYear() + 543;
// 				// const today = yyyy+''+mm+''+dd;

// 				// Run query to fetch data from the database
// 				const result = await sql.query(`
// 					SELECT DISTINCT PM.*, PT.* 
// 					FROM [UDON2].[dbo].[API_Q_OPD_Patmed] PM
// 					LEFT JOIN [API_Q_OPD_PATIENT] PT WITH(NOLOCK)
// 					ON PM.hn = PT.hn AND PM.registNo = PT.regNo AND PM.deptCode = PT.deptCode
// 					WHERE accQty !=0 AND medSite = 'O2' AND medStatus = '2' AND PM.deptCode is not null
// 				`);

// 				// Get total records
// 				const total = result.recordset.length;

// 				// Set pagination variables
// 				const page = parseInt(req.query.page as string) || 1; // Default to page 1
// 				const pageSize = parseInt(req.query.pageSize as string) || 4000; // Default to 10 items per page
// 				const startIndex = (page - 1) * pageSize;
// 				const endIndex = Math.min(startIndex + pageSize, total);
// 				const pages = Math.ceil(total / pageSize);

// 				// Slice the data for pagination
// 				const paginatedData = result.recordset.slice(startIndex, endIndex);

// 				// Create the response object
// 				const response = {
// 					data: paginatedData,
// 					page: page,
// 					pages: pages,
// 					total: total,
// 					startIndex: startIndex,
// 					endIndex: endIndex,
// 				};

// 				// const response = result.recordset

// 				// Send the response back to the client
// 				res.locals.data = response;
// 				super.send(res);
// 			} catch (err) {
// 				next(err); // Send error to error handler
// 			}
// 		}


// 		/**
// 	 *
// 	 * @param req
// 	 * @param res
// 	 * @param next
// 	 */
// 		public async getMedInfo1(
// 			req: Request,
// 			res: Response,
// 			next: NextFunction,
// 		): Promise<void> {
// 			try {
// 				// Connect to the database
// 				await sql.connect(config);
// 				const date = new Date()
// 				const dd = date.toLocaleString("default", {day: "2-digit"})
// 				const mm = date.toLocaleString("default", {month: "2-digit"});
// 				const yyyy = date.toLocaleString("default", {year: "numeric"});
// 				const thyear = Number(yyyy) + 543;
// 				const today = thyear+''+mm+''+dd;

// 				console.log(today);

// 				// Run query to fetch data from the database
// 				const result = await sql.query(`
// 						select DISTINCT PM.* from [UDON2].[dbo].[API_Q_OPD_MED_ALLERGY] PM
// 					`);

// 					// select DISTINCT PM.* from [UDON2].[dbo].[API_Q_OPD_Patmed] PM
// 					// 	WHERE PM.hn ='1369125' AND PM.deptCode is not null

// 					// select DISTINCT PT.* from [API_Q_OPD_PATIENT] PT WITH(NOLOCK)
// 					// 	WHERE PT.medSite = 'O2' and PT.medStatus = '2'
// 					// 	GROUP BY PT.hn, PT.regNo, PT.registDate, PT.fullname, PT.pay_typedes, PT.phone,
// 					// 	PT.age, PT.birthDay, PT.deptCode, PT.deptDesc, PT.CardID, PT.med_site, PT.qMedNo, PT.medSite,
// 					// 	PT.medStatus, PT.med_status_detail, PT.doctor_name, PT.docCode
// 					// select DISTINCT PM.* from [UDON2].[dbo].[API_Q_OPD_Patmed] PM
// 					// 	LEFT JOIN [API_Q_OPD_PATIENT] PT WITH(NOLOCK)
// 					// 	ON PM.hn = PT.hn AND PM.registNo = PT.regNo
// 					// 	WHERE PM.registDate= ${today} AND PM.siteConfirm ='O2'
// 				// Get total records
// 				const total = result.recordset.length;

// 				// Set pagination variables
// 				const page = parseInt(req.query.page as string) || 1; // Default to page 1
// 				const pageSize = parseInt(req.query.pageSize as string) || 4000; // Default to 10 items per page
// 				const startIndex = (page - 1) * pageSize;
// 				const endIndex = Math.min(startIndex + pageSize, total);
// 				const pages = Math.ceil(total / pageSize);

// 				// Slice the data for pagination
// 				const paginatedData = result.recordset.slice(startIndex, endIndex);

// 				// Create the response object
// 				const response = {
// 					data: paginatedData,
// 					page: page,
// 					pages: pages,
// 					total: total,
// 					startIndex: startIndex,
// 					endIndex: endIndex,
// 				};

// 				// const response = result.recordset

// 				// Send the response back to the client
// 				res.locals.data = response;
// 				super.send(res);
// 			} catch (err) {
// 				next(err); // Send error to error handler
// 			}
// 		}

// 		/**
// 		 *
// 		 * @param req
// 		 * @param res
// 		 * @param next
// 		 */
// 		public async getMedPay(
// 			req: Request,
// 			res: Response,
// 			next: NextFunction,
// 		): Promise<void> {
// 			try {
// 				// Connect to the database
// 				await sql.connect(config);
// 				const result = await sql.query(`
// 					SELECT DISTINCT PM.*, PT.* 
// 					FROM [UDON2].[dbo].[API_Q_OPD_Patmed] PM
// 					LEFT JOIN [API_Q_OPD_PATIENT] PT WITH(NOLOCK)
// 					ON PM.hn = PT.hn AND PM.registNo = PT.regNo AND PM.deptCode = PT.deptCode
// 					WHERE PT.medStatus='2' AND PM.siteConfirm ='O2' AND PM.accQty>0 AND PT.medSite='O2' AND PM.deptCode is not null				
// 					`);

// 					// select DISTINCT pt.*,pm.*
// 					// from API_Q_OPD_PATIENT pt with (nolock) left join
// 					 // API_Q_OPD_Patmed pm with (nolock) on pt.hn=pm.hn and pt.regNo = pm.registNo
// 					// where pt.medStatus='2' AND pm.siteConfirm ='O2' AND pm.accQty>0 AND pt.medSite='O2'

// 					  // order by pt.hn
// 				// Get total records
// 				const total = result.recordset.length;

// 				// Set pagination variables
// 				const page = parseInt(req.query.page as string) || 1; // Default to page 1
// 				const pageSize = parseInt(req.query.pageSize as string) || 8000; // Default to 10 items per page
// 				const startIndex = (page - 1) * pageSize;
// 				const endIndex = Math.min(startIndex + pageSize, total);
// 				const pages = Math.ceil(total / pageSize);

// 				// Slice the data for pagination
// 				const paginatedData = result.recordset.slice(startIndex, endIndex);

// 				// Create the response object
// 				const response = {
// 					data: paginatedData,
// 					page: page,
// 					pages: pages,
// 					total: total,
// 					startIndex: startIndex,
// 					endIndex: endIndex,
// 				};

// 				// const response = result.recordset

// 				// Send the response back to the client
// 				res.locals.data = response;
// 				super.send(res);
// 			} catch (err) {
// 				next(err); // Send error to error handler
// 			}
// 		}

// 		/**
// 		*
// 		* @param req
// 		* @param res
// 		* @param next
// 		*/
// 		public async getMedHn(
// 			req: Request,
// 			res: Response,
// 			next: NextFunction,
// 		): Promise<void> {
// 			try {
// 				// Connect to the database
// 				await sql.connect(config);
// 				// const date = new Date()
// 				// const dd = date.getDate()
// 				// const mm = date.getMonth()+1
// 				// const yyyy = date.getFullYear() + 543;
// 				// const today = yyyy+''+mm+''+dd;

// 				// Run query to fetch data from the database
// 				const result = await sql.query(`
// 					SELECT DISTINCT PT.*, AE.* 
// 					FROM [UDON2].[dbo].[API_Q_OPD_PATIENT] PT
// 					LEFT JOIN [API_Q_OPD_MED_ALLERGY] AE WITH(NOLOCK)
// 					ON PT.hn = AE.hn
// 					WHERE  (PT.qMedNo IS NOT NULL AND PT.qMedNo != '') AND PT.medSite = 'O2' AND PT.medStatus = '2'
// 					ORDER BY PT.qMedNo ASC
// 				`);

// 				// Get total records
// 				const total = result.recordset.length;

// 				// Set pagination variables
// 				const page = parseInt(req.query.page as string) || 1; // Default to page 1
// 				const pageSize = parseInt(req.query.pageSize as string) || 4000; // Default to 10 items per page
// 				const startIndex = (page - 1) * pageSize;
// 				const endIndex = Math.min(startIndex + pageSize, total);
// 				const pages = Math.ceil(total / pageSize);

// 				// Slice the data for pagination
// 				const paginatedData = result.recordset.slice(startIndex, endIndex);

// 				// Create the response object
// 				const response = {
// 					data: paginatedData,
// 					page: page,
// 					pages: pages,
// 					total: total,
// 					startIndex: startIndex,
// 					endIndex: endIndex,
// 				};

// 				// const response = result.recordset

// 				// Send the response back to the client
// 				res.locals.data = response;
// 				super.send(res);
// 			} catch (err) {
// 				next(err); // Send error to error handler
// 			}
// 		}

// 		/**
// 		 *
// 		 * @param req
// 		 * @param res
// 		 * @param next
// 		 */
// 		public async getMedQueue(
// 			req: Request,
// 			res: Response,
// 			next: NextFunction,
// 		): Promise<void> {
// 			try {
// 				const dayjsNow = dayjs();
// 				const dayjsStartDate = dayjsNow.startOf("day");
// 				const dayjsEndDate = dayjsNow.endOf("day");
// 				// console.log(dayjsStartDate.format("YYYY-MM-DDTHH:mm:ss"))

// 				const queue = await db.queue.findMany({
// 					where: {
// 						AND: [
// 						 { createdAt: { gte: new Date(dayjsStartDate.format("YYYY-MM-DDTHH:mm:ss"))}},
// 						 { createdAt: { lte: new Date(dayjsEndDate.format("YYYY-MM-DDTHH:mm:ss"))}}
// 						],
// 						// channel2: Number(id),

// 						queueStatus: { in: [1, 2, 4] },
// 					 },
// 					 take: 150,
// 					 orderBy: [ {createdAt: 'desc' }, { queueCode: "asc"}]});

// 					  const response = {
// 						data: queue,
// 					}
// 				// Send the response back to the client
// 				res.locals.data = response;
// 				super.send(res);
// 			} catch (err) {
// 				next(err); // Send error to error handler
// 			}
// 		}

// 		/**
// 		 *
// 		 * @param req
// 		 * @param res
// 		 * @param next
// 		 */
// 		public async postMedQueue(
// 			req: Request,
// 			res: Response,
// 			next: NextFunction,
// 		): Promise<void> {
// 			try {
// 				const data = req.body
// 				const udh = await db.configure.findFirst();
// 				const result = String(udh?.hospital_call_message);
// 				const call = result.split(',');

// 				data.map(async (item: any, index: number) => {
// 					const queues = await db.queue.findFirst({
// 						where: { AND: [{ queueCode: item.qMedNo as string }, { hnCode: item.hn.trim() }] }
// 					})
// 					// console.log(queues)
// 					if(queues === null) {
// 						const addCall = `${call[0]} ${ item.qMedNo.trim().substring(0, 1)} ${item.qMedNo.substring(1, 2)} ${item.qMedNo.substring(2, 3)} ${item.qMedNo.substring(3, 4)} ${item.qMedNo.substring(4, 5)}. ${call[1]} ${item.qMedRoom} ${call[2]}`;

// 						await db.$transaction(async (db) => {
// 							await db.queue.create({
// 								data: {
// 									regNo: item.regNo,
// 									queueCode: String(item.qMedNo.trim()),
// 									channel: Number(0),
// 									channel2: Number(item.qMedRoom),
// 									hnCode: String(item.hn.trim()),
// 									fullName: String(item.fullname.trim()),
// 									queueStatus: Number(1),
// 								},
// 							})
// 							await db.queueMsg.create({ 
// 								data: {
// 								    callMsg: addCall,
// 								    queueStatus: 0,
// 								} });
// 						})
// 					}
// 				}) 

// 				res.locals.data = data;
// 				super.send(res);
// 			} catch (err) {
// 				next(err); // Send error to error handler
// 			}
// 		}

// 		/**
// 		 *
// 		 * @param req
// 		 * @param res
// 		 * @param next
// 		 */
// 		public async postMedQpay(
// 			req: Request,
// 			res: Response,
// 			next: NextFunction,
// 		): Promise<void> {
// 			try {
// 				const data = req.body
// 				data.map(async (item: any) => {
// 					const queues = await db.queue.findFirst({
// 						where: { AND: [{queueCode: item.qMedNo.trim()}, {hnCode: item.hn.trim()}] }
// 					})
// 					if(queues !== null){
// 						await db.$transaction(async (db) => {
// 							await db.queue.updateMany({
// 							where: { AND: [{queueCode: item.qMedNo.trim()}, {hnCode: item.hn.trim()}] },
// 							data: {
// 								queueStatus: Number(4),
// 							},
// 							});
// 							await db.prescription.updateMany({
// 							where: { AND: [ {prescripCode: item.regNo.trim()}, {queue_code: item.qMedNo.trim()}, {hnCode: item.hn.trim()}] },
// 							data: {
// 								channel2: Number(item.qMedRoom),
// 								prescrip_status: 'จ่ายยาสำเร็จ',
// 							},
// 							});
// 						});
// 					}
// 				})


// 				res.locals.data = data;
// 				super.send(res);
// 			} catch (err) {
// 				next(err); // Send error to error handler
// 			}
// 		}


// 		/**
// 	 *
// 	 * @param req
// 	 * @param res
// 	 * @param next
// 	 */
// 		public async getDrugInfo(
// 			req: Request,
// 			res: Response,
// 			next: NextFunction,
// 		): Promise<void> {
// 			try {
// 				// Connect to the database
// 				await sql.connect(config);

// 				// Run query to fetch data from the API_Q_OPD_Med_inv table
// 				const result = await sql.query(`
// 				SELECT * FROM [UDON2].[dbo].[API_Q_OPD_Med_inv]
// 			`);

// 				// Get total records
// 				const total = result.recordset.length;

// 				// Set pagination variables
// 				const page = parseInt(req.query.page as string) || 1; // Default to page 1
// 				const pageSize = parseInt(req.query.pageSize as string) || 5000; // Default to 10 items per page
// 				const startIndex = (page - 1) * pageSize;
// 				const endIndex = Math.min(startIndex + pageSize, total);
// 				const pages = Math.ceil(total / pageSize);

// 				// Slice the data for pagination
// 				const paginatedData = result.recordset.slice(startIndex, endIndex);

// 				// Create the response object
// 				const response = {
// 					data: paginatedData,
// 					page: page,
// 					pages: pages,
// 					total: total,
// 					startIndex: startIndex,
// 					endIndex: endIndex,
// 				};

// 				// Send the response back to the client
// 				res.locals.data = response;
// 				super.send(res);
// 			} catch (err) {
// 				next(err); // Send error to error handler
// 			}
// 		}
// 		/**
// 		 *
// 		 * @param req
// 		 * @param res
// 		 * @param next
// 		 */
// 		public async getEquipInfo(
// 			req: Request,
// 			res: Response,
// 			next: NextFunction,
// 		): Promise<void> {
// 			try {
// 				// Connect to the database
// 				await sql.connect(config);

// 				// Run query to fetch data from the API_Q_OPD_Med_inv table
// 				const result = await sql.query(`
// 				SELECT * FROM [API_Q_OPD_MedEquip]
// 			`);

// 				// Get total records
// 				const total = result.recordset.length;

// 				// Set pagination variables
// 				const page = parseInt(req.query.page as string) || 1; // Default to page 1
// 				const pageSize = parseInt(req.query.pageSize as string) || 5000; // Default to 10 items per page
// 				const startIndex = (page - 1) * pageSize;
// 				const endIndex = Math.min(startIndex + pageSize, total);
// 				const pages = Math.ceil(total / pageSize);

// 				// Slice the data for pagination
// 				const paginatedData = result.recordset.slice(startIndex, endIndex);

// 				// Create the response object
// 				const response = {
// 					data: paginatedData,
// 					page: page,
// 					pages: pages,
// 					total: total,
// 					startIndex: startIndex,
// 					endIndex: endIndex,
// 				};

// 				// Send the response back to the client
// 				res.locals.data = response;
// 				super.send(res);
// 			} catch (err) {
// 				next(err); // Send error to error handler
// 			}
// 		}
// 		/**
// 		 *
// 		 * @param req
// 		 * @param res
// 		 * @param next
// 		 */
// 		public async getQueMedInfo(
// 			req: Request,
// 			res: Response,
// 			next: NextFunction,
// 		): Promise<void> {
// 			try {
// 				// Connect to the database
// 				await sql.connect(config);

// 				// Run query to fetch data from the API_Q_OPD_Med_inv table
// 				const result = await sql.query(`
// 				SELECT TOP(5) * FROM [API_Q_OPD_QueMed] WHERE qMedSts = '3' AND medDispense IS NULL ORDER BY qMedTime DESC
// 			`);

// 				// Get total records
// 				const total = result.recordset.length;

// 				// Set pagination variables
// 				const page = parseInt(req.query.page as string) || 1; // Default to page 1
// 				const pageSize = parseInt(req.query.pageSize as string) || 5000; // Default to 10 items per page
// 				const startIndex = (page - 1) * pageSize;
// 				const endIndex = Math.min(startIndex + pageSize, total);
// 				const pages = Math.ceil(total / pageSize);

// 				// Slice the data for pagination
// 				const paginatedData = result.recordset.slice(startIndex, endIndex);

// 				// Create the response object
// 				const response = {
// 					data: paginatedData,
// 					page: page,
// 					pages: pages,
// 					total: total,
// 					startIndex: startIndex,
// 					endIndex: endIndex,
// 				};

// 				// Send the response back to the client
// 				res.locals.data = response;
// 				super.send(res);
// 			} catch (err) {
// 				next(err); // Send error to error handler
// 			}
// 		}

// 		/**
// 		 *
// 		 * @param req
// 		 * @param res
// 		 * @param next
// 		 */
// 		public async getQueMedPay(
// 			req: Request,
// 			res: Response,
// 			next: NextFunction,
// 		): Promise<void> {
// 			try {
// 				// Connect to the database
// 				await sql.connect(config);
// 				const date = new Date()
// 				const dd = date.getDate()
// 				const mm = date.getMonth() + 1
// 				const yyyy = date.getFullYear() + 543;
// 				const today = yyyy + '' + mm + '' + dd;

// 				// Run query to fetch data from the API_Q_OPD_Med_inv table
// 				const result = await sql.query(`
// 				SELECT TOP(1) * FROM [API_Q_OPD_QueMed] WHERE qMedSts = '3' AND qMedDate = ${today} AND medDispense IS NOT NULL ORDER BY qMedTime DESC
// 			`);

// 				// Get total records
// 				const total = result.recordset.length;

// 				// Set pagination variables
// 				const page = parseInt(req.query.page as string) || 1; // Default to page 1
// 				const pageSize = parseInt(req.query.pageSize as string) || 5000; // Default to 10 items per page
// 				const startIndex = (page - 1) * pageSize;
// 				const endIndex = Math.min(startIndex + pageSize, total);
// 				const pages = Math.ceil(total / pageSize);

// 				// Slice the data for pagination
// 				const paginatedData = result.recordset.slice(startIndex, endIndex);

// 				// Create the response object
// 				const response = {
// 					data: paginatedData,
// 					page: page,
// 					pages: pages,
// 					total: total,
// 					startIndex: startIndex,
// 					endIndex: endIndex,
// 				};

// 				// Send the response back to the client
// 				res.locals.data = response;
// 				super.send(res);
// 			} catch (err) {
// 				next(err); // Send error to error handler
// 			}
// 		}

// 	/**
// 	 *
// 	 * @param req
// 	 * @param res
// 	 * @param next
// 	 */
// 	public getError(req: Request, res: Response, next: NextFunction): void {
// 		try {
// 			throw new ApiError('null', StatusCodes.BAD_REQUEST);
// 		} catch (error) {
// 			// from here error handler will get call
// 			next(error);
// 		}
// 	}

// }

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import BaseController from '../BaseController';

import { RouteDefinition } from '../../types/RouteDefinition';
import sql from 'mssql';
import config from '../../lib/db.config';
import { db } from '../../lib/prisma.db';

import dayjs from 'dayjs';
import { dayjsEndDate, dayjsStartDate } from '../../lib/date';

// import cron from "node-cron";
/**
 * Status controller
 */

// sql.connect(config, (err) => {
// 	if (err) {
// 		console.error("Connection failed:", err.message);
// 		throw err; // จัดการข้อผิดพลาดถ้ามีปัญหาในการเชื่อมต่อ
// 	}
// 	console.log("Connection Successful!");
// });//TODOอย่าลืมเปิดตัวนี้ เป็นการเช็คว่าได้เชื่อมต่อข้อมูลกับ รพ หรือไม่

export default class UdhMedController extends BaseController {
	// base path
	public basePath = 'udh';

	/**
	 *
	 */
	public routes(): RouteDefinition[] {
		return [
			{
				path: '/info',
				method: 'get',
				handler: this.getSystemInfo.bind(this),
			},
			{
				path: '/med-time',
				method: 'get',
				handler: this.getDateInfo.bind(this),
			},
			{
				path: '/med-info',
				method: 'get',
				handler: this.getMedInfo.bind(this),
			},
			{
				path: '/med-info1',
				method: 'get',
				handler: this.getMedInfo1.bind(this),
			},
			{
				path: '/med-pay',
				method: 'get',
				handler: this.getMedPay.bind(this),
			},
			{
				path: '/med-hn',
				method: 'get',
				handler: this.getMedHn.bind(this),
			},
			// {
			// 	path: '/med-queue2',
			// 	method: 'get',
			// 	handler: this.getMedQueue2.bind(this),
			// },
			{
				path: '/drug-info',
				method: 'get',
				handler: this.getDrugInfo.bind(this),
			},
			{
				path: '/equip-info',
				method: 'get',
				handler: this.getEquipInfo.bind(this),
			},
			{
				path: '/quemed-info',
				method: 'get',
				handler: this.getQueMedInfo.bind(this),
			},
			{
				path: '/quemed-pay',
				method: 'get',
				handler: this.getQueMedPay.bind(this),
			},
			{
				path: '/med-queue',
				method: 'get',
				handler: this.getMedQueue.bind(this),
			},
			{
				path: '/med-queue',
				method: 'post',
				handler: this.postMedQueue.bind(this),
			},
			{
				path: '/med-qpay',
				method: 'post',
				handler: this.postMedQpay.bind(this),
			},
			{
				path: '/user',
				method: 'get',
				handler: this.getUser.bind(this),
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
	public getSystemInfo(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {

			res.locals.data = 'ok ครับ';
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
	public async getDateInfo(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// Connect to the database
			// await sql.connect(config);
			const response = new Date().toLocaleDateString('th-TH', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				weekday: 'long',
				hour: 'numeric',
				minute: 'numeric',
				second: '2-digit'
			})
			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}

	/**
 *
 * @param req
 * @param res
 * @param next
 */
	public async getMedInfo(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// Connect to the database
			await sql.connect(config);
			// const date = new Date()
			// const dd = date.getDate()
			// const mm = date.getMonth()+1
			// const yyyy = date.getFullYear() + 543;
			// const today = yyyy+''+mm+''+dd;

			// Run query to fetch data from the database
			const result = await sql.query(`
					SELECT DISTINCT PM.*, PT.* 
					FROM [UDON2].[dbo].[API_Q_OPD_Patmed] PM
					LEFT JOIN [API_Q_OPD_PATIENT] PT WITH(NOLOCK)
					ON PM.hn = PT.hn AND PM.registNo = PT.regNo AND PM.deptCode = PT.deptCode
					WHERE accQty !=0 AND medSite = 'O2' AND medStatus = '2' AND PM.deptCode is not null
				`);

			// Get total records
			const total = result.recordset.length;

			// Set pagination variables
			const page = parseInt(req.query.page as string) || 1; // Default to page 1
			const pageSize = parseInt(req.query.pageSize as string) || 4000; // Default to 10 items per page
			const startIndex = (page - 1) * pageSize;
			const endIndex = Math.min(startIndex + pageSize, total);
			const pages = Math.ceil(total / pageSize);

			// Slice the data for pagination
			const paginatedData = result.recordset.slice(startIndex, endIndex);

			// Create the response object
			const response = {
				data: paginatedData,
				page: page,
				pages: pages,
				total: total,
				startIndex: startIndex,
				endIndex: endIndex,
			};

			// const response = result.recordset

			// Send the response back to the client
			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}


	/**
 *
 * @param req
 * @param res
 * @param next
 */
	public async getMedInfo1(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// Connect to the database
			await sql.connect(config);
			// console.log(today);

			// Run query to fetch data from the database
			const result = await sql.query(`
						select DISTINCT PM.* from [UDON2].[dbo].[API_Q_OPD_MED_ALLERGY] PM
					`);

			// select DISTINCT PM.* from [UDON2].[dbo].[API_Q_OPD_Patmed] PM
			// 	WHERE PM.hn ='1369125' AND PM.deptCode is not null

			// select DISTINCT PT.* from [API_Q_OPD_PATIENT] PT WITH(NOLOCK)
			// 	WHERE PT.medSite = 'O2' and PT.medStatus = '2'
			// 	GROUP BY PT.hn, PT.regNo, PT.registDate, PT.fullname, PT.pay_typedes, PT.phone,
			// 	PT.age, PT.birthDay, PT.deptCode, PT.deptDesc, PT.CardID, PT.med_site, PT.qMedNo, PT.medSite,
			// 	PT.medStatus, PT.med_status_detail, PT.doctor_name, PT.docCode
			// select DISTINCT PM.* from [UDON2].[dbo].[API_Q_OPD_Patmed] PM
			// 	LEFT JOIN [API_Q_OPD_PATIENT] PT WITH(NOLOCK)
			// 	ON PM.hn = PT.hn AND PM.registNo = PT.regNo
			// 	WHERE PM.registDate= ${today} AND PM.siteConfirm ='O2'
			// Get total records
			const total = result.recordset.length;

			// Set pagination variables
			const page = parseInt(req.query.page as string) || 1; // Default to page 1
			const pageSize = parseInt(req.query.pageSize as string) || 4000; // Default to 10 items per page
			const startIndex = (page - 1) * pageSize;
			const endIndex = Math.min(startIndex + pageSize, total);
			const pages = Math.ceil(total / pageSize);

			// Slice the data for pagination
			const paginatedData = result.recordset.slice(startIndex, endIndex);

			// Create the response object
			const response = {
				data: paginatedData,
				page: page,
				pages: pages,
				total: total,
				startIndex: startIndex,
				endIndex: endIndex,
			};

			// const response = result.recordset

			// Send the response back to the client
			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getMedPay(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// Connect to the database
			await sql.connect(config);
			const result = await sql.query(`
					SELECT DISTINCT PM.*, PT.* 
					FROM [UDON2].[dbo].[API_Q_OPD_Patmed] PM
					LEFT JOIN [API_Q_OPD_PATIENT] PT WITH(NOLOCK)
					ON PM.hn = PT.hn AND PM.registNo = PT.regNo AND PM.deptCode = PT.deptCode
					WHERE PT.medStatus='2' AND PM.siteConfirm ='O2' AND PM.accQty>0 AND PT.medSite='O2' AND PM.deptCode is not null				
					`);

			// select DISTINCT pt.*,pm.*
			// from API_Q_OPD_PATIENT pt with (nolock) left join
			// API_Q_OPD_Patmed pm with (nolock) on pt.hn=pm.hn and pt.regNo = pm.registNo
			// where pt.medStatus='2' AND pm.siteConfirm ='O2' AND pm.accQty>0 AND pt.medSite='O2'

			// order by pt.hn
			// Get total records
			const total = result.recordset.length;

			// Set pagination variables
			const page = parseInt(req.query.page as string) || 1; // Default to page 1
			const pageSize = parseInt(req.query.pageSize as string) || 8000; // Default to 10 items per page
			const startIndex = (page - 1) * pageSize;
			const endIndex = Math.min(startIndex + pageSize, total);
			const pages = Math.ceil(total / pageSize);

			// Slice the data for pagination
			const paginatedData = result.recordset.slice(startIndex, endIndex);

			// Create the response object
			const response = {
				data: paginatedData,
				page: page,
				pages: pages,
				total: total,
				startIndex: startIndex,
				endIndex: endIndex,
			};

			// const response = result.recordset

			// Send the response back to the client
			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}

	/**
	*
	* @param req
	* @param res
	* @param next
	*/
	public async getMedHn(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// Connect to the database
			await sql.connect(config);
			// const date = new Date()
			// const dd = date.getDate()
			// const mm = date.getMonth()+1
			// const yyyy = date.getFullYear() + 543;
			// const today = yyyy+''+mm+''+dd;

			// Run query to fetch data from the database
			const result = await sql.query(`
					SELECT DISTINCT PT.*, AE.* 
					FROM [UDON2].[dbo].[API_Q_OPD_PATIENT] PT
					LEFT JOIN [API_Q_OPD_MED_ALLERGY] AE WITH(NOLOCK)
					ON PT.hn = AE.hn
					WHERE  (PT.qMedNo IS NOT NULL AND PT.qMedNo != '') AND PT.medSite = 'O2' AND PT.medStatus = '2'
					ORDER BY PT.qMedNo ASC
				`);

			// Get total records
			const total = result.recordset.length;

			// Set pagination variables
			const page = parseInt(req.query.page as string) || 1; // Default to page 1
			const pageSize = parseInt(req.query.pageSize as string) || 4000; // Default to 10 items per page
			const startIndex = (page - 1) * pageSize;
			const endIndex = Math.min(startIndex + pageSize, total);
			const pages = Math.ceil(total / pageSize);

			// Slice the data for pagination
			const paginatedData = result.recordset.slice(startIndex, endIndex);

			// Create the response object
			const response = {
				data: paginatedData,
				page: page,
				pages: pages,
				total: total,
				startIndex: startIndex,
				endIndex: endIndex,
			};

			// const response = result.recordset

			// Send the response back to the client
			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	// public async getMedQueue2(
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction,
	// ): Promise<void> {
	// 	try {
	// 		// Connect to the database
	// 		await sql.connect(config);
	// 		const date = new Date()
	// 		const dd = date.getDate()
	// 		const mm = date.getMonth() + 1
	// 		const yyyy = date.getFullYear() + 543;
	// 		const today = yyyy + '' + mm + '' + dd;

	// 		// Run query to fetch data from the database
	// 		const result = await sql.query(`
	// 			SELECT PM.registDate, PM.hn, PT.pay_typedes, PT.med_site, PT.qMedNo, PT.medSite, PT.medStatus, PT.med_status_detail
	// 			FROM [UDON2].[dbo].[API_Q_OPD_Patmed] PM
	// 			LEFT JOIN [API_Q_OPD_PATIENT] PT WITH(NOLOCK)
	// 			ON PM.hn = PT.hn AND PM.registNo = PT.regNo
	// 			WHERE PM.registDate =${today} AND (PT.qMedNo IS NOT NULL) AND PT.medSite = 'O2' AND PT.medStatus = '3' 
	// 			GROUP BY PM.registDate, PM.hn, PT.pay_typedes, PT.med_site, PT.qMedNo, PT.medSite, PT.medStatus, PT.med_status_detail
	// 			ORDER BY PT.qMedNo ASC
	// 		`);

	// 		// Get total records
	// 		const total = result.recordset.length;

	// 		// Set pagination variables
	// 		const page = parseInt(req.query.page as string) || 1; // Default to page 1
	// 		const pageSize = parseInt(req.query.pageSize as string) || 4000; // Default to 10 items per page
	// 		const startIndex = (page - 1) * pageSize;
	// 		const endIndex = Math.min(startIndex + pageSize, total);
	// 		const pages = Math.ceil(total / pageSize);

	// 		// Slice the data for pagination
	// 		const paginatedData = result.recordset.slice(startIndex, endIndex);

	// 		// Create the response object
	// 		const response = {
	// 			data: paginatedData,
	// 			page: page,
	// 			pages: pages,
	// 			total: total,
	// 			startIndex: startIndex,
	// 			endIndex: endIndex,
	// 		};

	// 		// const response = result.recordset

	// 		// Send the response back to the client
	// 		res.locals.data = response;
	// 		super.send(res);
	// 	} catch (err) {
	// 		next(err); // Send error to error handler
	// 	}
	// }

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getMedQueue(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const queue = await db.queue.groupBy({
				by: ['queueCode', 'fullName', 'channel2', 'createdAt'],
				where: {
					queueStatus: { in: [1, 2, 4] },
					AND: [
						{ createdAt: { gte: new Date(dayjsStartDate.format("YYYY-MM-DDTHH:mm:ss")) } },
						{ createdAt: { lte: new Date(dayjsEndDate.format("YYYY-MM-DDTHH:mm:ss")) } }
					],
				},
				take: 150,
				orderBy: [{ createdAt: 'desc' }, { queueCode: "asc" }]
			})
			const response = { data: queue || null }
			// Send the response back to the client
			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	// public async postMedQueue(
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction,
	// ): Promise<void> {
	// 	try {
	// 		const data = await req.body
	// 		const udh = await db.configure.findFirst();
	// 		const result = String(udh?.hospital_call_message);
	// 		const call = result.split(',');
	// 		if (data) {
	// 			data.map(async (item: any, index: number) => {
	// 				const queues = await db.queue.findFirst({
	// 					where: {
	// 						regNo: item.regNo.trim(),
	// 						AND: [
	// 							{ queueCode: item.qMedNo.trim() },
	// 							{ hnCode: item.hn.trim() },
	// 							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
	// 							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
	// 						]
	// 					}
	// 				})

	// 				if (!queues) {
	// 					const addCall = `${call[0]} ${item.qMedNo.trim().substring(0, 1)} ${item.qMedNo.trim().substring(1, 2)} ${item.qMedNo.trim().substring(2, 3)} ${item.qMedNo.trim().substring(3, 4)}`
	// 					await Promise.all([
	// 						db.queue.deleteMany({
	// 							where: { AND: [{ regNo: item.regNo.trim(), queueCode: item.qMedNo.trim() }, { hnCode: item.hn.trim() }] }
	// 						}),
	// 						db.queue.create({
	// 							data: {
	// 								regNo: String(item.regNo),
	// 								queueCode: String(item.qMedNo.trim()),
	// 								channel: Number(0),
	// 								channel2: Number(item.qMedRoom),
	// 								hnCode: String(item.hn.trim()),
	// 								fullName: String(item.fullname.trim()),
	// 								queueStatus: Number(1),
	// 								createdAt: new Date().toISOString().slice(0, 10)
	// 							},
	// 						}),
	// 						db.queueMsg.create({
	// 							data: {
	// 								callMsg: addCall,
	// 								queueStatus: 0
	// 							}
	// 						})
	// 					])
	// 				}
	// 			})
	// 		}

	// 		res.locals.data = data;
	// 		super.send(res);
	// 	} catch (err) {
	// 		next(err); // Send error to error handler
	// 	}
	// }
	public async postMedQueue(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await req.body
			const udh = await db.configure.findFirst();
			const result = String(udh?.hospital_call_message);

			const call = result.split(',');
			data.map(async (item: any, index: number) => {
				const queues = await db.queue.findFirst({
					where: {
						regNo: item.regNo,
						AND: [
							{ queueCode: item.qMedNo.trim() },
							{ hnCode: item.hn.trim() },
							{ fullName: item.fullName },
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					}
				})


				if (!queues) {
					const addCall = `${call[0]} 
										${item.qMedNo.trim().substring(0, 1)} 
										${item.qMedNo.substring(1, 2)} 
										${item.qMedNo.substring(2, 3)} 
										${item.qMedNo.substring(3, 4)} 
										${item.qMedNo.substring(4, 5)}. 
										${call[1]} ${item.qMedRoom} 
										${call[2]}`;

					const prescription = await db.prescription.findFirst({
						where: { prescripCode: item.regNo.trim(), queue_code: item.qMedNo.trim(), hnCode: item.hn.trim() }
					});
					let diff: number;
					if (prescription) {
						let date1: any = new Date(prescription.firstIssTime);
						let date2: any = new Date();
						if (date2 < date1) {
							date2.setDate(date2.getDate() + 1);
						}
						diff = date2 - date1;
					}
					await Promise.all([
						db.prescription.update({
							where: { id: prescription.id },
							data: {
								lastDispense: new Date(),
								lastDiff: Math.floor((diff / 1000 / 60) << 0) || null
							}
						}),
						db.queue.create({
							data: {
								regNo: String(item.regNo),
								queueCode: String(item.qMedNo.trim()),
								channel: Number(0),
								channel2: Number(item.qMedRoom),
								hnCode: String(item.hn.trim()),
								fullName: String(item.fullname.trim()),
								queueStatus: Number(1),
								// queueDate: new Date(),
							},
						}),
						db.queueMsg.create({
							data: {
								callMsg: String(addCall),
								queueStatus: 0,
							}
						})

					])
				}
				return
			})

			res.locals.data = data;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	// public async postMedQpay(
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction,
	// ): Promise<void> {
	// 	try {
	// 		const data = await req.body
	// 		if (data) {
	// 			data.map(async (item: any) => {
	// 				const queues = await db.queue.findFirst({
	// 					where: {
	// 						regNo: item.regNo.trim(),
	// 						AND: [
	// 							{ queueCode: item.qMedNo.trim() },
	// 							{ hnCode: item.hn.trim() },
	// 							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
	// 							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
	// 						]
	// 					}
	// 				})
	// 				if (queues) {
	// 					await Promise.all([
	// 						await db.queue.updateMany({
	// 							where: { AND: [{ regNo: item.regNo.trim(), queueCode: item.qMedNo.trim() }, { hnCode: item.hn.trim() }] },
	// 							data: {
	// 								queueStatus: Number(4),
	// 							},
	// 						}),
	// 						await db.prescription.updateMany({
	// 							where: { AND: [{ prescripCode: item.regNo.trim() }, { queue_code: item.qMedNo.trim() }, { hnCode: item.hn.trim() }] },
	// 							data: {
	// 								channel2: Number(item.qMedRoom),
	// 								prescrip_status: 'จ่ายยาสำเร็จ',
	// 								lastDispense: new Date(),
	// 							},
	// 						})
	// 					])
	// 				}
	// 			})
	// 		}
	// 		res.locals.data = data;
	// 		super.send(res);
	// 	} catch (err) {
	// 		next(err); // Send error to error handler
	// 	}
	// }
	public async postMedQpay(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await req.body
			data.map(async (item: any) => {
				const queues = await db.queue.findFirst({
					where: {
						regNo: item.regNo.trim(),
						AND: [
							{ queueCode: item.qMedNo.trim() },
							{ hnCode: item.hn.trim() },
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					}
				})
				if (queues) {
					await Promise.all([
						db.queue.update({
							where: { id: queues.id },
							// AND: [{queueCode: item.qMedNo.trim()}, {hnCode: item.hn.trim()}] },
							data: {
								queueStatus: Number(4),
							},
						}),

						db.prescription.updateMany({
							where: {
								prescripCode: queues.regNo as string,
								AND: [{ queue_code: item.qMedNo.trim() }, { hnCode: item.hn.trim() }]
							},
							data: {
								channel2: Number(item.qMedRoom),
								prescrip_status: 'จ่ายยาสำเร็จ',
								userDispense:'',//Todo อย่าลืมมาใส่ตัวแปร
								userDispenseTime: new Date()
							},
						})

					])
				}
				return
			})


			res.locals.data = data;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}

	/**
 *
 * @param req
 * @param res
 * @param next
 */
	public async getDrugInfo(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// Connect to the database
			await sql.connect(config);

			// Run query to fetch data from the API_Q_OPD_Med_inv table
			// SELECT * FROM [UDON2].[dbo].[API_Q_OPD_Med_inv]


			// SELECT DISTINCT MI.*, LC.* 
			// 	FROM [UDON2].[dbo].[API_Q_OPD_Med_inv] MI
			// 	LEFT JOIN [API_Q_OPD_Lamed_c] LC WITH(NOLOCK)
			// 	ON MI.def_dose = LC.code_lamed
			// 	WHERE  (MI.def_dose IS NOT NULL AND MI.def_dose != '')
			// const result = await sql.query(`
			// 		SELECT * FROM [UDON2].[dbo].[API_Q_OPD_USER]
			// `);
			const result = await sql.query(`
				SELECT * FROM [UDON2].[dbo].[API_Q_OPD_Med_inv]
			`);
			// SELECT Med_inv.*,Lamed_c.* 
			// 	FROM [UDON2].[dbo].[API_Q_OPD_Med_inv] AS Med_inv
			// 	JOIN [UDON2].[dbo].[API_Q_OPD_Lamed_c] AS Lamed_c
			// 	ON Med_inv.def_dose = Lamed_c.code_lamed


			// Get total records
			const total = result.recordset.length;

			// Set pagination variables
			const page = parseInt(req.query.page as string) || 1; // Default to page 1
			const pageSize = parseInt(req.query.pageSize as string) || 5000; // Default to 10 items per page
			const startIndex = (page - 1) * pageSize;
			const endIndex = Math.min(startIndex + pageSize, total);
			const pages = Math.ceil(total / pageSize);

			// Slice the data for pagination
			const paginatedData = result.recordset.slice(startIndex, endIndex);

			// Create the response object
			const response = {
				data: paginatedData,
				page: page,
				pages: pages,
				total: total,
				startIndex: startIndex,
				endIndex: endIndex,
			};

			// Send the response back to the client
			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}
	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getEquipInfo(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// Connect to the database
			await sql.connect(config);

			// Run query to fetch data from the API_Q_OPD_Med_inv table
			const result = await sql.query(`
				SELECT * FROM [API_Q_OPD_MedEquip]
			`);

			// Get total records
			const total = result.recordset.length;

			// Set pagination variables
			const page = parseInt(req.query.page as string) || 1; // Default to page 1
			const pageSize = parseInt(req.query.pageSize as string) || 5000; // Default to 10 items per page
			const startIndex = (page - 1) * pageSize;
			const endIndex = Math.min(startIndex + pageSize, total);
			const pages = Math.ceil(total / pageSize);

			// Slice the data for pagination
			const paginatedData = result.recordset.slice(startIndex, endIndex);

			// Create the response object
			const response = {
				data: paginatedData,
				page: page,
				pages: pages,
				total: total,
				startIndex: startIndex,
				endIndex: endIndex,
			};

			// Send the response back to the client
			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}
	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getQueMedInfo(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// Connect to the database
			await sql.connect(config);

			// Run query to fetch data from the API_Q_OPD_Med_inv table
			const result = await sql.query(`
				SELECT TOP(3) * FROM [API_Q_OPD_QueMed] WHERE qMedSts = '3' AND medDispense IS NULL ORDER BY qMedTime DESC
				`);

			// Get total records
			const total = result.recordset.length;

			// Set pagination variables
			const page = parseInt(req.query.page as string) || 1; // Default to page 1
			const pageSize = parseInt(req.query.pageSize as string) || 5000; // Default to 10 items per page
			const startIndex = (page - 1) * pageSize;
			const endIndex = Math.min(startIndex + pageSize, total);
			const pages = Math.ceil(total / pageSize);

			// Slice the data for pagination
			const paginatedData = result.recordset.slice(startIndex, endIndex);

			// Create the response object
			const response = {
				data: paginatedData,
				page: page,
				pages: pages,
				total: total,
				startIndex: startIndex,
				endIndex: endIndex,
			};

			// Send the response back to the client
			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getQueMedPay(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// Connect to the database
			await sql.connect(config);
			// const date = new Date()
			// const dd = date.getDate()
			// const mm = date.getMonth() + 1
			// const yyyy = date.getFullYear() + 543;
			// const today = yyyy + '' + mm + '' + dd;

			// Run query to fetch data from the API_Q_OPD_Med_inv table
			const result = await sql.query(`
				SELECT TOP(30) * FROM [API_Q_OPD_QueMed] WHERE qMedSts = '3' AND medDispense IS NOT NULL ORDER BY qMedTime DESC
				`);

			// Get total records
			const total = result.recordset.length;

			// Set pagination variables
			const page = parseInt(req.query.page as string) || 1; // Default to page 1
			const pageSize = parseInt(req.query.pageSize as string) || 5000; // Default to 10 items per page
			const startIndex = (page - 1) * pageSize;
			const endIndex = Math.min(startIndex + pageSize, total);
			const pages = Math.ceil(total / pageSize);

			// Slice the data for pagination
			const paginatedData = result.recordset.slice(startIndex, endIndex);

			// Create the response object
			const response = {
				data: paginatedData,
				page: page,
				pages: pages,
				total: total,
				startIndex: startIndex,
				endIndex: endIndex,
			};

			// Send the response back to the client
			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err); // Send error to error handler
		}
	}

	/**
 *
 * @param req
 * @param res
 * @param next
 */
	public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			// Connect to the database
			await sql.connect(config);

			const result = await sql.query(`SELECT * FROM [UDON2].[dbo].[API_Q_OPD_Med_inv]`);

			// Get total records
			const total = result.recordset.length;

			// Set pagination variables
			const page = parseInt(req.query.page as string) || 1; // Default to page 1
			const pageSize = parseInt(req.query.pageSize as string) || 4000; // Default to 10 items per page
			const startIndex = (page - 1) * pageSize;
			const endIndex = Math.min(startIndex + pageSize, total);
			const pages = Math.ceil(total / pageSize);

			// Slice the data for pagination
			const paginatedData = result.recordset.slice(startIndex, endIndex);

			// Create the response object
			const response = {
				data: paginatedData,
				page: page,
				pages: pages,
				total: total,
				startIndex: startIndex,
				endIndex: endIndex,
			};


			// Send the response back to the client
			res.locals.data = response;
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
			throw new ApiError('null', StatusCodes.BAD_REQUEST);
		} catch (error) {
			// from here error handler will get call
			next(error);
		}
	}

}