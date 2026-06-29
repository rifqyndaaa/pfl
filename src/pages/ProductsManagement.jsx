import { useState, useMemo } from "react";
import Card from "../components/Card";
import { useProducts } from "../hooks/useProducts";
import {
  FaBoxOpen,
  FaSearch,
  FaPlus,
  FaMoneyBillWave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaTags,
  FaArrowUp,
  FaBoxes,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function ProductsManagement() {
  const {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct
  } = useProducts();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formData, setFormData] = useState({
    productName: "",
    category: "Dress",
    status: "Available",
    stock: "0",
    price: "0",
    imageUrl: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const nameMatch = p.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const codeMatch = p.product_code?.toLowerCase().includes(searchTerm.toLowerCase()) || false;

      const matchesSearch = nameMatch || codeMatch;
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const stats = useMemo(() => {
    const totalRevenue = products.reduce((sum, p) => sum + parseFloat(p.price || 0) * parseInt(p.stock || 0), 0);
    return {
      total: products.length,
      available: products.filter((p) => p.status === "Available").length,
      lowStock: products.filter((p) => p.status === "Low Stock").length,
      outStock: products.filter((p) => p.status === "Out of Stock").length,
      revenue: totalRevenue,
    };
  }, [products]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      productName: "",
      category: "Dress",
      status: "Available",
      stock: "0",
      price: "0",
      imageUrl: ""
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      productName: prod.product_name,
      category: prod.category || "Dress",
      status: prod.status || "Available",
      stock: String(prod.stock || 0),
      price: String(prod.price || 0),
      imageUrl: prod.image_url || ""
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await deleteProduct(id);
      } catch (err) {
        alert("Gagal menghapus produk: " + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productName || !formData.price || !formData.stock) {
      alert("Nama produk, harga, dan stok harus diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        product_name: formData.productName,
        category: formData.category,
        status: formData.status,
        stock: parseInt(formData.stock || 0),
        price: parseFloat(formData.price || 0),
        image_url: formData.imageUrl || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200"
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      setShowModal(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Available": return <FaCheckCircle className="text-emerald-500 text-xs" />;
      case "Low Stock": return <FaExclamationTriangle className="text-amber-500 text-xs" />;
      case "Out of Stock": return <FaTimesCircle className="text-rose-500 text-xs" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <ImSpinner2 className="animate-spin text-primary text-2xl" />
        <span className="text-xs text-slate-500 font-semibold">Mengambil data produk...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-4 rounded-2xl font-medium flex items-center gap-2">
          <FaExclamationTriangle className="shrink-0" />
          <span>Error loading data: {error}</span>
        </div>
      )}

      {/* CONTROLS HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search by SKU or name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-50 overflow-x-auto max-w-full">
            {["All", "Dress", "Shoes", "Bag", "Accessories", "Outer"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleOpenAddModal}
          className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <FaPlus size={11} />
          <span>Add Product</span>
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", val: stats.total, color: "text-primary", icon: <FaBoxes /> },
          { label: "Available", val: stats.available, color: "text-emerald-500", icon: <FaCheckCircle /> },
          { label: "Low Stock", val: stats.lowStock, color: "text-warning", icon: <FaExclamationTriangle /> },
          { label: "Inventory Valuation", val: `Rp ${stats.revenue.toLocaleString()}`, color: "text-emerald-600", icon: <FaMoneyBillWave /> },
        ].map((s, i) => (
          <Card key={i}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {s.label}
                </p>
                <p className="text-xl font-black text-slate-800 mt-1">
                  {s.val}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-slate-50 ${s.color} flex items-center justify-center text-sm`}>
                {s.icon}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
              <FaArrowUp className="text-emerald-500" />
              <span className="text-emerald-600 font-bold">+9%</span>
              <span>vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="w-10 h-10 rounded-lg object-cover shadow-sm border border-slate-100"
                      />
                      <div>
                        <div className="font-bold text-slate-800">{product.product_name}</div>
                        <div className="text-[9px] text-slate-400">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-400">
                    <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      {product.product_code}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{product.category}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                      ${product.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ''}
                      ${product.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                      ${product.status === 'Out of Stock' ? 'bg-rose-50 text-rose-700 border border-rose-100' : ''}
                    `}>
                      {getStatusIcon(product.status)}
                      <span>{product.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-700">{product.stock} pcs</td>
                  <td className="py-3 px-4 font-bold text-primary">
                    Rp {parseFloat(product.price).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-1.5 bg-slate-50 border border-slate-200 hover:border-primary hover:bg-primary-light hover:text-primary rounded-lg text-slate-500 cursor-pointer transition-all"
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        className="p-1.5 bg-slate-50 border border-slate-200 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-500 cursor-pointer transition-all"
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                    No matching products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="border-t border-slate-100 py-3.5 px-4 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <FaBoxOpen className="text-primary" />
            <span>Showing {filteredProducts.length} of {products.length} products</span>
          </div>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FaTags className="text-primary text-sm" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Product Overview</h3>
            </div>
          </div>
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span>Available Products</span>
              <span className="font-bold text-emerald-600">{stats.available}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Low Stock Products</span>
              <span className="font-bold text-amber-600">{stats.lowStock}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Out of Stock Products</span>
              <span className="font-bold text-rose-600">{stats.outStock}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <FaMoneyBillWave className="text-emerald-500 text-sm" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Inventory Value</h3>
          </div>
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span>Total Value</span>
              <span className="font-bold text-emerald-600">Rp {stats.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Average Product Price</span>
              <span className="font-bold text-primary">
                Rp {Math.round(products.length > 0 ? stats.revenue / products.length : 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ADD/EDIT PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-250/80 animate-slide">
            <div className="border-b border-slate-100 p-5 flex items-center gap-3 bg-slate-50">
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary text-sm">
                <FaPlus />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-[10px] text-slate-400">
                  {editingProduct ? "Perbarui rincian inventaris produk" : "Tambahkan produk baru ke inventaris"}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Silk Dress"
                  className="buiq-input"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category</label>
                <select
                  className="buiq-input bg-white"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Dress</option>
                  <option>Shoes</option>
                  <option>Bag</option>
                  <option>Accessories</option>
                  <option>Outer</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                <select
                  className="buiq-input bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option>Available</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Stock Amount</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  className="buiq-input"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Price (Rp)</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  className="buiq-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Image URL (optional)</label>
                <input
                  type="text"
                  placeholder="Paste Unsplash image URL"
                  className="buiq-input"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting && <ImSpinner2 className="animate-spin text-sm" />}
                  <span>{editingProduct ? "Save Changes" : "Add Product"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 bg-slate-100 text-slate-600 hover:bg-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}