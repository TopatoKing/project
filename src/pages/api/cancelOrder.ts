import { db } from "@/server/db";
import type { Orders } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

//this is the api route that will be called when a user wants to cancel an order
//it requires the userid of the logged in user to match the user who created the order and the order status to be NOT_STARTED
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = getAuth(req);
  const {orderId} = req.query;

  if (!orderId || orderId == undefined) {
    res.status(404).json("Order not found")
  }
const orderNum = parseInt(orderId?.toString() ?? '', 10);

  try {
    const order = await db.orders.delete({
      where: {
        OrderID: orderNum,
        OrderStatus: "NOT_STARTED",
        UserID: userId?.toString(),
      },
    });
    res
      .status(201)
      .json({
        message: "Order cancelled successfully",
        order_id: order.OrderID,
      });
  } catch (error) {
    console.error("Error inserting order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
}
