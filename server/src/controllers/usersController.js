import prisma from "../db.js";

export async function createUser(req, res) {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
      },
    });

    res.json(user);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
}

//getUser
export async function getUser(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) }
    });


    res.json(user);
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({ error: "Failed to get user" });
  }
}

//updateUser
export async function updateUser(req, res) {
  try {
    const user = await prisma.user.update({
      where: {id : Number(req.params.id) },
      data: {
        email: req.body.email,
        name: req.body.name,
      }
    });

    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
}