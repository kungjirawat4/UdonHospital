import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import BaseController from '../BaseController';

import { RouteDefinition } from '../../types/RouteDefinition';


import { dayjsEndDate, dayjsStartDate } from '../../lib/date';
import { db } from '../../lib/prisma.db';

/**
 * Status controller
 */
export default class UdhDashboardController extends BaseController {
	// base path
	public basePath = 'dashboard';

	/**
	 *
	 */
	public routes(): RouteDefinition[] {
		return [
			{
				path: '/',
				method: 'get',
				handler: this.getDashboard.bind(this),
			},
			{
				path: '/dashboardbackup',
				method: 'get',
				handler: this.getDashboardbackup.bind(this),
			},
			{
				path: '/hospital',
				method: 'get',
				handler: this.getHospital.bind(this),
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
	public async getDashboard(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const [s1, s2, s3, s4, s5, s6] = await Promise.all([
				db.prescription.count({
					where: {
						prescrip_status: 'รอคัดกรอง', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						prescrip_status: 'รอจับคู่ตะกร้า', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						prescrip_status: 'กำลังจัดยา', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						prescrip_status: 'กำลังตรวจสอบ', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						prescrip_status: 'รอเรียกคิว', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						prescrip_status: 'จ่ายยาสำเร็จ', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
			]);

			const [a, b, c, d, f, all] = await Promise.all([
				db.prescription.count({
					where: {
						queue_type: 'A', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						queue_type: 'B', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						queue_type: 'C', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						queue_type: 'D', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						queue_type: 'F', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
			]);

			const [h8, h9, h10, h11, h12, h13, h14, h15, h16, h17, h18, h19, h20, TodayA, TodayB, TodayC, TodayD, MonthA, MonthB, MonthC, MonthD] = await Promise.all([
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT08:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT08:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT09:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT09:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT10:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT10:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT11:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT11:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT12:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT12:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT13:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT13:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT14:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT14:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT15:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT15:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT16:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT16:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT17:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT17:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT18:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT18:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT19:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT19:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT20:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT20:59:ss')) } },
						]
					},
				}),


				// date of week A
				db.$queryRaw`select count(extract(dow from "dateQueue") = 1 or null) as monday,
									count(extract(dow from "dateQueue") = 2 or null) as tuesday,
									count(extract(dow from "dateQueue") = 3 or null) as wednesday,
									count(extract(dow from "dateQueue") = 4 or null) as thursday,
									count(extract(dow from "dateQueue") = 5 or null) as friday from sreenings
									where extract('week' from "createdAt") = extract('week' from now()) and "queue_type" = 'A'`,  // ข้อมูลสัปดาห์เดียวกัน
				// date of week B
				db.$queryRaw`select count(extract(dow from "dateQueue") = 1 or null) as monday,
									count(extract(dow from "dateQueue") = 2 or null) as tuesday,
									count(extract(dow from "dateQueue") = 3 or null) as wednesday,
									count(extract(dow from "dateQueue") = 4 or null) as thursday,
									count(extract(dow from "dateQueue") = 5 or null) as friday from sreenings
									where extract('week' from "createdAt") = extract('week' from now()) and "queue_type" = 'B'`,  // ข้อมูลสัปดาห์เดียวกัน

				// date of week C
				db.$queryRaw`select count(extract(dow from "dateQueue") = 1 or null) as monday,
									count(extract(dow from "dateQueue") = 2 or null) as tuesday,
									count(extract(dow from "dateQueue") = 3 or null) as wednesday,
									count(extract(dow from "dateQueue") = 4 or null) as thursday,
									count(extract(dow from "dateQueue") = 5 or null) as friday from sreenings
									where extract('week' from "createdAt") = extract('week' from now()) and "queue_type" = 'C'`,  // ข้อมูลสัปดาห์เดียวกัน

				// date of week D
				db.$queryRaw`select count(extract(dow from "dateQueue") = 1 or null) as monday,
									count(extract(dow from "dateQueue") = 2 or null) as tuesday,
									count(extract(dow from "dateQueue") = 3 or null) as wednesday,
									count(extract(dow from "dateQueue") = 4 or null) as thursday,
									count(extract(dow from "dateQueue") = 5 or null) as friday from sreenings
									where extract('week' from "createdAt") = extract('week' from now()) and "queue_type" = 'D'`,  // ข้อมูลสัปดาห์เดียวกัน


				db.$queryRaw`select count(extract(month from "dateQueue") = 1 or null) as jan,
					count(extract(month from "dateQueue") = 2 or null) as feb,
					count(extract(month from "dateQueue") = 3 or null) as mar,
					count(extract(month from "dateQueue") = 4 or null) as apr,
					count(extract(month from "dateQueue") = 5 or null) as may,
					count(extract(month from "dateQueue") = 6 or null) as jun,
					count(extract(month from "dateQueue") = 7 or null) as jul,
					count(extract(month from "dateQueue") = 8 or null) as aug,
					count(extract(month from "dateQueue") = 9 or null) as sept,
					count(extract(month from "dateQueue") = 10 or null) as oct,
					count(extract(month from "dateQueue") = 11 or null) as nov,
					count(extract(month from "dateQueue") = 12 or null) as december from sreenings_backup 
					where queue_type ='A'`,

				db.$queryRaw`select count(extract(month from "dateQueue") = 1 or null) as jan,
					count(extract(month from "dateQueue") = 2 or null) as feb,
					count(extract(month from "dateQueue") = 3 or null) as mar,
					count(extract(month from "dateQueue") = 4 or null) as apr,
					count(extract(month from "dateQueue") = 5 or null) as may,
					count(extract(month from "dateQueue") = 6 or null) as jun,
					count(extract(month from "dateQueue") = 7 or null) as jul,
					count(extract(month from "dateQueue") = 8 or null) as aug,
					count(extract(month from "dateQueue") = 9 or null) as sept,
					count(extract(month from "dateQueue") = 10 or null) as oct,
					count(extract(month from "dateQueue") = 11 or null) as nov,
					count(extract(month from "dateQueue") = 12 or null) as december from sreenings_backup 
					where queue_type ='B'`,

				db.$queryRaw`select count(extract(month from "dateQueue") = 1 or null) as jan,
					count(extract(month from "dateQueue") = 2 or null) as feb,
					count(extract(month from "dateQueue") = 3 or null) as mar,
					count(extract(month from "dateQueue") = 4 or null) as apr,
					count(extract(month from "dateQueue") = 5 or null) as may,
					count(extract(month from "dateQueue") = 6 or null) as jun,
					count(extract(month from "dateQueue") = 7 or null) as jul,
					count(extract(month from "dateQueue") = 8 or null) as aug,
					count(extract(month from "dateQueue") = 9 or null) as sept,
					count(extract(month from "dateQueue") = 10 or null) as oct,
					count(extract(month from "dateQueue") = 11 or null) as nov,
					count(extract(month from "dateQueue") = 12 or null) as december from sreenings_backup 
					where queue_type ='C'`,

				db.$queryRaw`select count(extract(month from "dateQueue") = 1 or null) as jan,
					count(extract(month from "dateQueue") = 2 or null) as feb,
					count(extract(month from "dateQueue") = 3 or null) as mar,
					count(extract(month from "dateQueue") = 4 or null) as apr,
					count(extract(month from "dateQueue") = 5 or null) as may,
					count(extract(month from "dateQueue") = 6 or null) as jun,
					count(extract(month from "dateQueue") = 7 or null) as jul,
					count(extract(month from "dateQueue") = 8 or null) as aug,
					count(extract(month from "dateQueue") = 9 or null) as sept,
					count(extract(month from "dateQueue") = 10 or null) as oct,
					count(extract(month from "dateQueue") = 11 or null) as nov,
					count(extract(month from "dateQueue") = 12 or null) as december from sreenings_backup 
					where queue_type ='D'`
			]);

			// console.log(Month[0])

			const Monday = [Number(TodayA[0].monday), Number(TodayB[0].monday), Number(TodayC[0].monday), Number(TodayD[0].monday)];
			const Tuesday = [Number(TodayA[0].tuesday), Number(TodayB[0].tuesday), Number(TodayC[0].tuesday), Number(TodayD[0].tuesday)];
			const Wednesday = [Number(TodayA[0].wednesday), Number(TodayB[0].wednesday), Number(TodayC[0].wednesday), Number(TodayD[0].wednesday)];
			const Thursday = [Number(TodayA[0].thursday), Number(TodayB[0].thursday), Number(TodayC[0].thursday), Number(TodayD[0].thursday)];
			const friday = [Number(TodayA[0].friday), Number(TodayB[0].friday), Number(TodayC[0].friday), Number(TodayD[0].friday)];

			const JanA = Number(MonthA[0].jan)
			const FebA = Number(MonthA[0].feb)
			const MarA = Number(MonthA[0].mar)
			const AprA = Number(MonthA[0].apr)

			const MayA = Number(MonthA[0].may)
			const JunA = Number(MonthA[0].jun)
			const JulA = Number(MonthA[0].jul)
			const AugA = Number(MonthA[0].aug)

			const SeptA = Number(MonthA[0].sept)
			const OctA = Number(MonthA[0].oct)
			const NovA = Number(MonthA[0].nov)
			const DecemberA = Number(MonthA[0].december)

			const JanB = Number(MonthB[0].jan)
			const FebB = Number(MonthB[0].feb)
			const MarB = Number(MonthB[0].mar)
			const AprB = Number(MonthB[0].apr)

			const MayB = Number(MonthB[0].may)
			const JunB = Number(MonthB[0].jun)
			const JulB = Number(MonthB[0].jul)
			const AugB = Number(MonthB[0].aug)

			const SeptB = Number(MonthB[0].sept)
			const OctB = Number(MonthB[0].oct)
			const NovB = Number(MonthB[0].nov)
			const DecemberB = Number(MonthB[0].december)

			const JanC = Number(MonthC[0].jan)
			const FebC = Number(MonthC[0].feb)
			const MarC = Number(MonthC[0].mar)
			const AprC = Number(MonthC[0].apr)

			const MayC = Number(MonthC[0].may)
			const JunC = Number(MonthC[0].jun)
			const JulC = Number(MonthC[0].jul)
			const AugC = Number(MonthC[0].aug)

			const SeptC = Number(MonthC[0].sept)
			const OctC = Number(MonthC[0].oct)
			const NovC = Number(MonthC[0].nov)
			const DecemberC = Number(MonthC[0].december)

			const JanD = Number(MonthD[0].jan)
			const FebD = Number(MonthD[0].feb)
			const MarD = Number(MonthD[0].mar)
			const AprD = Number(MonthD[0].apr)

			const MayD = Number(MonthD[0].may)
			const JunD = Number(MonthD[0].jun)
			const JulD = Number(MonthD[0].jul)
			const AugD = Number(MonthD[0].aug)

			const SeptD = Number(MonthD[0].sept)
			const OctD = Number(MonthD[0].oct)
			const NovD = Number(MonthD[0].nov)
			const DecemberD = Number(MonthD[0].december)

			const response = {
				status1: s1,
				status2: s2,
				status3: s3,
				status4: s4,
				status5: s5,
				status6: s6,
				a,
				b,
				c,
				d,
				f,
				all,
				h8,
				h9,
				h10,
				h11,
				h12,
				h13,
				h14,
				h15,
				h16,
				h17,
				h18,
				h19,
				h20,
				Daysofweek: { Monday, Tuesday, Wednesday, Thursday, friday },
				MonthofYearA: { JanA, FebA, MarA, AprA, MayA, JunA, JulA, AugA, SeptA, OctA, NovA, DecemberA },
				MonthofYearB: { JanB, FebB, MarB, AprB, MayB, JunB, JulB, AugB, SeptB, OctB, NovB, DecemberB },
				MonthofYearC: { JanC, FebC, MarC, AprC, MayC, JunC, JulC, AugC, SeptC, OctC, NovC, DecemberC },
				MonthofYearD: { JanD, FebD, MarD, AprD, MayD, JunD, JulD, AugD, SeptD, OctD, NovD, DecemberD },
				message: 'Dashboard has been updated successfully',
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
	public async getDashboardbackup(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const [s1, s2, s3, s4, s5, s6] = await Promise.all([
				db.prescription.count({
					where: {
						prescrip_status: 'รอคัดกรอง', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						prescrip_status: 'รอจับคู่ตะกร้า', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						prescrip_status: 'กำลังจัดยา', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						prescrip_status: 'กำลังตรวจสอบ', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						prescrip_status: 'รอเรียกคิว', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						prescrip_status: 'จ่ายยาสำเร็จ', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
			]);

			const [a, b, c, d, f, all] = await Promise.all([
				db.prescription.count({
					where: {
						queue_type: 'A', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						queue_type: 'B', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						queue_type: 'C', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						queue_type: 'D', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						queue_type: 'F', AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
						]
					},
				}),
			]);

			const [h8, h9, h10, h11, h12, h13, h14, h15, h16, h17, h18, h19, h20, TodayA, TodayB, TodayC, TodayD, MonthA, MonthB, MonthC, MonthD] = await Promise.all([
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT08:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT08:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT09:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT09:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT10:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT10:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT11:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT11:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT12:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT12:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT13:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT13:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT14:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT14:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT15:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT15:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT16:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT16:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT17:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT17:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT18:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT18:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT19:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT19:59:ss')) } },
						]
					},
				}),
				db.prescription.count({
					where: {
						AND: [
							{ createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDT20:00:ss')) } },
							{ createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDT20:59:ss')) } },
						]
					},
				}),


				// date of week A
				db.$queryRaw`select count(extract(dow from "dateQueue") = 1 or null) as monday,
										count(extract(dow from "dateQueue") = 2 or null) as tuesday,
										count(extract(dow from "dateQueue") = 3 or null) as wednesday,
										count(extract(dow from "dateQueue") = 4 or null) as thursday,
										count(extract(dow from "dateQueue") = 5 or null) as friday from sreenings
										where extract('week' from "createdAt") = extract('week' from now()) and "queue_type" = 'A'`,  // ข้อมูลสัปดาห์เดียวกัน
				// date of week B
				db.$queryRaw`select count(extract(dow from "dateQueue") = 1 or null) as monday,
										count(extract(dow from "dateQueue") = 2 or null) as tuesday,
										count(extract(dow from "dateQueue") = 3 or null) as wednesday,
										count(extract(dow from "dateQueue") = 4 or null) as thursday,
										count(extract(dow from "dateQueue") = 5 or null) as friday from sreenings
										where extract('week' from "createdAt") = extract('week' from now()) and "queue_type" = 'B'`,  // ข้อมูลสัปดาห์เดียวกัน

				// date of week C
				db.$queryRaw`select count(extract(dow from "dateQueue") = 1 or null) as monday,
										count(extract(dow from "dateQueue") = 2 or null) as tuesday,
										count(extract(dow from "dateQueue") = 3 or null) as wednesday,
										count(extract(dow from "dateQueue") = 4 or null) as thursday,
										count(extract(dow from "dateQueue") = 5 or null) as friday from sreenings
										where extract('week' from "createdAt") = extract('week' from now()) and "queue_type" = 'C'`,  // ข้อมูลสัปดาห์เดียวกัน

				// date of week D
				db.$queryRaw`select count(extract(dow from "dateQueue") = 1 or null) as monday,
										count(extract(dow from "dateQueue") = 2 or null) as tuesday,
										count(extract(dow from "dateQueue") = 3 or null) as wednesday,
										count(extract(dow from "dateQueue") = 4 or null) as thursday,
										count(extract(dow from "dateQueue") = 5 or null) as friday from sreenings
										where extract('week' from "createdAt") = extract('week' from now()) and "queue_type" = 'D'`,  // ข้อมูลสัปดาห์เดียวกัน


				db.$queryRaw`select count(extract(month from "dateQueue") = 1 or null) as jan,
						count(extract(month from "dateQueue") = 2 or null) as feb,
						count(extract(month from "dateQueue") = 3 or null) as mar,
						count(extract(month from "dateQueue") = 4 or null) as apr,
						count(extract(month from "dateQueue") = 5 or null) as may,
						count(extract(month from "dateQueue") = 6 or null) as jun,
						count(extract(month from "dateQueue") = 7 or null) as jul,
						count(extract(month from "dateQueue") = 8 or null) as aug,
						count(extract(month from "dateQueue") = 9 or null) as sept,
						count(extract(month from "dateQueue") = 10 or null) as oct,
						count(extract(month from "dateQueue") = 11 or null) as nov,
						count(extract(month from "dateQueue") = 12 or null) as december from sreenings 
						where queue_type ='A'`,

				db.$queryRaw`select count(extract(month from "dateQueue") = 1 or null) as jan,
						count(extract(month from "dateQueue") = 2 or null) as feb,
						count(extract(month from "dateQueue") = 3 or null) as mar,
						count(extract(month from "dateQueue") = 4 or null) as apr,
						count(extract(month from "dateQueue") = 5 or null) as may,
						count(extract(month from "dateQueue") = 6 or null) as jun,
						count(extract(month from "dateQueue") = 7 or null) as jul,
						count(extract(month from "dateQueue") = 8 or null) as aug,
						count(extract(month from "dateQueue") = 9 or null) as sept,
						count(extract(month from "dateQueue") = 10 or null) as oct,
						count(extract(month from "dateQueue") = 11 or null) as nov,
						count(extract(month from "dateQueue") = 12 or null) as december from sreenings 
						where queue_type ='B'`,

				db.$queryRaw`select count(extract(month from "dateQueue") = 1 or null) as jan,
						count(extract(month from "dateQueue") = 2 or null) as feb,
						count(extract(month from "dateQueue") = 3 or null) as mar,
						count(extract(month from "dateQueue") = 4 or null) as apr,
						count(extract(month from "dateQueue") = 5 or null) as may,
						count(extract(month from "dateQueue") = 6 or null) as jun,
						count(extract(month from "dateQueue") = 7 or null) as jul,
						count(extract(month from "dateQueue") = 8 or null) as aug,
						count(extract(month from "dateQueue") = 9 or null) as sept,
						count(extract(month from "dateQueue") = 10 or null) as oct,
						count(extract(month from "dateQueue") = 11 or null) as nov,
						count(extract(month from "dateQueue") = 12 or null) as december from sreenings 
						where queue_type ='C'`,

				db.$queryRaw`select count(extract(month from "dateQueue") = 1 or null) as jan,
						count(extract(month from "dateQueue") = 2 or null) as feb,
						count(extract(month from "dateQueue") = 3 or null) as mar,
						count(extract(month from "dateQueue") = 4 or null) as apr,
						count(extract(month from "dateQueue") = 5 or null) as may,
						count(extract(month from "dateQueue") = 6 or null) as jun,
						count(extract(month from "dateQueue") = 7 or null) as jul,
						count(extract(month from "dateQueue") = 8 or null) as aug,
						count(extract(month from "dateQueue") = 9 or null) as sept,
						count(extract(month from "dateQueue") = 10 or null) as oct,
						count(extract(month from "dateQueue") = 11 or null) as nov,
						count(extract(month from "dateQueue") = 12 or null) as december from sreenings 
						where queue_type ='D'`
			]);

			// console.log(Month[0])

			const Monday = [Number(TodayA[0].monday), Number(TodayB[0].monday), Number(TodayC[0].monday), Number(TodayD[0].monday)];
			const Tuesday = [Number(TodayA[0].tuesday), Number(TodayB[0].tuesday), Number(TodayC[0].tuesday), Number(TodayD[0].tuesday)];
			const Wednesday = [Number(TodayA[0].wednesday), Number(TodayB[0].wednesday), Number(TodayC[0].wednesday), Number(TodayD[0].wednesday)];
			const Thursday = [Number(TodayA[0].thursday), Number(TodayB[0].thursday), Number(TodayC[0].thursday), Number(TodayD[0].thursday)];
			const friday = [Number(TodayA[0].friday), Number(TodayB[0].friday), Number(TodayC[0].friday), Number(TodayD[0].friday)];

			const JanA = Number(MonthA[0].jan)
			const FebA = Number(MonthA[0].feb)
			const MarA = Number(MonthA[0].mar)
			const AprA = Number(MonthA[0].apr)

			const MayA = Number(MonthA[0].may)
			const JunA = Number(MonthA[0].jun)
			const JulA = Number(MonthA[0].jul)
			const AugA = Number(MonthA[0].aug)

			const SeptA = Number(MonthA[0].sept)
			const OctA = Number(MonthA[0].oct)
			const NovA = Number(MonthA[0].nov)
			const DecemberA = Number(MonthA[0].december)

			const JanB = Number(MonthB[0].jan)
			const FebB = Number(MonthB[0].feb)
			const MarB = Number(MonthB[0].mar)
			const AprB = Number(MonthB[0].apr)

			const MayB = Number(MonthB[0].may)
			const JunB = Number(MonthB[0].jun)
			const JulB = Number(MonthB[0].jul)
			const AugB = Number(MonthB[0].aug)

			const SeptB = Number(MonthB[0].sept)
			const OctB = Number(MonthB[0].oct)
			const NovB = Number(MonthB[0].nov)
			const DecemberB = Number(MonthB[0].december)

			const JanC = Number(MonthC[0].jan)
			const FebC = Number(MonthC[0].feb)
			const MarC = Number(MonthC[0].mar)
			const AprC = Number(MonthC[0].apr)

			const MayC = Number(MonthC[0].may)
			const JunC = Number(MonthC[0].jun)
			const JulC = Number(MonthC[0].jul)
			const AugC = Number(MonthC[0].aug)

			const SeptC = Number(MonthC[0].sept)
			const OctC = Number(MonthC[0].oct)
			const NovC = Number(MonthC[0].nov)
			const DecemberC = Number(MonthC[0].december)

			const JanD = Number(MonthD[0].jan)
			const FebD = Number(MonthD[0].feb)
			const MarD = Number(MonthD[0].mar)
			const AprD = Number(MonthD[0].apr)

			const MayD = Number(MonthD[0].may)
			const JunD = Number(MonthD[0].jun)
			const JulD = Number(MonthD[0].jul)
			const AugD = Number(MonthD[0].aug)

			const SeptD = Number(MonthD[0].sept)
			const OctD = Number(MonthD[0].oct)
			const NovD = Number(MonthD[0].nov)
			const DecemberD = Number(MonthD[0].december)

			const response = {
				status1: s1,
				status2: s2,
				status3: s3,
				status4: s4,
				status5: s5,
				status6: s6,
				a,
				b,
				c,
				d,
				f,
				all,
				h8,
				h9,
				h10,
				h11,
				h12,
				h13,
				h14,
				h15,
				h16,
				h17,
				h18,
				h19,
				h20,
				Daysofweek: { Monday, Tuesday, Wednesday, Thursday, friday },
				MonthofYearA: { JanA, FebA, MarA, AprA, MayA, JunA, JulA, AugA, SeptA, OctA, NovA, DecemberA },
				MonthofYearB: { JanB, FebB, MarB, AprB, MayB, JunB, JulB, AugB, SeptB, OctB, NovB, DecemberB },
				MonthofYearC: { JanC, FebC, MarC, AprC, MayC, JunC, JulC, AugC, SeptC, OctC, NovC, DecemberC },
				MonthofYearD: { JanD, FebD, MarD, AprD, MayD, JunD, JulD, AugD, SeptD, OctD, NovD, DecemberD },
				message: 'Dashboard has been updated successfully',
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
	public async getHospital(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const [result] = await Promise.all([
				db.configure.findMany(),
			])

			const response = {
				data: result,
				message: 'Hospital has been updated successfully',
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

}
