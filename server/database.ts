import { PrismaClient, Prisma } from "@prisma/client";

const $prisma = new PrismaClient();

const prisma = $prisma.$extends({
  model: {
    siteConfig: {
      async get() {
        let config = await $prisma.siteConfig.findFirst();
        if (!config) {
          config = await $prisma.siteConfig.create({
            data: {},
          });
        }
        return config;
      },
      async set(data: Prisma.SiteConfigUpdateArgs["data"]) {
        const config = await this.get();
        return $prisma.siteConfig.update({ where: { id: config.id }, data });
      },
    },
  },
});

export { prisma };

export type Database = typeof prisma;
export type { Prisma };
