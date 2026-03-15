import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import GrammarQuestion from '../models/grammarQuestion.js';

dotenv.config();

const grammarQuestions = [
  // BEGINNER LEVEL 1
  { text: "Which sentence uses the correct present tense?", options: ["She go to school", "She goes to school", "She going to school", "She gone to school"], correctAnswer: 1, explanation: "With third person singular (she/he/it), we add -s to the verb.", level: 1, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["He play tennis", "He plays tennis", "He playing tennis", "He played tennis"], correctAnswer: 1, explanation: "Third person singular verbs need -s: play -> plays", level: 1, skillLevel: "beginner", category: "grammar" },
  { text: "Which is correct?", options: ["I am liking coffee", "I like coffee", "I liking coffee", "I am like coffee"], correctAnswer: 1, explanation: "Use base form 'like' with 'I', not 'am liking'.", level: 1, skillLevel: "beginner", category: "grammar" },
  { text: "Select the correct present tense sentence:", options: ["They works hard", "They working hard", "They work hard", "They are work hard"], correctAnswer: 2, explanation: "With 'they', use the base form without -s.", level: 1, skillLevel: "beginner", category: "grammar" },
  { text: "What is the correct form?", options: ["The cat eats fish", "The cat eat fish", "The cat eating fish", "The cat ate fish"], correctAnswer: 0, explanation: "Third person singular: cat eats (adds -s).", level: 1, skillLevel: "beginner", category: "grammar" },

  // BEGINNER LEVEL 2
  { text: "Which sentence is in the past tense?", options: ["She eats breakfast", "She ate breakfast", "She eating breakfast", "She eat breakfast"], correctAnswer: 1, explanation: "Past tense of 'eat' is 'ate'.", level: 2, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct past tense form:", options: ["I goed to school", "I went to school", "I go to school", "I going to school"], correctAnswer: 1, explanation: "'Went' is the past tense of 'go'.", level: 2, skillLevel: "beginner", category: "grammar" },
  { text: "Select the correct sentence:", options: ["He writed a letter", "He wrote a letter", "He write a letter", "He writing a letter"], correctAnswer: 1, explanation: "'Wrote' is the past tense of 'write'.", level: 2, skillLevel: "beginner", category: "grammar" },
  { text: "Which is the correct past tense?", options: ["They saw the movie", "They see the movie", "They seen the movie", "They seeing the movie"], correctAnswer: 0, explanation: "'Saw' is the past tense of 'see'.", level: 2, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct past tense sentence:", options: ["She buyed a car", "She bought a car", "She buy a car", "She buying a car"], correctAnswer: 1, explanation: "'Bought' is the past tense of 'buy'.", level: 2, skillLevel: "beginner", category: "grammar" },

  // BEGINNER LEVEL 3
  { text: "Which sentence uses 'will' for future?", options: ["I will go tomorrow", "I am going tomorrow", "I go tomorrow", "I going tomorrow"], correctAnswer: 0, explanation: "'Will go' expresses a future action.", level: 3, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["She will arrives early", "She will arrive early", "She will arriving early", "She arriving early"], correctAnswer: 1, explanation: "Use base form 'arrive' after 'will'.", level: 3, skillLevel: "beginner", category: "grammar" },
  { text: "Which is correct for planned future?", options: ["I will visit my grandmother", "I am going to visit my grandmother", "I visit my grandmother", "I visited my grandmother"], correctAnswer: 1, explanation: "'Going to' expresses a planned future action.", level: 3, skillLevel: "beginner", category: "grammar" },
  { text: "Select the correct future tense:", options: ["They will to leave", "They will leave", "They leaving", "They leave"], correctAnswer: 1, explanation: "Use base form 'leave' after 'will'.", level: 3, skillLevel: "beginner", category: "grammar" },
  { text: "Which sentence is correct?", options: ["He will be happy", "He will is happy", "He will happy", "He will being happy"], correctAnswer: 0, explanation: "'Will be' forms the future tense of 'be'.", level: 3, skillLevel: "beginner", category: "grammar" },

  // BEGINNER LEVEL 4
  { text: "Which modal verb expresses ability?", options: ["She can swim", "She must swim", "She should swim", "She will swim"], correctAnswer: 0, explanation: "'Can' expresses ability to do something.", level: 4, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["You may to enter", "You may enter", "You may entering", "You may entered"], correctAnswer: 1, explanation: "'May' is followed by base form 'enter'.", level: 4, skillLevel: "beginner", category: "grammar" },
  { text: "Which expresses permission?", options: ["Could I use your phone", "I can use your phone", "I must use your phone", "I will use your phone"], correctAnswer: 0, explanation: "'Could' is a polite way to ask permission.", level: 4, skillLevel: "beginner", category: "grammar" },
  { text: "Select the correct sentence:", options: ["She can to dance", "She can dance", "She can dancing", "She can danced"], correctAnswer: 1, explanation: "'Can' is followed by base form 'dance'.", level: 4, skillLevel: "beginner", category: "grammar" },
  { text: "Which expresses possibility?", options: ["It could rain", "It must rain", "It should rain", "It would rain"], correctAnswer: 0, explanation: "'Could' expresses possibility.", level: 4, skillLevel: "beginner", category: "grammar" },

  // BEGINNER LEVEL 5
  { text: "Which article comes before 'apple'?", options: ["an apple", "the apple", "a apple", "apple"], correctAnswer: 0, explanation: "'An' is used before vowel sounds: an apple.", level: 5, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct article:", options: ["I need a book", "I need an book", "I need the book", "I need book"], correctAnswer: 0, explanation: "'A' is used before consonant sounds.", level: 5, skillLevel: "beginner", category: "grammar" },
  { text: "Which is correct?", options: ["She is honest person", "She is an honest person", "She is the honest person", "She is honest person"], correctAnswer: 1, explanation: "'An' comes before vowel sound: honest begins with 'o' sound.", level: 5, skillLevel: "beginner", category: "grammar" },
  { text: "Select the correct sentence:", options: ["I have cat", "I have a cat", "I have the cat", "I have an cat"], correctAnswer: 1, explanation: "Use 'a' before consonant sounds: a cat.", level: 5, skillLevel: "beginner", category: "grammar" },
  { text: "Which is correct?", options: ["He is university student", "He is a university student", "He is the university student", "He is an university student"], correctAnswer: 1, explanation: "'A' before consonant sound: a university student.", level: 5, skillLevel: "beginner", category: "grammar" },

  // BEGINNER LEVEL 6
  { text: "Which word is an adjective?", options: ["quickly", "run", "happy", "always"], correctAnswer: 2, explanation: "'Happy' describes a noun - it's an adjective.", level: 6, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct adverb:", options: ["She sings beautiful", "She sings beautifully", "She beautiful sings", "She beautiful"], correctAnswer: 1, explanation: "Adverbs end in -ly and modify verbs.", level: 6, skillLevel: "beginner", category: "grammar" },
  { text: "Select the correct sentence:", options: ["He is very tall", "He is tall very", "Very he is tall", "He is tall"], correctAnswer: 0, explanation: "Place adverb 'very' before adjective 'tall'.", level: 6, skillLevel: "beginner", category: "grammar" },
  { text: "Which is an adjective?", options: ["quickly", "beautiful", "carefully", "usually"], correctAnswer: 1, explanation: "'Beautiful' describes a noun - it's an adjective.", level: 6, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct adverb:", options: ["She drives careful", "She drives carefully", "She careful drives", "She drives"], correctAnswer: 1, explanation: "Adverbs modify verbs: drives carefully.", level: 6, skillLevel: "beginner", category: "grammar" },

  // BEGINNER LEVEL 7
  { text: "Which preposition shows location?", options: ["The book is in the bag", "The book is on the bag", "The book is at the bag", "Both A and B"], correctAnswer: 3, explanation: "'In' means inside, 'on' means on top of.", level: 7, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct preposition:", options: ["She lives in London", "She lives at London", "She lives on London", "She lives to London"], correctAnswer: 0, explanation: "Use 'in' with cities: in London.", level: 7, skillLevel: "beginner", category: "grammar" },
  { text: "Which is correct?", options: ["The cat is under the table", "The cat is in the table", "The cat is on the table", "The cat is to the table"], correctAnswer: 0, explanation: "'Under' means below or beneath.", level: 7, skillLevel: "beginner", category: "grammar" },
  { text: "Select the correct preposition:", options: ["I go to school", "I go at school", "I go in school", "I go on school"], correctAnswer: 0, explanation: "Use 'to' with school: go to school.", level: 7, skillLevel: "beginner", category: "grammar" },
  { text: "Which is correct?", options: ["The meeting is at 3pm", "The meeting is on 3pm", "The meeting is in 3pm", "The meeting is to 3pm"], correctAnswer: 0, explanation: "Use 'at' with specific times: at 3pm.", level: 7, skillLevel: "beginner", category: "grammar" },

  // BEGINNER LEVEL 8
  { text: "Which conjunction joins two sentences?", options: ["and", "quickly", "happy", "table"], correctAnswer: 0, explanation: "'And' connects two related ideas or actions.", level: 8, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["I like tea but coffee", "I like tea but I like coffee", "I like tea but I like not coffee", "I like tea and coffee"], correctAnswer: 1, explanation: "'But' shows contrast between two complete ideas.", level: 8, skillLevel: "beginner", category: "grammar" },
  { text: "Which is a conjunction?", options: ["quickly", "because", "happy", "under"], correctAnswer: 1, explanation: "'Because' connects reasons - it's a conjunction.", level: 8, skillLevel: "beginner", category: "grammar" },
  { text: "Select the correct sentence:", options: ["I am tired because I worked hard", "I am tired because hard worked", "Because I am tired", "I worked hard because"], correctAnswer: 0, explanation: "'Because' connects cause and effect.", level: 8, skillLevel: "beginner", category: "grammar" },
  { text: "Which is correct?", options: ["She is rich but happy", "She rich but happy", "She is rich but is happy", "She is rich happy"], correctAnswer: 0, explanation: "'But' joins two adjectives describing the subject.", level: 8, skillLevel: "beginner", category: "grammar" },

  // BEGINNER LEVEL 9
  { text: "Which is a possessive pronoun?", options: ["I", "you", "my", "he"], correctAnswer: 2, explanation: "'My' shows possession - it's a possessive adjective.", level: 9, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["This is my book", "This is mine book", "This is my's book", "This is book mine"], correctAnswer: 0, explanation: "Use 'my' before nouns: my book.", level: 9, skillLevel: "beginner", category: "grammar" },
  { text: "Which is correct?", options: ["Her is a teacher", "She is a teacher", "She teacher", "Her teacher"], correctAnswer: 1, explanation: "'She' is a subject pronoun.", level: 9, skillLevel: "beginner", category: "grammar" },
  { text: "Select the correct possessive:", options: ["This is his car", "This is him car", "This is he car", "This is car's his"], correctAnswer: 0, explanation: "'His' is both a possessive adjective and pronoun.", level: 9, skillLevel: "beginner", category: "grammar" },
  { text: "Which is correct?", options: ["Your name is what", "What is your name", "Your what name is", "What your name is"], correctAnswer: 1, explanation: "Question word order: What + is + your + name?", level: 9, skillLevel: "beginner", category: "grammar" },

  // BEGINNER LEVEL 10
  { text: "Which is the correct question form?", options: ["You like coffee?", "Do you like coffee?", "Like you coffee?", "You do like coffee?"], correctAnswer: 1, explanation: "Use auxiliary 'do' for questions: Do you like...?", level: 10, skillLevel: "beginner", category: "grammar" },
  { text: "Choose the correct question:", options: ["Where she lives?", "Where does she live?", "Where she live?", "Where she does live?"], correctAnswer: 1, explanation: "Question form: Where + does + she + live?", level: 10, skillLevel: "beginner", category: "grammar" },
  { text: "Which is correct?", options: ["What time is it?", "What time it is?", "It is what time?", "What is time it?"], correctAnswer: 0, explanation: "Question: What + is + it?", level: 10, skillLevel: "beginner", category: "grammar" },
  { text: "Select the correct question:", options: ["Who you are?", "Who are you?", "You are who?", "Who you are"], correctAnswer: 1, explanation: "Question: Who + are + you?", level: 10, skillLevel: "beginner", category: "grammar" },
  { text: "Which is correct?", options: ["Why you are sad?", "Why are you sad?", "You are why sad?", "Why sad you are?"], correctAnswer: 1, explanation: "Question: Why + are + you + sad?", level: 10, skillLevel: "beginner", category: "grammar" },

  // INTERMEDIATE LEVEL 1 - Present Perfect vs Past Simple
  { text: "Choose the correct sentence:", options: ["I have seen that movie last week", "I saw that movie last week", "I have gone to that movie last week", "I see that movie last week"], correctAnswer: 1, explanation: "Use past simple for specific time expressions like 'last week'.", level: 1, skillLevel: "intermediate", category: "grammar" },
  { text: "Which sentence uses present perfect correctly?", options: ["She has left the house yesterday", "She has left the house", "She left the house yesterday", "She left already"], correctAnswer: 1, explanation: "Present perfect is used when the time is not specified.", level: 1, skillLevel: "intermediate", category: "grammar" },
  { text: "Select the correct option:", options: ["I never have been to Paris", "I have never been to Paris", "I have never gone to Paris", "I never went to Paris"], correctAnswer: 1, explanation: "Use 'have been' for experience with 'never'.", level: 1, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is correct?", options: ["They have finished their work yet", "They have already finished their work", "They already finished their work", "They finished already"], correctAnswer: 1, explanation: "'Already' is used with present perfect.", level: 1, skillLevel: "intermediate", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["How long are you learning English?", "How long have you been learning English?", "How long do you learn English?", "How long you learned English?"], correctAnswer: 1, explanation: "'Have been learning' shows continuous action up to now.", level: 1, skillLevel: "intermediate", category: "grammar" },

  // INTERMEDIATE LEVEL 2 - Modal Verbs (must, should, could, might)
  { text: "Which modal verb expresses strong obligation?", options: ["You should study", "You could study", "You must study", "You might study"], correctAnswer: 2, explanation: "'Must' expresses strong obligation or necessity.", level: 2, skillLevel: "intermediate", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["You must to be careful", "You must be careful", "You must are careful", "You must being careful"], correctAnswer: 1, explanation: "'Must' is followed by base form without 'to'.", level: 2, skillLevel: "intermediate", category: "grammar" },
  { text: "Which expresses advice?", options: ["You must go to the doctor", "You should go to the doctor", "You could go to the doctor", "You might go to the doctor"], correctAnswer: 1, explanation: "'Should' is used to give advice.", level: 2, skillLevel: "intermediate", category: "grammar" },
  { text: "Select the correct option:", options: ["You shouldn't to worry", "You shouldn't worry", "You should not worry", "Both B and C are correct"], correctAnswer: 3, explanation: "'Shouldn't' is correct; 'should not' is also acceptable.", level: 2, skillLevel: "intermediate", category: "grammar" },
  { text: "Which modal shows past ability?", options: ["She could swim when she was five", "She can swim when she was five", "She might swim when she was five", "She should swim when she was five"], correctAnswer: 0, explanation: "'Could' expresses past ability.", level: 2, skillLevel: "intermediate", category: "grammar" },

  // INTERMEDIATE LEVEL 3 - First and Second Conditionals
  { text: "Which is a first conditional sentence?", options: ["If it rains, I will stay home", "If it rained, I would stay home", "If it rains, I would stay home", "If it rained, I will stay home"], correctAnswer: 0, explanation: "First conditional: if + present simple, will + verb.", level: 3, skillLevel: "intermediate", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["If you will study, you will pass", "If you study, you will pass", "If you studied, you will pass", "Study if you will pass"], correctAnswer: 1, explanation: "First conditional: if + present, will + base form.", level: 3, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is second conditional?", options: ["If I have money, I travel", "If I had money, I would travel", "If I had money, I will travel", "Have money if I travel"], correctAnswer: 1, explanation: "Second conditional: if + past simple, would + verb.", level: 3, skillLevel: "intermediate", category: "grammar" },
  { text: "Select the correct option:", options: ["If she were rich, she buy a mansion", "If she was rich, she would buy a mansion", "If she were rich, she would buy a mansion", "If she is rich, she would buy a mansion"], correctAnswer: 2, explanation: "Use 'were' for unreal conditions in second conditional.", level: 3, skillLevel: "intermediate", category: "grammar" },
  { text: "Which sentence is correct?", options: ["I would call you if I will have time", "I would call you if I had time", "I will call you if I had time", "I call you if I would have time"], correctAnswer: 1, explanation: "Second conditional: would + verb in both clauses.", level: 3, skillLevel: "intermediate", category: "grammar" },

  // INTERMEDIATE LEVEL 4 - Passive Voice
  { text: "Choose the passive form:", options: ["The cake was eaten by Tom", "The cake ate by Tom", "The cake was eating by Tom", "Tom was eaten the cake"], correctAnswer: 0, explanation: "Passive: subject + was/were + past participle.", level: 4, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is correct passive voice?", options: ["The letter is written by her", "The letter is wrote by her", "The letter is writing by her", "Her writes the letter"], correctAnswer: 0, explanation: "Use past participle 'written' in passive.", level: 4, skillLevel: "intermediate", category: "grammar" },
  { text: "Select the correct passive:", options: ["The house was built last year", "The house was build last year", "The house was building last year", "Built was the house last year"], correctAnswer: 0, explanation: "Past simple passive: was/were + past participle.", level: 4, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is the passive form?", options: ["They are building a new school", "A new school is being built", "A new school is building", "Building a new school by them"], correctAnswer: 1, explanation: "Present continuous passive: is/are being + past participle.", level: 4, skillLevel: "intermediate", category: "grammar" },
  { text: "Choose the correct passive:", options: ["The work will be done tomorrow", "The work will done tomorrow", "The work will be doing tomorrow", "Tomorrow the work will be done"], correctAnswer: 0, explanation: "Future passive: will be + past participle.", level: 4, skillLevel: "intermediate", category: "grammar" },

  // INTERMEDIATE LEVEL 5 - Reported Speech
  { text: "Choose the correct reported speech:", options: ["He said that he is tired", "He said that he was tired", "He said that he tired", "He said he tired"], correctAnswer: 1, explanation: "In reported speech, present becomes past.", level: 5, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is correct?", options: ["She told me to come", "She told me come", "She told me coming", "She told me that come"], correctAnswer: 0, explanation: "Use infinitive after 'tell' in reported speech.", level: 5, skillLevel: "intermediate", category: "grammar" },
  { text: "Select the correct option:", options: ["He asked where I was going", "He asked where I am going", "He asked where I going", "Asked he where I was going"], correctAnswer: 0, explanation: "Tense shifts back in reported questions.", level: 5, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is correct reported speech?", options: ["They said they will help", "They said they would help", "They said they help", "They said they helped"], correctAnswer: 1, explanation: "Future 'will' becomes 'would' in reported speech.", level: 5, skillLevel: "intermediate", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["I told him to not worry", "I told him not to worry", "I told him don't worry", "I told him worry not"], correctAnswer: 1, explanation: "'Not' comes before 'to' in infinitive.", level: 5, skillLevel: "intermediate", category: "grammar" },

  // INTERMEDIATE LEVEL 6 - Conjunctions (although, despite, because of)
  { text: "Which sentence uses 'although' correctly?", options: ["Although it was raining, but we went out", "Although it was raining, we went out", "It was raining although we went out", "We went out although"], correctAnswer: 1, explanation: "'Although' introduces a contrastive clause.", level: 6, skillLevel: "intermediate", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["Despite of the rain, we went out", "Despite the rain, we went out", "In spite the rain, we went out", "Despite it raining, but we went out"], correctAnswer: 1, explanation: "'Despite' is followed by a noun, not 'of'.", level: 6, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is correct?", options: ["Because of she was tired, she left", "Because she was tired, she left", "Because of being tired, she left", "She left because was tired"], correctAnswer: 1, explanation: "'Because' is followed by a subject and verb.", level: 6, skillLevel: "intermediate", category: "grammar" },
  { text: "Select the correct option:", options: ["Despite the weather was bad", "Despite the bad weather", "In spite the weather bad", "Despite of bad weather"], correctAnswer: 1, explanation: "'Despite' + noun phrase (no 'of').", level: 6, skillLevel: "intermediate", category: "grammar" },
  { text: "Which sentence is correct?", options: ["Although I am tired, but I will work", "Although I am tired, I will work", "I am tired although I will work", "Although tired, I work"], correctAnswer: 1, explanation: "No 'but' needed after 'although'.", level: 6, skillLevel: "intermediate", category: "grammar" },

  // INTERMEDIATE LEVEL 7 - Relative Clauses
  { text: "Choose the correct relative clause:", options: ["The man which works here", "The man who works here", "The man whom works here", "The man works here"], correctAnswer: 1, explanation: "Use 'who' for people as subject.", level: 7, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is correct?", options: ["The book that I bought it", "The book which I bought", "The book I bought it", "I bought the book which"], correctAnswer: 1, explanation: "Don't repeat the pronoun in relative clause.", level: 7, skillLevel: "intermediate", category: "grammar" },
  { text: "Select the correct option:", options: ["The city where I live", "The city which I live", "The city I live in", "Both A and C are correct"], correctAnswer: 3, explanation: "'Where' can replace 'in which'.", level: 7, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is a defining relative clause?", options: ["My brother, who lives in London", "The person who called me", "The book, which was expensive", "My car, which is blue"], correctAnswer: 1, explanation: "Defining clauses give essential information.", level: 7, skillLevel: "intermediate", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["The woman whom I met her", "The woman whom I met", "The woman I met her", "Met the woman whom"], correctAnswer: 1, explanation: "'Whom' is the object, no need for 'her'.", level: 7, skillLevel: "intermediate", category: "grammar" },

  // INTERMEDIATE LEVEL 8 - Quantifiers
  { text: "Which quantifier is used with uncountable nouns?", options: ["many", "few", "much", "several"], correctAnswer: 2, explanation: "'Much' is used with uncountable nouns like water.", level: 8, skillLevel: "intermediate", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["There are few furniture in the room", "There is a few furniture", "There is little furniture", "There are a few furnitures"], correctAnswer: 2, explanation: "'Little' is used with uncountable nouns.", level: 8, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is correct?", options: ["I have a few questions", "I have a few question", "I have few question", "I have a few of questions"], correctAnswer: 0, explanation: "'Few' with plural countable nouns.", level: 8, skillLevel: "intermediate", category: "grammar" },
  { text: "Select the correct option:", options: ["Much people came", "Many people came", "A lot of people came", "Both B and C are correct"], correctAnswer: 3, explanation: "'Many' and 'a lot of' work with people.", level: 8, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is correct?", options: ["There is few time", "There is little time", "There are a little time", "There are few times"], correctAnswer: 1, explanation: "'Little' with uncountable: little time.", level: 8, skillLevel: "intermediate", category: "grammar" },

  // INTERMEDIATE LEVEL 9 - Present Perfect Continuous
  { text: "Choose the present perfect continuous:", options: ["I have been working here for 5 years", "I have worked here for 5 years", "I am working here for 5 years", "I worked here for 5 years"], correctAnswer: 0, explanation: "Present perfect continuous: have been + ing.", level: 9, skillLevel: "intermediate", category: "grammar" },
  { text: "Which emphasizes duration?", options: ["I have written a letter", "I have been writing a letter", "I wrote a letter", "I am writing a letter"], correctAnswer: 1, explanation: "Continuous form emphasizes the duration.", level: 9, skillLevel: "intermediate", category: "grammar" },
  { text: "Select the correct sentence:", options: ["She has been waiting since 2 hours", "She has been waiting for 2 hours", "She has waited for 2 hours", "She waited for 2 hours"], correctAnswer: 1, explanation: "Use 'for' with periods of time.", level: 9, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is present perfect continuous?", options: ["They have been learning English", "They have learned English", "They learned English", "They are learning English"], correctAnswer: 0, explanation: "Have been + verb-ing shows ongoing action.", level: 9, skillLevel: "intermediate", category: "grammar" },
  { text: "Choose the correct option:", options: ["How long you have been studying?", "How long have you been studying?", "How long have you studied?", "How long you are studying?"], correctAnswer: 1, explanation: "Present perfect continuous question form.", level: 9, skillLevel: "intermediate", category: "grammar" },

  // INTERMEDIATE LEVEL 10 - Used to / Would / Get used to
  { text: "Which expresses past habit?", options: ["I used to go to school", "I use to go to school", "I am used to going to school", "I got used to go to school"], correctAnswer: 0, explanation: "'Used to' expresses past habits.", level: 10, skillLevel: "intermediate", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["I am used to wake up early", "I am used to waking up early", "I used to waking up early", "I used wake up early"], correctAnswer: 1, explanation: "'Be used to' is followed by verb-ing.", level: 10, skillLevel: "intermediate", category: "grammar" },
  { text: "Which is correct?", options: ["I didn't use to like coffee", "I didn't used to like coffee", "I don't use to like coffee", "I used to not like coffee"], correctAnswer: 0, explanation: "Negative: didn't + use to + verb.", level: 10, skillLevel: "intermediate", category: "grammar" },
  { text: "Select the correct option:", options: ["She got used to live alone", "She got used to living alone", "She used to live alone", "She used to living alone"], correctAnswer: 1, explanation: "'Get used to' takes verb-ing.", level: 10, skillLevel: "intermediate", category: "grammar" },
  { text: "Which expresses past state?", options: ["He would live in Paris", "He used to live in Paris", "He was used to living in Paris", "He got used to live in Paris"], correctAnswer: 1, explanation: "'Used to' for past states (not 'would').", level: 10, skillLevel: "intermediate", category: "grammar" },

  // ADVANCED LEVEL 1 - Third Conditionals
  { text: "Which is a third conditional sentence?", options: ["If I had known, I would have called", "If I knew, I would call", "If I know, I will call", "If I had known, I would call"], correctAnswer: 0, explanation: "Third conditional: if + past perfect, would have + past participle.", level: 1, skillLevel: "advanced", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["If she had studied harder, she would pass", "If she had studied harder, she would have passed", "If she studied harder, she would pass", "Had she studied harder, she would pass"], correctAnswer: 1, explanation: "Use past perfect + would have passed.", level: 1, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct?", options: ["I would have gone if I would have known", "I would have gone if I had known", "I would go if I had known", "I would have gone if I knew"], correctAnswer: 1, explanation: "Use past perfect in the if-clause.", level: 1, skillLevel: "advanced", category: "grammar" },
  { text: "Select the correct option:", options: ["They would have won had they trained more", "They would have won if they would train more", "They would win had they trained more", "They would have won if they trained more"], correctAnswer: 0, explanation: "Inverted form: had + subject + past participle.", level: 1, skillLevel: "advanced", category: "grammar" },
  { text: "Which sentence is correct?", options: ["If I would have money, I would have bought it", "Had I had money, I would have bought it", "If I had money, I would buy it", "If I have had money, I would buy it"], correctAnswer: 1, explanation: "Inversion is possible in third conditional.", level: 1, skillLevel: "advanced", category: "grammar" },

  // ADVANCED LEVEL 2 - Mixed Conditionals
  { text: "Which is a mixed conditional?", options: ["If I had studied, I would be a doctor", "If I study, I will pass", "If I studied, I would pass", "If I had studied, I would have passed"], correctAnswer: 0, explanation: "Mixes past result with present situation.", level: 2, skillLevel: "advanced", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["If she didn't miss the bus, she would be here now", "If she didn't miss the bus, she would have been here now", "If she hadn't missed the bus, she would be here now", "If she doesn't miss the bus, she is here now"], correctAnswer: 2, explanation: "Past unreal condition with present result.", level: 2, skillLevel: "advanced", category: "grammar" },
  { text: "Which expresses present result from past condition?", options: ["If I had learned Spanish, I would speak it", "If I learned Spanish, I would speak it", "If I speak Spanish, I would have learned it", "I would speak Spanish if I had learned it"], correctAnswer: 0, explanation: "Third conditional + second conditional meaning.", level: 2, skillLevel: "advanced", category: "grammar" },
  { text: "Select the correct option:", options: ["If he worked harder, he would have succeeded", "If he had worked harder, he would succeed", "If he works harder, he would have succeeded", "He would succeed if he had worked harder"], correctAnswer: 1, explanation: "Present unreal condition with past result.", level: 2, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct?", options: ["If I were you, I would have gone", "If I was you, I would go", "If I am you, I would go", "If I were you, I will go"], correctAnswer: 0, explanation: "'Were' is used in conditional for unreal present.", level: 2, skillLevel: "advanced", category: "grammar" },

  // ADVANCED LEVEL 3 - Subjunctive Mood
  { text: "Which uses the subjunctive correctly?", options: ["I suggest that he goes", "I suggest that he go", "I suggest that he went", "I suggest him to go"], correctAnswer: 1, explanation: "Subjunctive uses base form after 'suggest'.", level: 3, skillLevel: "advanced", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["It is important that he arrives on time", "It is important that he arrive on time", "It is important that he arrived on time", "It is important for him to arrive on time"], correctAnswer: 1, explanation: "Subjunctive uses base form 'arrive'.", level: 3, skillLevel: "advanced", category: "grammar" },
  { text: "Which uses the subjunctive?", options: ["I wish I was taller", "I wish I were taller", "I wish I am taller", "I wish I would be taller"], correctAnswer: 1, explanation: "'Were' is used in wishes about present.", level: 3, skillLevel: "advanced", category: "grammar" },
  { text: "Select the correct option:", options: ["They demanded that he resigns", "They demanded that he resign", "They demanded that he resigned", "They demanded his resignation"], correctAnswer: 1, explanation: "Subjunctive: demand + that + base form.", level: 3, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct?", options: ["If only I had more time", "If only I would have more time", "If only I have more time", "If only I will have more time"], correctAnswer: 0, explanation: "'If only' with past perfect expresses regret.", level: 3, skillLevel: "advanced", category: "grammar" },

  // ADVANCED LEVEL 4 - Inversions
  { text: "Which is an inversion?", options: ["Never I have seen such a thing", "Never have I seen such a thing", "I never have seen such a thing", "I have never seen such a thing"], correctAnswer: 1, explanation: "Inversion: adverb + auxiliary + subject.", level: 4, skillLevel: "advanced", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["Rarely she goes to the cinema", "Rarely does she go to the cinema", "She rarely goes to the cinema", "She goes rarely to the cinema"], correctAnswer: 1, explanation: "Inversion after negative adverb.", level: 4, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct inversion?", options: ["Not until I finished I left", "Not until I finished did I leave", "I not until finished left", "Until I finished I left"], correctAnswer: 1, explanation: "'Not until' triggers inversion.", level: 4, skillLevel: "advanced", category: "grammar" },
  { text: "Select the correct option:", options: ["Seldom we see such talent", "Seldom do we see such talent", "We seldom see such talent", "Such talent is seldom seen"], correctAnswer: 1, explanation: "Inversion with 'seldom'.", level: 4, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct?", options: ["No sooner I arrived than the phone rang", "No sooner had I arrived than the phone rang", "I no sooner arrived than the phone rang", "The phone rang no sooner I arrived"], correctAnswer: 1, explanation: "'No sooner' triggers past perfect inversion.", level: 4, skillLevel: "advanced", category: "grammar" },

  // ADVANCED LEVEL 5 - Causative Structures
  { text: "Which uses causative correctly?", options: ["I had my car repaired", "I had my car repair", "I had repaired my car", "I had my repairing car"], correctAnswer: 0, explanation: "Have + object + past participle.", level: 5, skillLevel: "advanced", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["She got her hair cut", "She got her hair to cut", "She got cut her hair", "She got her hair cutting"], correctAnswer: 0, explanation: "'Get' + object + past participle.", level: 5, skillLevel: "advanced", category: "grammar" },
  { text: "Which expresses someone else does the action?", options: ["I painted the house myself", "I had the house painted", "I have painted the house", "I was painting the house"], correctAnswer: 1, explanation: "Causative: arrange for someone else to do it.", level: 5, skillLevel: "advanced", category: "grammar" },
  { text: "Select the correct option:", options: ["He had his secretary send the email", "He had his secretary sending the email", "He had sent the email by his secretary", "His secretary was had to send the email"], correctAnswer: 0, explanation: "Have + person + base form.", level: 5, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct?", options: ["I'll get the mechanic fix my car", "I'll get my car fixed", "I'll get fixed my car", "I'll get to fix my car"], correctAnswer: 1, explanation: "Get + object + past participle.", level: 5, skillLevel: "advanced", category: "grammar" },

  // ADVANCED LEVEL 6 - Advanced Passive Forms
  { text: "Which is a passive with modals?", options: ["The work must be done", "The work must done", "Must be done the work", "The work must do"], correctAnswer: 0, explanation: "Modal + be + past participle.", level: 6, skillLevel: "advanced", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["The letter could have been sent", "The letter could have sent", "Could the letter been sent", "The letter could sent"], correctAnswer: 0, explanation: "Could have been + past participle.", level: 6, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct?", options: ["She is supposed to know the answer", "She is supposed know the answer", "She is supposed knowing the answer", "Supposed to know is she"], correctAnswer: 0, explanation: "'Be supposed to' + base form.", level: 6, skillLevel: "advanced", category: "grammar" },
  { text: "Select the correct option:", options: ["The book is said to be excellent", "The book is said excellent", "It is said the book excellent", "The book said to be excellent"], correctAnswer: 0, explanation: "Passive infinitive: be + past participle.", level: 6, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct?", options: ["He is believed to have left", "He is believed have left", "It is believed he left", "Believed is he to have left"], correctAnswer: 0, explanation: "Perfect infinitive passive: have been + past participle.", level: 6, skillLevel: "advanced", category: "grammar" },

  // ADVANCED LEVEL 7 - Ellipsis and Substitution
  { text: "Which uses ellipsis correctly?", options: ["I like coffee and she likes tea too", "I like coffee and she does too", "I like coffee and she likes too", "I like coffee and she likes also"], correctAnswer: 1, explanation: "'Does' substitutes for 'likes coffee'.", level: 7, skillLevel: "advanced", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["He can swim faster than I can", "He can swim faster than I can swim", "He can swim faster than me", "He can swim faster than I"], correctAnswer: 0, explanation: "Ellipsis omits repeated verb.", level: 7, skillLevel: "advanced", category: "grammar" },
  { text: "Which uses substitution?", options: ["I need a pen. Do you have one?", "I need a pen. Have you?", "I need a pen. Do you have it?", "I need a pen. Have one?"], correctAnswer: 0, explanation: "'One' substitutes for 'a pen'.", level: 7, skillLevel: "advanced", category: "grammar" },
  { text: "Select the correct option:", options: ["She is taller than him", "She is taller than he is", "She is taller than he", "She is taller than he tall"], correctAnswer: 1, explanation: "Ellipsis keeps subject + auxiliary.", level: 7, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct?", options: ["I'll go if you do", "I'll go if you will", "I'll go if you go to", "I'll go if you"], correctAnswer: 0, explanation: "Do substitutes for 'go' in clause.", level: 7, skillLevel: "advanced", category: "grammar" },

  // ADVANCED LEVEL 8 - Advanced Relative Clauses
  { text: "Which is a non-defining relative clause?", options: ["The book which I bought", "The book, which was expensive, is mine", "The book that I bought", "The book I bought"], correctAnswer: 1, explanation: "Non-defining clauses have commas.", level: 8, skillLevel: "advanced", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["The man whose car was stolen", "The man who car was stolen", "The man that car was stolen", "The man whose was stolen car"], correctAnswer: 0, explanation: "'Whose' shows possession.", level: 8, skillLevel: "advanced", category: "grammar" },
  { text: "Which uses a relative adverb?", options: ["The reason why I called", "The reason which I called", "The reason that I called", "The reason I called"], correctAnswer: 0, explanation: "'Why' modifies 'reason'.", level: 8, skillLevel: "advanced", category: "grammar" },
  { text: "Select the correct option:", options: ["The only person who knows", "The only person which knows", "The only person whom knows", "The only person knows"], correctAnswer: 0, explanation: "Use 'who' for defining clauses about people.", level: 8, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct?", options: ["Whoever wants to come can come", "Whomever wants to come can come", "Who wants to come can come", "Anyone who wants to come can come"], correctAnswer: 0, explanation: "'Whoever' is subject of 'wants to come'.", level: 8, skillLevel: "advanced", category: "grammar" },

  // ADVANCED LEVEL 9 - Modal Verbs for Speculation
  { text: "Which expresses past speculation?", options: ["She must be at home", "She must have been at home", "She might be at home", "She could be at home"], correctAnswer: 1, explanation: "Must have + past participle for past speculation.", level: 9, skillLevel: "advanced", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["He could left early", "He could have left early", "He could has left early", "He could left early"], correctAnswer: 1, explanation: "Could have + past participle for past possibility.", level: 9, skillLevel: "advanced", category: "grammar" },
  { text: "Which expresses present speculation?", options: ["She might have been working", "She might be working", "She might working", "She might been working"], correctAnswer: 1, explanation: "Might be + verb-ing for ongoing speculation.", level: 9, skillLevel: "advanced", category: "grammar" },
  { text: "Select the correct option:", options: ["They should have known the answer", "They should know the answer", "They should knew the answer", "They should to know the answer"], correctAnswer: 0, explanation: "Should have + past participle for past obligation.", level: 9, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct?", options: ["He can't have finished already", "He can't finished already", "He can't have finish already", "Can't he have finished already"], correctAnswer: 0, explanation: "Can't have + past participle shows impossibility.", level: 9, skillLevel: "advanced", category: "grammar" },

  // ADVANCED LEVEL 10 - Advanced Verb Forms
  { text: "Which uses future perfect?", options: ["By next year, I will have graduated", "By next year, I will graduate", "By next year, I graduate", "I will graduate by next year"], correctAnswer: 0, explanation: "Will have + past participle shows completed future action.", level: 10, skillLevel: "advanced", category: "grammar" },
  { text: "Choose the correct sentence:", options: ["By this time tomorrow, I will be flying", "By this time tomorrow, I will fly", "By this time tomorrow, I am flying", "I will fly by this time tomorrow"], correctAnswer: 0, explanation: "Future continuous at specific time.", level: 10, skillLevel: "advanced", category: "grammar" },
  { text: "Which expresses past continuous with background action?", options: ["I was reading when she called", "I read when she called", "I have read when she called", "I readed when she called"], correctAnswer: 0, explanation: "Past continuous (background) + past simple (main event).", level: 10, skillLevel: "advanced", category: "grammar" },
  { text: "Select the correct option:", options: ["Had I known, I would have come", "If I would have known, I would come", "Would I have known, I would come", "If I had known, I would come"], correctAnswer: 0, explanation: "Inversion is acceptable in conditionals.", level: 10, skillLevel: "advanced", category: "grammar" },
  { text: "Which is correct?", options: ["No matter how hard I tried, I couldn't succeed", "No matter how hard I try, I can't succeed", "However hard I tried, I couldn't succeed", "Both A and C are correct"], correctAnswer: 3, explanation: "'No matter how' and 'however' work similarly.", level: 10, skillLevel: "advanced", category: "grammar" }
];

const seedGrammar = async () => {
  try {
    await connectDB();
    console.log('Connected to database');
    await GrammarQuestion.deleteMany({});
    console.log('Cleared existing grammar questions');
    await GrammarQuestion.insertMany(grammarQuestions);
    console.log(`Seeded ${grammarQuestions.length} grammar questions`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedGrammar();
