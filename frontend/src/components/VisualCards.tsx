import React, { useState, useEffect } from 'react';
import API from '../services/api';

// 1. Define TypeScript Interface based on our MongoDB Schema
interface CardData {
  _id: string;
  word: string;
  definition: string;
  imageUrl: string;
  difficultyLevel: string;
}

const VisualCards: React.FC = () => {
  // State Management
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Fetch data from backend when the component loads
  useEffect(() => {
    fetchRandomCards();
  }, []);

  const fetchRandomCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/cards/random');
      setCards(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not load vocabulary cards. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Audio Pronunciation Feature (Using Browser Native Speech Synthesis)
  const playAudio = (e: React.MouseEvent, wordToSpeak: string) => {
    e.stopPropagation(); // Prevents the card from flipping back over when clicking the button
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(wordToSpeak);
      utterance.lang = 'en-US'; // Set to American English
      utterance.rate = 0.9;     // Slightly slower for learners
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech!");
    }
  };

  // 4. Navigation Handlers
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleNextCard = () => {
    setIsFlipped(false); // Reset flip state for the next card
    
    // Wait for the flip animation to finish before changing the content
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Deck finished, fetch a new random batch and reset to index 0
        setCurrentIndex(0);
        fetchRandomCards();
      }
    }, 300); 
  };

   // 5. Render States
  if (loading) return <div className="text-center p-12 text-lg text-gray-500">Loading your vocabulary deck...</div>;
  if (error) return <div className="text-center p-12 text-lg text-red-500">{error}</div>;
  if (cards.length === 0) return <div className="text-center p-12 text-lg text-gray-500">No cards found in the database.</div>;

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center font-sans max-w-[600px] mx-auto mt-10 p-5 bg-gray-50 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Visual Vocabulary</h2>
      <div className="text-gray-500 text-sm mb-5 font-bold">
        Card {currentIndex + 1} of {cards.length} • {currentCard.difficultyLevel}
      </div>

      {/* The 3D Card Container */}
      <div 
        className="w-full max-w-[400px] h-[400px] bg-transparent cursor-pointer mb-8 [perspective:1000px]"
        onClick={handleFlip}
      >
        <div 
          className={`relative w-full h-full text-center transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        >
          
          {/* FRONT OF CARD: Image Only */}
          <div className="absolute w-full h-full [backface-visibility:hidden] rounded-2xl shadow-lg flex flex-col justify-center items-center p-5 overflow-hidden bg-white">
            <img 
              src={currentCard.imageUrl} 
              alt={currentCard.word} 
              className="w-full h-4/5 object-cover rounded-lg mb-2.5"
            />
            <p className="text-gray-400 text-sm m-0 uppercase tracking-wide">
              Click card to reveal meaning
            </p>
          </div>

          {/* BACK OF CARD: Word, Definition, and Audio */}
          <div className="absolute w-full h-full [backface-visibility:hidden] rounded-2xl shadow-lg flex flex-col justify-center items-center p-5 overflow-hidden bg-blue-600 text-white [transform:rotateY(180deg)]">
            <h3 className="text-5xl m-0 mb-2.5 capitalize">{currentCard.word}</h3>
            <p className="text-xl leading-relaxed mb-7 opacity-90">{currentCard.definition}</p>
            
            <button 
              className="bg-white text-blue-600 border-none py-2.5 px-5 rounded-full font-bold cursor-pointer flex items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_4px_12px_rgba(255,255,255,0.3)]"
              onClick={(e) => playAudio(e, currentCard.word)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              Listen
            </button>
          </div>
          
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button 
          className={`py-3 px-6 text-base border-none rounded-lg cursor-pointer font-bold transition-colors ${
            currentIndex === cards.length - 1 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-blue-600 text-white hover:bg-blue-800'
          }`} 
          onClick={handleNextCard}
        >
          {currentIndex === cards.length - 1 ? "Get New Random Deck" : "Next Word"}
        </button>
      </div>
    </div>
  );
};

export default VisualCards;