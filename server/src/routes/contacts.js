import express from "express";
import prisma from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// GET all contacts for logged-in user
router.get("/", async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: req.user.id },
      include: { timestampedNotes: true }
    });
    res.json(contacts);
  } catch (err) {
    console.error("Error loading contacts:", err);
    res.status(500).json({ error: "Failed to load contacts" });
  }
});

// GET one contact (only if it belongs to the user)
router.get("/:id", async (req, res) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        id: Number(req.params.id),
        userId: req.user.id
      },
      include: { timestampedNotes: true }
    });
    res.json(contact);
  } catch (err) {
    console.error("Error loading contact:", err);
    res.status(500).json({ error: "Failed to load contact" });
  }
});

// CREATE new contact for logged-in user
router.post("/", async (req, res) => {
  try {
    const newContact = await prisma.contact.create({
      data: {
        name: req.body.name,
        generalNotes: req.body.generalNotes || "",
        user: {
          connect: { id: req.user.id }
        }
      }
    });
    res.status(201).json(newContact);
  } catch (err) {
    console.error("Error creating contact:", err);
    res.status(500).json({ error: "Failed to create contact" });
  }
});

// UPDATE contact (only if it belongs to the user)
router.put("/:id", async (req, res) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        id: Number(req.params.id),
        userId: req.user.id
      }
    });

    if (!contact) {
      return res.status(404).json({
        error: "Contact not found"
      });
    }

    const updatedContact = await prisma.contact.update({
      where: {
        id: contact.id
      },
      data: {
        name: req.body.name,
        generalNotes: req.body.generalNotes
      },
      include: {
        timestampedNotes: true
      }
    });

    res.json(updatedContact);

  } catch (err) {
    console.error("Error updating contact:", err);
    res.status(500).json({
      error: "Failed to update contact"
    });
  }
});

// ADD note to a contact (only if it belongs to the user)
router.post("/:id/notes", async (req, res) => {
  try {
    // First verify the contact belongs to the user
    const contact = await prisma.contact.findFirst({
      where: {
        id: Number(req.params.id),
        userId: req.user.id
      }
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    const newNote = await prisma.note.create({
      data: {
        text: req.body.text,
        contactId: contact.id
      }
    });

    res.status(201).json(newNote);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// UPDATE timestamped note
router.put("/:contactId/notes/:noteId", async (req, res) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        id: Number(req.params.contactId),
        userId: req.user.id
      }
    });

    if (!contact) {
      return res.status(404).json({
        error: "Contact not found"
      });
    }

    const updatedNote = await prisma.note.update({
      where: {
        id: Number(req.params.noteId)
      },
      data: {
        text: req.body.text
      }
    });

    const updatedContact = await prisma.contact.findFirst({
      where: {
        id: contact.id
      },
      include: {
        timestampedNotes: true
      }
    });

    res.json(updatedContact);

  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({
      error: "Failed to update note"
    });
  }
});

// DELETE timestamped note
router.delete("/:contactId/notes/:noteId", async (req, res) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        id: Number(req.params.contactId),
        userId: req.user.id
      }
    });

    if (!contact) {
      return res.status(404).json({
        error: "Contact not found"
      });
    }

    const deletedNote = await prisma.note.delete({
      where: {
        id: Number(req.params.noteId)
      }
    });

    res.json(deletedNote);

  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({
      error: "Failed to delete note"
    });
  }
});

// DELETE contact (only if it belongs to the user)
router.delete("/:id", async (req, res) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        id: Number(req.params.id),
        userId: req.user.id
      }
    });

    if (!contact) {
      return res.status(404).json({
        error: "Contact not found"
      });
    }

    // Delete related timestamped notes first
    await prisma.note.deleteMany({
      where: {
        contactId: contact.id
      }
    });

    // Delete the contact
    await prisma.contact.delete({
      where: {
        id: contact.id
      }
    });

    res.json({
      message: "Contact deleted"
    });

  } catch (err) {
    console.error("Error deleting contact:", err);
    res.status(500).json({
      error: "Failed to delete contact"
    });
  }
});

export default router;