import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  createProduct: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        brandName: z.string(),
        price: z.number(),
        images: z.array(z.string()),
        status: z.enum(["AVAILABLE", "OUT_OF_STOCK"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          brandName: input.brandName,
          price: input.price,
          images: input.images,
          status: input.status || "AVAILABLE", 
        },
      });
      return product;
    }),
  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany(); 
    return products; 
  }),
  getTableProducts: publicProcedure
    .query(async ({ ctx }) => {
      const products = await ctx.db.product.findMany({
        select: {
          id: true,
          name: true,
          brandName: true,
          price: true,
          status: true,
        },
      });

      return products;
    }),
    getProductById: publicProcedure
    .input(z.object({ id: z.number() })) // Validate that the input is an object with a number ID
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
      });
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    }),

  updateProduct: publicProcedure
    .input(
      z.object({
        id: z.number(), 
        name: z.string().optional(), 
        description: z.string().optional(), 
        price: z.number().optional(), 
        brandName: z.string().optional(), 
        status: z.enum(["AVAILABLE", "OUT_OF_STOCK"]).optional(), 
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedProduct = await ctx.db.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          brandName: input.brandName,
          status: input.status,
        },
      });
      return updatedProduct; 
    }),

  deleteProduct: publicProcedure
    .input(
      z.object({
        id: z.number(), 
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.product.delete({
        where: { id: input.id }, 
      });
      return { success: true }; 
    }),
  setProductAvailable: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedProduct = await ctx.db.product.update({
        where: { id: input.id },
        data: {
          status: "AVAILABLE", // Set the status to AVAILABLE
        },
      });
      return updatedProduct;
    }),

  setProductOutOfStock: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedProduct = await ctx.db.product.update({
        where: { id: input.id },
        data: {
          status: "OUT_OF_STOCK", 
        },
      });
      return updatedProduct;
    }),
});
