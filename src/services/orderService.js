import { supabase } from "../lib/supabaseClient";

export const orderService = {
  async getAll() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        customers (
          full_name,
          email
        ),
        products (
          product_name,
          category
        )
      `)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        customers (
          full_name,
          email
        ),
        products (
          product_name,
          category
        )
      `)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(order) {
    // Generate order number if not provided
    if (!order.order_number) {
      const { data: lastOrder } = await supabase
        .from("orders")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();
      const nextId = lastOrder ? lastOrder.id + 1 : 1;
      order.order_number = `ORD-${String(nextId).padStart(4, "0")}`;
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([order])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
