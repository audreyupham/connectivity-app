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
      where: {
        userId: req.user.id
      },
      include: {
        timestampedNotes: true
      }
    });

    res.json(contacts);

  } catch (err) {
    console.error("Error loading contacts:", err);
    res.status(500).json({
      error: "Failed to load contacts"
    });
  }
});


// GET one contact
router.get("/:id", async (req, res) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        id: Number(req.params.id),
        userId: req.user.id
      },
      include: {
        timestampedNotes: true
      }
    });

    if (!contact) {
      return res.status(404).json({
        error: "Contact not found"
      });
    }

    res.json(contact);

  } catch (err) {
    console.error("Error loading contact:", err);
    res.status(500).json({
      error: "Failed to load contact"
    });
  }
});


// CREATE contact
router.post("/", async (req, res) => {
  try {
    const { name, generalNotes } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        error: "Contact name is required"
      });
    }

    const newContact = await prisma.contact.create({
      data: {
        name: name.trim(),
        generalNotes: generalNotes || "",
        user: {
          connect: {
            id: req.user.id
          }
        }
      }
    });

    res.status(201).json(newContact);

  } catch (err) {
    console.error("Error creating contact:", err);
    res.status(500).json({
      error: "Failed to create contact"
    });
  }
});


// UPDATE contact
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


// ADD note to contact
router.post("/:id/notes", async (req, res) => {
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

    if (!req.body.text || req.body.text.trim() === "") {
      return res.status(400).json({
        error: "Note cannot be empty"
      });
    }

    const newNote = await prisma.note.create({
      data: {
        text: req.body.text.trim(),
        contactId: contact.id
      }
    });

    res.status(201).json(newNote);

  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({
      error: "Failed to create note"
    });
  }
});


// UPDATE note
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


    const note = await prisma.note.findFirst({
      where: {
        id: Number(req.params.noteId),
        contactId: contact.id
      }
    });

    if (!note) {
      return res.status(404).json({
        error: "Note not found"
      });
    }


    if (!req.body.text || req.body.text.trim() === "") {
      return res.status(400).json({
        error: "Note cannot be empty"
      });
    }


    await prisma.note.update({
      where: {
        id: note.id
      },
      data: {
        text: req.body.text.trim()
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


// DELETE note
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


    const note = await prisma.note.findFirst({
      where: {
        id: Number(req.params.noteId),
        contactId: contact.id
      }
    });


    if (!note) {
      return res.status(404).json({
        error: "Note not found"
      });
    }


    const deletedNote = await prisma.note.delete({
      where: {
        id: note.id
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


// DELETE contact
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


    await prisma.note.deleteMany({
      where: {
        contactId: contact.id
      }
    });


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