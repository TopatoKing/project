import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "POST") {
		const { data } = req.body;

		let admin = false;

		if (
			data.email_addresses[0].email_address.endsWith("@mycakeyworld.me")
		) {
			admin = true;
		}

		try {
			await db.$executeRaw`INSERT INTO users (UserID, UserForename, UserSurname, UserEmail, IsUserStaff) VALUES (${data.id}, ${data.first_name}, ${data.last_name}, ${data.email_addresses[0].email_address}, ${admin})`;

			res.status(201).json({
				message: "User created successfully",
			});
		} catch (error) {
			console.error("Error inserting user:", error);
			res.status(500).json({ error: "Error creating user" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}