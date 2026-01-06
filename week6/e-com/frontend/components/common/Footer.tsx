export default function Footer() {
  return (
    <footer className="bg-gray-100 px-4 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        <div>
          <h4 className="text-2xl font-bold mb-4">SHOP.CO</h4>
          <p className="text-gray-600 mb-4">
            We have clothes that suits your style and which you're proud to wear. From women to men.
          </p>
          <div className="flex space-x-4">
            <div className="w-8 h-8 bg-black rounded-full"></div>
            <div className="w-8 h-8 bg-black rounded-full"></div>
            <div className="w-8 h-8 bg-black rounded-full"></div>
          </div>
        </div>
        <div>
          <h5 className="font-bold mb-4">COMPANY</h5>
          <ul className="space-y-2 text-gray-600">
            <li>About</li>
            <li>Features</li>
            <li>Works</li>
            <li>Career</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">HELP</h5>
          <ul className="space-y-2 text-gray-600">
            <li>Customer Support</li>
            <li>Delivery Details</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">FAQ</h5>
          <ul className="space-y-2 text-gray-600">
            <li>Account</li>
            <li>Manage Deliveries</li>
            <li>Orders</li>
            <li>Payments</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">RESOURCES</h5>
          <ul className="space-y-2 text-gray-600">
            <li>Free eBooks</li>
            <li>Development Tutorial</li>
            <li>How to - Blog</li>
            <li>Youtube Playlist</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-300 mt-8 pt-8 flex justify-between items-center">
        <p className="text-gray-600">Shop.co © 2000-2023, All Rights Reserved</p>
        <div className="flex space-x-4">
          <div className="w-12 h-8 bg-gray-300 rounded"></div>
          <div className="w-12 h-8 bg-gray-300 rounded"></div>
          <div className="w-12 h-8 bg-gray-300 rounded"></div>
          <div className="w-12 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    </footer>
  );
}