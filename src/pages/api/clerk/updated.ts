import { NextApiRequest, NextApiResponse } from "next";
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
			data.email_addresses[0]!.email_address.endsWith("@mycakeyworld.me")
		) {
			admin = true;
		}

		try {
			await db.$executeRaw`UPDATE Users 
	SET 
    UserForename = ${data.first_name},
    UserSurname = ${data.last_name},
    UserEmail = ${data.email_addresses[0]!.email_address},
    IsUserStaff = ${admin}
	WHERE 
		UserID = ${data.id}`;

			res.status(201).json({
				message: "User updated successfully",
			});
		} catch (error) {
			console.error("Error updating user:", error);
			res.status(500).json({ error: "Error updating user" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}