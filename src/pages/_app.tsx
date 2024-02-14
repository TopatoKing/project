import { type AppType } from "next/dist/shared/lib/utils";
import { ClerkProvider, SignInButton, SignOutButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { GeistSans } from 'geist/font/sans';
import localFont from 'next/font/local'
 import {cn} from "@/lib/utils"
 import Link from "next/link";

import "@/styles/globals.css";

const marker = localFont({ src: './marker.ttf' })
const copper = localFont({ src: './copper.otf' })

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#ae924a",
          fontFamily: "Arial, sans-serif",
        },
      }}
    >
      <main className={cn(GeistSans.className)}>
      <div className="bg-[#57b0fe] p-8">
        <main className={"max-w-4xl mx-auto p-4 container min-w-[80%] bg-[#B7DDFE] rounded-lg min-h-screen"}>
          <h1 className={cn(marker.className, "text-5xl flex justify-center py-8")}>My Cakey World</h1>
          <div className={cn("flex justify-evenly", copper.className)}>
            <Link className="text-black text-lg" href="/contact">
              Contact
            </Link>
            <Link className="text-black text-lg" href="/products">
              Products
            </Link>
            <SignedOut>
            <SignInButton>
              <Link className="text-black" href={"#"}>Sign In</Link>
            </SignInButton>
            </SignedOut>
            <SignedIn>
            <SignOutButton>
              <Link className="text-black" href={"#"}>Sign Out</Link>
            </SignOutButton>
            </SignedIn>
          </div>
          <hr className="h-[2px] my-8 bg-[#57b0fe] border-0"/>
      <Component {...pageProps} />
      </main>
      </div>
      </main>
    </ClerkProvider>
  )
  
};

export default MyApp;
