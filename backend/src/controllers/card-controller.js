import Card from '../models/card.js';

// @desc    Get 10 random vocabulary cards
// @route   GET /api/cards/random
// @access  Public
export const getRandomCards = async (req, res) => {
  try {
    // $sample is the most efficient way to pull random documents from MongoDB
    const randomCards = await Card.aggregate([{ $sample: { size: 10 } }]);
    res.status(200).json(randomCards);
  } catch (error) {
    console.error("Error fetching random cards:", error);
    res.status(500).json({ message: "Failed to fetch vocabulary cards." });
  }
};