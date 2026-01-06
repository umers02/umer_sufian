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
    <section className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-12">BROWSE BY DRESS STYLE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {styles.map((style, index) => (
            <Link 
              key={index} 
              href={`/category/${style.slug}`}
              className="relative bg-gray-100 rounded-2xl overflow-hidden h-64 block hover:shadow-lg transition-shadow"
            >
              <Image 
                src={style.image} 
                alt={style.name} 
                fill 
                className="object-cover" 
              />
              <div className="absolute top-6 left-6">
                <h4 className="text-2xl font-bold">{style.name}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}