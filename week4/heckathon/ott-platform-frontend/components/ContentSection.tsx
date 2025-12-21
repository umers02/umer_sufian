import SectionHeader from './SectionHeader'
import CategoryCard from './CategoryCard'
import MovieCard from './MovieCard'

interface Movie {
  id: number
  title: string
  image: string
  year: string
  rating?: string
}

interface Category {
  name: string
  movies: Movie[]
}

interface ContentSectionProps {
  title: string
  categories: Category[]
  trendingMovies: Movie[]
  newReleases: Movie[]
  mustWatchMovies: Movie[]
  dbMovies?: any[]  // DB movies array
}

export default function ContentSection({ 
  title, 
  categories, 
  trendingMovies, 
  newReleases, 
  mustWatchMovies,
  dbMovies = []
}: ContentSectionProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <fieldset className="border border-gray-600 rounded-lg p-8">
          <legend className="px-4 text-2xl font-bold text-white bg-[#141414]">{title}</legend>
          
          {/* Our Genres */}
          <div className="mb-16">
            <SectionHeader title="Our Genres" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <CategoryCard key={index} category={category} />
              ))}
            </div>
          </div>

          {/* Popular Top 10 in Genres */}
          <div className="mb-16">
            <SectionHeader title="Popular Top 10 in Genres" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <CategoryCard key={index} category={category} showTopBadge={true} />
              ))}
            </div>
          </div>

          {/* Trending Now */}
          <div className="mb-16">
            <SectionHeader title="Trending Now" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trendingMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} variant="trending" dbMovies={dbMovies} />
              ))}
            </div>
          </div>

          {/* New Releases */}
          <div className="mb-16">
            <SectionHeader title="New Releases" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {newReleases.map((movie) => (
                <MovieCard key={movie.id} movie={movie} variant="release" dbMovies={dbMovies} />
              ))}
            </div>
          </div>

          {/* Must - Watch */}
          <div>
            <SectionHeader title={`Must - Watch ${title}`} />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mustWatchMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} variant="mustwatch" dbMovies={dbMovies} />
              ))}
            </div>
          </div>
        </fieldset>
      </div>
    </section>
  )
}