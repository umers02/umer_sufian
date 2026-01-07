'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/common/Header';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { orderService, CreateOrderData } from '../../services/orderService';

export default function CheckoutPage() {
  const { items, getTotalPrice, removeFromCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Check if cart contains only loyalty-only products
  const hasLoyaltyOnlyProducts = items.some(item => item.type === 'loyalty_only');
  const isLoyaltyOnlyCart = items.every(item => item.type === 'loyalty_only');
  const hasOnlyRegularProducts = items.every(item => item.type === 'regular');
  const hasHybridProducts = items.some(item => item.type === 'hybrid');
  const hasMixedCart = hasLoyaltyOnlyProducts && items.some(item => item.type === 'regular');
  const totalPointsRequired = items
    .filter(item => item.type === 'loyalty_only')
    .reduce((sum, item) => sum + (item.pointsPrice || 0) * item.quantity, 0);
  const hybridPointsRequired = items
    .filter(item => item.type === 'hybrid')
    .reduce((sum, item) => sum + (item.pointsPrice || 0) * item.quantity, 0);
  const regularProductsTotal = items
    .filter(item => item.type === 'regular')
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [paymentMethod, setPaymentMethod] = useState(isLoyaltyOnlyCart ? 'points' : 'card');
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [useHybridPoints, setUseHybridPoints] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Bulgaria',
    'Cambodia', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic',
    'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia',
    'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala',
    'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
    'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg',
    'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway',
    'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
    'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland',
    'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Venezuela', 'Vietnam'
  ];

  const subtotal = getTotalPrice();
  const shipping = isLoyaltyOnlyCart ? 0 : 15; // No shipping for points-only orders
  const tax = isLoyaltyOnlyCart ? 0 : subtotal * 0.08; // No tax for points-only orders
  const pointsDiscount = usePoints ? Math.min(pointsToUse * 0.01, subtotal) : 0;
  const hybridPointsDiscount = (paymentMethod === 'hybrid_points') ? hybridPointsRequired * 0.01 : 0;
  const total = isLoyaltyOnlyCart ? 0 : subtotal + shipping + tax - pointsDiscount - hybridPointsDiscount; // Total is 0 for points-only

  const handleInputChange = (section: 'shipping' | 'payment', field: string, value: string) => {
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to place an order');
      return;
    }
    
    // Check points for loyalty-only cart
    if (isLoyaltyOnlyCart && user.loyaltyPoints < totalPointsRequired) {
      alert(`Insufficient points! You need ${totalPointsRequired} points but only have ${user.loyaltyPoints} points.`);
      return;
    }
    
    // Check points for hybrid products if using points
    if (paymentMethod === 'hybrid_points' && user.loyaltyPoints < hybridPointsRequired) {
      alert(`Insufficient points for hybrid products! You need ${hybridPointsRequired} points but only have ${user.loyaltyPoints} points.`);
      return;
    }
    
    setLoading(true);
    
    try {
      const orderData: CreateOrderData = {
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color
        })),
        shippingAddress: shippingInfo,
        paymentMethod: isLoyaltyOnlyCart ? 'points' : (paymentMethod === 'hybrid_points' ? 'hybrid_points' : paymentMethod),
        subtotal,
        shipping,
        tax,
        total,
        pointsUsed: isLoyaltyOnlyCart ? totalPointsRequired : (usePoints ? pointsToUse : 0) + (paymentMethod === 'hybrid_points' ? hybridPointsRequired : 0)
      };
      
      await orderService.createOrder(orderData);
      alert('Order placed successfully!');
      // Clear cart after successful order
      items.forEach(item => {
        removeFromCart(item.id, item.size, item.color);
      });
      // Redirect to profile/orders page
      window.location.href = '/profile';
    } catch (error: any) {
      console.error('Order creation failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Navbar />
        <div className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to proceed to checkout</p>
            <Link href="/products" className="bg-black text-white px-8 py-3 rounded-full">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/cart" className="hover:text-black">Cart</Link>
            <span className="mx-2">›</span>
            <span className="text-black">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Shipping Information */}
              <div className="bg-white p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.firstName}
                      onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.lastName}
                      onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.state}
                      onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleInputChange('shipping', 'zipCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <select
                      value={shippingInfo.country}
                      onChange={(e) => handleInputChange('shipping', 'country', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                
                {hasMixedCart ? (
                  // Mixed cart: Show split payment info
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-medium mb-3 text-yellow-800">Mixed Cart - Split Payment Required</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Loyalty Products:</span>
                        <span className="font-semibold text-purple-600">{totalPointsRequired} points</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Regular Products:</span>
                        <span className="font-semibold">${regularProductsTotal.toFixed(2)} + fees</span>
                      </div>
                      <p className="text-yellow-700 mt-2">
                        ✓ Loyalty products will be paid with points automatically
                      </p>
                      <p className="text-yellow-700">
                        ✓ Choose payment method below for regular products
                      </p>
                    </div>
                  </div>
                ) : isLoyaltyOnlyCart ? (
                  // Loyalty-only products: Only show points payment
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          value="points"
                          checked={true}
                          readOnly
                          className="w-4 h-4"
                        />
                        <span className="font-medium">Loyalty Points Payment</span>
                      </div>
                      <span className="text-sm text-purple-600">
                        Available: {user?.loyaltyPoints || 0} points
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Required: <strong>{totalPointsRequired} points</strong></p>
                      <p className={user && user.loyaltyPoints >= totalPointsRequired ? 'text-green-600' : 'text-red-600'}>
                        {user && user.loyaltyPoints >= totalPointsRequired 
                          ? '✓ Sufficient points available' 
                          : '✗ Insufficient points'}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Regular products: Show all payment options
                  <>
                    <div className="space-y-4 mb-6">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span>Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span>PayPal</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span>Cash on Delivery</span>
                      </label>
                      {hasHybridProducts && (
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            value="hybrid_points"
                            checked={paymentMethod === 'hybrid_points'}
                            onChange={(e) => {
                              setPaymentMethod(e.target.value);
                              setUseHybridPoints(e.target.value === 'hybrid_points');
                            }}
                            className="w-4 h-4"
                          />
                          <span>Loyalty Points (Hybrid Products)</span>
                        </label>
                      )}
                    </div>

                    {/* Hybrid Products Points Details - Show when hybrid_points is selected */}
                    {paymentMethod === 'hybrid_points' && hasHybridProducts && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">Hybrid Products Payment with Points</span>
                          <span className="text-sm text-blue-600">
                            Available: {user?.loyaltyPoints || 0} points
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p>Required: <strong>{hybridPointsRequired} points</strong></p>
                          <p className={user && user.loyaltyPoints >= hybridPointsRequired ? 'text-green-600' : 'text-red-600'}>
                            {user && user.loyaltyPoints >= hybridPointsRequired 
                              ? '✓ Sufficient points available' 
                              : '✗ Insufficient points'}
                          </p>
                          <p className="text-blue-600 mt-1">
                            Discount: ${hybridPointsDiscount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Regular Products Points Option */}
                    {user && user.loyaltyPoints > 0 && !hasOnlyRegularProducts && !hasHybridProducts && (
                      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={usePoints}
                              onChange={(e) => {
                                setUsePoints(e.target.checked);
                                if (!e.target.checked) setPointsToUse(0);
                              }}
                              className="w-4 h-4"
                            />
                            <span className="font-medium">Use Loyalty Points</span>
                          </label>
                          <span className="text-sm text-purple-600">
                            Available: {user.loyaltyPoints} points
                          </span>
                        </div>
                        
                        {usePoints && (
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Points to use (1 point = $0.01)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={Math.min(user.loyaltyPoints, subtotal * 100)}
                              value={pointsToUse}
                              onChange={(e) => setPointsToUse(Number(e.target.value))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              Discount: ${pointsDiscount.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Card Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV *</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                      <input
                        type="text"
                        required
                        value={paymentInfo.cardName}
                        onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl sticky top-4">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          width={64} 
                          height={64} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.size} • {item.color}</p>
                        <p className="text-sm font-semibold">${item.price} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 border-t pt-4">
                  {hasMixedCart ? (
                    // Mixed cart: Show both breakdowns
                    <>
                      <div className="bg-purple-50 p-3 rounded-lg mb-3">
                        <h4 className="font-medium text-purple-800 mb-2">Loyalty Products</h4>
                        <div className="flex justify-between text-sm">
                          <span>Points Required:</span>
                          <span className="font-semibold text-purple-600">{totalPointsRequired} points</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Regular Products</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${regularProductsTotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>$15.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>${(regularProductsTotal * 0.08).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-1">
                            <span>Cash Total:</span>
                            <span>${(regularProductsTotal + 15 + regularProductsTotal * 0.08).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available Points:</span>
                        <span className="font-semibold">{user?.loyaltyPoints || 0} points</span>
                      </div>
                    </>
                  ) : isLoyaltyOnlyCart || paymentMethod === 'hybrid_points' ? (
                    // Loyalty/Hybrid points cart: Show points breakdown
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Points Required</span>
                        <span className="font-semibold text-purple-600">
                          {isLoyaltyOnlyCart ? totalPointsRequired : hybridPointsRequired} points
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your Available Points</span>
                        <span className="font-semibold">{user?.loyaltyPoints || 0} points</span>
                      </div>
                      <hr />
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Payment Method</span>
                        <span className="font-bold text-purple-600">Loyalty Points</span>
                      </div>
                    </>
                  ) : (
                    // Regular cart: Show cash breakdown
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold">${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-semibold">${tax.toFixed(2)}</span>
                      </div>
                      {usePoints && pointsDiscount > 0 && !hasOnlyRegularProducts && !hasHybridProducts && (
                        <div className="flex justify-between text-purple-600">
                          <span>Points Discount ({pointsToUse} points)</span>
                          <span className="font-semibold">-${pointsDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <hr />
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">${total.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading || 
                    (isLoyaltyOnlyCart && user && user.loyaltyPoints < totalPointsRequired) ||
                    (paymentMethod === 'hybrid_points' && user && user.loyaltyPoints < hybridPointsRequired) ||
                    (hasMixedCart && user && user.loyaltyPoints < totalPointsRequired)
                  }
                  className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 
                   hasMixedCart ? 
                     (user && user.loyaltyPoints >= totalPointsRequired ? 
                       `Place Order - ${totalPointsRequired} Points + $${(regularProductsTotal + 15 + regularProductsTotal * 0.08).toFixed(2)}` : 
                       'Insufficient Points for Loyalty Products') :
                   isLoyaltyOnlyCart ? 
                     (user && user.loyaltyPoints >= totalPointsRequired ? 
                       `Place Order - ${totalPointsRequired} Points` : 
                       'Insufficient Points') :
                   paymentMethod === 'hybrid_points' ?
                     (user && user.loyaltyPoints >= hybridPointsRequired ? 
                       `Place Order - ${hybridPointsRequired} Points` : 
                       'Insufficient Points') :
                     `Place Order - $${total.toFixed(2)}`}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}