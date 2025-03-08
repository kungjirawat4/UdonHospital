// import * as http from 'http';
// import { AddressInfo } from 'net';
// import App from './App';
// import logger from './lib/logger';
// import next from 'next';
// import { db } from './lib/prisma.db';
// import io from './socket-io';
// import { udh4 } from './udp_server';

// const app: App = new App();
// let server: http.Server;
// const dev = process.env.NODE_ENV !== "production";
// const nextApp = next({ dev });
// const nextHandler = nextApp.getRequestHandler();

// function serverError(error: NodeJS.ErrnoException): void {
// 	if (error.syscall !== 'listen') {
// 		throw error;
// 	}
// 	// handle specific error codes here.
// 	throw error;
// }

// function serverListening(): void {
// 	const addressInfo: AddressInfo = server.address() as AddressInfo;
// 	udh4.bind(20000);
// 	logger.info(
// 		`Listening on ${addressInfo.address}:${process.env.PORT || 8080}`,
// 	);
// }

// nextApp.prepare().then(() => {
// 	app.init()
// 		.then(() => {
// 			app.express.set('port', process.env.PORT || 8080);
// 			server = app.httpServer;
// 			app.express.all('*', (req: any, res: any) => nextHandler(req, res))
// 			// กำหนดให้ socket.io สามารถทำงานได้
// 			io?.attach(server)
// 			server.on('error', serverError);
// 			server.on('listening', serverListening);
// 			server.listen(process.env.PORT || 8080);
// 		})
// 	.catch((err: Error) => {
// 		logger.info('app.init error');
// 		logger.error(err.name);
// 		logger.error(err.message);
// 		logger.error(err.stack);
// 	}).finally(async () => {
// 		await db.$disconnect();
// 	});
// })
// process.on('unhandledRejection', (reason: Error) => {
// 	logger.error('Unhandled Promise Rejection: reason:', reason.message);
// 	logger.error(reason.stack);
// 	// application specific logging, throwing an error, or other logic here
// });


import * as http from 'http';
import { AddressInfo } from 'net';
import App from './App';
import logger from './lib/logger';
import next from 'next';
import { db } from './lib/prisma.db';
import io from './socket-io';
import udp4  from './udp_server';
import cron from "node-cron";
import axios from 'axios';

const app: App = new App();
let server: http.Server;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const { NEXT_PUBLIC_API_URL } = process.env;

function serverError(error: NodeJS.ErrnoException): void {
	if (error.syscall !== 'listen') {
		throw error;
	}
	// handle specific error codes here.
	throw error;
}

function serverListening(): void {
	const addressInfo: AddressInfo = server.address() as AddressInfo;
	udp4.bind(20000);
	logger.info(
		`Listening on ${addressInfo.address}:${process.env.PORT || 8080}`,
	);
}

cron.schedule("* 59 20 * * 1,2,3,4,5", async function () {    // ทุกๆ 21.00 ของวันศุกร์
	await Promise.all([
		await axios.get(`${NEXT_PUBLIC_API_URL}/database/daily`) // ทำการสำรองข้อมูล
			.then(async res => {
				if (res.status === 200) {
					db.$disconnect();
				}
			})
			.catch(error => {
				db.$disconnect();
			}),
	])

})
cron.schedule("* 59 20 * * 6", async function () {    // ทุกๆ 21.00 ของวันเสาร์
	await Promise.all([
		await axios.get(`${NEXT_PUBLIC_API_URL}/database/delete`) // ทำการสำรองข้อมูล
			.then(async res => {
				if (res.status === 200) {
					db.$disconnect();
				}
			})
			.catch(error => {
				db.$disconnect();
			}),
	])

})

// cron.schedule("*/20 * 1-20 * * 1,2,3,4,5", async function () {    // ทุกๆ 01.00-21.00 ของวันจันทร์-ศุกร์
// 	await Promise.all([
// 		await axios.get(`${NEXT_PUBLIC_API_URL}/medicine/udh-med`) // ทำการดึงข้อมูลของโรงพยาบาล
// 			.then(async res => {
// 				if (res.status === 200) {
// 					// console.log(res.data)
// 					console.log('ดึงข้อมูลสำเร็จ');
// 					db.$disconnect();
// 				}
// 			})
// 			.catch(error => {
// 				db.$disconnect();
// 			}),
// 	])

// })
// cron.schedule("*/10 * 1-16 * * 1,2,3,4,5", async function () {    // ทุกๆ 01.00-21.00 ของวันจันทร์-ศุกร์
// 	await Promise.all([
// 		await axios.get(`${NEXT_PUBLIC_API_URL}/medicine/udh-station`) // ทำการดึงข้อมูลของโรงพยาบาล
// 			.then(async res => {
// 				if (res.status === 200) {
// 					// console.log(res.data)
// 					console.log('เช็คมูลสำเร็จ');
// 					db.$disconnect();
// 				}
// 			})
// 			.catch(error => {
// 				db.$disconnect();
// 			}),
// 	])
// 	// console.log('เช็คมูลสำเร็จ');

// })
nextApp.prepare().then(() => {
	app.init()
		.then(() => {
			app.express.set('port', process.env.PORT || 8080);
			server = app.httpServer;
			app.express.all('*', (req: any, res: any) => nextHandler(req, res))
			// กำหนดให้ socket.io สามารถทำงานได้
			io?.attach(server)
			server.on('error', serverError);
			server.on('listening', serverListening);
			server.listen(process.env.PORT || 8080);
		})
		.catch((err: Error) => {
			logger.info('app.init error');
			logger.error(err.name);
			logger.error(err.message);
			logger.error(err.stack);
		}).finally(async () => {
			await db.$disconnect();
		});
})
process.on('unhandledRejection', (reason: Error) => {
	logger.error('Unhandled Promise Rejection: reason:', reason.message);
	logger.error(reason.stack);
	// application specific logging, throwing an error, or other logic here
});