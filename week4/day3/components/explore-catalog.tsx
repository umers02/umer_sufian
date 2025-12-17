"use client"

import Image from "next/image"

export function ExploreCatalog() {
  return (
    <section className="py-8">
      <div className=" rounded-lg mx-4 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-80">
              <Image 
                src="/img/catalog.jpg" 
                alt="Catalog games" 
                fill 
                className="object-cover" 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center p-8 md:w-1/2">
            <div className="text-center md:text-left">
              <h2 className="text-white text-2xl font-bold mb-4">Explore our Catalog</h2>
              <p className="text-gray-300 text-sm">
                Browse by genre, features, price, and more to find your next favorite game.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}