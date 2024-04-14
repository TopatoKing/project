import { authMiddleware } from "@clerk/nextjs";

/* This export allows the application to be public so the 
user does not need to be logged in to view the site */
export default authMiddleware({
  publicRoutes: ["/", "/api/createUser"],
});

/* This is a route matcher for Next.js which include API routes 
and static files */
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

/* This code is authentication middleware for this Next.js application 
which utilises Clerk, it allows certain routes to be publicly accessible 
and it provides a route matcher configuration for Next.js */