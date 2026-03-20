const path = require('path');
const fs = require('fs');
const Story = require('../models/Story');

const DEFAULT_STORIES = [
  {
    defaultKey: 'diksha-my-shiksha-story',
    name: 'Diksha',
    title: 'MY SHIKSHA STORY',
    description:
      'When a parent passes away, life changes. Two years ago, I lost my mother. Last year, I lost my father in a road accident. I felt a huge empty space in my heart.',
    fullStory:
      'When a parent passes away, life changes. Two years ago, I lost my mother. Last year, I lost my father in a road accident. I felt a huge empty space in my heart. It was painful and uncomfortable. Since then, I started questioning life and purpose. Being with parents is a happy place that I can still see clearly when I close my eyes. There was so much laughter and love in our home every time we were together.',
    imageUrl: '/uploads/stories/story-1773344014104-126922149.jpg'
  },
  {
    defaultKey: 'rita-devi-struggle-story',
    name: 'RITA DEVI',
    title: 'Rita Devi Struggle Story',
    description:
      'Now, Rita Devi feels more secure and hopeful about the future. She is working towards becoming independent and taking care of herself.',
    fullStory:
      'Now, Rita Devi feels more secure and hopeful about the future. With steady support and encouragement, she is working towards becoming independent and taking care of herself with dignity.',
    imageUrl: '/uploads/stories/story-1773344183451-762570882.jpg'
  },
  {
    defaultKey: 'ravi-journey-to-independence',
    name: 'RAVI KUMAR',
    title: "Ravi's Journey to Independence",
    description:
      'Ravi\'s story is an inspiring one; with encouragement and determination, he continues building a favorable future for himself.',
    fullStory:
      'Ravi\'s story is an inspiring one. With encouragement, mentorship, and determination, he proved that consistent support can help create a favorable future and a strong path to independence.',
    imageUrl: '/uploads/stories/story-1773354011637-950213653.jpg'
  }
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const ensureDefaultStories = async () => {
  for (const defaultStory of DEFAULT_STORIES) {
    const existing = await Story.findOne({
      $or: [
        { defaultKey: defaultStory.defaultKey },
        {
          name: { $regex: `^${escapeRegex(defaultStory.name)}$`, $options: 'i' },
          title: { $regex: `^${escapeRegex(defaultStory.title)}$`, $options: 'i' }
        }
      ]
    });

    if (!existing) {
      await Story.create(defaultStory);
      continue;
    }

    const patch = {};
    if (!existing.defaultKey) {
      patch.defaultKey = defaultStory.defaultKey;
    }
    if (!existing.imageUrl && defaultStory.imageUrl) {
      patch.imageUrl = defaultStory.imageUrl;
    }
    if (!existing.fullStory && defaultStory.fullStory) {
      patch.fullStory = defaultStory.fullStory;
    }

    if (Object.keys(patch).length > 0) {
      await Story.findByIdAndUpdate(existing._id, patch, { runValidators: true });
    }
  }
};

const getStories = async (req, res, next) => {
  try {
    await ensureDefaultStories();
    const stories = await Story.find().sort({ createdAt: -1 });
    return res.json(stories);
  } catch (error) {
    return next(error);
  }
};

const createStory = async (req, res, next) => {
  try {
    const { name, title, description, fullStory } = req.body;
    const imageUrl = req.file ? `/uploads/stories/${req.file.filename}` : '';
    const story = await Story.create({ name, title, description, fullStory, imageUrl });
    return res.status(201).json(story);
  } catch (error) {
    return next(error);
  }
};

const updateStory = async (req, res, next) => {
  try {
    const { name, title, description, fullStory } = req.body;
    const update = { name, title, description, fullStory };

    if (req.file) {
      const existing = await Story.findById(req.params.id);
      if (existing?.imageUrl) {
        const oldPath = path.join(__dirname, '..', existing.imageUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      update.imageUrl = `/uploads/stories/${req.file.filename}`;
    }

    const story = await Story.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    return res.json(story);
  } catch (error) {
    return next(error);
  }
};

const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.defaultKey) {
      return res.status(400).json({ message: 'Default stories are permanent and cannot be deleted.' });
    }

    await story.deleteOne();

    if (story.imageUrl) {
      const imgPath = path.join(__dirname, '..', story.imageUrl);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    return res.json({ message: 'Story deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getStories, createStory, updateStory, deleteStory };
