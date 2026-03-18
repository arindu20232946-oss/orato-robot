import Card from '../models/Card.js';

const getImageUrl = (word) => {
  const prompt = encodeURIComponent(
    `A single clear educational flashcard illustration of ${word.toLowerCase()}, centered subject, plain light background, no scenery, no text, no watermark`
  );
  return `https://image.pollinations.ai/prompt/${prompt}?width=400&height=400&nologo=true`;
};

const fallbackCards = [
  { _id: 'fallback-1', word: 'Apple', definition: 'A round fruit with red or green skin.', imageUrl: getImageUrl('apple'), difficultyLevel: 'Beginner' },
  { _id: 'fallback-2', word: 'Book', definition: 'A written or printed work consisting of pages.', imageUrl: getImageUrl('book'), difficultyLevel: 'Beginner' },
  { _id: 'fallback-3', word: 'Bird', definition: 'A warm-blooded egg-laying vertebrate with feathers.', imageUrl: getImageUrl('bird'), difficultyLevel: 'Beginner' },
  { _id: 'fallback-4', word: 'Mountain', definition: 'A large natural elevation of the earth surface.', imageUrl: getImageUrl('mountain'), difficultyLevel: 'Intermediate' },
  { _id: 'fallback-5', word: 'Teacher', definition: 'A person who teaches students.', imageUrl: getImageUrl('teacher'), difficultyLevel: 'Intermediate' },
  { _id: 'fallback-6', word: 'Computer', definition: 'An electronic device for processing data.', imageUrl: getImageUrl('computer'), difficultyLevel: 'Intermediate' },
  { _id: 'fallback-7', word: 'Ocean', definition: 'A very large expanse of sea.', imageUrl: getImageUrl('ocean'), difficultyLevel: 'Beginner' },
  { _id: 'fallback-8', word: 'Study', definition: 'The devotion of time and attention to learning.', imageUrl: getImageUrl('student studying'), difficultyLevel: 'Intermediate' },
  { _id: 'fallback-9', word: 'Listen', definition: 'Give attention to sound.', imageUrl: getImageUrl('person listening'), difficultyLevel: 'Beginner' },
  { _id: 'fallback-10', word: 'Flower', definition: 'The seed-bearing part of a plant.', imageUrl: getImageUrl('flower'), difficultyLevel: 'Beginner' },
];

// @desc    Get 10 random vocabulary cards
// @route   GET /api/cards/random
// @access  Public
export const getRandomCards = async (req, res) => {
  try {
    const queryPromise = Card.aggregate([{ $sample: { size: 10 } }]);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('DB_QUERY_TIMEOUT')), 5000);
    });

    const randomCards = await Promise.race([queryPromise, timeoutPromise]);

    if (!Array.isArray(randomCards) || randomCards.length === 0) {
      return res.status(200).json(fallbackCards);
    }

    res.status(200).json(randomCards);
  } catch (error) {
    console.error("Error fetching random cards:", error);
    res.status(200).json(fallbackCards);
  }
};