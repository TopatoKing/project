import Link from "next/link";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import Image from "next/image";

const copper = localFont({ src: './copper.otf' })


export default function Account() {
    return (
        <main className="flex">
            <nav className="w-[30%] min-h-screen mx-4">
                <Link className="text-black text-lg" href="/account_details">
                    Account Details
                </Link>
                <Link className="text-black text-lg" href="/orders">
                    Orders
                </Link>

            </nav>
            <div className="border-l-2 border-[#57b0fe] h-screen"/>
            <section className="w-[70%] min-h-screen mx-4">

            </section>
        </main>
    )
}