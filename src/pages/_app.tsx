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
      {/* creates the darker background of the page */}
      <main className={cn(GeistSans.className)}>
        <div className="bg-[#57b0fe] p-8">
          {/* creates the main lighter container for the page */}
          <main className={"container mx-auto min-h-screen min-w-[80%] max-w-4xl rounded-lg bg-[#B7DDFE] p-4"}>
            {/* Company name displayed at the top of the page in the marker font */}
            <Link href="/">
              <h1 className={cn(marker.className, "flex justify-center py-8 text-5xl",)}>
               My Cakey World
              </h1>
            </Link>
            {/* div ensures the options are evenly spaced and all use the font copper */}
            <div className={cn("flex justify-evenly", copper.className)}>
              {/* Link to the contact page through contact.tsx */}
              <Link className="text-lg text-black" href="/contact">
                Contact
              </Link>
              {/* Link to the products page through products.tsx */}
              <Link className="text-lg text-black" href="/products">
                Products
              </Link>
              {/* Link to the orders page through orders.tsx */}
              <Link className="text-lg text-black" href="/orders">
                Orders
              </Link>
              {/* Link to the users account page through [[...index]].tsx located in the account folder */}
              <Link className="text-lg text-black" href="/account">
                Account
              </Link>
              {/* Sign in/out button imported from clerk */}
              <SignedOut>
                {/* sign in is displayed when no user is logged in */}
                <SignInButton>
                  {/* Link to the sign in page through [[...index]].tsx in the sign-in folder */}
                  <Link className="text-black" href="/sign-in">
                    Sign In
                  </Link>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                {/* Sign out is displayed when a user is logged in */}
                <SignOutButton>
                  {/* Signs the user out and links to the sign in page through [[...index]].tsx in the sign-in folder */}
                  <Link className="text-black" href="/sign-in">
                    Sign Out
                  </Link>
                </SignOutButton>
              </SignedIn>
            </div>
            {/* seperating line that divides the main page from the navigation bar */}
            <hr className="my-8 h-[2px] border-0 bg-[#57b0fe]" />
            {/* main page component, this is where the other pages are displayed */}
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
