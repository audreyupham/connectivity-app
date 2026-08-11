import prisma from "../db.js";

export async function updateUser(req, res) {
  try {
    if (!req.body.name || req.body.name.trim() === "") {
      return res.status(400).json({
        error: "Name cannot be empty"
      });
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        name: req.body.name
      }
    });
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.error("Error updating user:", err);

    res.status(500).json({
      error: "Failed to update profile"
    });
  }
}