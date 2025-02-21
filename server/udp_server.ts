import dgram from 'dgram';

export const udh4 = dgram.createSocket('udp4');

udh4.on('message', (msg, rinfo) => {
    console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

udh4.on('listening', () => {
    const address = udh4.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
});

// udh4.bind(20000);