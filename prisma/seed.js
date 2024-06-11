const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  const filePath = path.resolve(__dirname, '../src/static/craft.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  for (const item of data) {
    await prisma.crafting.create({
      data: {
        ...item,
        id: uuidv4()
      }
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
