require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie.model');
const connectDB = require('../config/db');

const sampleMovies = [
  {
    tmdbId: 550,
    title: "Fight Club",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    release_date: "1999-10-15",
    vote_average: 8.4,
    vote_count: 26280,
    genre_ids: [18],
    original_language: "en",
    popularity: 61.416,
    adult: false
  },
  {
    tmdbId: 155,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
    release_date: "2008-07-18",
    vote_average: 9.0,
    vote_count: 32000,
    genre_ids: [28, 80, 18],
    original_language: "en",
    popularity: 123.456,
    adult: false
  },
  {
    tmdbId: 13,
    title: "Forrest Gump",
    overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdrop_path: "/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg",
    release_date: "1994-06-23",
    vote_average: 8.5,
    vote_count: 25000,
    genre_ids: [35, 18, 10749],
    original_language: "en",
    popularity: 85.123,
    adult: false
  },
  {
    tmdbId: 278,
    title: "The Shawshank Redemption",
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop_path: "/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
    release_date: "1994-09-23",
    vote_average: 9.3,
    vote_count: 24000,
    genre_ids: [18, 80],
    original_language: "en",
    popularity: 95.789,
    adult: false
  },
  {
    tmdbId: 238,
    title: "The Godfather",
    overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    release_date: "1972-03-14",
    vote_average: 9.2,
    vote_count: 19000,
    genre_ids: [18, 80],
    original_language: "en",
    popularity: 112.456,
    adult: false
  }
];

const addMovies = async () => {
  try {
    await connectDB();
    
    // Clear existing movies
    await Movie.deleteMany({});
    
    // Add sample movies
    const movies = await Movie.insertMany(sampleMovies.map(movie => ({
      ...movie,
      isActive: true,
      addedBy: null // You can set this to an admin user ID if needed
    })));
    
    console.log(`${movies.length} movies added successfully!`);
    console.log('Movies added:');
    movies.forEach(movie => {
      console.log(`- ID: ${movie._id}, TMDB ID: ${movie.tmdbId}, Title: ${movie.title}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding movies:', error);
    process.exit(1);
  }
};

addMovies();