import api from './api';

export const productService = {
  async getTopSellingProducts(limit: number = 8) {
    try {
      const response = await api.get(`/products/top-selling?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top selling products:', error);
      return [];
    }
  },

  async getAllProducts() {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async getProductById(id: string) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
};