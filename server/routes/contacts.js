//Prisma imports
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');



const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });


const express = require('express');
const router = express.Router();
//Temp tests-- DEBUGGG
//console.log("Prisma client keys:", Object.keys(prisma).sort());


//GET all contacts
router.get("/", async (req, res) => {
    const contacts = await prisma.contact.findMany({
        include: { timestampedNotes: true }
    });
    res.json(contacts);
});

//GET one contact
router.get("/:id", async (req, res) => {
    const contact = await prisma.contact.findUnique({
        where: {id: Number(req.params.id)},
        include: { timestampedNotes: true}
    });
    res.json(contact);
})

//POST new contact
router.post("/", async (req, res) => {
    const newContact = await prisma.contact.create({
        data: {
            name: req.body.name,
            generalNotes: req.body.generalNotes || ""
        }
    });
    res.status(201).json(newContact);
});

//PUT update contact
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    // update contact fields
    await prisma.contact.update({
      where: { id },
      data: {
        name: req.body.name,
        generalNotes: req.body.generalNotes
      }
    });

    // fetch and return the full contact with notes
    const updatedContact = await prisma.contact.findUnique({
      where: { id },
      include: { timestampedNotes: true }
    });

    if (!updatedContact) return res.status(404).json({ error: "Contact not found" });

    res.json(updatedContact);
  } catch (err) {
    console.error("CONTACT UPDATE ERROR:", err);
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    res.status(500).json({ error: "Server error" });
  }
});

//POST new note
router.post("/:id/notes", async (req, res) => {
    
    const newNote = await prisma.note.create({
        data: {
            text: req.body.text,
            contactId: Number(req.params.id)
        }
    });
    res.status(201).json(newNote);
});

// PUT updated note
router.put("/:contactId/notes/:noteId", async (req, res) => {
  try {
    const updatedNote = await prisma.note.update({
      where: { id: Number(req.params.noteId) },
      data: { text: req.body.text }
    });

    const updatedContact = await prisma.contact.findUnique({
      where: { id: Number(req.params.contactId)},
      include: { timestampedNotes: true}
    });

    res.json(updatedContact);
  } catch (err) {
    console.error("NOTE UPDATE ERROR:", err);
    res.status(404).json({ error: "Note not found" });
  }
});

// DELETE note
router.delete("/:contactId/notes/:noteId", async (req, res) => {
  try {
    await prisma.note.delete({
      where: { id: Number(req.params.noteId) }
    });
    res.status(204).send();
  } catch (err) {
    console.error("NOTE DELETE ERROR:", err);
    res.status(404).json({ error: "Note not found" });
  }
});

// DELETE /contacts/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    // delete notes then contact in a transaction
    await prisma.$transaction([
      prisma.note.deleteMany({ where: { contactId: id } }),
      prisma.contact.delete({ where: { id } })
    ]);

    // 204 No Content
    return res.status(204).send();
  } catch (err) {
    console.error("CONTACT DELETE ERROR:", err);
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    return res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;