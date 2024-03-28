import { db } from "@/server/db";
import type { Orders } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

//this is the api route that will be called when a user wants to create an order
//this will insert a new order into the database and send a success message or an error message back for the toaster to display
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = req.body as Orders;

  try {
    const order = await db.orders.create({
      data: {
        UserID: data.UserID,
        CakeNumber: data.CakeNumber,
        CakeSize: data.CakeSize,
        CakeShape: data.CakeShape,
        OrderStatus: "NOT_STARTED",
        OrderPaid: false,
        CakePriceTotal: data.CakePriceTotal,
        OrderQuantity: data.OrderQuantity,
      },
    });
    res
      .status(201)
      .json({ message: "Order created successfully", order_id: order.OrderID });
  } catch (error) {
    console.error("Error inserting order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
}
