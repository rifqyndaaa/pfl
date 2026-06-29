import { supabase } from "../lib/supabaseClient";

export const customerService = {
  async getAll() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async getByEmail(email) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(customer) {
    // Generate unique code if not provided
    if (!customer.customer_code) {
      const { data: lastCust } = await supabase
        .from("customers")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();
      const nextId = lastCust ? lastCust.id + 1 : 1;
      customer.customer_code = `CUST-${String(nextId).padStart(4, "0")}`;
    }

    const { data, error } = await supabase
      .from("customers")
      .insert([customer])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from("customers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
