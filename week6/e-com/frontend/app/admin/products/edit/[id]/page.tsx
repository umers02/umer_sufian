'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminSidebar from '../../../../../components/admin/AdminSidebar';
import AdminHeader from '../../../../../components/admin/AdminHeader';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  price: number;
  salePrice: number;
  isOnSale?: boolean;
  type: string;
  pointsPrice?: number;
  tags: string[];
  sizes: string[];
  images: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  
  const availableTags = ['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'];
  const availableSizes = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setProduct(result.data || result);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!product) return;
    
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('category', product.category);
      formData.append('brand', product.brand);
      formData.append('sku', product.sku);
      formData.append('stock', product.stock.toString());
      formData.append('price', product.price.toString());
      formData.append('type', product.type);
      
      // Points price for loyalty_only or hybrid products
      if ((product.type === 'loyalty_only' || product.type === 'hybrid') && product.pointsPrice) {
        formData.append('pointsPrice', product.pointsPrice.toString());
      }
      
      // Handle salePrice and isOnSale
      if (product.salePrice && product.salePrice > 0) {
        formData.append('salePrice', product.salePrice.toString());
        formData.append('isOnSale', 'true');
      } else {
        formData.append('salePrice', '0');
        formData.append('isOnSale', 'false');
      }
      
      // Send existing images that should be kept
      formData.append('existingImages', JSON.stringify(product.images));
      
      // Handle tags - only append if tags exist
      if (product.tags && product.tags.length > 0) {
        product.tags.forEach(tag => {
          formData.append('tags', tag);
        });
      }

      // Handle sizes - only append if sizes exist
      if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach(size => {
          formData.append('sizes', size);
        });
      }

      newImages.forEach(image => {
        formData.append('images', image);
      });

      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Product updated successfully!');
        router.push('/admin/products');
      } else {
        const error = await response.json();
        const errorMessage = Array.isArray(error.message) 
          ? error.message.join(', ') 
          : error.message || 'Failed to update product';
        alert(`Failed to update product: ${errorMessage}`);
        console.error('Update error:', error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    if (!product) return;
    setProduct({ ...product, [field]: value });
  };

  const addTag = (tag: string) => {
    if (!product || product.tags.includes(tag)) return;
    setProduct({ ...product, tags: [...product.tags, tag] });
  };

  const removeTag = (tag: string) => {
    if (!product) return;
    setProduct({ ...product, tags: product.tags.filter(t => t !== tag) });
  };

  const addSize = (size: string) => {
    if (!product || (product.sizes && product.sizes.includes(size))) return;
    const currentSizes = product.sizes || [];
    setProduct({ ...product, sizes: [...currentSizes, size] });
  };

  const removeSize = (size: string) => {
    if (!product || !product.sizes) return;
    setProduct({ ...product, sizes: product.sizes.filter(s => s !== size) });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)]);
    }
  };

  const removeExistingImage = (index: number) => {
    const updatedImages = product!.images.filter((_, i) => i !== index);
    setProduct({ ...product!, images: updatedImages });
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg p-8 text-center">
              <p>Loading product details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg p-8 text-center">
              <p>Product not found</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
            <nav className="text-sm text-gray-500">
              Home &gt; All Products &gt; Product Details
            </nav>
          </div>

          <div className="bg-white rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={product.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={product.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={product.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type
                  </label>
                  <select
                    value={product.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="regular">Regular Product</option>
                    <option value="loyalty_only">Loyalty Only</option>
                    <option value="hybrid">Hybrid (Cash + Points)</option>
                  </select>
                </div>

                {(product.type === 'loyalty_only' || product.type === 'hybrid') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points Price
                    </label>
                    <input
                      type="number"
                      value={product.pointsPrice || 0}
                      onChange={(e) => handleInputChange('pointsPrice', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter points required"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={product.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regular Price
                    </label>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price
                    </label>
                    <input
                      type="number"
                      value={product.salePrice}
                      onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addTag(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a tag</option>
                      {availableTags.filter(tag => !product.tags.includes(tag)).map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                    
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
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
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sizes
                  </label>
                  <div className="space-y-3">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addSize(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a size</option>
                      {availableSizes.filter(size => !(product.sizes || []).includes(size)).map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    
                    <div className="flex flex-wrap gap-2">
                      {(product.sizes || []).map((size, index) => (
                        <span
                          key={index}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-2"
                        >
                          {size}
                          <button
                            type="button"
                            onClick={() => removeSize(size)}
                            className="text-white hover:text-red-300"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image Gallery */}
              <div className="space-y-6">
                <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <p>No image available</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Product Gallery</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-blue-500 text-2xl mb-2">🖼️</div>
                    <p className="text-gray-500 mb-1">Drop your images here, or browse</p>
                    <p className="text-xs text-gray-400">Jpeg, png are allowed</p>
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
                      className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                    >
                      Browse Files
                    </label>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {product.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Product thumbnail.png</p>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div className="bg-blue-500 h-1 rounded-full w-full"></div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeExistingImage(index)}
                          className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {newImages.map((image, index) => (
                      <div key={`new-${index}`} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{image.name}</p>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div className="bg-green-500 h-1 rounded-full w-full"></div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeNewImage(index)}
                          className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'DELETING...' : 'DELETE'}
              </button>
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {updating ? 'UPDATING...' : 'UPDATE'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}