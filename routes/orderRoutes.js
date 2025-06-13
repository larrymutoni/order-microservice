const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const db = require("../config/db");

/**
 * @swagger
 * /orders/ping-db:
 *   get:
 *     summary: Test the DB connection
 *     responses:
 *       200:
 *         description: Successful DB ping
 *       500:
 *         description: Database connection error
 */
router.get("/ping-db", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT 1 + 1 AS result");
    res.json({ success: true, result: rows[0].result });
  } catch (error) {
    console.error("Ping DB error:", error);
    res
      .status(500)
      .json({ success: false, error: error.message || "Unknown error" });
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               restaurant_id:
 *                 type: integer
 *                 example: 5
 *               payment_id:
 *                 type: integer
 *                 example: 10
 *               delivery_address:
 *                 type: string
 *                 example: "123 Avenue A"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     item_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post("/", orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     responses:
 *       200:
 *         description: A list of all orders
 */
router.get("/", orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
router.get("/:id", orderController.getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update the status of an order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "delivered"
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 */
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
