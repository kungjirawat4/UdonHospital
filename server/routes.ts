// import { Router } from 'express';
// import SystemStatusController from './components/system-status/SystemStatusController';
// import UdhMedController from './components/udh-med/UdhMedController';
// import { RouteDefinition } from './types/RouteDefinition';
// import logger from './lib/logger';
// import AuthUserController from './components/auth-user/AuthUserController';
// import AdminUserController from './components/admin-user/AdminUserController';
// import UdhDashboardController from './components/udh-dashboard/UdhDashboardController';
// import UdhMedicineController from './components/udh-medicine/UdhMedicineController';
// import UdhAutoloadController from './components/udh-autoload/UdhAutoloadController';

// function registerControllerRoutes(routes: RouteDefinition[]): Router {
// 	const controllerRouter = Router();
// 	routes.forEach((route) => {
// 		switch (route.method) {
// 			case 'get':
// 				controllerRouter.get(route.path, route.handler);
// 				break;
// 			case 'post':
// 				controllerRouter.post(route.path, route.handler);
// 				break;
// 			case 'put':
// 				controllerRouter.put(route.path, route.handler);
// 				break;
// 			case 'patch':
// 				controllerRouter.patch(route.path, route.handler);
// 				break;
// 			case 'delete':
// 				controllerRouter.delete(route.path, route.handler);
// 				break;
// 			default:
// 				throw new Error(`Unsupported HTTP method: ${route.method}`);
// 		}
// 	});
// 	return controllerRouter;
// }

// /**
//  * Here, you can register routes by instantiating the controller.
//  *
//  */
// export default function registerRoutes(): Router {
// 	try {
// 		const router = Router();

// 		// Define an array of controller objects
// 		const controllers = [
// 			new SystemStatusController(),
// 			new UdhMedController(),
// 			new AuthUserController(),
// 			new AdminUserController(),
// 			new UdhDashboardController(),
// 			new UdhMedicineController(),
// 			new UdhAutoloadController()
// 		];

// 		// Dynamically register routes for each controller
// 		controllers.forEach((controller) => {
// 			// make sure each controller has basePath attribute and routes() method
// 			router.use(
// 				`/v1/${controller.basePath}`,
// 				//`/${controller.basePath}`,
// 				registerControllerRoutes(controller.routes()),
// 			);
// 		});

// 		return router;
// 	} catch (error) {
// 		logger.error('Unable to register the routes:', error);
// 	}
// }

import { Router } from 'express';
import SystemStatusController from './components/system-status/SystemStatusController';
import UdhMedController from './components/udh-med/UdhMedController';
import { RouteDefinition } from './types/RouteDefinition';
import logger from './lib/logger';
import AuthUserController from './components/auth-user/AuthUserController';
import AdminUserController from './components/admin-user/AdminUserController';
import UdhDashboardController from './components/udh-dashboard/UdhDashboardController';
import UdhMedicineController from './components/udh-medicine/UdhMedicineController';
import UdhAutoloadController from './components/udh-autoload/UdhAutoloadController';
import UdhBackupController from './components/udh-backup/UdhBackupController';

function registerControllerRoutes(routes: RouteDefinition[]): Router {
	const controllerRouter = Router();
	routes.forEach((route) => {
		switch (route.method) {
			case 'get':
				controllerRouter.get(route.path, route.handler);
				break;
			case 'post':
				controllerRouter.post(route.path, route.handler);
				break;
			case 'put':
				controllerRouter.put(route.path, route.handler);
				break;
			case 'patch':
				controllerRouter.patch(route.path, route.handler);
				break;
			case 'delete':
				controllerRouter.delete(route.path, route.handler);
				break;
			default:
				throw new Error(`Unsupported HTTP method: ${route.method}`);
		}
	});
	return controllerRouter;
}

/**
 * Register routes for the "/v1" version
 */
export function registerRoutesV1(): Router {
	try {
		const router = Router();

		// Define controllers for the "/v1" routes
		const controllersV1 = [
			new SystemStatusController(),
			new UdhMedController(),
			new AuthUserController(),
			new AdminUserController(),
			new UdhDashboardController(),
			new UdhMedicineController(),
			new UdhAutoloadController(),
			new UdhBackupController()
		];

		// Register routes for each controller with basePath "/v1/{basePath}"
		controllersV1.forEach((controller) => {
			router.use(
				`/v1/${controller.basePath}`,
				registerControllerRoutes(controller.routes())
			);
		});

		return router;
	} catch (error) {
		logger.error('Unable to register the routes:', error);
	}
}

/**
 * Register routes for the "/api" version
 */
export function registerRoutesV2(): Router {
	try {
		const router = Router();

		// Define controllers for the "/api" routes
		const controllersV2 = [
			// new SystemStatusController(),
			new UdhAutoloadController()
			// เพิ่ม controller อื่น ๆ ที่ต้องการใช้งานเส้นทาง "/api"
		];

		// Register routes for each controller with basePath "/api/{basePath}"
		controllersV2.forEach((controller) => {
			router.use(
				`/api/${controller.basePath}`,
				registerControllerRoutes(controller.routes())
			);
		});

		return router;
	} catch (error) {
		logger.error('Unable to register the routes:', error);
	}
}

/**
 * รวมเส้นทางทั้งสองเวอร์ชัน
 */
export default function registerAllRoutes(): Router {
	const router = Router();

	// ใช้ registerRoutesV1 สำหรับเส้นทาง "/v1"
	router.use(registerRoutesV1());

	// ใช้ registerRoutesV2 สำหรับเส้นทาง "/api"
	router.use(registerRoutesV2());

	return router;
}