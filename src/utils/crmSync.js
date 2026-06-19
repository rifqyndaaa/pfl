// crmSync.js - BUIQ CRM Loyalty Single Source of Truth Synchronization

const INITIAL_WISHLIST = [
  {
    id: "w1",
    name: "Premium Leather Bag",
    category: "Bags",
    price: 1800000,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80",
    inStock: true
  },
  {
    id: "w2",
    name: "Linen Dress Collection",
    category: "Dresses",
    price: 450000,
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&auto=format&fit=crop&q=80",
    inStock: true
  },
  {
    id: "w3",
    name: "Limited Edition Sneakers",
    category: "Shoes",
    price: 1250000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
    inStock: true
  },
  {
    id: "w4",
    name: "Signature Accessories Pack",
    category: "Accessories",
    price: 320000,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80",
    inStock: false
  }
];

export function getWishlist() {
  const stored = localStorage.getItem("buiq_wishlist");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("buiq_wishlist", JSON.stringify(INITIAL_WISHLIST));
  return INITIAL_WISHLIST;
}

export function syncCrmAndLoyalty() {
  // Load tables
  let customers = JSON.parse(localStorage.getItem("buiq_customers") || "null");
  let members = JSON.parse(localStorage.getItem("buiq_members") || "null");
  let orders = JSON.parse(localStorage.getItem("buiq_orders") || "null");

  // Fallbacks if not initialized
  if (!customers) {
    customers = [];
    localStorage.setItem("buiq_customers", JSON.stringify(customers));
  }
  if (!members) {
    members = [];
    localStorage.setItem("buiq_members", JSON.stringify(members));
  }
  if (!orders) {
    orders = [];
    localStorage.setItem("buiq_orders", JSON.stringify(orders));
  }

  // Ensure current logged-in member exists in buiq_customers and buiq_members
  const currentUserStr = localStorage.getItem("buiq_user");
  if (currentUserStr) {
    const currentUser = JSON.parse(currentUserStr);
    if (currentUser.role === "member" || currentUser.role === "admin") {
      const email = currentUser.email || (currentUser.role === "admin" ? "emily.johnson@x.dummyjson.com" : "member@buiq.com");
      const name = currentUser.role === "admin" ? "Emily Johnson" : `${currentUser.firstName || "Sarah"} ${currentUser.lastName || "Miller"}`;

      // Check customer
      let custIndex = customers.findIndex(c => c.email.toLowerCase() === email.toLowerCase());
      if (custIndex === -1) {
        const nextId = customers.length > 0 ? Math.max(...customers.map(c => c.customerId)) + 1 : 1;
        const newCust = {
          customerId: nextId,
          customerCode: `CUST-${String(nextId).padStart(4, "0")}`,
          customerName: name,
          email: email,
          phone: "0812-9988-5543",
          status: "Active",
          totalOrders: 0,
          totalSpent: 0,
          image: currentUser.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
        };
        customers.push(newCust);
        localStorage.setItem("buiq_customers", JSON.stringify(customers));
        custIndex = customers.length - 1;
      }

      // Check orders for Sarah
      const sarahOrders = orders.filter(o => o.customerName === name || o.customerId === customers[custIndex].customerId);
      if (sarahOrders.length === 0) {
        // Generate 4 premium fashion orders
        const mockSarahOrders = [
          {
            orderId: orders.length > 0 ? Math.max(...orders.map(o => o.orderId)) + 1 : 1,
            customerId: customers[custIndex].customerId,
            customerName: name,
            customerAvatar: customers[custIndex].image,
            product: "Linen Dress Collection",
            category: "Dresses",
            status: "Completed",
            totalPrice: 450000,
            orderDate: "2026-05-10",
            paymentMethod: "Bank Transfer"
          },
          {
            orderId: orders.length > 0 ? Math.max(...orders.map(o => o.orderId)) + 2 : 2,
            customerId: customers[custIndex].customerId,
            customerName: name,
            customerAvatar: customers[custIndex].image,
            product: "Premium Leather Bag",
            category: "Bags",
            status: "Completed",
            totalPrice: 1800000,
            orderDate: "2026-05-28",
            paymentMethod: "Credit Card"
          },
          {
            orderId: orders.length > 0 ? Math.max(...orders.map(o => o.orderId)) + 3 : 3,
            customerId: customers[custIndex].customerId,
            customerName: name,
            customerAvatar: customers[custIndex].image,
            product: "Signature Gold Earrings",
            category: "Accessories",
            status: "Completed",
            totalPrice: 250000,
            orderDate: "2026-06-02",
            paymentMethod: "ShopeePay"
          },
          {
            orderId: orders.length > 0 ? Math.max(...orders.map(o => o.orderId)) + 4 : 4,
            customerId: customers[custIndex].customerId,
            customerName: name,
            customerAvatar: customers[custIndex].image,
            product: "Oversized Denim Jacket",
            category: "Outerwear",
            status: "Completed",
            totalPrice: 650000,
            orderDate: "2026-06-12",
            paymentMethod: "GoPay"
          }
        ];

        orders.push(...mockSarahOrders);
        localStorage.setItem("buiq_orders", JSON.stringify(orders));

        // Update customer totalSpent / totalOrders
        customers[custIndex].totalOrders = mockSarahOrders.length;
        customers[custIndex].totalSpent = mockSarahOrders.reduce((sum, o) => sum + o.totalPrice, 0);
        localStorage.setItem("buiq_customers", JSON.stringify(customers));
      }
    }
  }

  // 2. Synchronize customers table into members table
  let updatedMembers = [...members];
  let membersChanged = false;

  customers.forEach(cust => {
    let memIndex = updatedMembers.findIndex(m => m.email.toLowerCase() === cust.email.toLowerCase());
    
    // Determine membership tier based on spending
    const spending = cust.totalSpent || 0;
    let tier = "Basic";
    if (spending >= 15000000) tier = "VIP";
    else if (spending >= 5000000) tier = "Gold";
    else if (spending >= 1500000) tier = "Silver";

    if (memIndex === -1) {
      const nextIdNum = updatedMembers.length > 0 
        ? Math.max(...updatedMembers.map(m => parseInt(m.memberId.split("-")[1] || 0, 10))) + 1 
        : 1;

      updatedMembers.push({
        memberId: `MEM-${String(nextIdNum).padStart(4, "0")}`,
        fullName: cust.customerName,
        email: cust.email,
        phone: cust.phone || "0812-9988-1234",
        membershipType: tier,
        status: cust.status === "VIP" ? "Active" : cust.status,
        joinDate: new Date().toISOString().split("T")[0],
        totalOrders: cust.totalOrders || 0,
        totalSpending: spending,
        image: cust.image
      });
      membersChanged = true;
    } else {
      const member = updatedMembers[memIndex];
      if (
        member.totalSpending !== spending || 
        member.totalOrders !== cust.totalOrders || 
        member.fullName !== cust.customerName || 
        member.image !== cust.image ||
        member.membershipType !== tier ||
        member.status !== (cust.status === "VIP" ? "Active" : cust.status)
      ) {
        member.totalSpending = spending;
        member.totalOrders = cust.totalOrders;
        member.fullName = cust.customerName;
        member.image = cust.image;
        member.membershipType = tier;
        member.status = cust.status === "VIP" ? "Active" : cust.status;
        membersChanged = true;
      }
    }
  });

  if (membersChanged) {
    localStorage.setItem("buiq_members", JSON.stringify(updatedMembers));
  }
}
