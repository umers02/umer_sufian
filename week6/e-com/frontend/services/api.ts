// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   return {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` })
//   };
// };

// export const api = {
//   post: async (endpoint: string, data: any) => {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       method: 'POST',
//       headers: getAuthHeaders(),
//       body: JSON.stringify(data),
//     });
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Something went wrong');
//     }
    
//     return response.json();
//   },

//   get: async (endpoint: string) => {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     });
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Something went wrong');
//     }
    
//     return response.json();
//   }
// };




const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};

  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: 'Invalid response format' };
    }
    
    if (!res.ok) {
      // Handle 403 Forbidden specifically
      if (res.status === 403) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Access denied. Please login again.');
      }
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  },

  post: async (endpoint: string, body?: any) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: 'Invalid response format' };
    }
    
    if (!res.ok) {
      // Handle 403 Forbidden specifically
      if (res.status === 403) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Access denied. Please login again.');
      }
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  },

  patch: async (endpoint: string, body?: any) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: 'Invalid response format' };
    }
    
    if (!res.ok) {
      // Handle 403 Forbidden specifically
      if (res.status === 403) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Access denied. Please login again.');
      }
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  },
};

export default api;
