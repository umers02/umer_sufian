import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-gray-100 px-4 py-16">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="flex-1 pr-8">
          <h2 className="text-5xl font-bold text-black mb-6 leading-tight">
            FIND CLOTHES<br />
            THAT MATCHES<br />
            YOUR STYLE
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Browse through our diverse range of meticulously crafted garments, designed
            to bring out your individuality and cater to your sense of style.
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Shop Now
          </button>
          <div className="flex space-x-8 mt-12">
            <div>
              <div className="text-3xl font-bold">200+</div>
              <div className="text-gray-600">International Brands</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2,000+</div>
              <div className="text-gray-600">High-Quality Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold">30,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Image
            src="/hero-section.jpg"
            alt="Fashion Models"
            width={600}
            height={600}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}