import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

/* this is the api route that will be called when a user wants to cancel 
an order it requires the userid of the logged in user to match the user 
who created the order and the order status to be NOT_STARTED */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  {/* userId is defined by the logged in user */}
  const { userId } = getAuth(req);
  {/* orderId is taken from the query that called the API */}
  const { orderId } = req.query;

  {/* if the order doesnt match any orders in the table then it 
  will display Order not found */}
  if (!orderId || orderId == undefined) {
    res.status(404).json("Order not found");
  }
  {/* variable that converts the order numbers to a string */}
  const orderNum = parseInt(orderId?.toString() ?? "", 10);

  {/* will delete order from database if the user id matches, 
order status is NOT_STARTED and order number matches */}
  try {
    const order = await db.orders.delete({
      where: {
        OrderID: orderNum,
        OrderStatus: "NOT_STARTED",
        UserID: userId?.toString(),
      },
    });
    {/* displays sucessful cancelling message */}
    res.status(201).json({
      message: "Order cancelled successfully",
      order_id: order.OrderID,
    });
    {/* catches any errors when cancelling and dislpays them */}
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Error cancelling order" });
  }
}
