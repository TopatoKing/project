import { SignUp } from "@clerk/nextjs";
 
export default function SignUpPage() {
  return  <main className="flex">
  {/* main section of the page */}
  <section className="mx-4 min-h-screen flex w-full flex-col items-center">
    {/* Displays the SignUp box imported from Clerk */}
    <SignUp path="/sign-up" routing="path" />
  </section>
</main>
}