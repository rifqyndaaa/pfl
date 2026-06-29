import { useState, useEffect } from "react";
import { productService } from "../services/productService";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const newProd = await productService.create(productData);
      setProducts((prev) => [newProd, ...prev]);
      return newProd;
    } catch (err) {
      console.error("Error adding product:", err);
      throw err;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const updated = await productService.update(id, updates);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
      return updated;
    } catch (err) {
      console.error("Error updating product:", err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
}
