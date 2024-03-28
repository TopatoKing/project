import { type AppType } from "next/dist/shared/lib/utils";
import {
  ClerkProvider,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

//fonts for the text
const marker = localFont({ src: "./marker.ttf" });
const copper = localFont({ src: "./copper.otf" });

//This is the main navigation bar at the top of the webpage and the main title, this includes the links to each seperate page
//the user is able to navigate to. The ability for the user to sign in and out is also displayed on this navigation bar.
//Component and pageProps are the main components of the webpage, which is the content below the main navigation bar.
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
          <main
            className={
              "container mx-auto min-h-screen min-w-[80%] max-w-4xl rounded-lg bg-[#B7DDFE] p-4"
            }
          >
            <h1
              className={cn(
                marker.className,
                "flex justify-center py-8 text-5xl",
              )}
            >
              My Cakey World
            </h1>
            <div className={cn("flex justify-evenly", copper.className)}>
              <Link className="text-lg text-black" href="/contact">
                Contact
              </Link>
              <Link className="text-lg text-black" href="/products">
                Products
              </Link>
              <Link className="text-lg text-black" href="/orders">
                Orders
              </Link>
              <Link className="text-lg text-black" href="/account">
                Account
              </Link>
              <SignedOut>
                <SignInButton>
                  <Link className="text-black" href={"#"}>
                    Sign In
                  </Link>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <SignOutButton>
                  <Link className="text-black" href={"#"}>
                    Sign Out
                  </Link>
                </SignOutButton>
              </SignedIn>
            </div>
            <hr className="my-8 h-[2px] border-0 bg-[#57b0fe]" />
            <Component {...pageProps} />
          </main>
        </div>
      </main>
      <Toaster />
    </ClerkProvider>
  );
};

//This is the main export of the file, which is the main component of the webpage
export default MyApp;
