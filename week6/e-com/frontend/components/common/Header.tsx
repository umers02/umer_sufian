'use client';

import { useState } from 'react';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <header className="bg-black text-white text-center py-2 text-sm">
      Sign up and get 20% off to your first order. Sign Up Now
      <button 
        className="ml-4 text-white hover:text-gray-300"
        onClick={() => setIsVisible(false)}
      >
        ×
      </button>
    </header>
  );
}