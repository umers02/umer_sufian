const Movie = require('../../models/Movie.model');

// Add movie to database
const addMovie = async (req, res) => {
  try {
    const { tmdbId, title, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, genre_ids, original_language, popularity, adult } = req.body;

    // Check if movie already exists
    const existingMovie = await Movie.findOne({ tmdbId });
    if (existingMovie) {
      return res.status(400).json({ message: 'Movie already exists in database' });
    }

    const movie = new Movie({
      tmdbId,
      title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      vote_average,
      vote_count,
      genre_ids,
      original_language,
      popularity,
      adult,
      addedBy: req.user.id
    });

    await movie.save();
    res.status(201).json({ message: 'Movie added successfully', movie });
  } catch (error) {
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
    
    const movie = await Movie.findOneAndUpdate(
      { tmdbId: id },
      { isActive: false },
      { new: true }
    );

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