// Frontend API Client for AdHoc Express Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adhoc_token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }
    return data;
};

export const api = {
    // Authentication
    auth: {
        async register(formData) {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await handleResponse(res);
            if (data.token && typeof window !== 'undefined') {
                localStorage.setItem('adhoc_token', data.token);
            }
            return data;
        },

        async login(email, password) {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await handleResponse(res);
            if (data.token && typeof window !== 'undefined') {
                localStorage.setItem('adhoc_token', data.token);
            }
            return data;
        },

        async getMe() {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(res);
        },

        logout() {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('adhoc_token');
            }
        },

        async updateProfile(updates) {
            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(updates),
            });
            return handleResponse(res);
        },
    },

    // Production Houses
    productionHouses: {
        async getAll(params = {}) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, val]) => {
                if (val !== undefined && val !== null && val !== '') {
                    searchParams.append(key, val);
                }
            });
            const url = `${API_BASE_URL}/production-houses?${searchParams.toString()}`;
            const res = await fetch(url, { headers: getAuthHeaders() });
            return handleResponse(res);
        },

        async getById(identifier) {
            const res = await fetch(`${API_BASE_URL}/production-houses/${identifier}`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(res);
        },

        async create(data) {
            const res = await fetch(`${API_BASE_URL}/production-houses`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse(res);
        },

        async update(id, updates) {
            const res = await fetch(`${API_BASE_URL}/production-houses/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(updates),
            });
            return handleResponse(res);
        },
    },

    // Enquiries & Discussions
    enquiries: {
        async getAll() {
            const res = await fetch(`${API_BASE_URL}/enquiries`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(res);
        },

        async getById(id) {
            const res = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(res);
        },

        async create(data) {
            const res = await fetch(`${API_BASE_URL}/enquiries`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse(res);
        },

        async updateStatus(id, status, quoteAmount) {
            const res = await fetch(`${API_BASE_URL}/enquiries/${id}/status`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status, quoteAmount }),
            });
            return handleResponse(res);
        },

        async addMessage(id, message) {
            const res = await fetch(`${API_BASE_URL}/enquiries/${id}/messages`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ message }),
            });
            return handleResponse(res);
        },
    },

    // Saved Houses / Bookmarks
    savedHouses: {
        async getSaved() {
            const res = await fetch(`${API_BASE_URL}/saved-houses`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(res);
        },

        async toggle(productionHouseId) {
            const res = await fetch(`${API_BASE_URL}/saved-houses/toggle`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ productionHouseId }),
            });
            return handleResponse(res);
        },
    },

    // Verification
    verification: {
        async getStatus(productionHouseId) {
            const res = await fetch(`${API_BASE_URL}/verification/${productionHouseId}`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(res);
        },

        async submit(data) {
            const res = await fetch(`${API_BASE_URL}/verification/submit`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse(res);
        },
    },
};

export default api;
