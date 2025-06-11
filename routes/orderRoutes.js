const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const db = require('../config/db');

// ⚠️ Define this BEFORE `/:id`
router.get('/ping-db', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT 1 + 1 AS result');
    res.json({ success: true, result: rows[0].result });
  } catch (error) {
    console.error('Ping DB error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
