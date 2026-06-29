import { useState, useEffect } from "react";
import { orderService } from "../services/orderService";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData) => {
    try {
      const newOrd = await orderService.create(orderData);
      // Re-fetch to load populated relationships (customers, products)
      await fetchOrders();
      return newOrd;
    } catch (err) {
      console.error("Error adding order:", err);
      throw err;
    }
  };

  const updateOrder = async (id, updates) => {
    try {
      const updated = await orderService.update(id, updates);
      // Re-fetch to load populated relationships
      await fetchOrders();
      return updated;
    } catch (err) {
      console.error("Error updating order:", err);
      throw err;
    }
  };

  const deleteOrder = async (id) => {
    try {
      await orderService.delete(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders,
    addOrder,
    updateOrder,
    deleteOrder
  };
}
