import { inngest } from "./client";
import configPromise from "@payload-config";
import { getPayload } from "payload";

export const cancelExpiredOrder = (inngest as any).createFunction(
  { 
    id: "cancel-expired-order",
    triggers: [{ event: "canteen/order.created" }]
  },
  async ({ event, step }: any) => {
    await step.sleep("wait-for-payment", "15m");

    const orderStatus = await step.run("check-order-status", async () => {
      const payload = await getPayload({ config: configPromise });
      const order = await payload.findByID({
        collection: "orders",
        id: event.data.orderId,
      });
      return order.status;
    });

    if (orderStatus === "PENDING_PAYMENT") {
      await step.run("cancel-order", async () => {
        const payload = await getPayload({ config: configPromise });
        await payload.update({
          collection: "orders",
          id: event.data.orderId,
          data: { status: "CANCELLED_EXPIRED" },
        });
      });
      return { status: "cancelled", orderId: event.data.orderId };
    }

    return { status: "paid_or_completed", orderId: event.data.orderId };
  }
);
