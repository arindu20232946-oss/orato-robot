import mongoose from 'mongoose';
import Card from './src/models/card.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_learning_db';

// Helper function to generate a unique image URL based on the word
const getImageUrl = (word) => `https://picsum.photos/seed/${word}/400/400`;

const vocabularyData = [
  // --- Animals (1-20) ---
  { word: "Cat", definition: "A small domesticated carnivorous mammal.", imageUrl: getImageUrl("Cat"), difficultyLevel: "Beginner" },
  { word: "Dog", definition: "A domesticated carnivorous mammal, often kept as a pet.", imageUrl: getImageUrl("Dog"), difficultyLevel: "Beginner" },
  { word: "Elephant", definition: "A very large plant-eating mammal with a trunk.", imageUrl: getImageUrl("Elephant"), difficultyLevel: "Intermediate" },
  { word: "Bird", definition: "A warm-blooded egg-laying vertebrate with feathers and wings.", imageUrl: getImageUrl("Bird"), difficultyLevel: "Beginner" },
  { word: "Lion", definition: "A large, powerful cat living in prides in Africa.", imageUrl: getImageUrl("Lion"), difficultyLevel: "Intermediate" },
  { word: "Tiger", definition: "A large wild cat with a yellow-orange coat and dark stripes.", imageUrl: getImageUrl("Tiger"), difficultyLevel: "Intermediate" },
  { word: "Bear", definition: "A large, heavy mammal that walks on the soles of its feet.", imageUrl: getImageUrl("Bear"), difficultyLevel: "Beginner" },
  { word: "Monkey", definition: "A small to medium-sized primate that typically has a long tail.", imageUrl: getImageUrl("Monkey"), difficultyLevel: "Beginner" },
  { word: "Snake", definition: "A long limbless reptile which has no eyelids.", imageUrl: getImageUrl("Snake"), difficultyLevel: "Intermediate" },
  { word: "Frog", definition: "A tailless amphibian with a short stout body and long hind legs.", imageUrl: getImageUrl("Frog"), difficultyLevel: "Beginner" },
  { word: "Fish", definition: "A limbless cold-blooded vertebrate animal with gills and fins.", imageUrl: getImageUrl("Fish"), difficultyLevel: "Beginner" },
  { word: "Shark", definition: "A long-bodied marine fish with a cartilaginous skeleton.", imageUrl: getImageUrl("Shark"), difficultyLevel: "Intermediate" },
  { word: "Whale", definition: "A very large marine mammal with a streamlined hairless body.", imageUrl: getImageUrl("Whale"), difficultyLevel: "Intermediate" },
  { word: "Dolphin", definition: "A small gregarious toothed whale that typically has a beaklike snout.", imageUrl: getImageUrl("Dolphin"), difficultyLevel: "Advanced" },
  { word: "Penguin", definition: "A large flightless seabird of the southern hemisphere.", imageUrl: getImageUrl("Penguin"), difficultyLevel: "Intermediate" },
  { word: "Kangaroo", definition: "A large plant-eating marsupial with a long powerful tail.", imageUrl: getImageUrl("Kangaroo"), difficultyLevel: "Advanced" },
  { word: "Zebra", definition: "An African wild horse with black-and-white stripes.", imageUrl: getImageUrl("Zebra"), difficultyLevel: "Intermediate" },
  { word: "Giraffe", definition: "A large African mammal with a very long neck and forelegs.", imageUrl: getImageUrl("Giraffe"), difficultyLevel: "Intermediate" },
  { word: "Horse", definition: "A solid-hoofed plant-eating domesticated mammal.", imageUrl: getImageUrl("Horse"), difficultyLevel: "Beginner" },
  { word: "Cow", definition: "A fully grown female animal of a domesticated breed of ox.", imageUrl: getImageUrl("Cow"), difficultyLevel: "Beginner" },

  // --- Food & Drink (21-40) ---
  { word: "Apple", definition: "A round fruit with red or green skin and a whitish interior.", imageUrl: getImageUrl("Apple"), difficultyLevel: "Beginner" },
  { word: "Banana", definition: "A long curved fruit which grows in clusters.", imageUrl: getImageUrl("Banana"), difficultyLevel: "Beginner" },
  { word: "Orange", definition: "A round juicy citrus fruit with a tough bright reddish-yellow rind.", imageUrl: getImageUrl("Orange"), difficultyLevel: "Beginner" },
  { word: "Grape", definition: "A berry growing in clusters on a grapevine.", imageUrl: getImageUrl("Grape"), difficultyLevel: "Beginner" },
  { word: "Strawberry", definition: "A sweet fleshy red fruit.", imageUrl: getImageUrl("Strawberry"), difficultyLevel: "Intermediate" },
  { word: "Watermelon", definition: "A large melon with a hard green rind and sweet red juicy flesh.", imageUrl: getImageUrl("Watermelon"), difficultyLevel: "Intermediate" },
  { word: "Carrot", definition: "A tapering orange-colored root eaten as a vegetable.", imageUrl: getImageUrl("Carrot"), difficultyLevel: "Beginner" },
  { word: "Potato", definition: "A starchy plant tuber which is one of the most important food crops.", imageUrl: getImageUrl("Potato"), difficultyLevel: "Beginner" },
  { word: "Tomato", definition: "A glossy red, or occasionally yellow, pulpy edible fruit.", imageUrl: getImageUrl("Tomato"), difficultyLevel: "Beginner" },
  { word: "Onion", definition: "An edible bulb with a pungent taste and smell.", imageUrl: getImageUrl("Onion"), difficultyLevel: "Intermediate" },
  { word: "Bread", definition: "Food made of flour, water, and yeast mixed together and baked.", imageUrl: getImageUrl("Bread"), difficultyLevel: "Beginner" },
  { word: "Cheese", definition: "A food made from the pressed curds of milk.", imageUrl: getImageUrl("Cheese"), difficultyLevel: "Beginner" },
  { word: "Milk", definition: "An opaque white fluid rich in fat and protein.", imageUrl: getImageUrl("Milk"), difficultyLevel: "Beginner" },
  { word: "Water", definition: "A colorless, transparent, odorless liquid.", imageUrl: getImageUrl("Water"), difficultyLevel: "Beginner" },
  { word: "Coffee", definition: "A hot drink made from roasted and ground seeds.", imageUrl: getImageUrl("Coffee"), difficultyLevel: "Beginner" },
  { word: "Tea", definition: "A hot drink made by infusing dried crushed leaves.", imageUrl: getImageUrl("Tea"), difficultyLevel: "Beginner" },
  { word: "Juice", definition: "The liquid obtained from or present in fruit or vegetables.", imageUrl: getImageUrl("Juice"), difficultyLevel: "Beginner" },
  { word: "Pizza", definition: "A dish consisting of a flat round base of dough baked with a topping.", imageUrl: getImageUrl("Pizza"), difficultyLevel: "Beginner" },
  { word: "Burger", definition: "A flat round cake of minced beef, fried or grilled.", imageUrl: getImageUrl("Burger"), difficultyLevel: "Intermediate" },
  { word: "Salad", definition: "A cold dish of various mixtures of raw or cooked vegetables.", imageUrl: getImageUrl("Salad"), difficultyLevel: "Beginner" },

  // --- Household Objects (41-60) ---
  { word: "Chair", definition: "A separate seat for one person, typically with a back and four legs.", imageUrl: getImageUrl("Chair"), difficultyLevel: "Beginner" },
  { word: "Table", definition: "A piece of furniture with a flat top and one or more legs.", imageUrl: getImageUrl("Table"), difficultyLevel: "Beginner" },
  { word: "Bed", definition: "A piece of furniture for sleep or rest.", imageUrl: getImageUrl("Bed"), difficultyLevel: "Beginner" },
  { word: "Sofa", definition: "A long upholstered seat with a back and arms, for two or more people.", imageUrl: getImageUrl("Sofa"), difficultyLevel: "Intermediate" },
  { word: "Lamp", definition: "A device for giving light.", imageUrl: getImageUrl("Lamp"), difficultyLevel: "Beginner" },
  { word: "Television", definition: "A system for transmitting visual images and sound.", imageUrl: getImageUrl("Television"), difficultyLevel: "Intermediate" },
  { word: "Computer", definition: "An electronic device for storing and processing data.", imageUrl: getImageUrl("Computer"), difficultyLevel: "Intermediate" },
  { word: "Phone", definition: "A device used to talk to people who are far away.", imageUrl: getImageUrl("Phone"), difficultyLevel: "Beginner" },
  { word: "Book", definition: "A written or printed work consisting of pages glued or sewn together.", imageUrl: getImageUrl("Book"), difficultyLevel: "Beginner" },
  { word: "Pen", definition: "An instrument for writing or drawing with ink.", imageUrl: getImageUrl("Pen"), difficultyLevel: "Beginner" },
  { word: "Pencil", definition: "An instrument for writing or drawing, consisting of a thin stick of graphite.", imageUrl: getImageUrl("Pencil"), difficultyLevel: "Beginner" },
  { word: "Notebook", definition: "A small book with blank or ruled pages for writing notes in.", imageUrl: getImageUrl("Notebook"), difficultyLevel: "Intermediate" },
  { word: "Clock", definition: "A mechanical or electrical device for measuring time.", imageUrl: getImageUrl("Clock"), difficultyLevel: "Beginner" },
  { word: "Mirror", definition: "A reflective surface, now typically of glass coated with a metal amalgam.", imageUrl: getImageUrl("Mirror"), difficultyLevel: "Intermediate" },
  { word: "Window", definition: "An opening in the wall or roof of a building or vehicle.", imageUrl: getImageUrl("Window"), difficultyLevel: "Beginner" },
  { word: "Door", definition: "A hinged, sliding, or revolving barrier at the entrance to a building, room, or vehicle.", imageUrl: getImageUrl("Door"), difficultyLevel: "Beginner" },
  { word: "Key", definition: "A small piece of shaped metal with incisions cut to fit the wards of a particular lock.", imageUrl: getImageUrl("Key"), difficultyLevel: "Beginner" },
  { word: "Lock", definition: "A mechanism for keeping a door, lid, etc., fastened.", imageUrl: getImageUrl("Lock"), difficultyLevel: "Beginner" },
  { word: "Cup", definition: "A small bowl-shaped container for drinking from.", imageUrl: getImageUrl("Cup"), difficultyLevel: "Beginner" },
  { word: "Plate", definition: "A flat dish, typically circular, from which food is eaten or served.", imageUrl: getImageUrl("Plate"), difficultyLevel: "Beginner" },

  // --- Nature & Environment (61-80) ---
  { word: "Sun", definition: "The star around which the earth orbits.", imageUrl: getImageUrl("Sun"), difficultyLevel: "Beginner" },
  { word: "Moon", definition: "The natural satellite of the earth, visible by reflected light from the sun.", imageUrl: getImageUrl("Moon"), difficultyLevel: "Beginner" },
  { word: "Star", definition: "A fixed luminous point in the night sky.", imageUrl: getImageUrl("Star"), difficultyLevel: "Beginner" },
  { word: "Cloud", definition: "A visible mass of condensed water vapor floating in the atmosphere.", imageUrl: getImageUrl("Cloud"), difficultyLevel: "Beginner" },
  { word: "Rain", definition: "Moisture condensed from the atmosphere that falls visibly in separate drops.", imageUrl: getImageUrl("Rain"), difficultyLevel: "Beginner" },
  { word: "Snow", definition: "Atmospheric water vapor frozen into ice crystals.", imageUrl: getImageUrl("Snow"), difficultyLevel: "Beginner" },
  { word: "Wind", definition: "The perceptible natural movement of the air.", imageUrl: getImageUrl("Wind"), difficultyLevel: "Beginner" },
  { word: "Storm", definition: "A violent disturbance of the atmosphere with strong winds.", imageUrl: getImageUrl("Storm"), difficultyLevel: "Intermediate" },
  { word: "Tree", definition: "A woody perennial plant with a trunk and branches.", imageUrl: getImageUrl("Tree"), difficultyLevel: "Beginner" },
  { word: "Flower", definition: "The seed-bearing part of a plant, consisting of reproductive organs.", imageUrl: getImageUrl("Flower"), difficultyLevel: "Beginner" },
  { word: "Grass", definition: "Vegetation consisting of typically short plants with long narrow leaves.", imageUrl: getImageUrl("Grass"), difficultyLevel: "Beginner" },
  { word: "Mountain", definition: "A large natural elevation of the earth's surface.", imageUrl: getImageUrl("Mountain"), difficultyLevel: "Intermediate" },
  { word: "River", definition: "A large natural stream of water flowing in a channel to the sea.", imageUrl: getImageUrl("River"), difficultyLevel: "Intermediate" },
  { word: "Lake", definition: "A large body of water surrounded by land.", imageUrl: getImageUrl("Lake"), difficultyLevel: "Intermediate" },
  { word: "Ocean", definition: "A very large expanse of sea, in particular, each of the main areas into which the sea is divided.", imageUrl: getImageUrl("Ocean"), difficultyLevel: "Beginner" },
  { word: "Beach", definition: "A pebbly or sandy shore, especially by the ocean between high- and low-water marks.", imageUrl: getImageUrl("Beach"), difficultyLevel: "Beginner" },
  { word: "Forest", definition: "A large area covered chiefly with trees and undergrowth.", imageUrl: getImageUrl("Forest"), difficultyLevel: "Intermediate" },
  { word: "Desert", definition: "A dry, barren area of land, especially one covered with sand.", imageUrl: getImageUrl("Desert"), difficultyLevel: "Advanced" },
  { word: "Island", definition: "A piece of land surrounded by water.", imageUrl: getImageUrl("Island"), difficultyLevel: "Intermediate" },
  { word: "Valley", definition: "A low area of land between hills or mountains.", imageUrl: getImageUrl("Valley"), difficultyLevel: "Advanced" },

  // --- Actions & Abstract (81-100) ---
  { word: "Run", definition: "Move at a speed faster than a walk.", imageUrl: getImageUrl("Run"), difficultyLevel: "Beginner" },
  { word: "Walk", definition: "Move at a regular pace by lifting and setting down each foot in turn.", imageUrl: getImageUrl("Walk"), difficultyLevel: "Beginner" },
  { word: "Jump", definition: "Push oneself off a surface and into the air by using the muscles in one's legs and feet.", imageUrl: getImageUrl("Jump"), difficultyLevel: "Beginner" },
  { word: "Swim", definition: "Propel the body through water by using the limbs.", imageUrl: getImageUrl("Swim"), difficultyLevel: "Beginner" },
  { word: "Fly", definition: "Move through the air using wings.", imageUrl: getImageUrl("Fly"), difficultyLevel: "Beginner" },
  { word: "Read", definition: "Look at and comprehend the meaning of written or printed matter.", imageUrl: getImageUrl("Read"), difficultyLevel: "Beginner" },
  { word: "Write", definition: "Mark letters, words, or other symbols on a surface, typically paper, with a pen, pencil, or similar implement.", imageUrl: getImageUrl("Write"), difficultyLevel: "Beginner" },
  { word: "Speak", definition: "Say something in order to convey information, an opinion, or a feeling.", imageUrl: getImageUrl("Speak"), difficultyLevel: "Beginner" },
  { word: "Listen", definition: "Give one's attention to a sound.", imageUrl: getImageUrl("Listen"), difficultyLevel: "Beginner" },
  { word: "Think", definition: "Have a particular opinion, belief, or idea about someone or something.", imageUrl: getImageUrl("Think"), difficultyLevel: "Intermediate" },
  { word: "Smile", definition: "Form one's features into a pleased, kind, or amused expression.", imageUrl: getImageUrl("Smile"), difficultyLevel: "Beginner" },
  { word: "Laugh", definition: "Make the spontaneous sounds and movements of the face and body that are the instinctive expressions of lively amusement.", imageUrl: getImageUrl("Laugh"), difficultyLevel: "Beginner" },
  { word: "Cry", definition: "Shed tears, typically as an expression of distress, pain, or sorrow.", imageUrl: getImageUrl("Cry"), difficultyLevel: "Beginner" },
  { word: "Sleep", definition: "Provide a person with a bed or room to sleep in.", imageUrl: getImageUrl("Sleep"), difficultyLevel: "Beginner" },
  { word: "Wake", definition: "Emerge or cause to emerge from a state of sleep; stop sleeping.", imageUrl: getImageUrl("Wake"), difficultyLevel: "Beginner" },
  { word: "Eat", definition: "Put food into the mouth and chew and swallow it.", imageUrl: getImageUrl("Eat"), difficultyLevel: "Beginner" },
  { word: "Drink", definition: "Take a liquid into the mouth and swallow.", imageUrl: getImageUrl("Drink"), difficultyLevel: "Beginner" },
  { word: "Work", definition: "Activity involving mental or physical effort done in order to achieve a purpose or result.", imageUrl: getImageUrl("Work"), difficultyLevel: "Beginner" },
  { word: "Play", definition: "Engage in activity for enjoyment and recreation rather than a serious or practical purpose.", imageUrl: getImageUrl("Play"), difficultyLevel: "Beginner" },
  { word: "Study", definition: "The devotion of time and attention to acquiring knowledge on an academic subject.", imageUrl: getImageUrl("Study"), difficultyLevel: "Intermediate" }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB...");
    
    // Clear the existing cards to prevent duplicates
    await Card.deleteMany({}); 
    console.log("Old cards cleared.");

    // Insert the 100 new cards
    await Card.insertMany(vocabularyData);
    console.log(`Database seeded successfully with ${vocabularyData.length} cards!`);
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });