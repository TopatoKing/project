import Head from "next/head";
import Image from "next/image";

//this is the main page as the user loads onto the website
//this is the first page the user will see before navigating to other pages with the nav bar at the top of the page
export default function home() {
  return (
    <>
      <Head>
          <title>Cakey World</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex w-full flex-col items-center px-4">
        <p className="text-m mb-2">Welcome to the My Cakey World webpage</p>
        <p className="text-m mb-2">Please use the above options to navigate our page</p>
        <Image className="rounded-lg" alt="Cakey World" height={344} src="/cake.jpg" width={816} />
      </main>
    </>
  );
}
