import { UserProfile } from "@clerk/nextjs";

//UserProfile: Displays the account box from clerk "account details"
export default function Account() {
  return (
    <main className="flex">
      {/* main section of the page */}
      <section className="mx-4 min-h-screen flex w-full flex-col items-center">
        {/* Displays the UserProfile box imported from Clerk */}
        <UserProfile path="/account" routing="path" />
      </section>
    </main>
  );
}
