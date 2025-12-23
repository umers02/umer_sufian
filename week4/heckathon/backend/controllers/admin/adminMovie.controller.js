const Movie = require('../../models/Movie.model');

// Add movie to database
const addMovie = async (req, res) => {
  try {
    console.log('Received movie data:', req.body); // Debug log
    console.log('User:', req.user?.email, 'Role:', req.user?.role); // Debug log
    
    const movieData = req.body;
    const tmdbId = movieData.id || movieData.tmdbId; // Handle both id and tmdbId

    if (!tmdbId) {
      console.log('Missing movie ID');
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    // Check if movie already exists
    const existingMovie = await Movie.findOne({ tmdbId });
    if (existingMovie) {
      console.log('Movie already exists:', tmdbId);
      return res.status(400).json({ message: 'Movie already exists in database' });
    }

    // Validate required fields
    if (!movieData.title) {
      console.log('Missing movie title');
      return res.status(400).json({ message: 'Movie title is required' });
    }

    const movie = new Movie({
      tmdbId,
      title: movieData.title,
      overview: movieData.overview || '',
      poster_path: movieData.poster_path || '',
      backdrop_path: movieData.backdrop_path || '',
      release_date: movieData.release_date || '',
      vote_average: movieData.vote_average || 0,
      vote_count: movieData.vote_count || 0,
      genre_ids: movieData.genre_ids || [],
      original_language: movieData.original_language || 'en',
      popularity: movieData.popularity || 0,
      adult: movieData.adult || false,
      addedBy: req.user.id
    });

    await movie.save();
    console.log('Movie saved successfully:', movie.title); // Debug log
    res.status(201).json({ message: 'Movie added successfully', movie });
  } catch (error) {
    console.error('Error adding movie:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Movie already exists in database' 
      });
    }
    
    res.status(500).json({ message: 'Error adding movie', error: error.message });
  }
};

// Get all movies
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
      .populate('addedBy', 'name email');

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

// Get single movie
const getMovie = async (req, res) => {
  try {
    const { id } = req.params;
    let movie;
    
    // Check if id is a valid MongoDB ObjectId format
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Try to find by database _id
      movie = await Movie.findOne({ _id: id, isActive: true });
    } else {
      // Try to find by tmdbId (numeric)
      const tmdbId = parseInt(id);
      if (!isNaN(tmdbId)) {
        movie = await Movie.findOne({ tmdbId: tmdbId, isActive: true });
      }
    }
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Error in getMovie:', error);
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
  }
};

// Update movie
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const movie = await Movie.findOneAndUpdate(
      { tmdbId: id },
      updates,
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie updated successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Error updating movie', error: error.message });
  }
};

// Delete movie
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    
    const movie = await Movie.findOneAndDelete({ tmdbId: id });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie', error: error.message });
  }
};

// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments({ isActive: true });
    const recentMovies = await Movie.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('title poster_path tmdbId');

    res.json({
      totalMovies,
      recentMovies
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

module.exports = {
  addMovie,
  getAllMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  getDashboardStats
};