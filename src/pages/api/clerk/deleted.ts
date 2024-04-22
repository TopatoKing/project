import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";

/* this is the api route that will be called when a user requests to be 
deleted and will delete the user from the database */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	
	{/* takes the data that has been sent to this API route and defines it as a string */}
	if (req.method === "POST") {
		const { data } = req.body as {data: {id: string}};

		{/* Deletes the user that matches the UserID sent to the api route */}
		try {
			await db.users.delete({where: {UserID: data.id}});

			{/* Displays a message on the account being successfully deleted */}
			res.status(201).json({
				message: "User deleted successfully",
			});
			{/* Catches any errors and displays them in the clerk console */}
		} catch (error) {
			console.error("Error deleting user:", error);
			res.status(500).json({ error: "Error deleting user" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}