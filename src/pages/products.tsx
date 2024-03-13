import Link from "next/link";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { GetServerSideProps } from "next";
import { db } from "@/server/db";
import type { Cakes } from "@prisma/client";

const copper = localFont({ src: "./copper.otf" });

export default function Products({ cakes }: { cakes: Cakes[] }) {
  return (
    <main className="rounded-xl container mx-auto min-w-[80%] max-w-4xl bg-[#B7DDFE] p-4">
      <h2
        className={cn("mb-6 text-center text-lg text-black", copper.className)}
      >
        CLICK ON IMAGE FOR DETAILS
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {cakes.map((cake) => (
          <Link
            className="block border-4 border-[#57b0fe] p-4 text-center"
            href={`/products/${cake.CakeID}`}
          >
            <Image
              alt={cake.Type}
              className="mx-auto mb-2"
              height="150"
              src={`/cakes/${cake.CakeStringID}.jpg`}
              style={{
                aspectRatio: "150/150",
                objectFit: "cover",
              }}
              width="150"
            />
            <span>{cake.Type}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cakes = await db.cakes.findMany();
  return {
    props: {
      cakes,
    },
  };
};
