import Image from 'next/image';
import Link from 'next/link';

export default function BrowseByStyle() {
  const styles = [
    { name: 'Casual', image: '/casual-bg.png', slug: 'casual' },
    { name: 'Formal', image: '/formal-bg.png', slug: 'formal' },
    { name: 'Party', image: '/party-bg.png', slug: 'party' },
    { name: 'Gym', image: '/gym-bg.png', slug: 'gym' }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-[#F0F0F0] rounded-3xl p-16">
          <h3 className="text-4xl md:text-5xl font-black text-center mb-12">BROWSE BY DRESS STYLE</h3>
          <div className="grid grid-cols-5 gap-5">
            {/* Top Row - Casual (1 column) and Formal (4 columns) */}
            <div className="col-span-2">
              <Link 
                href={`/category/${styles[0].slug}`}
                className="relative bg-white rounded-2xl overflow-hidden h-72 block hover:shadow-lg transition-shadow"
              >
                <Image 
                  src={styles[0].image} 
                  alt={styles[0].name} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute top-6 left-6">
                  <h4 className="text-3xl font-bold text-black">{styles[0].name}</h4>
                </div>
              </Link>
            </div>
            <div className="col-span-3">
              <Link 
                href={`/category/${styles[1].slug}`}
                className="relative bg-white rounded-2xl overflow-hidden h-72 block hover:shadow-lg transition-shadow"
              >
                <Image 
                  src={styles[1].image} 
                  alt={styles[1].name} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute top-6 left-6">
                  <h4 className="text-3xl font-bold text-black">{styles[1].name}</h4>
                </div>
              </Link>
            </div>
            
            {/* Bottom Row - Party (4 columns) and Gym (1 column) */}
            <div className="col-span-3">
              <Link 
                href={`/category/${styles[2].slug}`}
                className="relative bg-white rounded-2xl overflow-hidden h-72 block hover:shadow-lg transition-shadow"
              >
                <Image 
                  src={styles[2].image} 
                  alt={styles[2].name} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute top-6 left-6">
                  <h4 className="text-3xl font-bold text-black">{styles[2].name}</h4>
                </div>
              </Link>
            </div>
            <div className="col-span-2">
              <Link 
                href={`/category/${styles[3].slug}`}
                className="relative bg-white rounded-2xl overflow-hidden h-72 block hover:shadow-lg transition-shadow"
              >
                <Image 
                  src={styles[3].image} 
                  alt={styles[3].name} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute top-6 left-6">
                  <h4 className="text-3xl font-bold text-black">{styles[3].name}</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}