import React from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <>
      <div className="w-full h-20 bg-[#57b0fe] sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <h2>My Cakey World</h2>
            <ul className="hidden md:flex gap-x-6 text-white">
              <li>
                <Link href="/Products">
                  <p>Products</p>
                </Link>
              </li>
              <li>
                <Link href="/About us">
                  <p>About Us</p>
                </Link>
              </li>
              <li>
                <Link href="Contact">
                  <p>Contact</p>
              </Link>
              </li>
            </ul>
            <SignedIn>
            <UserButton/>
            </SignedIn>
            <SignedOut>
                <SignInButton/>
                <SignUpButton/>
            </SignedOut>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Navbar;