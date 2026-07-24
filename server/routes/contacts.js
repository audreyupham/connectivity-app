//Prisma imports
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });


const express = require('express');
const router = express.Router();


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
    const updated = await prisma.contact.update({
        where: {id: Number(req.params.id)},
        data: req.body
    });
    res.json(updated);
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

module.exports = router;