import Link from "next/link";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import Image from "next/image";

//font for the text
const copper = localFont({ src: "./copper.otf" });

//This is the contact page, which displays the operating hours and contact details for the company
export default function Contact() {
  return (
    <main className="mx-auto mt-8 flex w-full max-w-md flex-col items-center px-4">
      <div className="text-center text-[#03468F]">
        <h2 className="mb-4 text-xl font-semibold">Operating Hours</h2>
        <p className="text-m mb-2">Mon: 10:00 - 15:00</p>
        <p className="text-m mb-2">Tue: 09:00 - 16:00</p>
        <p className="text-m mb-2">Wed: Closed</p>
        <p className="text-m mb-2">Thu: 10:00 - 15:00</p>
        <p className="text-m mb-2">Fri: 09:00 - 15:00</p>
        <p className="text-m mb-2">Sat: Closed</p>
        <p className="text-m mb-4">Sun: 10:00 - 15:00</p>
        <p className="text-m">For any inquiries or further information</p>
        <p className="text-m">Please call us: 07765 635708</p>
        <p className="text-m">
          Please email us at:{" "}
          <a className="text-blue-600" href="#">
            cakeyworld12@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}
