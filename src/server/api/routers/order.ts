import { z } from "zod";
import { Resend } from 'resend';
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { env } from "~/env";
import { EmailTemplate } from "~/app/_components/EmailTemplate";

const CartItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string(),
});

const resend = new Resend(env.RESEND_API_KEY);

export const orderRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(
      z.object({
        cartItems: z.array(
          z.object({
            id: z.number(),
            quantity: z.number(),
            product: z.object({
              id: z.number(),
              name: z.string(),
              price: z.number(),
            }),
          })
        ),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { cartItems, note } = input;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
      });

      return await ctx.db.$transaction(async (prisma) => {
        const order = await prisma.order.create({
          data: {
            userId: userId,
            totalAmount: cartItems.reduce(
              (acc, item) => acc + item.quantity * item.product.price,
              0
            ),
            note: note || null,
            products: {
              create: cartItems.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
              })),
            },
          },
        });

        await prisma.cartItem.deleteMany({
          where: {
            userId: userId,
            id: {
              in: cartItems.map((item) => item.id),
            },
          },
        });

        // Send email using Resend
        await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: ['delivered@resend.dev'],
          subject: `New Order Placed - Order ID: ${order.id}`,
          react: EmailTemplate({
            customerName: user?.name || 'Unknown',
            customerEmail: user?.email || 'Unknown',
            orderId: order.id,
            totalAmount: order.totalAmount,
            products: cartItems.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
              note: note || 'No note provided',
            })),
          }),
        });

        return order;
      });
    }),

  getAllOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Optional: Filter out orders with null products if needed
    return orders.filter(order =>
      order.products.every(productOrder => productOrder.product !== null)
    );
  }),

  updateOrderStatus: adminProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["UNDER_REVIEW", "PAYMENT_PENDING", "OUT_FOR_DELIVERY", "DELIVERED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { orderId, status } = input;

      const updatedOrder = await ctx.db.order.update({
        where: {
          id: orderId,
        },
        data: {
          status,
        },
      });

      return updatedOrder;
    }),
});
