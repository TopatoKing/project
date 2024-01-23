import { type AppType } from "next/dist/shared/lib/utils";
import { ClerkProvider } from '@clerk/nextjs'
import { GeistSans } from 'geist/font/sans';

import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#ae924a",
          colorText: "white",
          fontFamily: "Arial, sans-serif",
        },
      }}
    >
      <main className={GeistSans.className}>
      <Navbar/>
      <Component {...pageProps} />;
      </main>
    </ClerkProvider>
  )
  
};

export default MyApp;
