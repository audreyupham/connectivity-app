import express from "express";
import prisma from "../db.js";

const router = express.Router();

// GET all contacts
/*
router.get("/", async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      include: { timestampedNotes: true }
    });
    res.json(contacts);
  } catch (err) {
    console.error("Error loading contacts:", err);
    res.status(500).json({ error: "Failed to load contacts" });
  }
}); */

router.get("/", async (req, res) => {
  console.log("GET /contacts hit");

  try {
    const contacts = await prisma.contact.findMany({
      include: { timestampedNotes: true }
    });

    console.log("Loaded contacts:", contacts.length);
    res.json(contacts);
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);
    console.error(err.stack);

    res.status(500).json({
      error: err.message,
      code: err.code
    });
  }
});

// GET one contact
router.get("/:id", async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: Number(req.params.id) },
      include: { timestampedNotes: true }
    });
    res.json(contact);
  } catch (err) {
    console.error("Error loading contact:", err);
    res.status(500).json({ error: "Failed to load contact" });
  }
});

// POST new contact
router.post("/", async (req, res) => {
  try {
    const newContact = await prisma.contact.create({
      data: {
        name: req.body.name,
        generalNotes: req.body.generalNotes || ""
      }
    });
    res.status(201).json(newContact);
  } catch (err) {
    console.error("Error creating contact:", err);
    res.status(500).json({ error: "Failed to create contact" });
  }
});

// PUT update contact
router.put("/:id", async (req, res) => {
  try {
    const updated = await prisma.contact.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating contact:", err);
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// POST new note
router.post("/:id/notes", async (req, res) => {
  try {
    const newNote = await prisma.note.create({
      data: {
        text: req.body.text,
        contactId: Number(req.params.id)
      }
    });
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
});

export default router;
