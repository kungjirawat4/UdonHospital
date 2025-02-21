// // @ts-ignore
// import { PrismaClient, QueryMode } from '@prisma/client'

// let prisma: PrismaClient

// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient()
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient()
//   }

//   prisma = global.prisma
// }

// export { prisma, QueryMode }
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
// import { PrismaClient, QueryMode } from '@prisma/client';

// // eslint-disable-next-line no-restricted-globals
// const globalPrisma = global as unknown as {
//   prisma: PrismaClient | undefined;
// };

// const db
//   = globalPrisma.prisma
//   ?? new PrismaClient({
//     log:
//       process.env.NODE_ENV === 'development'
//         ? ['query', 'error', 'warn']
//         : ['error'],
//   });

// if (process.env.NODE_ENV !== 'production') {
//   globalPrisma.prisma = db;
// }

// export { db, QueryMode };

import { PrismaClient, QueryMode } from '@prisma/client';

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }

  prisma = global.prisma
}

export { prisma, QueryMode }