import { useState, useMemo } from "react";
import Card from "../components/Card";
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
  FaEye,
  FaBoxes,
} from "react-icons/fa";

const generateProducts = () => {
  const categories = ["Dress", "Shoes", "Bag", "Accessories", "Outer"];
  const statuses = ["Available", "Low Stock", "Out of Stock"];
  const names = [
    "Silk Dress", "Nike Sneakers", "Leather Bag", "Oversized Hoodie",
    "Classic Watch", "Cargo Pants", "Denim Jacket", "Canvas Shoes"
  ];
  const images = [
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
  ];

  const products = [];
  for (let i = 1; i <= 30; i++) {
    products.push({
      productId: i,
      productName: names[i % names.length],
      category: categories[i % categories.length],
      status: statuses[i % 3],
      stock: Math.floor(5 + Math.random() * 80),
      price: Math.floor(100000 + Math.random() * 1500000),
      image: images[i % images.length],
      sku: `PRD-${String(i).padStart(4, "0")}`,
    });
  }
  return products;
};

const initialProducts = generateProducts();

export default function ProductsManagement() {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("buiq_products");
    if (stored) return JSON.parse(stored);
    localStorage.setItem("buiq_products", JSON.stringify(initialProducts));
    return initialProducts;
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formData, setFormData] = useState({
    productName: "",
    category: "Dress",
    status: "Available",
    stock: "",
    price: "",
    imageUrl: "",
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = useMemo(() => {
    return {
      total: products.length,
      available: products.filter((p) => p.status === "Available").length,
      lowStock: products.filter((p) => p.status === "Low Stock").length,
      outStock: products.filter((p) => p.status === "Out of Stock").length,
      revenue: products.reduce((sum, p) => sum + p.price, 0),
    };
  }, [products]);

  const handleAddProduct = () => {
    if (!formData.productName || !formData.price || !formData.stock) {
      alert("Harap isi semua field!");
      return;
    }

    const newProduct = {
      productId: products.length > 0 ? Math.max(...products.map((p) => p.productId)) + 1 : 1,
      sku: `PRD-${String(products.length + 1).padStart(4, "0")}`,
      image: formData.imageUrl || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200",
      productName: formData.productName,
      category: formData.category,
      status: formData.status,
      stock: parseInt(formData.stock),
      price: parseInt(formData.price),
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem("buiq_products", JSON.stringify(updated));
    setFormData({
      productName: "",
      category: "Dress",
      status: "Available",
      stock: "",
      price: "",
      imageUrl: "",
    });
    setShowModal(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Available": return <FaCheckCircle className="text-emerald-500 text-xs" />;
      case "Low Stock": return <FaExclamationTriangle className="text-warning text-xs" />;
      case "Out of Stock": return <FaTimesCircle className="text-danger text-xs" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      
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
          onClick={() => setShowModal(true)}
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
          { label: "Valuation", val: `Rp ${stats.revenue.toLocaleString()}`, color: "text-emerald-600", icon: <FaMoneyBillWave /> },
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.productId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-10 h-10 rounded-lg object-cover shadow-sm border border-slate-100"
                      />
                      <div>
                        <div className="font-bold text-slate-800">{product.productName}</div>
                        <div className="text-[9px] text-slate-400">ID: {product.productId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-400">
                    <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      {product.sku}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{product.category}</td>
                  <td className="py-3 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                      ${product.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ''}
                      ${product.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                      ${product.status === 'Out of Stock' ? 'bg-rose-50 text-rose-700 border border-rose-100' : ''}
                    ">
                      {getStatusIcon(product.status)}
                      <span>{product.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-700">{product.stock} pcs</td>
                  <td className="py-3 px-4 font-bold text-primary">
                    Rp {product.price.toLocaleString()}
                  </td>
                </tr>
              ))}
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
            <FaEye className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
          </div>
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span>Available Products</span>
              <span className="font-bold text-emerald-600">{stats.available}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Low Stock Products</span>
              <span className="font-bold text-warning">{stats.lowStock}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Out of Stock Products</span>
              <span className="font-bold text-danger">{stats.outStock}</span>
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
                Rp {Math.round(stats.revenue / stats.total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-250/80 animate-slide">
            <div className="border-b border-slate-100 p-5 flex items-center gap-3 bg-slate-50">
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary text-sm">
                <FaPlus />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900">Add New Product</h2>
                <p className="text-[10px] text-slate-400">Tambahkan produk baru ke inventaris</p>
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
                  onClick={handleAddProduct}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10"
                >
                  Add Product
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 bg-slate-100 text-slate-600 hover:bg-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}