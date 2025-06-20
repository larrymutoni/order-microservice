const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticateJWT = require("../middleware/authenticateJWT");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /orders/ping-db:
 *   get:
 *     summary: Ping the database
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Database is responsive
 */
router.get("/ping-db", async (req, res) => {
  try {
    const [results] = await require("../config/db").query("SELECT 1 + 1 AS result");
    res.json({ success: true, result: results[0].result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurant_id
 *               - payment_id
 *               - delivery_address
 *               - items
 *             properties:
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
router.post("/", authenticateJWT, orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (no auth)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get("/", orderController.getOrders);

/**
 * @swagger
 * /orders/my-orders:
 *   get:
 *     summary: Get my orders (user's own)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders for the logged-in user
 */
router.get("/my-orders", authenticateJWT, orderController.getMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
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
 *         description: Order found
 */
router.get("/:id", orderController.getOrderById);

/**
 * @swagger
 * /orders/restaurant/{restaurantId}:
 *   get:
 *     summary: Get orders for a restaurant
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Orders found
 */
router.get("/restaurant/:restaurantId", orderController.getOrdersByRestaurantId);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update status of an order
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
 */
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
