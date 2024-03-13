import { toast, useToast } from "@/components/ui/use-toast";
import { db } from "@/server/db";
import { GetServerSideProps } from "next";
import type { Cakes, Sizes } from "@prisma/client";
import Image from "next/image";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

//make a type for the data that is returned from the server
interface FinalCake extends Cakes {
  CakeAllergens: {
    AllergenID: number;
    Allergens: {
      AllergenName: string;
    };
  }[];
}

//this is the page for the product selected from the products page
//it displays the cake image, allergens, size, shape and price
//it also allows the user to place an order for the selected cake
//if the user is not logged in they will not be able to place an order
export default function SearchPage({
  theCake,
  sizes,
}: {
  theCake: FinalCake;
  sizes: Sizes[];
}) {
  console.log(sizes);

  const [finalCakePrice, setFinalCakePrice] = useState(theCake.TypePrice);
  const [selectedSizeMultiplier, setSelectedSizeMultiplier] = useState("8");
  const [selectedShape, setSelectedShape] = useState("Rectangular");
  const { userId } = useAuth();

  useEffect(() => {
    const price = parseFloat(
      (theCake.TypePrice * parseFloat(selectedSizeMultiplier)).toFixed(2),
    );
    setFinalCakePrice(price);
  }, [selectedSizeMultiplier]);

  useEffect(() => {
    if (Number.isNaN(finalCakePrice)) {
      setFinalCakePrice(theCake.TypePrice);
    }
  });

  async function submit() {
    const order = await fetch("/api/createOrder", {
      method: "POST",
      body: JSON.stringify({
        UserID: userId,
        CakeNumber: theCake.CakeID,
        CakeSize:
          sizes.find((size) => size.Price.toString() === selectedSizeMultiplier)
            ?.CakeSize || 0,
        CakeShape: selectedShape,
        CakePriceTotal: finalCakePrice,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (order.ok) {
      toast({
        title: "Order Placed",
        description: "Your order has been placed",
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: "There was an error placing your order",
        variant: "destructive",
      });
    }
  }

  return (
    <main className="flex">
      <nav className="mx-4 min-h-[60dvh] w-[40%]">
        <Image
          src={`/cakes/${theCake.CakeStringID}.jpg`}
          alt={theCake.Type}
          width={300}
          height={300}
          className="mt-12 w-full justify-center rounded-lg"
        />
        {theCake.CakeAllergens.length > 0 && (
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold">Allergens:</h3>
            <ul className="list-disc">
              {theCake.CakeAllergens.map((allergen) => (
                <li key={allergen.AllergenID}>
                  {allergen.Allergens.AllergenName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
      <div className="h-[65dvh] border-l-2 border-[#57b0fe]" />
      <section className="mx-4 min-h-[60dvh] w-[60%]">
        <div>
          <h2 className="mb-4 text-center text-2xl font-semibold">
            {theCake.Type}
          </h2>
          <div className="mb-4">
            <label className="mb-2 block" htmlFor="size">
              Size:
            </label>
            <Select
              value={selectedSizeMultiplier}
              onValueChange={setSelectedSizeMultiplier}
            >
              <SelectTrigger id="size">
                <SelectValue placeholder="12”" />
              </SelectTrigger>
              <SelectContent position="popper">
                {sizes.map((size) => (
                  <SelectItem value={size.Price.toString()}>
                    {size.CakeSize}”
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label className="mb-2 block" htmlFor="shape">
              Shape:
            </label>
            <Select value={selectedShape} onValueChange={setSelectedShape}>
              <SelectTrigger id="shape">
                <SelectValue placeholder="Rectangular" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="rectangular">Rectangular</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-6">
            <label className="mb-2 block" htmlFor="price">
              Price:
            </label>
            <span>£{finalCakePrice}</span>
          </div>
          <Button className="w-full" onClick={submit}>
            Place Order
          </Button>
        </div>
      </section>
    </main>
  );
}

//fetches the cake id from the database and displays the error 404 page is the cake id is not found
//fetches the CakeAllergens table and the Allergens table from the database and includes it with the CakeID
//fetches the sizes table from the database
//returns the allergens for that CakeID and the CakeID itself under the variable theCake
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { cake_id } = context.query;

  if (!cake_id || isNaN(parseInt(cake_id as string, 10))) {
    return {
      notFound: true,
    };
  }

  const theCake = await db.cakes.findUnique({
    where: {
      CakeID: parseInt(cake_id as string, 10),
    },
    include: {
      CakeAllergens: {
        include: {
          Allergens: true,
        },
      },
    },
  });
  console.log(theCake);

  if (!theCake) {
    return {
      notFound: true,
    };
  }

  const sizes = await db.sizes.findMany();

  return {
    props: {
      theCake,
      sizes,
    },
  };
};
