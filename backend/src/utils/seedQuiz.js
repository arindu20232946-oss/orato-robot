import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Quiz from '../models/quiz.js';

const seedQuizzes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Quiz.deleteMany({});
    console.log('🗑️  Cleared existing quizzes');

    await Quiz.insertMany([

      // ─── QUIZ 1: Present Tense (Beginner) ───────────────────────────────────
      {
        title: 'Present Tense Quiz',
        category: 'Grammar',
        difficulty: 'Beginner',
        description: 'Test your knowledge of English present tense',
        icon: '📝',
        iconBg: 'bg-blue-100',
        timeLimit: 10,
        points: 50,
        questions: [
          {
            text: 'Which sentence uses the correct present tense?',
            options: ['She go to school', 'She goes to school', 'She going to school', 'She gone to school'],
            correctAnswer: 1,
            explanation: '"She goes" is correct — with third person singular (she/he/it) we add -s to the verb.'
          },
          {
            text: 'Fill in the blank: "I ___ English every day."',
            options: ['studies', 'study', 'studied', 'studying'],
            correctAnswer: 1,
            explanation: '"study" is correct — with "I" we use the base form of the verb.'
          },
          {
            text: 'Which is the correct negative form? "She ___ like coffee."',
            options: ["don't", "doesn't", 'not', "isn't"],
            correctAnswer: 1,
            explanation: '"doesn\'t" is used with third person singular (she/he/it).'
          },
          {
            text: 'Which sentence is in the simple present tense?',
            options: ['He was reading a book', 'He reads a book every night', 'He will read a book', 'He has read a book'],
            correctAnswer: 1,
            explanation: '"reads" is simple present tense used for habits and routines.'
          },
          {
            text: 'Choose the correct form: "They ___ football every Sunday."',
            options: ['plays', 'play', 'played', 'playing'],
            correctAnswer: 1,
            explanation: 'With plural subjects like "they", we use the base form without -s.'
          }
        ]
      },

      // ─── QUIZ 2: Daily Vocabulary (Beginner) ────────────────────────────────
      {
        title: 'Daily Vocabulary Quiz',
        category: 'Vocabulary',
        difficulty: 'Beginner',
        description: 'Learn common English words used in daily life',
        icon: '📖',
        iconBg: 'bg-green-100',
        timeLimit: 8,
        points: 10,
        questions: [
          {
            text: 'What does "grateful" mean?',
            options: ['Angry', 'Thankful', 'Sad', 'Excited'],
            correctAnswer: 1,
            explanation: '"Grateful" means feeling or showing thanks.'
          },
          {
            text: 'Which word means "very tired"?',
            options: ['Energetic', 'Happy', 'Exhausted', 'Confused'],
            correctAnswer: 2,
            explanation: '"Exhausted" means extremely tired.'
          },
          {
            text: 'What is the opposite of "ancient"?',
            options: ['Old', 'Modern', 'Large', 'Heavy'],
            correctAnswer: 1,
            explanation: '"Modern" means recent or new, opposite of ancient.'
          },
          {
            text: 'What does "enormous" mean?',
            options: ['Very small', 'Very fast', 'Very large', 'Very loud'],
            correctAnswer: 2,
            explanation: '"Enormous" means extremely large in size.'
          },
          {
            text: 'Which word means "to look at something carefully"?',
            options: ['Glance', 'Examine', 'Ignore', 'Blink'],
            correctAnswer: 1,
            explanation: '"Examine" means to inspect or look at something carefully.'
          }
        ]
      },

      // ─── QUIZ 3: Intermediate Grammar ───────────────────────────────────────
      {
        title: 'Intermediate Grammar Quiz',
        category: 'Grammar',
        difficulty: 'Intermediate',
        description: 'Test your intermediate English grammar skills',
        icon: '✍️',
        iconBg: 'bg-purple-100',
        timeLimit: 15,
        points: 25,
        questions: [
          {
            text: 'Which sentence is in the past perfect tense?',
            options: [
              'She was eating when I called',
              'She had already eaten when I called',
              'She ate before I called',
              'She will have eaten by then'
            ],
            correctAnswer: 1,
            explanation: 'Past perfect uses "had + past participle" to show an action completed before another past action.'
          },
          {
            text: 'Choose the correct first conditional: "If it rains, I ___ stay home."',
            options: ['would', 'will', 'had', 'have'],
            correctAnswer: 1,
            explanation: 'First conditional uses "will" for real or possible future situations.'
          },
          {
            text: 'Which sentence is grammatically correct?',
            options: [
              'The list of items are on the desk',
              'The list of items is on the desk',
              'The lists of item is on the desk',
              'The list of item are on the desk'
            ],
            correctAnswer: 1,
            explanation: '"List" is the subject (singular), so the verb must be "is".'
          },
          {
            text: 'Which sentence is grammatically correct?',
            options: [
              'Him and me are going',
              'He and me are going',
              'Me and him are going',
              'He and I are going'
            ],
            correctAnswer: 3,
            explanation: 'Compound subjects require pronouns in the subjective case: "He and I".'
          },
          {
            text: 'Choose the correct passive voice: "Someone broke the window."',
            options: [
              'The window is broken',
              'The window was broken',
              'The window has broken',
              'The window broke'
            ],
            correctAnswer: 1,
            explanation: 'Passive voice in past tense uses "was/were + past participle": "The window was broken."'
          }
        ]
      },

      // ─── QUIZ 4: Advanced Grammar ────────────────────────────────────────────
      {
        title: 'Advanced Grammar Quiz',
        category: 'Grammar',
        difficulty: 'Advanced',
        description: 'Challenge your advanced English grammar knowledge',
        icon: '🖋️',
        iconBg: 'bg-red-100',
        timeLimit: 20,
        points: 40,
        questions: [
          {
            text: 'Which sentence correctly uses advanced pronoun case?',
            options: [
              'Me and him went to the library',
              'He and I went to the library',
              'Him and I went to the library',
              'Me and he went to the library'
            ],
            correctAnswer: 1,
            explanation: 'Compound subjects require pronouns in the subjective case: "He and I".'
          },
          {
            text: 'Which sentence maintains proper parallel structure?',
            options: [
              'The committee valued honesty, punctuality, and hard work',
              'The committee valued honesty, being punctual, and that members worked hard',
              'The committee valued honesty, punctuality, and working hard',
              'The committee valued honesty, punctuality, and that members were hardworking'
            ],
            correctAnswer: 0,
            explanation: 'Parallelism requires consistent grammatical forms. Option A uses three nouns: honesty, punctuality, hard work.'
          },
          {
            text: 'Which sentence correctly uses a non-restrictive clause?',
            options: [
              'My brother who lives in Canada is visiting next week',
              'My brother, who lives in Canada, is visiting next week',
              'My brother, who lives in Canada is visiting next week',
              'My brother who lives in Canada, is visiting next week'
            ],
            correctAnswer: 1,
            explanation: 'Non-restrictive clauses add extra information and must be set off by commas on both sides.'
          },
          {
            text: 'Which sentence correctly uses reported speech?',
            options: [
              'She said she will finish the report yesterday',
              'She said she would finish the report yesterday',
              'She said she will finish the report tomorrow',
              'She said she would finish the report tomorrow'
            ],
            correctAnswer: 3,
            explanation: 'Reported speech requires backshifting: "will" becomes "would". Since the time reference is future (tomorrow), option D is correct.'
          },
          {
            text: 'Which sentence demonstrates correct article usage with abstract nouns?',
            options: [
              'She has a knowledge of French literature',
              'She has knowledge of French literature',
              'She has the knowledge of French literature',
              'She has an knowledge of French literature'
            ],
            correctAnswer: 1,
            explanation: 'Abstract nouns like "knowledge" are uncountable and generally take no article unless specified.'
          }
        ]
      },

      // ─── QUIZ 5: Intermediate Vocabulary ───────────────────────────────────
      {
        title: 'Intermediate Vocabulary Quiz',
        category: 'Vocabulary',
        difficulty: 'Intermediate',
        description: 'Enhance your vocabulary with intermediate words',
        icon: '📚',
        iconBg: 'bg-yellow-100',
        timeLimit: 12,
        points: 20,
        questions: [
          {
            text: 'What is a synonym for "abundant"?',
            options: ['Scarce', 'Plentiful', 'Rare', 'Few'],
            correctAnswer: 1,
            explanation: '"Abundant" means existing or available in large quantities; plentiful.'
          },
          {
            text: 'What does "meticulous" mean?',
            options: ['Careless', 'Sloppy', 'Thorough', 'Quick'],
            correctAnswer: 2,
            explanation: '"Meticulous" means showing great attention to detail; very careful and precise.'
          },
          {
            text: 'Which word means "to make something less severe"?',
            options: ['Aggravate', 'Worsen', 'Mitigate', 'Intensify'],
            correctAnswer: 2,
            explanation: '"Mitigate" means make less severe, serious, or painful.'
          },
          {
            text: 'What is the opposite of "ambiguous"?',
            options: ['Clear', 'Vague', 'Uncertain', 'Obscure'],
            correctAnswer: 0,
            explanation: '"Ambiguous" means open to more than one interpretation; clear is its opposite.'
          },
          {
            text: 'Which word means "a person who is deeply involved in reading"?',
            options: ['Bookworm', 'Athlete', 'Musician', 'Artist'],
            correctAnswer: 0,
            explanation: '"Bookworm" is an informal term for a person devoted to reading.'
          }
        ]
      },

      // ─── QUIZ 6: Advanced Vocabulary ──────────────────────────────────────
      {
        title: 'Advanced Vocabulary Quiz',
        category: 'Vocabulary',
        difficulty: 'Advanced',
        description: 'Master complex English vocabulary',
        icon: '🎓',
        iconBg: 'bg-indigo-100',
        timeLimit: 15,
        points: 30,
        questions: [
          {
            text: 'What does the word "ephemeral" signify?',
            options: ['Eternal', 'Short-lived', 'Permanent', 'Endless'],
            correctAnswer: 1,
            explanation: '"Ephemeral" means lasting for a very short time.'
          },
          {
            text: 'Choose the correct synonym for "ubiquitous":',
            options: ['Rare', 'Omnipresent', 'Isolated', 'Hidden'],
            correctAnswer: 1,
            explanation: '"Ubiquitous" means present, appearing, or found everywhere.'
          },
          {
            text: 'Which of the following is an antonym for "cacophony"?',
            options: ['Noise', 'Clamor', 'Harmony', 'Uproar'],
            correctAnswer: 2,
            explanation: '"Cacophony" is a harsh discordant mixture of sounds, so its antonym is harmony.'
          },
          {
            text: 'What does "esoteric" mean?',
            options: ['Common', 'Understood by few', 'Public', 'Obvious'],
            correctAnswer: 1,
            explanation: '"Esoteric" refers to something intended for or likely to be understood by only a small number of people.'
          },
          {
            text: 'Which word means "having a stubbornly uncooperative attitude"?',
            options: ['Compliant', 'Docile', 'Recalcitrant', 'Amenable'],
            correctAnswer: 2,
            explanation: '"Recalcitrant" means having a stubbornly uncooperative attitude towards authority or discipline.'
          }
        ]
      }

    ]);

    console.log('❓ Quizzes seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedQuizzes();