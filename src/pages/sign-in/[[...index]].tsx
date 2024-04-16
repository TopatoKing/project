import { SignIn } from "@clerk/nextjs";
 
export default function SignInPage() {
  return  <main className="flex">
  {/* main section of the page */}
  <section className="mx-4 min-h-screen flex w-full flex-col items-center">
    {/* Displays the SignIn box imported from Clerk */}
    <SignIn path="/sign-in" routing="path" />
  </section>
</main>
}