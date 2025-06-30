import prisma from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany();
      console.log(users);
      res.status(200).json(users);
    } catch (error) {
      console.log("Error fetching users", error);
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  } else if (req.method === "POST") {
    console.log("post req");
    try {
      const { name, email, password, phone, role } = req.body;
      const today = new Date();

      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: password,
          phone: phone,
          isActive: true,
          role: role,
          createdAt: today.toISOString(),
          lastLogin: today.toISOString(),
        },
      });
      res.status(200).json(newUser);
    } catch (error) {
      console.log("Error creating user", error);
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  } else if (req.method === "PUT") {
    console.log("update req");
    try {
      const { userId, name, email, password, phone, role, isActive } = req.body;
      const updateUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name,
          email: email,
          phone: phone,
          password: password,
          role: role,
          isActive: isActive,
        },
      });
      res.status(200).json(updateUser);
    } catch (error) {
      console.log("Error updating user", error);
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", 'UPDATE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
