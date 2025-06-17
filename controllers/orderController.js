const Order = require("../models/orderModel");

// Create a new order
exports.createOrder = async (req, res) => {
  const { user_id, restaurant_id, payment_id, delivery_address, items } = req.body;

  if (!user_id || !restaurant_id || !payment_id || !delivery_address || !items) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existing = await Order.findOne({ where: { payment_id } });
    if (existing) {
      return res.status(409).json({ error: "Order already exists for this payment" });
    }

    const newOrder = await Order.create({
      user_id,
      restaurant_id,
      payment_id,
      delivery_address,
      items,
    });

    res.status(201).json({ orderId: newOrder.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get all orders (use with caution - admin/internal only)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get one order by ID
exports.getOrderById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Get orders for a specific user
exports.getOrdersByUserId = async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });

  try {
    const orders = await Order.findAll({ where: { user_id: userId } });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

// Get orders for a specific restaurant
exports.getOrdersByRestaurantId = async (req, res) => {
  const restaurantId = parseInt(req.params.restaurantId);
  if (isNaN(restaurantId)) return res.status(400).json({ error: "Invalid restaurant ID" });

  try {
    const orders = await Order.findAll({ where: { restaurant_id: restaurantId } });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch restaurant orders" });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Status updated", orderId: id, newStatus: status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
};
