import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

import { publicProcedure, router } from '../../../server/trpc';

const prisma = new PrismaClient();

const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return await prisma.user.findMany();
  }),
  addUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      console.log(input);

      return await prisma.user.create({ data: input });
    }),
  deleteUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.user.delete({ where: { id: input.id } });
    }),
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
