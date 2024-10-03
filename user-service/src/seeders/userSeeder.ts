const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const seedUsers = async () => {
    const users = [
        {
            firstName: 'George',
            lastName: 'Enesi',
            email: 'myfakemail@gmail.com',
            mobile: '08177788801',
            password: await bcrypt.hash('password1', 10)
        },
        {
            firstName: 'mary',
            lastName: 'Jane',
            email: 'my2we@gmail.com',
            mobile: '08177788803',
            password: await bcrypt.hash('password1', 10)
        },
    ]

    for (const user of users){
        await prisma.user.create({data: user});
    }
    console.log('Users seeded succcessfully!');
}
seedUsers().catch((e)=> console.error(e)).finally(async()=>await prisma.$disconnect());