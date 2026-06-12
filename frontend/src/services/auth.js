import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

function persistSession(token, user) {
  localStorage.setItem("mediwise_token", token);
  localStorage.setItem("mediwise_user", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("mediwise_token");
  localStorage.removeItem("mediwise_user");
}

export const authService = {
  async signUp({ email, password, fullName }) {
    const { data } = await axios.post(`${API_BASE_URL}/auth/register/`, {
      email,
      password,
      confirm_password: password,
      full_name: fullName,
    });
    persistSession(data.token, data.user);
    return data;
  },

  async signIn({ email, password }) {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login/`, { email, password });
    persistSession(data.token, data.user);
    return data;
  },

  async signOut() {
    try {
      const token = localStorage.getItem("mediwise_token");
      if (token) {
        await axios.post(
          `${API_BASE_URL}/auth/logout/`,
          {},
          { headers: { Authorization: `Token ${token}` } }
        );
      }
    } catch (_) {
      // Ignore logout errors and keep the UI responsive in local development.
    } finally {
      clearSession();
    }
  },

  async resetPassword(email) {
    await Promise.resolve();
    return { message: `Password reset for ${email} is not configured in local demo mode.` };
  },

  async getSession() {
    const token = localStorage.getItem("mediwise_token");
    const user = localStorage.getItem("mediwise_user");
    return { token, user: user ? JSON.parse(user) : null };
  },

  async getCurrentUser() {
    const token = localStorage.getItem("mediwise_token");
    if (!token) return null;
    const { data } = await axios.get(`${API_BASE_URL}/auth/me/`, {
      headers: { Authorization: `Token ${token}` },
    });
    localStorage.setItem("mediwise_user", JSON.stringify(data));
    return data;
  },

  onAuthStateChange(callback) {
    callback("SIGNED_IN", this.getSession());
    return { unsubscribe: () => {} };
  },
};