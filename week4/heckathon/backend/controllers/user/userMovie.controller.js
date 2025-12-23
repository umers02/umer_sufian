const Movie = require('../../models/Movie.model');

// Get movie details for user (with mock data)
const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find movie in database first
    let movie = await Movie.findOne({ tmdbId: parseInt(id), isActive: true });
    
    if (movie) {
      // Return database movie with mock data
      return res.json(movie);
    }
    
    // If not found in database, return default mock data structure
    const defaultMockData = {
      tmdbId: parseInt(id),
      title: "Sample Movie",
      overview: "This is a sample movie description.",
      description: "This is a detailed description of the sample movie.",
      poster_path: "/sample-poster.jpg",
      backdrop_path: "/sample-backdrop.jpg",
      release_date: "2024-01-01",
      vote_average: 7.5,
      vote_count: 1000,
      runtime: 120,
      status: "Released",
      genres: [
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" }
      ],
      spoken_languages: [
        { iso_639_1: "en", name: "English" }
      ],
      cast: [
        {
          name: "John Doe",
          character: "Main Character",
          profile_path: "/sample-actor1.jpg"
        },
        {
          name: "Jane Smith", 
          character: "Supporting Role",
          profile_path: "/sample-actor2.jpg"
        },
        {
          name: "Mike Johnson",
          character: "Villain",
          profile_path: "/sample-actor3.jpg"
        }
      ],
      reviews: [
        {
          author: "MovieCritic",
          content: "An amazing movie with great storyline and excellent performances. The cinematography is outstanding and the acting is top-notch.",
          author_details: {
            rating: 8
          }
        },
        {
          author: "FilmLover",
          content: "Visually stunning and emotionally engaging. This movie delivers on all fronts with incredible action sequences and character development.",
          author_details: {
            rating: 9
          }
        }
      ],
      videos: [
        {
          key: "dQw4w9WgXcQ",
          name: "Official Trailer",
          type: "Trailer"
        }
      ]
    };
    
    res.json(defaultMockData);
    
  } catch (error) {
    console.error('Error in getMovieDetails:', error);
    res.status(500).json({ message: 'Error fetching movie details', error: error.message });
  }
};

// Get all active movies (for listing)
const getAllMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, search } = req.query;
    
    let query = { isActive: true };
    
    if (genre) {
      query.genre_ids = { $in: [parseInt(genre)] };
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('tmdbId title overview poster_path backdrop_path release_date vote_average vote_count genre_ids');

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};

// Get movies by genre for home page categories
const getMoviesByGenre = async (req, res) => {
  try {
    const genreMap = {
      'Action': 28,
      'Adventure': 12,
      'Comedy': 35,
      'Drama': 18,
      'Horror': 27
    };

    const categories = [];
    
    for (const [genreName, genreId] of Object.entries(genreMap)) {
      const movies = await Movie.find({ 
        genre_ids: { $in: [genreId] }, 
        isActive: true 
      })
      .limit(4)
      .select('tmdbId title poster_path release_date');
      
      categories.push({
        name: genreName,
        genreId: genreId,
        movies: movies.map(movie => ({
          id: movie.tmdbId,
          title: movie.title,
          image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/img/placeholder.jpg',
          year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : '2024'
        }))
      });
    }

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies by genre', error: error.message });
  }
};

module.exports = {
  getMovieDetails,
  getAllMovies,
  getMoviesByGenre
};