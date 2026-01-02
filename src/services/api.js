const API_BASE_URL = "http://localhost:8000";

// Helper function for making requests
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// User API
export const userAPI = {
  create: (userData) =>
    request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getAll: () => request("/users"),

  getById: (id) => request(`/users/${id}`), // FIXED: was "getID"
};

// Project API
export const projectAPI = {
  create: (
    projectData,
    userId // FIXED: parameter name
  ) =>
    request(`/projects?user_id=${userId}`, {
      // FIXED: removed spaces
      method: "POST",
      body: JSON.stringify(projectData),
    }),

  getAll: () => request("/projects"), // FIXED: was "getALL"

  getById: (id) => request(`/projects/${id}`), // FIXED: was "getID"

  delete: (id) =>
    request(`/projects/${id}`, {
      method: "DELETE",
    }),
};

// Task API
export const taskAPI = {
  create: (taskData) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),

  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.user_id) params.append("user_id", filters.user_id);
    if (filters.project_id) params.append("project_id", filters.project_id);
    if (filters.status) params.append("status", filters.status);

    const query = params.toString();
    return request(`/tasks${query ? `?${query}` : ""}`); // FIXED: removed extra ?
  },

  getById: (id) => request(`/tasks/${id}`), // FIXED: was "getID"

  update: (id, updates) =>
    request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  delete: (id) =>
    request(`/tasks/${id}`, {
      method: "DELETE",
    }),
};
