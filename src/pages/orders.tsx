import Link from "next/link";
import { GetServerSideProps } from "next";
import { db } from "@/server/db";
import { getAuth } from "@clerk/nextjs/server";
import type { Orders, Cakes, Users } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function Account({
  orders,
  theCakes,
  user,
}: {
  orders: Orders[];
  theCakes: Cakes[];
  user: Users;
}) {

  const router = useRouter();
	const refreshData = () => {
		void router.replace(router.asPath);
	};

  function CakeNumbertoCakeName(CakeNumber: number) {
    return (
      theCakes.find((cake) => cake.CakeID === CakeNumber)?.Type || "Unknown"
    );
  }
  async function cancelOrder(OrderID: number) {
    const cancel = await fetch(`/api/cancelOrder?orderId=${OrderID}`, {
      method: "GET",
    });
    if (cancel.ok) {
      toast({
        title: "Order Successfully Cancelled",
        variant: "success"
      })
      refreshData()
    } else {
      toast({
        title: "Order failed to delete :(",
        variant: "destructive"
      })
    }
    
  }

  return (
    <main className="flex">
      <nav className="mx-4 flex min-h-screen w-[20%] flex-col items-center">
        <Link className="text-lg text-black" href="/account">
          Account Details
        </Link>
        <Link className="text-lg text-[#0000ff]" href="/orders">
          Orders
        </Link>
      </nav>
      <div className="h-screen border-l-2 border-[#57b0fe]" />
      <section className="mx-4 min-h-screen w-[80%]">
        <p className="flex flex-col items-center text-lg">
          Orders for account: {user.UserForename} {user.UserSurname}
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {orders.map((order, thecake) => (
            <div key={order.OrderID} className="my-4 flex flex-col">
              <div className="rounded-md block border-4 border-[#57b0fe] p-4">
                <p className="text-lg">
                  Cake: {CakeNumbertoCakeName(order.CakeNumber)}
                </p>
                <p className="text-lg">Size: {order.CakeSize}"</p>
                <p className="text-lg">Shape: {order.CakeShape}</p>
                <p className="text-lg">Total: £{order.CakePriceTotal}</p>
                <p className="text-lg">Status: {order.OrderStatus}</p>
                <p className="text-lg">
                  Paid: {order.OrderPaid ? "Yes" : "No"}
                </p>
                
                <Button disabled={order.OrderStatus !== "NOT_STARTED"} className="rounded-lg" variant={"destructive"} onClick={() => cancelOrder(order.OrderID)} >Cancel Order</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = getAuth(context.req);
  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const orders = await db.orders.findMany({
    where: {
      UserID: userId,
    },
  });

  const user = await db.users.findUnique({
    where: {
      UserID: userId,
    },
  });

  const thecake = await db.cakes.findMany();
  return {
    props: {
      user,
      orders,
      theCakes: thecake,
    },
  };
};
