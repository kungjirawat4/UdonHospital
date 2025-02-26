// import dgram from 'dgram';

// export const udh4 = dgram.createSocket('udp4');

// udh4.on('message', (msg, rinfo) => {
//     console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
// });

// udh4.on('listening', () => {
//     const address = udh4.address();
//     console.log(`Server listening on ${address.address}:${address.port}`);
// });

// // udh4.bind(20000);

import axios from 'axios';
import dgram from 'dgram';
import 'dotenv/config';
import { db } from './lib/prisma.db';
const udp4 = dgram.createSocket('udp4');

const { NEXT_PUBLIC_APP_URL } = process.env;

udp4.on('message', async (msg, rinfo) => {
    const _ip = rinfo.address;
    const data_raw = msg.toString();
    const p_ip = _ip.split(".");
    const u_ip = Number(p_ip[3]);

    function r_d(str: String){
        const cut_start = str.split("").join('');
        return cut_start.split(/\r?\n|\r/).join('');
    }

    const data = r_d(data_raw);

    if(u_ip > 110){ // ตู้จัดยามือ (ตู้ 4 ปุ่มกด) จำแนกตาม IP 111 ขึ้นไป
        try{
            const s_d = data.split("OK");
            let address: String;
            let ID: String;
            let person: String;
            let cabinetType: 'SMD';
            for(var i = 0; i < s_d.length; i++){
                const d_d = s_d[i].split("//");
                if (d_d[0].length > 0){
                    address =d_d[0];
                    ID = d_d[1];
                    person = d_d[2];
                }
            }

            if(address) {
            await axios
               .post(`${NEXT_PUBLIC_APP_URL}/autoload/cabinet`, { cabinetType, address, ID, person, u_ip })
               .then(res => {
                console.log('sdf',res.data)
                 db.$disconnect();
               })
               .catch(error => {
                 db.$disconnect();
                 console.error(error)
               })
            }
            // console.log("Address: "+ address);
            // console.log("ID: "+ ID);
            // console.log("Person: "+ person);
            // console.log("IP: "+ u_ip);
            // console.log("-----------");

        }catch{
            console.log("Go checking a cabinet IP: "+u_ip+" Motherfucker!");
        }
    }else{ // ตู้ HYB
        try{
            const s_d = data.split("//");
            const p_address = s_d[0].split("C");

            const address = p_address[1];

            const ID = s_d[1];
            const person = s_d[2];
            const whatever = s_d[3];
            const cabinetType = 'HYB';

            
            if(address) {
                await axios
                   .post(`${NEXT_PUBLIC_APP_URL}/autoload/cabinet`, { cabinetType, address, ID, person, u_ip })
                   .then(res => {
                    console.log('sdf',res.data)
                     db.$disconnect();
                   })
                   .catch(error => {
                     db.$disconnect();
                     console.error(error)
                   })
                }

            // console.log("Address: "+ address);
            // console.log("ID: "+ ID);
            // console.log("Stat: "+ person);
            // console.log("WTF: "+whatever);
            // console.log("IP: "+ u_ip);
            // console.log("-----------");
        }catch{
            console.log("Go checking a cabinet IP: "+u_ip+" Motherfucker!");
        }
    }
});

udp4.on('listening', () => {
    const address = udp4.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
});


export default udp4;