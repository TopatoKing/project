import { GetServerSideProps } from "next";
import { db } from "@/server/db";
import { getAuth } from "@clerk/nextjs/server";
import type { Orders, Cakes, Users } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import React, { useState } from 'react';

//this is the orders section of the account page, it displays the orders for the logged in user
//the nav element is the page selection part for the accounts page (navigation bar is on the left side of the page)
//it displays the cake name, size, shape, total price, status and if it has been paid for
//it also allows the user to cancel an order if the status is NOT_STARTED this is done by calling the cancelOrder api route
//upon requesting to cancel an order the user will be notified if the order was successfully cancelled or not through the toast component
//the cancel button is disabled if the order status is not NOT_STARTED
export default function Orders({
  orders,
  theCakes,
  user,
}: {
  orders: Orders[];
  theCakes: Cakes[];
  user: Users;
}) {
  {/* variables for refreshing the page once an order is deleted from the database */}
  const router = useRouter();
  const refreshData = () => {
    void router.replace(router.asPath);
  };

  {/* Converts the Cake number into its name format */}
  function CakeNumbertoCakeName(CakeNumber: number) {
    return (
      theCakes.find((cake) => cake.CakeID === CakeNumber)?.Type ?? "Unknown"
    );
  }
  {/* function that calls the cancelOrder API */}
  async function cancelOrder(OrderID: number) {
    const cancel = await fetch(`/api/cancelOrder?orderId=${OrderID}`, {
      method: "GET",
    });
    {/* pop-up that will display the status of deleting the order */}
    if (cancel.ok) {
      toast({
        title: "Order Successfully Cancelled",
        variant: "success",
      });
      {/* refreshes the page to remove the now deleted order */}
      refreshData();
    } else {
      toast({
        title: "Order failed to delete :(",
        variant: "destructive",
      });
    }
  }
  {/* variable for disabling the cancel order button and enabling confirm cancel */}
  const [cancelOrderPressed, setCancelOrderPressed] =  useState<boolean[]>(
		new Array(orders.length).fill(false),
	);

  return (  
    <main className="flex">
      {/* Creates the section for the order boxes to fill and centers it */}
      <section className="mx-4 min-h-screen w-full flex flex-col items-center">
        {/* text at the top of the page that displays the logged in users name */}
        <p className="flex flex-col items-center text-lg">
          Orders for account: {user.UserForename} {user.UserSurname}
        </p>
        {/* Creates the box and fills it with the details of the order. 
        Repeats for all orders under the logged in account */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {orders.map((order, index) => (
            <div key={order.OrderID} className="my-4 flex flex-col">
              <div className="rounded-md block border-4 border-[#57b0fe] p-4">
                <p className="text-lg">Order No. {order.OrderID}</p>
                <p className="text-lg">
                  Cake: {CakeNumbertoCakeName(order.CakeNumber)}
                </p>
                <p className="text-lg">Size: {order.CakeSize}&quot;</p>
                <p className="text-lg">Shape: {order.CakeShape}</p>
                <p className="text-lg">Quantity: {order.OrderQuantity}</p>
                <p className="text-lg">Total: £{order.CakePriceTotal}</p>
                <p className="text-lg">Status: {order.OrderStatus}</p>
                <p className="text-lg">
                  Paid: {order.OrderPaid ? "Yes" : "No"}
                </p>

                {/* Button that unlocks the confirm cancel button when pressed */}
                <Button className="rounded-lg mx-1" 
                disabled={order.OrderStatus !== "NOT_STARTED"} 
                onClick={() => {
                  const orderthing = [...cancelOrderPressed];
											orderthing[index] = true;
											setCancelOrderPressed(orderthing);
                }} >
                  Cancel Order
                </Button>

                {/* Button that calls the cancelOrder function when pressed, 
                button gets unlocked when the cancel order button is pressed */}
                <Button
                  disabled={!cancelOrderPressed[index]}
                  className="rounded-lg mx-1"
                  variant={"destructive"}
                  onClick={() => {
                    void cancelOrder(order.OrderID).then(() => {
                      setCancelOrderPressed(new Array(orders.length).fill(false))
                    });
                    
                    }}>
                  Confirm Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

//this function gets the orders, the cakes and the user from the database
//if the user is not logged in they will be redirected to the sign in page
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = getAuth(context.req);
  {/* sends user to the sign in page if not logged in */}
  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  {/* locates all orders from the logged in user id */}
  const orders = await db.orders.findMany({
    where: {
      UserID: userId,
    },
  });

  {/* locates the user id of the logged in user */}
  const user = await db.users.findUnique({
    where: {
      UserID: userId,
    },
  });

  {/* locates the cakes table */}
  const thecake = await db.cakes.findMany();

  {/* returns the user id (name) for logged in user, their orders, and the cakes table */}
  return {
    props: {
      user,
      orders,
      theCakes: thecake,
    },
  };
};
