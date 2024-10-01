import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getProfileEmail: protectedProcedure
    .query(async ({ ctx }) => {
      
      const userId = ctx.session.user.id;
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { email: true }, 
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user.email;
    }),

    updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        address: z.string().min(1).max(255),
        phone: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          address: input.address,
          phone: input.phone,
        },
      });
    }),

    hasProfile: protectedProcedure.query(async ({ ctx }) => {
      
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id, 
        },
        select: {
          profileCreated: true,
        },
      });
  
      
      return user?.profileCreated !== null;
    }),

    getUserProfileDetails: protectedProcedure.query(async ({ ctx }) => {
      
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,  
        },
        select: {
          name: true,
          address: true,
          phone: true,
        },
      });
    
      
      return {
        name: user?.name || null,
        address: user?.address || null,
        phone: user?.phone || null,
      };
    }),
  
  
  
  
  
  
  
  
  
  

});
