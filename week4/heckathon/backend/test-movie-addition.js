const axios = require('axios');

// Test the movie addition endpoint
async function testMovieAddition() {
  try {
    // First, let's test if the server is running
    const healthCheck = await axios.get('http://localhost:5000/health');
    console.log('Server health:', healthCheck.data);

    // Test movie data (similar to what TMDB would send)
    const testMovie = {
      id: 245891,
      title: "John Wick",
      overview: "Ex-hitman John Wick comes out of retirement to track down the gangsters that took everything from him.",
      poster_path: "/ff2ti5DkA9UYLzyqhQfI2kZqEuh.jpg",
      backdrop_path: "/ff2ti5DkA9UYLzyqhQfI2kZqEuh.jpg",
      release_date: "2014-10-24",
      vote_average: 7.4,
      vote_count: 18040,
      genre_ids: [28, 53, 80],
      original_language: "en",
      popularity: 47.013,
      adult: false
    };

    // You'll need to replace this with a valid admin token
    const token = 'YOUR_ADMIN_TOKEN_HERE';

    const response = await axios.post('http://localhost:5000/api/admin/movies/tmdb', testMovie, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Movie added successfully:', response.data);
  } catch (error) {
    console.error('Error testing movie addition:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data);
    console.error('Full error:', error.message);
  }
}

// Run the test
testMovieAddition();