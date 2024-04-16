import { toast } from "@/components/ui/use-toast";
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

//make a type for the data that is returned from the database server
interface FinalCake extends Cakes {
  CakeAllergens: {
    AllergenID: number;
    Allergens: {
      AllergenName: string;
    };
  }[];
}

/*this is the page for the product selected from the products page
it displays the cake image, allergens, size, shape and price
it also allows the user to place an order for the selected cake
if the user is not logged in they will not be able to place an order*/

export default function SearchPage({
  theCake,
  sizes,
}: {
  theCake: FinalCake;
  sizes: Sizes[];
}) {
  console.log(sizes);

  //Variable that displays the price of the selected items
  const [finalCakePrice, setFinalCakePrice] = useState(
    theCake.TypePrice.toPrecision(2),
  );

  //size, shape and quantity variables with their respective default values
  const [selectedSizeMultiplier, setSelectedSizeMultiplier] = useState("1");
  const [selectedShape, setSelectedShape] = useState("circle");
  const [selectedquantity, setSelectedQuantity] = useState("1");
  const { userId } = useAuth();

  //variables for the place order and confirm order buttons
  const [placeOrderPressed, setPlaceOrderPressed] = useState(false);
  const [confirmOrderPressed, setConfirmOrderPressed] = useState(false);

  /* changes the value of the price depending on what the user has selected for type, 
  size and quantity */
  useEffect(() => {
    const price =
      theCake.TypePrice *
      parseFloat(selectedSizeMultiplier) *
      parseInt(selectedquantity, 10);

    setFinalCakePrice(price.toString());
  }, [selectedSizeMultiplier, selectedquantity, theCake.TypePrice]);

  //sets the default displayed value of the price to the selected cake types base price
  useEffect(() => {
    if (Number.isNaN(parseFloat(finalCakePrice))) {
      setFinalCakePrice(theCake.TypePrice.toPrecision(2));
    }
  });

  //function submits the chosen values of type, size, shape, quantity, price and UserID to the createOrder API
  async function submit() {
    setConfirmOrderPressed(true)
    const order = await fetch("/api/createOrder", {
      method: "POST",
      body: JSON.stringify({
        UserID: userId,
        CakeNumber: theCake.CakeID,
        CakeSize:
          sizes.find((size) => size.Price.toString() === selectedSizeMultiplier)
            ?.CakeSize ?? 0,
        CakeShape: selectedShape,
        CakePriceTotal: finalCakePrice,
        OrderQuantity: selectedquantity,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    {/* Displays a pop-up in the bottom corner of the page to notify the user of the order status */}
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
      {/* sections off the left sitde of the page for the image and allergens */}
      <nav className="mx-4 min-h-[60dvh] w-[40%]">
        {/* fetches the image of the selected cake from the database and displays it */}
        <Image
          src={`/cakes/${theCake.CakeStringID}.jpg`}
          alt={theCake.Type}
          width={300}
          height={300}
          className="mt-12 w-full justify-center rounded-lg"
        />
        {/* Fetches the allergens of the selected cake from the database and displays them */}
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
      {/* sections off the right side of the page for the order details and places a dividing line 
      for the left and right */}
      <div className="h-[65dvh] border-l-2 border-[#57b0fe]" />
      <section className="mx-4 min-h-[60dvh] w-[60%]">
        <div>
          <h2 className="mb-4 text-center text-2xl font-semibold">
            {theCake.Type}
          </h2>
          {/* Selecter box and values extracted from the database for the size of the cake */}
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
                  <SelectItem value={size.Price.toString()} key={size.Price}>
                    {size.CakeSize}”
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Selecter box and values for the shape of the cake */}
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
          {/* Selecter box for the quantity of the order */}
          <div className="mb-4">
            <label className="mb-2 block" htmlFor="quantity">
              Quantity:
            </label>
            <Select
              value={selectedquantity.toString()}
              onValueChange={setSelectedQuantity}
            >
              <SelectTrigger id="quantity">
                <SelectValue placeholder="1" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Text and value for the calculated price of the order */}
          <div className="mb-6">
            <label className="mb-2 block" htmlFor="price">
              Price:
            </label>
            <span>£{finalCakePrice}</span>
          </div>
          {/* Place order button which unlocks the confirm order button */}
          <Button className="w-full" 
          onClick={() =>setPlaceOrderPressed(true)} 
          disabled={placeOrderPressed} >
            Place Order
          </Button>
          {/* Confirm order button is unlocked when Placer Order button is pressed, this 
          sends the inputed values to the submit function */}
          <Button className="w-full" 
          onClick={submit} 
          disabled={!placeOrderPressed || confirmOrderPressed}>
            Confirm Order
          </Button>
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  {/* Fetches the cake id from the database and displays the error 404 page is the cake 
id is not found. */}
  const { cake_id } = context.query;

  if (!cake_id || isNaN(parseInt(cake_id as string, 10))) {
    return {
      notFound: true,
    };
  }

  {/* Fetches the CakeAllergens table and the Allergens table from the database and 
includes it with the CakeID. */}
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

  {/* Displays error 404 page if the cake allergens are not found */}
  if (!theCake) {
    return {
      notFound: true,
    };
  }

  {/* Fetches the sizes table from the database. */}
  const sizes = await db.sizes.findMany();

  {/* Returns the allergens for that CakeID and the CakeID itself under the variable 
theCake. Along with the sizes table */}
  return {
    props: {
      theCake,
      sizes,
    },
  };
};
