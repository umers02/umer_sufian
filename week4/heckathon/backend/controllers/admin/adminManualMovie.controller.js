const ManualMovie = require('../../models/ManualMovie.model');
const Movie = require('../../models/Movie.model');

// Add manual movie
const addManualMovie = async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      addedBy: req.user.id
    };

    // Handle file uploads
    if (req.files) {
      if (req.files.poster) movieData.poster_path = req.files.poster[0].path;
      if (req.files.backdrop) movieData.backdrop_path = req.files.backdrop[0].path;
      if (req.files.trailer) movieData.trailer_url = req.files.trailer[0].path;
    }

    // Parse JSON fields
    if (req.body.genres) movieData.genres = JSON.parse(req.body.genres);
    if (req.body.spoken_languages) movieData.spoken_languages = JSON.parse(req.body.spoken_languages);
    if (req.body.cast) movieData.cast = JSON.parse(req.body.cast);

    const movie = new ManualMovie(movieData);
    await movie.save();

    res.status(201).json({ message: 'Manual movie added successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Error adding manual movie', error: error.message });
  }
};

// Get all movies (TMDB + Manual combined)
const getAllMoviesCombined = async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, search } = req.query;
    
    // Get TMDB movies
    let tmdbQuery = { isActive: true };
    if (genre) tmdbQuery.genre_ids = { $in: [parseInt(genre)] };
    if (search) tmdbQuery.title = { $regex: search, $options: 'i' };
    
    const tmdbMovies = await Movie.find(tmdbQuery)
      .sort({ createdAt: -1 })
      .populate('addedBy', 'name email');

    // Get Manual movies
    let manualQuery = { isActive: true };
    if (genre) manualQuery['genres.id'] = parseInt(genre);
    if (search) manualQuery.title = { $regex: search, $options: 'i' };
    
    const manualMovies = await ManualMovie.find(manualQuery)
      .sort({ createdAt: -1 })
      .populate('addedBy', 'name email');

    // Combine and format
    const allMovies = [
      ...tmdbMovies.map(movie => ({ ...movie.toObject(), source: 'tmdb' })),
      ...manualMovies.map(movie => ({ ...movie.toObject(), source: 'manual' }))
    ];

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMovies = allMovies.slice(startIndex, endIndex);

    res.json({
      movies: paginatedMovies,
      totalPages: Math.ceil(allMovies.length / limit),
      currentPage: parseInt(page),
      total: allMovies.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};

// Get single movie (check both collections)
const getMovieCombined = async (req, res) => {
  try {
    const { id } = req.params;
    let movie;

    console.log('Looking for movie with ID:', id);

    // First try TMDB movies by tmdbId (numeric)
    const tmdbId = parseInt(id);
    if (!isNaN(tmdbId)) {
      movie = await Movie.findOne({ tmdbId: tmdbId, isActive: true });
      if (movie) {
        console.log('Found TMDB movie:', movie.title);
        return res.json({ ...movie.toObject(), source: 'tmdb' });
      }
    }

    // Then try manual movies by _id (ObjectId)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      movie = await ManualMovie.findOne({ _id: id, isActive: true });
      if (movie) {
        console.log('Found manual movie:', movie.title);
        return res.json({ ...movie.toObject(), source: 'manual' });
      }
    }

    // Finally try TMDB movies by _id (ObjectId)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      movie = await Movie.findOne({ _id: id, isActive: true });
      if (movie) {
        console.log('Found TMDB movie by _id:', movie.title);
        return res.json({ ...movie.toObject(), source: 'tmdb' });
      }
    }

    console.log('No movie found with ID:', id);
    res.status(404).json({ message: 'Movie not found' });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
  }
};

// Update manual movie
const updateManualMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.poster) updates.poster_path = req.files.poster[0].path;
      if (req.files.backdrop) updates.backdrop_path = req.files.backdrop[0].path;
      if (req.files.trailer) updates.trailer_url = req.files.trailer[0].path;
    }

    // Parse JSON fields
    if (req.body.genres) updates.genres = JSON.parse(req.body.genres);
    if (req.body.spoken_languages) updates.spoken_languages = JSON.parse(req.body.spoken_languages);
    if (req.body.cast) updates.cast = JSON.parse(req.body.cast);

    const movie = await ManualMovie.findByIdAndUpdate(id, updates, { new: true });
    
    if (!movie) {
      return res.status(404).json({ message: 'Manual movie not found' });
    }

    res.json({ message: 'Manual movie updated successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Error updating manual movie', error: error.message });
  }
};

// Delete manual movie
const deleteManualMovie = async (req, res) => {
  try {
    const { id } = req.params;
    
    const movie = await ManualMovie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({ message: 'Manual movie not found' });
    }

    res.json({ message: 'Manual movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting manual movie', error: error.message });
  }
};

module.exports = {
  addManualMovie,
  getAllMoviesCombined,
  getMovieCombined,
  updateManualMovie,
  deleteManualMovie
};