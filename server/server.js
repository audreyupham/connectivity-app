require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const PORT = 3001;

const contactsRouter = require("./routes/contacts");
app.use("/contacts", contactsRouter);

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
