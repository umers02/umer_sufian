const Video = require('../../models/Video.model');
const Subscription = require('../../models/Subscription.model');
const fs = require('fs');
const path = require('path');

const getVideos = async (req, res) => {
  try {
    const { genre, search, page = 1, limit = 20 } = req.query;
    
    // Check user subscription
    const subscription = await Subscription.findOne({ 
      userId: req.user.id, 
      status: { $in: ['active', 'trial'] },
      endDate: { $gte: new Date() }
    }).populate('planId');

    let query = { isVisible: true };
    
    // If user doesn't have subscription, only show free content
    if (!subscription) {
      query.isPremium = false;
    }

    if (genre) query.genre = new RegExp(genre, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { genre: new RegExp(search, 'i') }
      ];
    }

    const videos = await Video.find(query)
      .select('-videoUrl') // Don't send video URL in list
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Video.countDocuments(query);

    res.json({ 
      videos, 
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      hasSubscription: !!subscription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findById(id);
    if (!video || !video.isVisible) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if video is premium and user has subscription
    if (video.isPremium) {
      const subscription = await Subscription.findOne({ 
        userId: req.user.id, 
        status: { $in: ['active', 'trial'] },
        endDate: { $gte: new Date() }
      });

      if (!subscription) {
        return res.status(403).json({ message: 'Premium subscription required' });
      }
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.json({ video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const streamVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findById(id);
    if (!video || !video.isVisible) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if video is premium and user has subscription
    if (video.isPremium) {
      const subscription = await Subscription.findOne({ 
        userId: req.user.id, 
        status: { $in: ['active', 'trial'] },
        endDate: { $gte: new Date() }
      });

      if (!subscription) {
        return res.status(403).json({ message: 'Premium subscription required' });
      }
    }

    const videoPath = path.resolve(video.videoUrl);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getVideos, getVideoById, streamVideo };