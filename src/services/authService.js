import api from "@/services/helper/client";
import endPoints from "@/services/helper/endpoints";

export const authService = {
  /**
   * Login with credentials
   * @param {Object} data - Login credentials
   * @returns {Promise} API response
   */
  async login(data, { signal } = {}) {
    const res = await api("post", endPoints.LOGIN, data, {}, { signal });

    if (res?.status === "success") {
      return res;
    }

    throw new Error(res?.message || "Login failed");
  },

  /**
   * Request mobile OTP
   * @param {Object} data - Phone number data
   * @returns {Promise} API response
   */
  async requestMobileOtp(data, { signal } = {}) {
    const res = await api("post", endPoints.REQUEST_MOBILE_OTP, data, {}, { signal });

    if (res?.status === "success") {
      return res;
    }

    throw new Error(res?.message || "Failed to send OTP");
  },

  /**
   * Register/Signup merchant
   * @param {Object} data - Registration data
   * @returns {Promise} API response
   */
  async register(data, { signal } = {}) {
    const res = await api("post", endPoints.SIGNUP, data, {}, { signal });

    if (res?.status === "success") {
      return res;
    }

    throw new Error(res?.message || "Registration failed");
  },

  /**
   * Check if merchant exists
   * @param {Object} data - Phone number data
   * @returns {Promise} API response with exists flag
   */
  async checkMerchantExists(data, { signal } = {}) {
    const res = await api("post", endPoints.CHECK_IN, data, {}, { signal });

    if (res?.status === "success") {
      return res;
    }

    throw new Error(res?.message || "Error checking merchant");
  },

  /**
   * Verify OTP
   * @param {Object} data - OTP verification data
   * @returns {Promise} API response
   */
  async verifyOtp(data, { signal } = {}) {
    const res = await api("post", endPoints.VERIFY_OTP, data, {}, { signal });

    if (res?.status === "success") {
      return res;
    }

    throw new Error(res?.message || "OTP verification failed");
  },

  /**
   * Resend OTP
   * @param {Object} data - Phone number data
   * @returns {Promise} API response
   */
  async resendOtp(data, { signal } = {}) {
    const res = await api("post", endPoints.RESEND_OTP, data, {}, { signal });

    if (res?.status === "success") {
      return res;
    }

    throw new Error(res?.message || "Failed to resend OTP");
  },

  /**
   * Update merchant profile
   * @param {Object} data - Merchant update data
   * @returns {Promise} API response
   */
  async updateMerchant(data, id, { signal } = {}) {
    const res = await api("put", `${endPoints.UPDATE_MERCHANT}/${id}`, data, {}, { signal });

    if (res?.status === "success") {
      return res;
    }

    throw new Error(res?.message || "Error updating merchant");
  },

  /**
   * Create merchant profile
   * @param {Object} data - Merchant create data
   * @returns {Promise} API response
   */
  async createMerchant(data, { signal } = {}) {
    const res = await api("post", endPoints.CREATE_MERCHANT, data, {}, { signal });

    if (res?.status === "success") {
      return res;
    }

    throw new Error(res?.message || "Error creating merchant");
  },

  async deleteMerchant(data, { signal } = {}) {
    const res = await api("delete", endPoints.DELETE_MERCHANT, data, {}, { signal });

    if (res?.status === "success") {
      return res;
    }

    throw new Error(res?.message || "Error deleting merchant");
  },

  async getMerchantsByOwner(ownerId, categoryId = null, { signal } = {}) {
    const params = { OwnerId: ownerId };
    if (categoryId) {
      params.categoryId = categoryId;
    }
    const res = await api("get", endPoints.GET_MERCHANTS_BY_OWNER, {}, params, { signal });

    if (res?.status === "success") {
      return res;
    }

    throw new Error(res?.message || "Error fetching merchants");
  },
};

