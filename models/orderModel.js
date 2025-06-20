const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    uuid: { type: DataTypes.STRING, allowNull: false }, // ✅ renamed to uuid
    restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
    payment_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    delivery_address: { type: DataTypes.STRING, allowNull: false },
    items: { type: DataTypes.JSON, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

module.exports = Order;
