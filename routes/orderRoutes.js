const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const db = require("../config/db");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Endpoints for managing orders
 */

/**
 * @swagger
 * /orders/ping-db:
 *   get:
 *     summary: Ping the database
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Database connection is working
 *       500:
 *         description: Database connection failed
 */
router.get("/ping-db", async (req, res) => {
  try {
    const [results] = await db.query("SELECT 1 + 1 AS result");
    res.json({ success: true, result: results[0].result });
  } catch (error) {
    console.error("Ping DB error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - restaurant_id
 *               - payment_id
 *               - delivery_address
 *               - items
 *             properties:
 *               user_id:
 *                 type: integer
 *               restaurant_id:
 *                 type: integer
 *               payment_id:
 *                 type: string
 *               delivery_address:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/", orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get("/", orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order data
 *       404:
 *         description: Order not found
 */
router.get("/:id", orderController.getOrderById);

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Get orders for a specific user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Orders belonging to the user
 */
router.get("/user/:userId", orderController.getOrdersByUserId);

/**
 * @swagger
 * /orders/restaurant/{restaurantId}:
 *   get:
 *     summary: Get orders for a specific restaurant
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Orders for the restaurant
 */
router.get("/restaurant/:restaurantId", orderController.getOrdersByRestaurantId);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Order not found
 */
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
