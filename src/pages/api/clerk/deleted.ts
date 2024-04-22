import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "POST") {
		const { data } = req.body as {data: {id: string}};

		try {
			await db.orders.deleteMany({where: {UserID: data.id}}), await db.users.delete({where: {UserID: data.id}});

			res.status(201).json({
				message: "User deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting user:", error);
			res.status(500).json({ error: "Error deleting user" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}