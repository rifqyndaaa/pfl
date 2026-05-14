import { useState, useMemo } from "react";
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
  const categories = [
    "Dress",
    "Shoes",
    "Bag",
    "Accessories",
    "Outer",
  ];

  const statuses = [
    "Available",
    "Low Stock",
    "Out of Stock",
  ];

  const names = [
    "Silk Dress",
    "Nike Sneakers",
    "Leather Bag",
    "Oversized Hoodie",
    "Classic Watch",
    "Cargo Pants",
    "Denim Jacket",
    "Canvas Shoes",
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
  const [products, setProducts] =
    useState(initialProducts);

  const [showModal, setShowModal] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

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
      p.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      p.sku
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const stats = useMemo(() => {
    return {
      total: products.length,

      available: products.filter(
        (p) => p.status === "Available"
      ).length,

      lowStock: products.filter(
        (p) => p.status === "Low Stock"
      ).length,

      outStock: products.filter(
        (p) => p.status === "Out of Stock"
      ).length,

      revenue: products.reduce(
        (sum, p) => sum + p.price,
        0
      ),
    };
  }, [products]);

  const handleAddProduct = () => {
    if (
      !formData.productName ||
      !formData.price ||
      !formData.stock
    ) {
      alert("Harap isi semua field!");
      return;
    }

    const newProduct = {
      productId:
        products.length > 0
          ? Math.max(
              ...products.map((p) => p.productId)
            ) + 1
          : 1,

      sku: `PRD-${String(
        products.length + 1
      ).padStart(4, "0")}`,

      image:
        formData.imageUrl ||
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200",

      productName: formData.productName,
      category: formData.category,
      status: formData.status,
      stock: parseInt(formData.stock),
      price: parseInt(formData.price),
    };

    setProducts([newProduct, ...products]);

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
      case "Available":
        return (
          <FaCheckCircle className="text-green-500" />
        );

      case "Low Stock":
        return (
          <FaExclamationTriangle className="text-amber-500" />
        );

      case "Out of Stock":
        return (
          <FaTimesCircle className="text-rose-500" />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-6 space-y-6">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl shadow-2xl p-8">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <FaBoxOpen className="text-white text-3xl" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-white">
                BUIQ Products
              </h1>

              <p className="text-violet-100 text-sm mt-1">
                Dashboard / Products
              </p>
            </div>
          </div>

          <div className="flex gap-3">

            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-sm" />

              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/70 outline-none"
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-violet-600 px-5 py-2 rounded-xl font-bold flex items-center gap-2"
            >
              <FaPlus />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {[
          {
            label: "Total Products",
            val: stats.total,
            icon: (
              <FaBoxes className="text-blue-500 text-xl" />
            ),
          },

          {
            label: "Available",
            val: stats.available,
            icon: (
              <FaCheckCircle className="text-green-500 text-xl" />
            ),
          },

          {
            label: "Low Stock",
            val: stats.lowStock,
            icon: (
              <FaExclamationTriangle className="text-amber-500 text-xl" />
            ),
          },

          {
            label: "Revenue",
            val: `Rp ${stats.revenue.toLocaleString()}`,
            icon: (
              <FaMoneyBillWave className="text-emerald-500 text-xl" />
            ),
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-3">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {s.label}
                </p>

                <p className="text-2xl font-black text-gray-800 mt-1">
                  {s.val}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                {s.icon}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <FaArrowUp className="text-green-500" />

              <span className="text-green-600 font-bold">
                +9%
              </span>

              <span className="text-gray-400">
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div className="flex gap-2 flex-wrap">

        {[
          "All",
          "Dress",
          "Shoes",
          "Bag",
          "Accessories",
          "Outer",
        ].map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category)
            }
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              selectedCategory === category
                ? "bg-violet-500 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="bg-gray-100 text-gray-500 text-xs uppercase">

                <th className="p-4 text-left">
                  Product
                </th>

                <th className="p-4 text-left">
                  SKU
                </th>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Stock
                </th>

                <th className="p-4 text-left">
                  Price
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredProducts.map((product) => (
                <tr
                  key={product.productId}
                  className="hover:bg-violet-50 transition-all"
                >

                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-12 h-12 rounded-xl object-cover"
                      />

                      <div>
                        <div className="font-bold text-gray-800">
                          {product.productName}
                        </div>

                        <div className="text-xs text-gray-400">
                          Product ID: {product.productId}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-xl text-xs font-bold">
                      {product.sku}
                    </span>
                  </td>

                  <td className="p-4 text-gray-700 font-medium">
                    {product.category}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">

                      {getStatusIcon(product.status)}

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase
                        
                        ${
                          product.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : ""
                        }

                        ${
                          product.status === "Low Stock"
                            ? "bg-amber-100 text-amber-700"
                            : ""
                        }

                        ${
                          product.status === "Out of Stock"
                            ? "bg-rose-100 text-rose-700"
                            : ""
                        }
                        
                        `}
                      >
                        {product.status}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 font-bold text-gray-700">
                    {product.stock} pcs
                  </td>

                  <td className="p-4 font-bold text-violet-600">
                    Rp{" "}
                    {product.price.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between items-center">

          <div className="flex items-center gap-2 text-sm text-gray-500">

            <FaBoxOpen className="text-violet-500" />

            <span>
              Showing {filteredProducts.length} of{" "}
              {products.length} products
            </span>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">

          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-2">
              <FaTags className="text-violet-500 text-xl" />

              <h3 className="font-bold text-gray-800">
                Product Overview
              </h3>
            </div>

            <FaEye className="text-violet-400" />
          </div>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Available Products</span>

              <span className="font-bold text-green-600">
                {stats.available}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Low Stock</span>

              <span className="font-bold text-amber-600">
                {stats.lowStock}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Out of Stock</span>

              <span className="font-bold text-rose-600">
                {stats.outStock}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">

          <div className="flex items-center gap-2 mb-4">
            <FaMoneyBillWave className="text-emerald-500 text-xl" />

            <h3 className="font-bold text-gray-800">
              Revenue Summary
            </h3>
          </div>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Total Revenue</span>

              <span className="font-bold text-emerald-600">
                Rp{" "}
                {stats.revenue.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Average Price</span>

              <span className="font-bold text-blue-600">
                Rp{" "}
                {Math.round(
                  stats.revenue / stats.total
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}