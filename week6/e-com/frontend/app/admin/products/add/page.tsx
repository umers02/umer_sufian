'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/admin/AdminSidebar';
import AdminHeader from '../../../../components/admin/AdminHeader';
import { ProductFormData } from '../../../../types/product';

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    brand: '',
    sku: '',
    stock: '',
    regularPrice: '',
    salePrice: '',
    tags: [],
    isOnSale: false,
    type: 'regular',
    pointsPrice: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add tag when pressing Enter
  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
      setTagInput('');
    }
  };

  // Add tag to array
  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  // Remove tag from array
  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Image upload handling
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleDone = async () => {
    setLoading(true);

    try {
      // Validation
      if (!formData.name || !formData.description || !formData.regularPrice || !formData.stock) {
        alert('Please fill all required fields');
        setLoading(false);
        return;
      }

      const fd = new FormData();

      // Required fields
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('price', Number(formData.regularPrice).toString());
      fd.append('stock', Number(formData.stock).toString());
      fd.append('type', formData.type);

      // Points price for loyalty_only or hybrid products
      if ((formData.type === 'loyalty_only' || formData.type === 'hybrid') && formData.pointsPrice) {
        fd.append('pointsPrice', Number(formData.pointsPrice).toString());
      }

      // Sale Price & isOnSale
      if (formData.salePrice && formData.salePrice.trim() !== '') {
        fd.append('salePrice', Number(formData.salePrice).toString());
        fd.append('isOnSale', 'true');
      } else {
        fd.append('isOnSale', 'false');
      }

      // Optional fields
      if (formData.category) fd.append('category', formData.category);
      if (formData.brand) fd.append('brand', formData.brand);
      if (formData.sku) fd.append('sku', formData.sku);

      // Tags array - only append if tags exist
      if (formData.tags && formData.tags.length > 0) {
        formData.tags.forEach((tag) => fd.append('tags', tag));
      }

      // Images
      images.forEach((img) => fd.append('images', img));

      // Auth token
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        throw new Error(
          Array.isArray(err.message) ? err.message.join(', ') : err.message
        );
      }

      alert('Product added successfully');
      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      alert(`Failed to save product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset form and navigate back
  const handleCancel = () => {
    router.push('/admin/products');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
            <nav className="text-sm text-gray-500">
              Home &gt; All Products &gt; Add New Product
            </nav>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Type name here"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Type description here"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Type category here"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Type brand name here"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* SKU & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Fox-3983"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="1258"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Price & Sale Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regular Price
                    </label>
                    <input
                      type="number"
                      name="regularPrice"
                      value={formData.regularPrice}
                      onChange={handleInputChange}
                      placeholder="₹1000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price
                    </label>
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      placeholder="₹450"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Product Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'regular' | 'loyalty_only' | 'hybrid'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="regular">Regular (Cash Only)</option>
                    <option value="loyalty_only">Loyalty Points Only</option>
                    <option value="hybrid">Hybrid (Cash or Points)</option>
                  </select>
                </div>

                {/* Points Price - Show only for loyalty_only or hybrid */}
                {(formData.type === 'loyalty_only' || formData.type === 'hybrid') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points Price
                    </label>
                    <input
                      type="number"
                      name="pointsPrice"
                      value={formData.pointsPrice}
                      onChange={handleInputChange}
                      placeholder="500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={formData.type === 'loyalty_only'}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.type === 'loyalty_only' 
                        ? 'This product can only be purchased with points'
                        : 'Users can buy this product with either cash or points'
                      }
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 min-h-[100px]">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-800 text-white px-3 py-1 rounded text-sm flex items-center gap-2"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-white hover:text-red-300"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                      placeholder="Type tag and press Enter"
                      className="w-full px-3 py-2 border-0 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-6">
                <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📷</div>
                    <p>Product Image Preview</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Gallery
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                    <div className="text-blue-500 text-4xl mb-2">🖼️</div>
                    <p className="text-gray-600 mb-2">Drop your images here, or browse</p>
                    <p className="text-sm text-gray-500 mb-4">Jpeg, png are allowed</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                    >
                      Browse Files
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="space-y-3">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 rounded"></div>
                            <div>
                              <p className="text-sm font-medium">{image.name}</p>
                              <div className="w-32 h-1 bg-blue-200 rounded">
                                <div className="w-full h-1 bg-blue-500 rounded"></div>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDone}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : 'Done'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
