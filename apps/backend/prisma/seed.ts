import { PrismaClient } from '.prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  await prisma.user.create({
    data: {
      displayName: 'Admin Super',
      password: await bcrypt.hash('123456', 10),
      username: 'admin',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      displayName: 'Novotel',
      password: await bcrypt.hash('mj1GomnifZvqGvk', 10),
      username: 'novotel',
      role: 'VIEWER',
    },
  });

  // await prisma.page.createMany({
  //   data: [
  //     {
  //       id: '483304101523131',
  //       isActive: true,
  //       name: 'Marcello Dominguez',
  //       clientId: '1281271743024458',
  //       clientSecret: '80068712ca40723b6042e24b9fda68ce',
  //       shortLivedToken:
  //         'EAASNT1MajUoBO2qiK3ZCm9YjzB80CUFYcvZAf3SQLP0VeVNKhVQP2t2CV05cBhZAhx53h4QMC1tZAUp7t5IutkL8ZAIdwZAQxMqOrpThh9fZBKuKQCz0lWi7hnZBCJDL74s8GBzkJZAXwe4pNMwSbAdyfX9ZBN1O1GmZCuXrJxZAetfrfG6HOGZB5YDv2jQfZBZAatGtyhZCaor49sjSzZCw98X8oA9mhxTWgDJDK',
  //       appScopedUserId: '122198334902192628',
  //       pageLongLivedToken:
  //         'EAASNT1MajUoBO7KRBRiNn38RUCAGHltyocUwef3sJxvotRhCsebNdy021fVm290Ctvl24ShCZArhgHHA4KF1LlePzqL2buAp0RiEKeiDV9m0YJJoLIICNScbQV7V8186msVFsT6E6AuVMn3SD67QJAFDZBfPE6N0h8jutpK7NZCCKhhekhZA0mhkq6ZCLWsZCw',
  //       userLongLivedToken:
  //         'EAASNT1MajUoBOZCQZC1Tx07thBXhqPN44KEHgvGZBWcZCSJ87A5aBJPTfrS53csGVoqXzrqHreYZB2v91MD4mZCLSwV41irMa6ZCah9RQtMlCuUrryRRjVipGatt7T47sHmFAadUj3jUGI6M6CehE2miHVLj3bjBHXFSXgG1Ga6orTIq6zmLLFgvKx9',
  //     },
  //     {
  //       id: '344470028757615',
  //       isActive: true,
  //       name: 'Gabriel Ali',
  //       clientId: '1281271743024458',
  //       clientSecret: '80068712ca40723b6042e24b9fda68ce',
  //       shortLivedToken:
  //         'EAASNT1MajUoBO2qiK3ZCm9YjzB80CUFYcvZAf3SQLP0VeVNKhVQP2t2CV05cBhZAhx53h4QMC1tZAUp7t5IutkL8ZAIdwZAQxMqOrpThh9fZBKuKQCz0lWi7hnZBCJDL74s8GBzkJZAXwe4pNMwSbAdyfX9ZBN1O1GmZCuXrJxZAetfrfG6HOGZB5YDv2jQfZBZAatGtyhZCaor49sjSzZCw98X8oA9mhxTWgDJDK',
  //       appScopedUserId: '122198334902192628',
  //       userLongLivedToken:
  //         'EAASNT1MajUoBO0ABFn97aljeHtVpmNKKYIiUrv1ARiMFMM6raRoqK1eSxxH8rx1A1wjufK04UFwAGPHYBixPZB7UADoq749qZCviVy3huhZAdjPYZAFSkIZBy3lyZAQGUisNZC7MDK3w9GdRtY4cE1M4tasqJzrnWPIJ2kqCd7thwuSYjnxkmoBDmn6w8eFadPs',
  //       pageLongLivedToken: 'F',
  //     },
  //   ],
  // });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
