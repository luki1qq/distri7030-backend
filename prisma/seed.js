import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.create({
    data: {
      description: "ACCESORIOS PARA PILETAS Y PISCINAS",
    },
  });
  console.log({ category });
  const subCategory = await prisma.subCategory.create({
    data: {
      description: "ACCESORIOS PARA PILETAS Y PISCINAS",
      categoryId: category.id,
    },
  });
  console.log({ subCategory });

  const product = await prisma.products.create({
    data: {
      codeCompatibility: "QUI57",
      priceSale: 2032.87,
      isActive: true,
      description: "ALGUICIDA x 1 LITRO P/ PILETAS DE LONA/QUI57",
      categoryId: category.id,
      subCategoryId: subCategory.id,
      image: "https://via.placeholder.com/150",
    },
  });
  console.log({ product });
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
