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
export default class UdhBackupController extends BaseController {
    // base path
    public basePath = 'database';

    /**
     *
     */
    public routes(): RouteDefinition[] {
        return [
            {
                path: '/',
                method: 'get',
                handler: this.getAll.bind(this),
            },
            {
                path: '/daily',
                method: 'get',
                handler: this.getDaily.bind(this),
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
    public async getAll(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {

            const response = {
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
     * @param nextprisma
     */
    public async getDaily(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const [prescription, arranged] = await Promise.all([
                db.prescription.findMany({
                    where: {
                        AND: [
                            { createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
                            { createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
                        ]
                    },
                    orderBy: [{ createdAt: 'asc' }]
                }),
                db.arranged.findMany({
                    where: {
                        AND: [
                            { createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
                            { createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
                        ]
                    },
                    orderBy: [{ createdAt: 'asc' }]
                })

            ])

            // await Promise.all([
            //     db.arrangedBackup.deleteMany({
            //         where: {
            //             AND: [
            //                 { createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
            //                 { createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
            //             ]
            //         }
            //     }),

            //     db.prescriptionBackup.deleteMany({
            //         where: {
            //             AND: [
            //                 { createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
            //                 { createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
            //             ]
            //         }
            //     }),
            // ])

            if (prescription && arranged) {
                await Promise.all([
                    prescription.map(async (item: any, index: number) => {
                        // console.log(index)
                        await db.prescriptionBackup.create({
                            data: {
                                prescripId: item.id,
                                prescripCode: item.prescripCode,
                                urgent: item.urgent,
                                basket_num: item.basket_num,
                                hnCode: item.hnCode,
                                vnCode: item.vnCode,
                                queue_code: item.queue_code,
                                queue_num: item.queue_num,
                                doctor_names: item.doctor_names,
                                lap_name: item.lap_name,
                                dept_name: item.dept_name,
                                dept_code: item.dept_code,
                                drug_allergy: item.drug_allergy,
                                pay_type: item.pay_type,
                                queue_random: item.queue_random,
                                queue_type: item.queue_type,
                                full_name: item.full_name,
                                medicine_total: item.medicine_total,
                                medicine_price: item.medicine_price,
                                medicine_service: item.medicine_service,
                                prescrip_status: item.prescrip_status,
                                delivery: item.delivery,
                                startTime: item.startTime,
                                arrangTime: item.arrangTime,
                                userDoubleCheck: item.userDoubleCheck,
                                checkTime: item.checkTime,
                                userDispense: item.userDispense,
                                userDispenseTime: item.userDispense,
                                restBasket: item.restBasket,
                                userRestBasket: item.userRestBasket,
                                prescrip_comment: item.prescrip_comment,
                                prescripAdd: item.prescripAdd,
                                hospitalId: item.hospitalId,
                                userId: item.userId,
                                basketId: item.basketId,
                                autoLoad: item.autoLoad,
                                cabinetId: item.cabinetId,
                                firstIssTime: item.firstIssTime,
                                lastDispense: item.lastDispense,
                                lastDiff: Number(item.lastDiff),
                                dateQueue: item.dateQueue,
                                createdAt: item.createdAt,
                                updatedAt: item.updatedAt,
                                channel: Number(item.channel),
                                channel2: Number(item.channel2),

                            }
                        })
                    }),

                    arranged.map(async (item: any, index: number) => {
                        await db.arrangedBackup.create({
                            data: {
                                arrangedId: item.id,
                                hospitalId: item.hospitalId,
                                prescripId: item.prescripId,
                                medicineId: item.medicineId,
                                medicineCode: item.medicineCode,
                                medicine_name: item.medicine_name,
                                medicine_amount: item.medicine_amount,
                                med_detail: item.med_detail,
                                med_detail1: item.med_detail1,
                                dispcause: item.dispcause,
                                lastDisp: item.lastDisp,
                                medsts: item.medsts,
                                prod_type: item.prod_type,
                                medicinePackageSize: item.medicinePackageSize,
                                medicine_amount_edit: item.medicine_amount_edit,
                                medicine_method: item.medicine_method,
                                medicineMethodEn: item.medicineMethodEn,
                                medicine_condition: item.medicine_condition,
                                medicine_unit_eating: item.medicine_unit_eating,
                                medicineUnitEatingEn: item.medicineUnitEatingEn,
                                medicine_frequency: item.medicine_frequency,
                                medicineFrequencyEn: item.medicineFrequencyEn,
                                medicine_advice: item.medicine_advice,
                                medicineAdviceEn: item.medicineAdviceEn,
                                medicine_value: item.medicine_value,
                                medicine_reason: item.medicine_reason,
                                user_arrang: item.user_arrang,
                                user_arrang_time: item.user_arrang_time,
                                user_double_check: item.user_double_check,
                                user_check_time: item.user_check_time,
                                user_dispense: item.user_dispense,
                                user_dispense_time: item.user_dispense_time,
                                arrang_status: item.arrang_status,
                                print_status: item.print_status,
                                labelNo: item.labelNo,
                                error00: item.error00,
                                error01: item.error01,
                                error02: item.error02,
                                error03: item.error03,
                                error04: item.error04,
                                error05: item.error05,
                                error06: item.error06,
                                error07: item.error07,
                                error08: item.error08,
                                error09: item.error09,
                                error10: item.error10,
                                checkComment: item.checkComment,
                                barcode: item.barcode,
                                userId: item.user_id,
                                basketId: item.basketId,
                                autoLoad: item.autoLoad,
                                createdAt: item.createdAt,
                                updatedAt: item.updatedAt
                            }
                        })
                    })
                ])
            }


            const response = {
                prescription,
                message: 'Daily backup database successfully',
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