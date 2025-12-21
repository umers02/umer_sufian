const Video = require('../../models/Video.model');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, 'uploads/videos/');
    } else if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVideo = async (req, res) => {
  try {
    const { title, description, genre, releaseYear, director, cast, rating, language, quality, type, isPremium } = req.body;
    
    const videoData = {
      title,
      description,
      genre,
      releaseYear: parseInt(releaseYear),
      director,
      cast: cast ? cast.split(',').map(c => c.trim()) : [],
      rating: rating ? parseFloat(rating) : 0,
      language,
      quality,
      type,
      isPremium: isPremium === 'true',
      uploadedBy: req.user.id
    };

    if (req.files) {
      if (req.files.video) videoData.videoUrl = req.files.video[0].path;
      if (req.files.thumbnail) videoData.thumbnailUrl = req.files.thumbnail[0].path;
    }

    const video = await Video.create(videoData);
    res.status(201).json({ message: 'Video uploaded successfully', video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.cast && typeof updates.cast === 'string') {
      updates.cast = updates.cast.split(',').map(c => c.trim());
    }

    const video = await Video.findByIdAndUpdate(id, updates, { new: true });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({ message: 'Video updated successfully', video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const hideVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndUpdate(id, { isVisible: false }, { new: true });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ message: 'Video hidden successfully', video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const showVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndUpdate(id, { isVisible: true }, { new: true });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ message: 'Video shown successfully', video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllVideos, createVideo, updateVideo, deleteVideo, hideVideo, showVideo, upload };