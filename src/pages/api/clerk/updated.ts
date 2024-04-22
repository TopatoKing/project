import { NextApiRequest, NextApiResponse } from "next";
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

/* this api route will be called when a user updates their account details through the 
clerk account box and will update that user's information in the Users table of the database */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {

	{/* takes the data that has been sent to this API route and defines it as Data */}
	if (req.method === "POST") {
		const { data } = req.body as Data;

		{/* Finds the user that matches the UserID and updates 
		the information in the entry */}
		try {
			await db.users.update({ 
				where: { UserID: data.id },
				data: {
					UserForename: data.first_name,
					UserSurname: data.last_name,
					UserEmail: data.email_addresses[0]!.email_address},
		});

			{/* Displays a message on the account being successfully updated */}
			res.status(201).json({
				message: "User updated successfully",
			});
			{/* Catches any errors and displays them */}
		} catch (error) {
			console.error("Error updating user:", error);
			res.status(500).json({ error: "Error updating user" });
		}
		{/* Displays a message in the clerk console when a user tries to 
		update a field that doesnt exist in the database */}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}