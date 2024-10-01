import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const cartRouter = createTRPCRouter({
    addToCart: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1).optional().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const existingCartItem =  await ctx.db.cartItem.findFirst({
        where: {
          userId: userId,
          productId: input.productId,
        },
      });

      if (existingCartItem) {
        // Update quantity if item already exists in cart
        const updatedCartItem = await ctx.db.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + input.quantity },
        });
        return updatedCartItem;
      } else {
        // Create new cart item
        const newCartItem = await ctx.db.cartItem.create({
          data: {
            userId,
            productId: input.productId,
            quantity: input.quantity,
          },
        });
        return newCartItem;
      }
    }),

  // Get all items in the cart
  getCartItems: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      const cartItems = await ctx.db.cartItem.findMany({
        where: { userId },
        include: { product: true }, // Include product details if necessary
      });
      return cartItems;
    }),

  // Update the quantity of an item in the cart
  updateCartItem: protectedProcedure
    .input(
      z.object({
        cartItemId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedCartItem = await ctx.db.cartItem.update({
        where: { id: input.cartItemId },
        data: { quantity: input.quantity },
      });
      return updatedCartItem;
    }),

  // Remove an item from the cart
  removeCartItem: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.cartItem.delete({
        where: { id: input },
      });
      return { success: true };
    }),

  // Clear the entire cart
  clearCart: protectedProcedure
  .mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id; // This should be a string based on your model
    await ctx.db.cartItem.deleteMany({
      where: { userId: userId }, // Ensure this is a string
    });
    return { success: true };
  }),
});
