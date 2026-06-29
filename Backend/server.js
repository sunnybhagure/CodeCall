const express = require("express");

const mongoose = require("mongoose");
require("dotenv").config();



const app = express();


const cors = require('cors');
app.use(cors());
// Middleware

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

app.use("/api/users", require("./routes/userRoutes"));


app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/test", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});