// import { Socket } from "socket.io";

// /**
//  * Socket IO handler
//  * @param {Socket} socket - The socket instance
//  * @returns {void}
//  */
// const socketIO = (socket: Socket): void => {
//     // socket.emit('requestHormuudUSSDCode', {
//     //     id: '1',
//     //     code: '*123#',
//     //     // code: '*727*1845822*20*3007#',
//     //     model: 'SM-A556E',
//     // });

//     socket.on('responseHormuudUSSDCode', (data: any) => {
//         console.log('🚀 ', data);
//     });
// };

// export default socketIO;

import { io } from "socket.io-client";


export const socketClient = io(process.env.SOCKET_IO, {
    reconnection: true,
    withCredentials: true,
    transports: [
        "websocket",
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling',
        'polling'
    ], // <--- Could it related be this?
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999
});