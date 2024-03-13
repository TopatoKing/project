import { type NextApiRequest, type NextApiResponse } from "next";
import { db } from "@/server/db";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { data } = req.body as Data;

    let admin = false;

    if (
      data.email_addresses &&
      data.email_addresses.length > 0 &&
      data.email_addresses[0] &&
      data.email_addresses[0].email_address.endsWith("@mycakeyworld.co.uk")
    ) {
      admin = true;
    }

    try {
      const newUser = await db.users.create({
        data: {
          UserID: data.id,
          UserForename: data.first_name,
          UserSurname: data.last_name,
          UserEmail: data.email_addresses?.[0]
            ? data.email_addresses[0].email_address
            : "",
          IsUserStaff: admin,
        },
      });

      res.status(201).json({
        message: "User created successfully",
        user_id: newUser.UserID,
      });
    } catch (error) {
      console.error("Error inserting user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
