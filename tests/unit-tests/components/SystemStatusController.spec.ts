import { NextFunction, Request, Response } from 'express';
import SystemStatusController from '../../../server/components/system-status/SystemStatusController';
import BaseController from '../../../server/components/BaseController';
import * as crypto from '../../../server/lib/crypto';

describe('System Status Controller', () => {
	let request: Partial<Request>;
	let response: Partial<Response>;
	const next: NextFunction = jest.fn();
	let controller: SystemStatusController;

	beforeAll(() => {
		controller = new SystemStatusController();
	});

	beforeEach(() => {
		request = {};
		response = {
			locals: {},
			status: jest.fn(),
			send: jest.fn(),
		};
	});

	test('getError method', () => {
		controller.getError(request as Request, response as Response, next);
		expect(next).toHaveBeenCalled();
	});

	test('getSystemInfo method', () => {
		controller.getSystemInfo(
			request as Request,
			response as Response,
			next,
		);
		const locals = response.locals;
		expect(locals?.data).toHaveProperty('os');
	});

	test('getSystemInfo method with updated env variables', () => {
		process.env.APPLY_ENCRYPTION = 'true';
		process.env.SECRET_KEY = 'key';
		const mockEncrypt = jest.spyOn(crypto, 'encrypt');
		controller.getSystemInfo(
			request as Request,
			response as Response,
			next,
		);
		expect(mockEncrypt).toHaveBeenCalled();
	});

	test('getSystemInfo method with exception', () => {
		jest.spyOn(BaseController.prototype, 'send').mockImplementation(() => {
			throw new Error('exception');
		});
		controller.getSystemInfo(
			request as Request,
			response as Response,
			next,
		);
		expect(next).toHaveBeenCalled();
	});

	test('getServerTime method', () => {
		controller.getServerTime(
			request as Request,
			response as Response,
			next,
		);
		const locals = response.locals;
		expect(locals?.data).toHaveProperty('date');
		expect(locals?.data).toHaveProperty('utc');
	});

	test('getServerTime method with exception', () => {
		jest.spyOn(BaseController.prototype, 'send').mockImplementation(() => {
			throw new Error('exception');
		});
		controller.getServerTime(
			request as Request,
			response as Response,
			next,
		);
		expect(next).toHaveBeenCalled();
	});

	test('getResourceUsage method', () => {
		controller.getResourceUsage(
			request as Request,
			response as Response,
			next,
		);
		const locals = response.locals;
		expect(locals?.data).toHaveProperty('processMemory');
		expect(locals?.data).toHaveProperty('systemMemory');
	});

	test('getResourceUsage method with exception', () => {
		jest.spyOn(BaseController.prototype, 'send').mockImplementation(() => {
			throw new Error('exception');
		});
		controller.getResourceUsage(
			request as Request,
			response as Response,
			next,
		);
		expect(next).toHaveBeenCalled();
	});

	test('getProcessInfo method', () => {
		controller.getProcessInfo(
			request as Request,
			response as Response,
			next,
		);
		const locals = response.locals;
		expect(locals?.data).toHaveProperty('applicationVersion');
		expect(locals?.data).toHaveProperty('nodeDependencyVersions');
	});

	test('getProcessInfo method with exception', () => {
		jest.spyOn(BaseController.prototype, 'send').mockImplementation(() => {
			throw new Error('exception');
		});
		controller.getProcessInfo(
			request as Request,
			response as Response,
			next,
		);
		expect(next).toHaveBeenCalled();
	});
});
