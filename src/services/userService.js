import { supabase } from "../lib/supabaseClient";

export const userService = {
  /**
   * Fetch all registered users from the database.
   * Calls the get_users RPC which joins auth.users with public.profiles.
   */
  async getAll() {
    const { data, error } = await supabase.rpc("get_users");
    if (error) {
      console.error("Error in userService.getAll:", error);
      throw error;
    }
    return data;
  },

  /**
   * Update user details in public.profiles (full_name, role).
   */
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    if (error) {
      console.error("Error in userService.updateProfile:", error);
      throw error;
    }
    return data;
  },

  /**
   * Enable or disable a user account by toggling its banned status.
   * @param {string} userId - The uuid of the user to toggle.
   * @param {boolean} ban - True to disable (ban), False to enable.
   */
  async toggleStatus(userId, ban) {
    const { error } = await supabase.rpc("toggle_user_status", {
      user_id: userId,
      ban: ban
    });
    if (error) {
      console.error("Error in userService.toggleStatus:", error);
      throw error;
    }
  },

  /**
   * Perform a soft-delete on a user account.
   * Deletes the customer record & related orders, and disables auth login.
   * @param {string} userId - The uuid of the user to delete.
   */
  async deleteUser(userId) {
    const { error } = await supabase.rpc("delete_user_account", {
      user_id: userId
    });
    if (error) {
      console.error("Error in userService.deleteUser:", error);
      throw error;
    }
  }
};
