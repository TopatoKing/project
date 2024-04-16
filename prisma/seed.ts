import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const allergens = await prisma.allergens.upsert({
    where: { AllergenID: 1 },
    update: {},
    create: {
      AllergenID: 1,
      AllergenName: "Egg",
    },
  });
  console.log({ allergens });
  const allergens1 = await prisma.allergens.upsert({
    where: { AllergenID: 2 },
    update: {},
    create: {
      AllergenID: 2,
      AllergenName: "Milk",
    },
  });
  console.log({ allergens1 });
  const allergens2 = await prisma.allergens.upsert({
    where: { AllergenID: 3 },
    update: {},
    create: {
      AllergenID: 3,
      AllergenName: "Soy",
    },
  });
  console.log({ allergens2 });
  const cake1 = await prisma.cakes.upsert({
    where: { CakeID: 1 },
    update: {},
    create: {
      CakeID: 1,
      CakeStringID: "chocolate",
      TypePrice: 10,
      Type: "Chocolate",
      CakeNumber: 1,
    },
  });
  console.log({ cake1 });
  const cake2 = await prisma.cakes.upsert({
    where: { CakeID: 2 },
    update: {},
    create: {
      CakeID: 2,
      CakeStringID: "vanilla_sponge",
      TypePrice: 10,
      Type: "Vanilla",
      CakeNumber: 2,
    },
  });
  console.log({ cake2 });
  const cake3 = await prisma.cakes.upsert({
    where: { CakeID: 3 },
    update: {},
    create: {
      CakeID: 3,
      CakeStringID: "victoria_sponge",
      TypePrice: 10,
      Type: "Victoria Sponge",
      CakeNumber: 3,
    },
  });
  console.log({ cake3 });
  const cakeAllergens = await prisma.cakeAllergens.upsert({
    where: { CakeAllergensID: 1 },
    update: {},
    create: {
      CakeID: 1,
      AllergenID: 1,
    },
  });
  console.log({ cakeAllergens });
  const cakeAllergens1 = await prisma.cakeAllergens.upsert({
    where: { CakeAllergensID: 2 },
    update: {},
    create: {
      CakeID: 2,
      AllergenID: 2,
    },
  });
  console.log({ cakeAllergens1 });
  const cakeAllergens2 = await prisma.cakeAllergens.upsert({
    where: { CakeAllergensID: 3 },
    update: {},
    create: {
      CakeID: 2,
      AllergenID: 3,
    },
  });
  console.log({ cakeAllergens2 });

  const sizes1 = await prisma.sizes.upsert({
    where: { SizeID: 1 },
    update: {},
    create: {
      SizeID: 1,
      CakeSize: 8,
      Price: 1,
    },
  });
  console.log({ sizes1 });
  const sizes2 = await prisma.sizes.upsert({
    where: { SizeID: 2 },
    update: {},
    create: {
      SizeID: 2,
      CakeSize: 12,
      Price: 1.5,
    },
  });
  console.log({ sizes2 });
  const sizes3 = await prisma.sizes.upsert({
    where: { SizeID: 3 },
    update: {},
    create: {
      SizeID: 3,
      CakeSize: 16,
      Price: 2,
    },
  });
  console.log({ sizes3 });
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
