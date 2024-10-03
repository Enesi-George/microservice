const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAssets() {
    const assets = [
        {
            name: 'mansion',
            latitude: 40.7128,
            longitude: -74.0060,
            ide: 'NYC001',
        },
        {
            name: 'duplex',
            latitude: 34.0522,
            longitude: -118.2437,
            ide: 'LA001',
        },
    ];

    for (const asset of assets) {
        await prisma.$queryRaw`
            INSERT INTO "Asset" (id, name, ide, latitude, longitude)
            VALUES (
                gen_random_uuid(), 
                ${asset.name}, 
                ${asset.ide}, 
                ${asset.latitude}, 
                ${asset.longitude}
            );
        `;
    }

    console.log('Assets seeded successfully');
}

seedAssets()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
