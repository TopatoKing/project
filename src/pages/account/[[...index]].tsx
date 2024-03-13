import Link from "next/link";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";

//font for the text
const copper = localFont({ src: "./../copper.otf" });

//the nav element is the page selection part for the accounts page (navigation bar is on the left side of the page)
//UserProfile: Displays the account box from clerk "account details"
export default function Account() {
  return (
    <main className="flex">
      <nav className="mx-4 flex min-h-screen w-[20%] flex-col items-center">
        <Link className="text-lg text-[#0000ff]" href="/account">
          Account Details
        </Link>
        <Link className="text-lg text-black" href="/orders">
          Orders
        </Link>
      </nav>
      <div className="h-screen border-l-2 border-[#57b0fe]" />
      <section className="mx-4 min-h-screen w-[80%]">
        <div className="max-h-[10dvh]">
          <UserProfile path="/account" routing="path" />
        </div>
      </section>
    </main>
  );
}
