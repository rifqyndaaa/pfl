import { useState, useEffect } from "react";
import { customerService } from "../services/customerService";

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      const newCust = await customerService.create(customerData);
      setCustomers((prev) => [newCust, ...prev]);
      return newCust;
    } catch (err) {
      console.error("Error adding customer:", err);
      throw err;
    }
  };

  const updateCustomer = async (id, updates) => {
    try {
      const updated = await customerService.update(id, updates);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
      return updated;
    } catch (err) {
      console.error("Error updating customer:", err);
      throw err;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await customerService.delete(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting customer:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    refresh: fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  };
}
