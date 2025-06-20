require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const orderRoutes = require("./routes/orderRoutes");
const sequelize = require("./config/db");
const setupSwagger = require("./swagger/swagger"); // ← add this line

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

setupSwagger(app); // ← mount Swagger at /api-docs

app.use("/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Order Microservice is running!");
});

sequelize
  .sync() // Set force to false to avoid dropping tables on every restart
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync DB:", err);
  });
