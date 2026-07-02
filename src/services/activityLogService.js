import { supabase } from "../lib/supabaseClient";

export const activityLogService = {
  /**
   * Fetch activity logs with text search, multi-field filtering, pagination, and sorting.
   */
  async getAll({
    page = 1,
    limit = 10,
    search = "",
    module = "All",
    role = "All",
    activity = "All",
    startDate = "",
    endDate = "",
    sortBy = "created_at",
    sortDir = "desc"
  }) {
    let query = supabase
      .from("activity_logs")
      .select("*", { count: "exact" });

    // 1. Text Search (filters by user_name, activity, or description)
    if (search.trim()) {
      query = query.or(
        `user_name.ilike.%${search}%,description.ilike.%${search}%,activity.ilike.%${search}%`
      );
    }

    // 2. Filter Module
    if (module !== "All") {
      query = query.eq("module", module);
    }

    // 3. Filter Role
    if (role !== "All") {
      query = query.eq("user_role", role.toLowerCase());
    }

    // 4. Filter Activity type
    if (activity !== "All") {
      query = query.eq("activity", activity);
    }

    // 5. Date Range Filtering
    if (startDate) {
      query = query.gte("created_at", `${startDate}T00:00:00Z`);
    }
    if (endDate) {
      query = query.lte("created_at", `${endDate}T23:59:59Z`);
    }

    // 6. Sorting
    query = query.order(sortBy, { ascending: sortDir === "asc" });

    // 7. Pagination Range
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) {
      console.error("Error in activityLogService.getAll:", error);
      throw error;
    }

    return {
      data: data || [],
      total: count || 0
    };
  },

  /**
   * Manually create a new activity log (used for client-side events like Login, Logout, Voucher Redeem)
   */
  async create(logData) {
    const { data, error } = await supabase
      .from("activity_logs")
      .insert([
        {
          user_id: logData.user_id || null,
          user_name: logData.user_name || "Guest",
          user_role: logData.user_role || "guest",
          module: logData.module,
          activity: logData.activity,
          description: logData.description,
          reference_id: logData.reference_id || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error in activityLogService.create:", error);
      throw error;
    }
    return data;
  },

  /**
   * Fetch statistical summary counts for the dashboard cards.
   */
  async getStats() {
    const todayStr = new Date().toISOString().split("T")[0];

    const [totalRes, todayRes, adminRes, memberRes] = await Promise.all([
      supabase.from("activity_logs").select("*", { count: "exact", head: true }),
      supabase.from("activity_logs").select("*", { count: "exact", head: true }).gte("created_at", `${todayStr}T00:00:00Z`),
      supabase.from("activity_logs").select("*", { count: "exact", head: true }).eq("user_role", "admin"),
      supabase.from("activity_logs").select("*", { count: "exact", head: true }).eq("user_role", "member")
    ]);

    return {
      total: totalRes.count || 0,
      today: todayRes.count || 0,
      admin: adminRes.count || 0,
      member: memberRes.count || 0
    };
  }
};
