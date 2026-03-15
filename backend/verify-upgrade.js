import mongoose from 'mongoose';
import User from './src/models/user.js';
import Quiz from './src/models/quiz.js';
import QuizResult from './src/models/quizResult.js';
import ListeningContent from './src/models/listeningContent.js';
import ListeningProgress from './src/models/listeningProgress.js';
import ReadingContent from './src/models/readingContent.js';
import ReadingProgress from './src/models/readingProgress.js';
import GrammarProgress from './src/models/grammarProgress.js';
import Settings from './src/models/settings.model.js';
import { checkAndUpgradeLevel } from './src/services/progressService.js';

const MONGODB_URI = 'mongodb://localhost:27017/orato';

async function verifyUpgrade() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Find or create a test user
    const email = 'testuser@example.com';
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName: 'Test User',
        email,
        password: 'password123',
        skillLevel: 'beginner'
      });
    } else {
      user.skillLevel = 'beginner';
      await user.save();
    }
    const userId = user._id;

    // 2. Ensure settings exist and notification is ON
    await Settings.findOneAndUpdate(
      { userId },
      { 'notifications.progressUpdates': true, skillLevel: 'beginner' },
      { upsert: true }
    );

    console.log(`Starting verification for user: ${user.fullName} (${userId})`);
    console.log(`Current Level: ${user.skillLevel}`);

    // 3. Clear existing progress for test user
    await QuizResult.deleteMany({ userId });
    await ListeningProgress.deleteMany({ userId });
    await ReadingProgress.deleteMany({ userId });
    await GrammarProgress.deleteMany({ userId });

    // 4. Create Dummy Progress
    
    // Vocabulary Quizzes
    const vocabQuizzes = await Quiz.find({ difficulty: 'Beginner', category: 'Vocabulary' }).limit(10);
    if (vocabQuizzes.length === 0) {
      console.log('⚠️ No vocabulary quizzes found in DB. Creating dummy ones...');
      for (let i = 1; i <= 10; i++) {
        await Quiz.create({
          title: `Vocab Quiz ${i}`,
          category: 'Vocabulary',
          difficulty: 'Beginner',
          questions: [{ text: 'Q1', options: ['A', 'B'], correctAnswer: 0 }]
        });
      }
    }
    const finalVocabQuizzes = await Quiz.find({ difficulty: 'Beginner', category: 'Vocabulary' }).limit(10);
    for (const quiz of finalVocabQuizzes) {
      await QuizResult.create({
        userId,
        quizId: quiz._id,
        score: 100,
        totalQuestions: 5,
        correctAnswers: 5
      });
    }
    console.log(`- Created ${finalVocabQuizzes.length} vocab results`);

    // Listening Items
    const listeningItems = await ListeningContent.find({ level: 'beginner' }).limit(10);
    if (listeningItems.length === 0) {
      console.log('⚠️ No listening items found. Creating dummy ones...');
      for (let i = 1; i <= 10; i++) {
        await ListeningContent.create({
          level: 'beginner',
          order: i,
          title: `Listening ${i}`,
          content: 'Some audio text',
          questions: [
            { text: 'Q1', options: ['A', 'B'], correctAnswer: 0 },
            { text: 'Q2', options: ['A', 'B'], correctAnswer: 0 },
            { text: 'Q3', options: ['A', 'B'], correctAnswer: 0 }
          ]
        });
      }
    }
    const finalListeningItems = await ListeningContent.find({ level: 'beginner' }).limit(10);
    for (const item of finalListeningItems) {
      await ListeningProgress.create({
        userId,
        contentId: item._id,
        completed: true
      });
    }
    console.log(`- Created ${finalListeningItems.length} listening results`);

    // Reading Items
    const readingItems = await ReadingContent.find({ level: 'beginner' }).limit(10);
    if (readingItems.length === 0) {
      console.log('⚠️ No reading items found. Creating dummy ones...');
      for (let i = 1; i <= 10; i++) {
        await ReadingContent.create({
          title: `Reading ${i}`,
          type: 'paragraph',
          level: 'beginner',
          order: i,
          content: 'Some text',
          questions: [{ questionText: 'Q1', type: 'mcq', options: ['A', 'B'], correctAnswer: 'A' }]
        });
      }
    }
    const finalReadingItems = await ReadingContent.find({ level: 'beginner' }).limit(10);
    for (const item of finalReadingItems) {
      await ReadingProgress.create({
        userId,
        readingContentId: item._id,
        level: 'beginner',
        order: item.order,
        completed: true
      });
    }
    console.log(`- Created ${finalReadingItems.length} reading results`);

    // Grammar Levels
    await GrammarProgress.findOneAndUpdate(
      { userId, skillLevel: 'beginner' },
      {
        completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        isCompleted: true
      },
      { upsert: true }
    );
    console.log(`- Created grammar progress`);

    // 5. Run the upgrade check
    console.log('\nRunning checkAndUpgradeLevel...');
    const result = await checkAndUpgradeLevel(userId);
    
    // 6. Verify Results
    const updatedUser = await User.findById(userId);
    const updatedSettings = await Settings.findOne({ userId });

    console.log('\n--- VERIFICATION RESULTS ---');
    console.log(`Service Result: upgraded=${result.upgraded}, newLevel=${result.newLevel}`);
    console.log(`User skillLevel: ${updatedUser.skillLevel}`);
    console.log(`Settings skillLevel: ${updatedSettings.skillLevel}`);
    
    if (updatedUser.skillLevel === 'intermediate' && result.upgraded) {
      console.log('\n✅ SUCCESS: User upgraded automatically!');
    } else {
      console.log('\n❌ FAILURE: Upgrade did not happen as expected.');
      console.log('Reason if provided:', result.reason);
    }

    process.exit();
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
}

verifyUpgrade();
