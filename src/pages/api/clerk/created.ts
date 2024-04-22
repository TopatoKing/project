import { type NextApiRequest, type NextApiResponse } from "next";
import { db } from "@/server/db";

//this is the data that will be sent to the api route
type Data = {
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email_addresses: {
      email_address: string;
    }[];
  };
};

/*this api route will be called when a new user is created user logs in and will insert a new user
 into the database and send a success message or an error message back to be stored in the clerk console.
  It will also check if the user is an admin and set the IsUserStaff field to true if they are */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  {/* takes the data that has been sent to this API route and defines it as Data */}
  if (req.method === "POST") {
    const { data } = req.body as Data;

    {/* Users data that will be placed into a new entry in the users table */}
    try {
      const newUser = await db.users.create({
        data: {
          UserID: data.id,
          UserForename: data.first_name,
          UserSurname: data.last_name,
          UserEmail: data.email_addresses[0]!.email_address,
          IsUserStaff: data.email_addresses[0]!.email_address.endsWith(
            "@mycakeyworld.co.uk",
          ),
        },
      });

      {/* Displays a message on the successful creation of an account */}
      res.status(201).json({
        message: "User created successfully",
        user_id: newUser.UserID,
      });
      {/* Catches any errors and displays them */}
    } catch (error) {
      console.error("Error inserting user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
