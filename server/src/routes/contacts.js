import express from "express";
import prisma from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Protect all routes
router.use(authMiddleware);


// GET all contacts for logged-in user
router.get("/", async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        timestampedNotes: true
      },
      orderBy: {
        lastActivityAt: "desc"
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

//searchbar
router.get("/search", async (req, res) => {
  try {
    const search = req.query.q?.trim();

    if (!search) {
      return res.json([]);
    }

    const contacts = await prisma.contact.findMany({
      where: {
        userId: req.user.id,
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            generalNotes: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            timestampedNotes: {
              some: {
                text: {
                  contains: search,
                  mode: "insensitive"
                }
              }
            }
          }
        ]
      },

      include: {
        timestampedNotes: {
          where: {
            text: {
              contains: search,
              mode: "insensitive"
            }
          },
          orderBy: {
            timestamp: "desc"
          },
          take: 3
        }
      },

      orderBy: {
        lastActivityAt: "desc"
      }
    });

    res.json(contacts);

  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({
      error: "Search failed"
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
        },
        lastActivityAt: new Date()
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
        generalNotes: req.body.generalNotes,
        lastActivityAt: new Date()
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

    await prisma.contact.update({
      where: {
        id: contact.id
      },
      data: {
        lastActivityAt: new Date()
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

    await prisma.contact.update({
      where: {
        id: contact.id
      },
      data: {
        lastActivityAt: new Date()
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

// UPLOAD / REPLACE contact image
router.post("/:id/image", upload.single("image"), async (req, res) => {
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

if (!req.file) {
  return res.status(400).json({
    error: "No image uploaded"
  });
}

// Upload new image to Cloudinary
const result = await new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "connectivity-app",
      transformation: [
        {
          width: 300,
          height: 300,
          crop: "fill",
          gravity: "center"
        }
      ],
      format: "jpg",
      quality: "auto"
    },
    (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }
  );

  uploadStream.end(req.file.buffer);
});

// Save the old Cloudinary public ID before replacing it
const oldImagePublicId = contact.imagePublicId;

// Save the new Cloudinary URL and public ID
const updatedContact = await prisma.contact.update({
  where: {
    id: contact.id
  },

  data: {
    imageUrl: result.secure_url,
    imagePublicId: result.public_id,
    lastActivityAt: new Date()
  },

  include: {
    timestampedNotes: true
  }
});

// Delete the old Cloudinary image after the new one
// has successfully uploaded and been saved.
if (oldImagePublicId) {
  try {
    const deleteResult = await cloudinary.uploader.destroy(
      oldImagePublicId
    );

    console.log("Cloudinary delete result:", deleteResult);
    console.log("Old Cloudinary public ID:", oldImagePublicId);
  } catch (deleteError) {
    console.error(
      "Could not delete old Cloudinary image:",
      deleteError
    );
  }
}

res.json(updatedContact);

} catch (err) {
console.error("Error uploading image:", err);

res.status(500).json({
  error: "Failed to upload image"
});

}
});

// REMOVE contact image
router.delete("/:id/image", async (req, res) => {
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

    if (contact.imagePublicId) {
      try {
        const deleteResult = await cloudinary.uploader.destroy(
          contact.imagePublicId
        );

        console.log(
          "Cloudinary image removed:",
          contact.imagePublicId,
          deleteResult
        );
      } catch (deleteError) {
        console.error(
          "Could not remove Cloudinary image:",
          deleteError
        );
      }
    }

    // Remove image reference from database
    const updatedContact = await prisma.contact.update({
      where: {
        id: contact.id
      },

      data: {
        imageUrl: null,
        imagePublicId: null,
        lastActivityAt: new Date()
      },

      include: {
        timestampedNotes: true
      }
    });

    res.json(updatedContact);
  } catch (err) {
    console.error("Error removing image:", err);

    res.status(500).json({
      error: "Failed to remove image"
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

    await prisma.contact.update({
      where: {
        id: contact.id
      },
      data: {
        lastActivityAt: new Date()
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

    // Delete contact's image
    if (contact.imagePublicId) {
      try {
        const deleteResult = await cloudinary.uploader.destroy(
          contact.imagePublicId
        );

        console.log(
          "Cloudinary image removed with contact:",
          contact.imagePublicId,
          deleteResult
        );
      } catch (deleteError) {
        console.error(
          "Could not remove Cloudinary image:",
          deleteError
        );
      }
    }

    // Notes are deleted automatically because of
    // onDelete: Cascade in the Prisma schema.
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