require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// מאפשר לפרונטאנד (React על פורט 5173) לשלוח בקשות לשרת
app.use(cors({ origin: ["http://localhost:5173","http://localhost:5174"] }));
app.use(express.json());

connectDB();

app.use(productRoutes);
app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
