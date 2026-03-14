import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import ReadingContent from "./src/models/readingContent.js";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const tasks = [
  // ─── BEGINNER ───────────────────────────────────────────
  {
    level: "beginner", order: 1, type: "paragraph",
    title: "My Daily Routine",
    estimatedMinutes: 8,
    content: `Every day I wake up at 7 o'clock in the morning. First, I wash my face and brush my teeth. Then I eat breakfast with my family. I usually have bread and a cup of tea. After breakfast, I go to school by bus. School starts at 8:30. I study English, Math, and Science. At lunchtime, I eat rice and vegetables. After school, I play with my friends. In the evening, I do my homework. I go to bed at 9 o'clock at night.`,
    questions: [
      { questionText: "What time does the person wake up?", type: "mcq", options: ["6 o'clock", "7 o'clock", "8 o'clock", "9 o'clock"], correctAnswer: "7 o'clock" },
      { questionText: "How does the person go to school?", type: "mcq", options: ["By car", "By bicycle", "By bus", "On foot"], correctAnswer: "By bus" },
      { questionText: "What does the person eat for breakfast?", type: "mcq", options: ["Rice and curry", "Bread and tea", "Eggs and milk", "Fruits and juice"], correctAnswer: "Bread and tea" },
      { questionText: "Write about your own daily routine in 2-3 sentences.", type: "writing" },
    ],
  },
  {
    level: "beginner", order: 2, type: "poem",
    title: "The Little Star",
    estimatedMinutes: 6,
    content: `Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.\n\nWhen the blazing sun is gone,\nWhen he nothing shines upon,\nThen you show your little light,\nTwinkle, twinkle, through the night.\n\nIn the dark blue sky you keep,\nAnd often through my curtains peep,\nFor you never shut your eye,\nTill the sun is in the sky.`,
    questions: [
      { questionText: "What does the star look like in the poem?", type: "mcq", options: ["A ball", "A diamond", "A flower", "A candle"], correctAnswer: "A diamond" },
      { questionText: "When does the star shine?", type: "mcq", options: ["During the day", "At sunset", "At night", "In the morning"], correctAnswer: "At night" },
      { questionText: "What does the star never do until the sun rises?", type: "mcq", options: ["Twinkle", "Move", "Shut its eye", "Shine"], correctAnswer: "Shut its eye" },
      { questionText: "How does this poem make you feel? Write 1-2 sentences.", type: "writing" },
    ],
  },
  {
    level: "beginner", order: 3, type: "paragraph",
    title: "Animals on the Farm",
    estimatedMinutes: 8,
    content: `A farm is a place where people grow food and keep animals. On a farm, you can find many different animals. Cows give us milk. Chickens give us eggs. Sheep give us wool to make warm clothes. Pigs roll in the mud to keep cool. Dogs help farmers watch over the other animals. Horses can carry people and heavy things. Farmers wake up very early in the morning to feed all the animals. They work hard every day to take care of them. Farm animals are very important to our daily life.`,
    questions: [
      { questionText: "What do cows give us?", type: "mcq", options: ["Eggs", "Wool", "Milk", "Meat"], correctAnswer: "Milk" },
      { questionText: "Why do pigs roll in the mud?", type: "mcq", options: ["To get clean", "To keep cool", "To find food", "To sleep"], correctAnswer: "To keep cool" },
      { questionText: "What do sheep give us?", type: "mcq", options: ["Milk", "Eggs", "Wool", "Honey"], correctAnswer: "Wool" },
      { questionText: "Name two animals from the passage and what they give us.", type: "writing" },
    ],
  },
  {
    level: "beginner", order: 4, type: "poem",
    title: "Rain, Rain",
    estimatedMinutes: 6,
    content: `Rain, rain, go away,\nCome again another day.\nLittle children want to play,\nRain, rain, go away.\n\nRain on the green grass,\nRain on the tree,\nRain on the housetop,\nBut not on me!\n\nI hear the rain drops,\nFalling down so fast,\nSplashing in the puddles,\nI hope it doesn't last.`,
    questions: [
      { questionText: "Why do the children want the rain to go away?", type: "mcq", options: ["They are scared", "They want to play", "They are sleeping", "They are studying"], correctAnswer: "They want to play" },
      { questionText: "Where does the rain fall in the second verse?", type: "mcq", options: ["On mountains and rivers", "On grass, tree and housetop", "On roads and cars", "On flowers and gardens"], correctAnswer: "On grass, tree and housetop" },
      { questionText: "What do the raindrops fall into?", type: "mcq", options: ["Rivers", "Buckets", "Puddles", "Gardens"], correctAnswer: "Puddles" },
      { questionText: "Do you like rainy days? Write 1-2 sentences about why or why not.", type: "writing" },
    ],
  },
  {
    level: "beginner", order: 5, type: "paragraph",
    title: "My Favourite Food",
    estimatedMinutes: 7,
    content: `Food gives us energy to work and play. Different people like different foods. My favourite food is rice and curry. Rice is white and soft. Curry can be made with vegetables, fish, or chicken. It is very tasty! Some people like bread and butter. Others like noodles or soup. Fruits are also very good for us. Bananas, mangoes, and apples are popular fruits in Sri Lanka. We should eat healthy food every day. Junk food like chips and sweets are not good if we eat too much. Drinking enough water is also very important for our health.`,
    questions: [
      { questionText: "What does food give us?", type: "mcq", options: ["Sleep", "Energy", "Water", "Air"], correctAnswer: "Energy" },
      { questionText: "What is the writer's favourite food?", type: "mcq", options: ["Bread and butter", "Noodles and soup", "Rice and curry", "Fruits and juice"], correctAnswer: "Rice and curry" },
      { questionText: "Which fruits are mentioned as popular in Sri Lanka?", type: "mcq", options: ["Grapes, oranges, and pears", "Bananas, mangoes, and apples", "Strawberries, kiwi, and plums", "Watermelon, papaya, and guava"], correctAnswer: "Bananas, mangoes, and apples" },
      { questionText: "What is your favourite food and why? Write 2 sentences.", type: "writing" },
    ],
  },
  {
    level: "beginner", order: 6, type: "poem",
    title: "My Family",
    estimatedMinutes: 6,
    content: `My family is big and small,\nI love each one of them all.\nMother cooks and sings a song,\nFather works the whole day long.\n\nSister reads her favourite book,\nBrother likes to cook and look.\nGrandma tells us stories old,\nOf knights and dragons, brave and bold.\n\nWe laugh and play and sometimes fight,\nBut hug each other every night.\nMy family means the world to me,\nTogether happy we will be.`,
    questions: [
      { questionText: "What does the mother do in the poem?", type: "mcq", options: ["Reads books", "Cooks and sings", "Tells stories", "Works all day"], correctAnswer: "Cooks and sings" },
      { questionText: "What does grandma do?", type: "mcq", options: ["Cooks food", "Reads books", "Tells old stories", "Plays games"], correctAnswer: "Tells old stories" },
      { questionText: "How does the family end each night?", type: "mcq", options: ["By watching TV", "By hugging each other", "By eating dinner", "By reading books"], correctAnswer: "By hugging each other" },
      { questionText: "Write 2 sentences about your own family.", type: "writing" },
    ],
  },
  {
    level: "beginner", order: 7, type: "paragraph",
    title: "A Trip to the Beach",
    estimatedMinutes: 8,
    content: `Last Sunday, my family went to the beach. The beach was very beautiful. The water was blue and the sand was white. We played in the waves and built sandcastles. My little sister found some shells near the water. My father bought ice cream for all of us. The ice cream was cold and sweet. We also saw some fishermen catching fish in their boats. The sun was very bright and hot. We put on sunscreen to protect our skin. In the evening, the sky turned orange and pink. It was a wonderful day that I will never forget.`,
    questions: [
      { questionText: "When did the family go to the beach?", type: "mcq", options: ["Saturday", "Sunday", "Monday", "Friday"], correctAnswer: "Sunday" },
      { questionText: "What did the little sister find?", type: "mcq", options: ["Crabs", "Fish", "Shells", "Stones"], correctAnswer: "Shells" },
      { questionText: "Why did they put on sunscreen?", type: "mcq", options: ["To smell good", "To protect their skin", "To swim better", "To look nice"], correctAnswer: "To protect their skin" },
      { questionText: "Describe your favourite trip in 2-3 sentences.", type: "writing" },
    ],
  },
  {
    level: "beginner", order: 8, type: "poem",
    title: "The Seasons",
    estimatedMinutes: 6,
    content: `Spring is green and full of flowers,\nRain falls down in gentle showers.\nBirds come back and start to sing,\nEverything is fresh in spring.\n\nSummer's hot with golden sun,\nChildren play and laugh and run.\nBeaches, ice cream, days so bright,\nFireflies glow in the summer night.\n\nAutumn brings the leaves of red,\nYellow, orange overhead.\nWinter cold with snow and frost,\nWarm inside, the chill is lost.`,
    questions: [
      { questionText: "What happens in spring according to the poem?", type: "mcq", options: ["Snow falls", "Leaves turn red", "Birds come back and sing", "Children play on beaches"], correctAnswer: "Birds come back and sing" },
      { questionText: "What do fireflies do in summer?", type: "mcq", options: ["Sing songs", "Glow at night", "Fall from trees", "Play with children"], correctAnswer: "Glow at night" },
      { questionText: "What colours are the autumn leaves?", type: "mcq", options: ["Green and blue", "White and grey", "Red, yellow and orange", "Pink and purple"], correctAnswer: "Red, yellow and orange" },
      { questionText: "Which season do you like most and why? Write 2 sentences.", type: "writing" },
    ],
  },
  {
    level: "beginner", order: 9, type: "paragraph",
    title: "Our School",
    estimatedMinutes: 7,
    content: `My school is a big and happy place. There are many classrooms, a library, and a playground. Every morning, students come to school with their bags and books. Our teachers are kind and helpful. They teach us many subjects like English, Maths, Science, and Art. In the library, there are hundreds of books to read. During break time, we play on the playground with our friends. We have a school garden where we grow vegetables and flowers. Every Friday, we have a music class where we sing songs. I love my school because I learn new things every day and I have many good friends there.`,
    questions: [
      { questionText: "What is in the school besides classrooms?", type: "mcq", options: ["A swimming pool and gym", "A library and playground", "A cinema and garden only", "A hospital and shop"], correctAnswer: "A library and playground" },
      { questionText: "What do students grow in the school garden?", type: "mcq", options: ["Fruits and trees", "Vegetables and flowers", "Rice and wheat", "Herbs and spices"], correctAnswer: "Vegetables and flowers" },
      { questionText: "When is music class held?", type: "mcq", options: ["Monday", "Wednesday", "Thursday", "Friday"], correctAnswer: "Friday" },
      { questionText: "What do you like most about your school? Write 2 sentences.", type: "writing" },
    ],
  },
  {
    level: "beginner", order: 10, type: "poem",
    title: "The Happy Sun",
    estimatedMinutes: 6,
    content: `Good morning, Mr. Sun so bright,\nYou chased away the dark of night.\nYou warm the earth and light the sky,\nA golden ball up there so high.\n\nThe flowers open when you rise,\nThe birds sing songs beneath blue skies.\nThe children wake and start to play,\nAll because you made the day.\n\nSo thank you, Sun, for shining down,\nOn every village, field and town.\nWithout you nothing here would grow,\nYou give us life with every glow.`,
    questions: [
      { questionText: "What did the sun chase away?", type: "mcq", options: ["Rain", "Clouds", "The dark of night", "The cold wind"], correctAnswer: "The dark of night" },
      { questionText: "What do flowers do when the sun rises?", type: "mcq", options: ["Close up", "Fall down", "Open up", "Change colour"], correctAnswer: "Open up" },
      { questionText: "What does the sun give according to the last verse?", type: "mcq", options: ["Rain and wind", "Life with every glow", "Snow and frost", "Darkness and cold"], correctAnswer: "Life with every glow" },
      { questionText: "Write 2 sentences about why the sun is important to you.", type: "writing" },
    ],
  },

  // ─── INTERMEDIATE ────────────────────────────────────────
  {
    level: "intermediate", order: 1, type: "paragraph",
    title: "Technology in Daily Life",
    estimatedMinutes: 10,
    content: `Technology has completely transformed the way we live, work, and communicate. Smartphones allow us to connect with people anywhere in the world within seconds. Social media platforms have changed how we share information and stay updated with current events. In education, online learning has made it possible for students to access quality courses from top universities without leaving their homes. In healthcare, advanced medical equipment helps doctors diagnose diseases more accurately and quickly. However, technology also has its drawbacks. Excessive screen time can lead to eye strain, sleep problems, and reduced physical activity. Cybercrime and privacy concerns are growing issues in the digital age. Despite these challenges, most experts agree that the benefits of technology far outweigh its disadvantages, as long as we use it responsibly and mindfully.`,
    questions: [
      { questionText: "How has online learning benefited students?", type: "mcq", options: ["It made school more expensive", "It allows access to quality courses without leaving home", "It replaced all physical schools", "It reduced the quality of education"], correctAnswer: "It allows access to quality courses without leaving home" },
      { questionText: "What is one negative effect of excessive screen time?", type: "mcq", options: ["Better eyesight", "Improved sleep", "Eye strain", "More physical activity"], correctAnswer: "Eye strain" },
      { questionText: "What do most experts believe about technology?", type: "mcq", options: ["It is more harmful than helpful", "Its benefits outweigh disadvantages if used responsibly", "It should be banned completely", "It only benefits rich people"], correctAnswer: "Its benefits outweigh disadvantages if used responsibly" },
      { questionText: "How has technology changed your own daily life? Give two examples.", type: "writing" },
    ],
  },
  {
    level: "intermediate", order: 2, type: "poem",
    title: "The Road Not Taken",
    estimatedMinutes: 10,
    content: `Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;\n\nThen took the other, as just as fair,\nAnd having perhaps the better claim,\nBecause it was grassy and wanted wear;\nThough as for that the passing there\nHad worn them really about the same,\n\nI shall be telling this with a sigh\nSomewhere ages and ages hence:\nTwo roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.`,
    questions: [
      { questionText: "Why was the traveler standing at the fork in the road?", type: "mcq", options: ["He was lost", "He could not choose which road to take", "He was waiting for someone", "He was tired"], correctAnswer: "He could not choose which road to take" },
      { questionText: "Which road did the traveler choose?", type: "mcq", options: ["The more popular road", "The road with signs", "The less traveled road", "The shorter road"], correctAnswer: "The less traveled road" },
      { questionText: "What does 'that has made all the difference' suggest?", type: "mcq", options: ["The choice did not matter", "The wrong road was chosen", "The choice had a big impact on his life", "Both roads were the same"], correctAnswer: "The choice had a big impact on his life" },
      { questionText: "What does this poem mean to you personally? Write 3-4 sentences.", type: "writing" },
    ],
  },
  {
    level: "intermediate", order: 3, type: "paragraph",
    title: "Environmental Issues",
    estimatedMinutes: 10,
    content: `Our planet is facing serious environmental challenges that require immediate attention and collective action. Climate change, caused mainly by the burning of fossil fuels, is raising global temperatures and leading to more frequent extreme weather events such as floods, droughts, and hurricanes. Deforestation is destroying habitats and reducing biodiversity, pushing many species toward extinction. Ocean pollution from plastic waste is killing marine life and entering the food chain. Air pollution in major cities is causing respiratory diseases and reducing quality of life. However, there is hope. Renewable energy sources like solar and wind power are growing rapidly. Many governments are introducing stricter environmental laws. Individuals can also make a difference by reducing waste, recycling, using public transport, and choosing sustainable products. Protecting our environment is not just a responsibility — it is a necessity for our survival.`,
    questions: [
      { questionText: "What is the main cause of climate change mentioned?", type: "mcq", options: ["Volcanic eruptions", "Burning of fossil fuels", "Ocean pollution", "Deforestation"], correctAnswer: "Burning of fossil fuels" },
      { questionText: "What is deforestation doing to species?", type: "mcq", options: ["Helping them thrive", "Moving them to cities", "Pushing them toward extinction", "Making them stronger"], correctAnswer: "Pushing them toward extinction" },
      { questionText: "Which renewable energy sources are mentioned?", type: "mcq", options: ["Coal and gas", "Nuclear and hydro", "Solar and wind", "Oil and steam"], correctAnswer: "Solar and wind" },
      { questionText: "What are two things you personally do or could do to help the environment?", type: "writing" },
    ],
  },
  {
    level: "intermediate", order: 4, type: "poem",
    title: "Still I Rise",
    estimatedMinutes: 10,
    content: `You may write me down in history\nWith your bitter, twisted lies,\nYou may trod me in the very dirt\nBut still, like dust, I'll rise.\n\nDoes my sassiness upset you?\nWhy are you beset with gloom?\n'Cause I walk like I've got oil wells\nPumping in my living room.\n\nJust like moons and like suns,\nWith the certainty of tides,\nJust like hopes springing high,\nStill I'll rise.\n\nOut of the huts of history's shame\nI rise\nUp from a past that's rooted in pain\nI rise\nI'm a black ocean, leaping and wide,\nWelling and swelling I bear in the tide.\nLeaving behind nights of terror and fear\nI rise\nInto a daybreak that's wondrously clear\nI rise.`,
    questions: [
      { questionText: "What is the main theme of this poem?", type: "mcq", options: ["Sadness and defeat", "Resilience and strength", "Anger and revenge", "Fear and loneliness"], correctAnswer: "Resilience and strength" },
      { questionText: "What natural things does the speaker compare rising to?", type: "mcq", options: ["Rivers and mountains", "Moons, suns and tides", "Stars and planets", "Wind and rain"], correctAnswer: "Moons, suns and tides" },
      { questionText: "What tone does the speaker use throughout the poem?", type: "mcq", options: ["Fearful and uncertain", "Sad and hopeless", "Confident and defiant", "Quiet and gentle"], correctAnswer: "Confident and defiant" },
      { questionText: "What difficulties have you overcome in your life? How does this poem relate to your experience? Write 3-4 sentences.", type: "writing" },
    ],
  },
  {
    level: "intermediate", order: 5, type: "paragraph",
    title: "Travel and Culture",
    estimatedMinutes: 10,
    content: `Travelling to different countries is one of the most enriching experiences a person can have. When you visit a new place, you are exposed to different languages, foods, traditions, and ways of thinking. This exposure helps break down stereotypes and build empathy and understanding between people of different backgrounds. For example, visiting Japan might teach you about the value of discipline and respect in their culture. Travelling through Italy exposes you to centuries of art, architecture, and culinary tradition. Backpacking through Southeast Asia shows you how communities thrive with very different values and lifestyles. Travel also challenges you personally — navigating unfamiliar places builds confidence and problem-solving skills. With the rise of affordable airlines and digital booking platforms, travel has become more accessible than ever. Even if international travel is not possible, exploring your own country can be equally eye-opening and rewarding.`,
    questions: [
      { questionText: "What is one benefit of travelling to different countries?", type: "mcq", options: ["It wastes money", "It builds empathy and understanding", "It creates more stereotypes", "It makes people less confident"], correctAnswer: "It builds empathy and understanding" },
      { questionText: "What does visiting Japan teach you according to the passage?", type: "mcq", options: ["Cooking skills", "Art and architecture", "Discipline and respect", "Language and literature"], correctAnswer: "Discipline and respect" },
      { questionText: "How has travel become more accessible?", type: "mcq", options: ["Free government programs", "Affordable airlines and digital booking", "More cruise ships", "Cheaper hotels"], correctAnswer: "Affordable airlines and digital booking" },
      { questionText: "Describe a place you have visited or would like to visit. What would you learn there? Write 3-4 sentences.", type: "writing" },
    ],
  },
  {
    level: "intermediate", order: 6, type: "poem",
    title: "If",
    estimatedMinutes: 10,
    content: `If you can keep your head when all about you\nAre losing theirs and blaming it on you,\nIf you can trust yourself when all men doubt you,\nBut make allowance for their doubting too;\n\nIf you can wait and not be tired by waiting,\nOr being lied about, don't deal in lies,\nOr being hated, don't give way to hating,\nAnd yet don't look too good, nor talk too wise:\n\nIf you can dream—and not make dreams your master;\nIf you can think—and not make thoughts your aim;\nIf you can meet with Triumph and Disaster\nAnd treat those two impostors just the same;\n\nYours is the Earth and everything that's in it,\nAnd—which is more—you'll be a Man, my son!`,
    questions: [
      { questionText: "What quality is described in the first stanza?", type: "mcq", options: ["Being popular", "Staying calm under pressure", "Making others blame themselves", "Avoiding all problems"], correctAnswer: "Staying calm under pressure" },
      { questionText: "How should Triumph and Disaster be treated according to the poem?", type: "mcq", options: ["Celebrate triumph and mourn disaster", "Fear both equally", "Treat them both the same", "Ignore them both"], correctAnswer: "Treat them both the same" },
      { questionText: "What is the reward for meeting all the conditions in the poem?", type: "mcq", options: ["Fame and fortune", "The Earth and everything in it", "Wisdom and knowledge", "Peace and silence"], correctAnswer: "The Earth and everything in it" },
      { questionText: "Which quality described in this poem do you find most difficult? Why? Write 3-4 sentences.", type: "writing" },
    ],
  },
  {
    level: "intermediate", order: 7, type: "paragraph",
    title: "Health and Lifestyle",
    estimatedMinutes: 10,
    content: `Maintaining good health is one of the most important investments you can make in your life. A balanced diet rich in fruits, vegetables, whole grains, and lean proteins provides the essential nutrients your body needs to function properly. Regular physical exercise, even just 30 minutes of walking daily, can significantly reduce the risk of heart disease, diabetes, and depression. Sleep is often underestimated — adults need between 7 to 9 hours of quality sleep per night for their body to repair and their mind to process information effectively. Mental health is equally important as physical health. Stress management through meditation, hobbies, or social connection plays a vital role in overall wellbeing. Avoiding smoking, limiting alcohol consumption, and staying hydrated are simple yet powerful habits. Small consistent changes to your lifestyle can have a dramatic positive impact on your quality of life and longevity.`,
    questions: [
      { questionText: "How much daily exercise is mentioned as beneficial?", type: "mcq", options: ["10 minutes", "20 minutes", "30 minutes", "60 minutes"], correctAnswer: "30 minutes" },
      { questionText: "How many hours of sleep do adults need per night?", type: "mcq", options: ["5 to 6 hours", "6 to 7 hours", "7 to 9 hours", "10 to 12 hours"], correctAnswer: "7 to 9 hours" },
      { questionText: "What is mentioned as a way to manage stress?", type: "mcq", options: ["Sleeping more", "Eating more", "Meditation and hobbies", "Watching TV"], correctAnswer: "Meditation and hobbies" },
      { questionText: "What healthy habits do you practise in your daily life? What would you like to improve? Write 3-4 sentences.", type: "writing" },
    ],
  },
  {
    level: "intermediate", order: 8, type: "poem",
    title: "Invictus",
    estimatedMinutes: 10,
    content: `Out of the night that covers me,\nBlack as the pit from pole to pole,\nI thank whatever gods may be\nFor my unconquerable soul.\n\nIn the fell clutch of circumstance\nI have not winced nor cried aloud.\nUnder the bludgeonings of chance\nMy head is bloody, but unbowed.\n\nBeyond this place of wrath and tears\nLooms but the Horror of the shade,\nAnd yet the menace of the years\nFinds and shall find me unafraid.\n\nIt matters not how strait the gate,\nHow charged with punishments the scroll,\nI am the master of my fate,\nI am the captain of my soul.`,
    questions: [
      { questionText: "What does 'my head is bloody, but unbowed' mean?", type: "mcq", options: ["The speaker is physically injured", "Despite hardship, the speaker refuses to give up", "The speaker lost a battle", "The speaker is angry"], correctAnswer: "Despite hardship, the speaker refuses to give up" },
      { questionText: "What is the speaker's attitude toward the future?", type: "mcq", options: ["Fearful and uncertain", "Hopeless and sad", "Unafraid and determined", "Excited and cheerful"], correctAnswer: "Unafraid and determined" },
      { questionText: "What do the last two lines mean?", type: "mcq", options: ["Others control the speaker's life", "The speaker controls their own destiny", "God controls everything", "Fate cannot be changed"], correctAnswer: "The speaker controls their own destiny" },
      { questionText: "Do you believe you are the master of your own fate? Explain your view in 3-4 sentences.", type: "writing" },
    ],
  },
  {
    level: "intermediate", order: 9, type: "paragraph",
    title: "Social Media and Youth",
    estimatedMinutes: 10,
    content: `Social media has become an inseparable part of young people's lives in the 21st century. Platforms like Instagram, TikTok, YouTube, and Twitter allow teenagers to express themselves, connect with peers, and access information instantly. However, research increasingly shows that excessive social media use is linked to anxiety, depression, and low self-esteem, particularly among young girls who compare themselves to unrealistic beauty standards. The phenomenon of cyberbullying has also emerged as a serious concern, with many young people experiencing harassment online. On the positive side, social media has empowered youth activism — movements addressing climate change, mental health awareness, and social justice have gained global momentum through these platforms. The key, many psychologists argue, is developing digital literacy and healthy boundaries around social media use, rather than avoiding it altogether. Parents, schools, and technology companies all share responsibility in creating a safer online environment for young people.`,
    questions: [
      { questionText: "What negative effect is linked to excessive social media use?", type: "mcq", options: ["Better grades", "Anxiety and depression", "More exercise", "Improved sleep"], correctAnswer: "Anxiety and depression" },
      { questionText: "What positive role has social media played for youth?", type: "mcq", options: ["Replacing education", "Empowering youth activism", "Eliminating cyberbullying", "Reducing screen time"], correctAnswer: "Empowering youth activism" },
      { questionText: "What do psychologists say is the key to healthy social media use?", type: "mcq", options: ["Deleting all accounts", "Using only one platform", "Digital literacy and healthy boundaries", "Parental monitoring only"], correctAnswer: "Digital literacy and healthy boundaries" },
      { questionText: "How does social media affect your own life — both positively and negatively? Write 3-4 sentences.", type: "writing" },
    ],
  },
  {
    level: "intermediate", order: 10, type: "poem",
    title: "A Psalm of Life",
    estimatedMinutes: 10,
    content: `Tell me not, in mournful numbers,\nLife is but an empty dream!\nFor the soul is dead that slumbers,\nAnd things are not what they seem.\n\nLife is real! Life is earnest!\nAnd the grave is not its goal;\nDust thou art, to dust returnest,\nWas not spoken of the soul.\n\nNot enjoyment, and not sorrow,\nIs our destined end or way;\nBut to act, that each tomorrow\nFind us farther than today.\n\nLives of great men all remind us\nWe can make our lives sublime,\nAnd, departing, leave behind us\nFootprints on the sands of time.`,
    questions: [
      { questionText: "What is the poet's view of life?", type: "mcq", options: ["Life is an empty dream", "Life is real and earnest", "Life is sad and hopeless", "Life is short and meaningless"], correctAnswer: "Life is real and earnest" },
      { questionText: "What should each tomorrow find us according to the poem?", type: "mcq", options: ["Resting and relaxing", "Farther than today", "Closer to death", "Full of sorrow"], correctAnswer: "Farther than today" },
      { questionText: "What does 'footprints on the sands of time' mean?", type: "mcq", options: ["Walking on a beach", "Leaving a lasting legacy", "Forgetting the past", "Living in the present only"], correctAnswer: "Leaving a lasting legacy" },
      { questionText: "What legacy or footprint do you want to leave in your life? Write 3-4 sentences.", type: "writing" },
    ],
  },

  // ─── ADVANCED ────────────────────────────────────────────
  {
    level: "advanced", order: 1, type: "paragraph",
    title: "Artificial Intelligence and Society",
    estimatedMinutes: 15,
    content: `Artificial intelligence is rapidly reshaping the fabric of modern society, presenting both extraordinary opportunities and profound ethical dilemmas. Machine learning algorithms now power everything from medical diagnostics and financial trading to content recommendation and criminal justice risk assessment. In healthcare, AI systems have demonstrated the ability to detect cancers from imaging scans with accuracy rivalling that of experienced radiologists. In education, adaptive learning platforms personalise instruction to individual student needs in real time. However, the proliferation of AI also raises urgent questions about algorithmic bias, privacy, and the future of work. Studies have shown that facial recognition systems perform significantly less accurately on darker-skinned individuals, raising serious civil liberties concerns. As automation displaces routine jobs, economists debate whether new AI-driven industries will generate sufficient employment to compensate. Philosophers and technologists increasingly argue that we need robust regulatory frameworks and ethical guidelines before deploying AI in high-stakes decision-making contexts. The development of artificial general intelligence — machines that can perform any intellectual task a human can — remains a contested frontier that some scientists believe could fundamentally transform civilisation within decades.`,
    questions: [
      { questionText: "What concern is raised about facial recognition systems?", type: "mcq", options: ["They are too expensive", "They are less accurate on darker-skinned individuals", "They invade all privacy equally", "They only work indoors"], correctAnswer: "They are less accurate on darker-skinned individuals" },
      { questionText: "What do economists debate regarding AI automation?", type: "mcq", options: ["Whether AI is too slow", "Whether new industries will create enough jobs", "Whether robots should vote", "Whether AI should teach in schools"], correctAnswer: "Whether new industries will create enough jobs" },
      { questionText: "What do philosophers argue is needed before deploying AI in high-stakes contexts?", type: "mcq", options: ["More computing power", "Faster internet", "Robust regulatory frameworks and ethical guidelines", "Cheaper hardware"], correctAnswer: "Robust regulatory frameworks and ethical guidelines" },
      { questionText: "Discuss the ethical implications of using AI in criminal justice. What safeguards would you recommend? Write 4-5 sentences.", type: "writing" },
    ],
  },
  {
    level: "advanced", order: 2, type: "poem",
    title: "The Second Coming",
    estimatedMinutes: 15,
    content: `Turning and turning in the widening gyre\nThe falcon cannot hear the falconer;\nThings fall apart; the centre cannot hold;\nMere anarchy is loosed upon the world,\nThe blood-dimmed tide is loosed, and everywhere\nThe ceremony of innocence is drowned;\nThe best lack all conviction, while the worst\nAre full of passionate intensity.\n\nSurely some revelation is at hand;\nSurely the Second Coming is at hand.\nThe Second Coming! Hardly are those words out\nWhen a vast image out of Spiritus Mundi\nTroubles my sight: somewhere in sands of the desert\nA shape with lion body and the head of a man,\nA gaze blank and pitiless as the sun,\nIs moving its slow thighs, while all about it\nReel shadows of the indignant desert birds.\nThe darkness drops again; but now I know\nThat twenty centuries of stony sleep\nWere vexed to nightmare by a rocking cradle,\nAnd what rough beast, its hour come round at last,\nSlouches towards Bethlehem to be born?`,
    questions: [
      { questionText: "What does 'the centre cannot hold' suggest?", type: "mcq", options: ["A building is collapsing", "Society is losing its order and stability", "A political election is happening", "A storm is approaching"], correctAnswer: "Society is losing its order and stability" },
      { questionText: "What paradox does Yeats present about conviction?", type: "mcq", options: ["The brave are fearful", "The best lack conviction while the worst are intensely passionate", "The young are wiser than the old", "The rich are sadder than the poor"], correctAnswer: "The best lack conviction while the worst are intensely passionate" },
      { questionText: "What does the 'rough beast' symbolise?", type: "mcq", options: ["A real lion", "A coming apocalyptic force or era", "A religious saviour", "A natural disaster"], correctAnswer: "A coming apocalyptic force or era" },
      { questionText: "Analyse how this poem relates to a contemporary global crisis of your choice. Write 5-6 sentences.", type: "writing" },
    ],
  },
  {
    level: "advanced", order: 3, type: "paragraph",
    title: "Climate Change and Global Justice",
    estimatedMinutes: 15,
    content: `The climate crisis represents perhaps the most complex intersection of science, politics, economics, and ethics that humanity has ever confronted. The scientific consensus is unambiguous: human activities, primarily the combustion of fossil fuels, have raised global temperatures by approximately 1.1 degrees Celsius above pre-industrial levels, triggering cascading effects across ecosystems. Yet the distribution of both responsibility and impact is profoundly unequal. Historically, wealthy industrialised nations have contributed the overwhelming majority of cumulative greenhouse gas emissions, while the most severe impacts — rising sea levels, extreme droughts, intensifying cyclones — disproportionately affect developing nations that have contributed least to the problem. This raises fundamental questions of climate justice. Should wealthy nations provide financial reparations to vulnerable countries? How should the remaining global carbon budget be allocated equitably? Critics argue that current international frameworks, including the Paris Agreement, rely too heavily on voluntary national pledges without binding enforcement mechanisms. Meanwhile, indigenous communities worldwide are leading some of the most innovative and place-based responses to climate disruption, drawing on centuries of ecological knowledge. The transition to a low-carbon economy is technologically feasible, but requires unprecedented levels of political will, international cooperation, and systemic economic transformation.`,
    questions: [
      { questionText: "By how much have human activities raised global temperatures?", type: "mcq", options: ["0.5 degrees Celsius", "1.1 degrees Celsius", "2.5 degrees Celsius", "3.0 degrees Celsius"], correctAnswer: "1.1 degrees Celsius" },
      { questionText: "What is the core argument of climate justice?", type: "mcq", options: ["All countries are equally responsible", "Wealthy nations who caused more emissions should bear greater responsibility", "Developing nations should pay for climate change", "Technology alone will solve climate change"], correctAnswer: "Wealthy nations who caused more emissions should bear greater responsibility" },
      { questionText: "What criticism is made of the Paris Agreement?", type: "mcq", options: ["It is too expensive", "It excludes developing nations", "It relies on voluntary pledges without binding enforcement", "It focuses only on deforestation"], correctAnswer: "It relies on voluntary pledges without binding enforcement" },
      { questionText: "Should wealthy nations pay climate reparations to developing countries? Construct a detailed argument for or against this position. Write 5-6 sentences.", type: "writing" },
    ],
  },
  {
    level: "advanced", order: 4, type: "poem",
    title: "Ozymandias",
    estimatedMinutes: 15,
    content: `I met a traveller from an antique land,\nWho said—"Two vast and trunkless legs of stone\nStand in the desert. . . . Near them, on the sand,\nHalf sunk a shattered visage lies, whose frown,\nAnd wrinkled lip, and sneer of cold command,\nTell that its sculptor well those passions read\nWhich yet survive, stamped on these lifeless things,\nThe hand that mocked them, and the heart that fed;\nAnd on the pedestal, these words appear:\nMy name is Ozymandias, King of Kings;\nLook on my Works, ye Mighty, and despair!\nNothing beside remains. Round the decay\nOf that colossal Wreck, boundless and bare\nThe lone and level sands stretch far away."`,
    questions: [
      { questionText: "What remains of Ozymandias's great empire?", type: "mcq", options: ["A magnificent palace", "A great army", "Shattered ruins in empty desert", "A thriving city"], correctAnswer: "Shattered ruins in empty desert" },
      { questionText: "What is the central irony of the poem?", type: "mcq", options: ["A weak king became powerful", "A boastful king's works have completely vanished despite his claim to eternal greatness", "The sculptor became more famous than the king", "The desert preserved the statue perfectly"], correctAnswer: "A boastful king's works have completely vanished despite his claim to eternal greatness" },
      { questionText: "What universal theme does the poem explore?", type: "mcq", options: ["The importance of art", "The inevitability of war", "The transience of power and human achievement", "The beauty of nature"], correctAnswer: "The transience of power and human achievement" },
      { questionText: "Apply the theme of this poem to a modern political leader or institution. What does Ozymandias warn us about power? Write 5-6 sentences.", type: "writing" },
    ],
  },
  {
    level: "advanced", order: 5, type: "paragraph",
    title: "Human Rights in the Digital Age",
    estimatedMinutes: 15,
    content: `The digital revolution has fundamentally reconfigured both the threats to and the mechanisms for protecting human rights globally. On one hand, the internet and social media have provided unprecedented platforms for dissent, whistleblowing, and the coordination of social movements — from the Arab Spring to #MeToo — that have challenged entrenched power structures. On the other hand, authoritarian governments are increasingly deploying sophisticated digital surveillance tools to monitor, control, and suppress their populations. China's Social Credit System, which assigns citizens behavioural scores affecting their access to services, has drawn international criticism as an Orwellian instrument of social control. Meanwhile, even democratic governments have faced serious scrutiny over mass surveillance programmes revealed by whistleblowers like Edward Snowden. The commodification of personal data by technology corporations raises further questions about consent, autonomy, and the right to privacy. As artificial intelligence enables increasingly granular profiling of individuals, the traditional legal frameworks protecting human rights — largely conceived in the post-World War II era — struggle to keep pace with technological reality. International human rights bodies are grappling with how to extend protections to the digital sphere, balancing security imperatives with civil liberties in an interconnected and often opaque digital ecosystem.`,
    questions: [
      { questionText: "How have the internet and social media positively impacted human rights?", type: "mcq", options: ["By enabling government surveillance", "By providing platforms for dissent and social movements", "By replacing legal systems", "By reducing access to information"], correctAnswer: "By providing platforms for dissent and social movements" },
      { questionText: "What criticism has China's Social Credit System received?", type: "mcq", options: ["It is too expensive to run", "It improves citizen behaviour", "It is an Orwellian instrument of social control", "It protects privacy effectively"], correctAnswer: "It is an Orwellian instrument of social control" },
      { questionText: "Why do traditional human rights frameworks struggle in the digital age?", type: "mcq", options: ["They are too modern", "They were conceived before digital technology existed and cannot keep pace", "They only apply to wealthy nations", "They focus too much on economic rights"], correctAnswer: "They were conceived before digital technology existed and cannot keep pace" },
      { questionText: "Do you believe privacy is still a meaningful right in the digital age? Construct a nuanced argument drawing on examples from the passage and your own knowledge. Write 5-6 sentences.", type: "writing" },
    ],
  },
  {
    level: "advanced", order: 6, type: "poem",
    title: "Dover Beach",
    estimatedMinutes: 15,
    content: `The sea is calm tonight.\nThe tide is full, the moon lies fair\nUpon the straits; on the French coast the light\nGleams and is gone; the cliffs of England stand,\nGlimmering and vast, out in the tranquil bay.\nCome to the window, sweet is the night-air!\n\nThe Sea of Faith\nWas once, too, at the full, and round earth's shore\nLay like the folds of a bright girdle furled.\nBut now I only hear\nIts melancholy, long, withdrawing roar,\nRetreting, to the breath\nOf the night-wind, down the vast edges drear\nAnd naked shingles of the world.\n\nAh, love, let us be true\nTo one another! for the world, which seems\nTo lie before us like a land of dreams,\nSo various, so beautiful, so new,\nHath really neither joy, nor love, nor light,\nNor certitude, nor peace, nor help for pain;\nAnd we are here as on a darkling plain\nSwept with confused alarms of struggle and flight,\nWhere ignorant armies clash by night.`,
    questions: [
      { questionText: "What does the 'Sea of Faith' represent in the poem?", type: "mcq", options: ["The literal ocean", "Religious belief and certainty that is fading", "Political power", "Scientific knowledge"], correctAnswer: "Religious belief and certainty that is fading" },
      { questionText: "What is the poet's solution to the loss of faith and meaning?", type: "mcq", options: ["Return to religion", "Pursue wealth", "Be true to each other in love", "Seek political power"], correctAnswer: "Be true to each other in love" },
      { questionText: "What does the 'darkling plain' in the final lines symbolise?", type: "mcq", options: ["A beautiful landscape", "A peaceful battlefield", "A world of confusion, conflict and meaninglessness", "A religious sanctuary"], correctAnswer: "A world of confusion, conflict and meaninglessness" },
      { questionText: "How does the tension between scientific progress and spiritual meaning manifest in the modern world? Connect your answer to the poem's central themes. Write 5-6 sentences.", type: "writing" },
    ],
  },
  {
    level: "advanced", order: 7, type: "paragraph",
    title: "The Psychology of Conformity",
    estimatedMinutes: 15,
    content: `Human beings are fundamentally social creatures, and the psychological mechanisms that govern conformity reveal much about the tensions between individuality and collective identity. Stanley Milgram's obedience experiments in the 1960s demonstrated with disturbing clarity that ordinary people would administer apparently lethal electric shocks to strangers when instructed to do so by authority figures — findings that profoundly challenged prevailing assumptions about individual moral agency. Solomon Asch's conformity experiments showed that individuals would deny clear visual evidence to align with incorrect group consensus. These findings have far-reaching implications for understanding historical atrocities, organisational misconduct, and everyday social behaviour. Contemporary research in social neuroscience reveals that social rejection activates the same neural pathways as physical pain, providing a biological basis for our deep-seated need to conform. However, the role of the nonconformist — the individual who resists social pressure — is equally significant. Research by Charlan Nemeth demonstrates that minority dissent, even when initially unwelcome, consistently improves group decision-making by broadening the range of considered alternatives. This suggests a fundamental paradox: societies need conformity for cohesion, but require dissent for growth and correction. Understanding these dynamics is essential for designing institutions that can harness collective intelligence while protecting individual conscience.`,
    questions: [
      { questionText: "What did Milgram's experiments demonstrate?", type: "mcq", options: ["People always disobey authority", "Ordinary people would cause harm when instructed by authority figures", "Authority figures are always correct", "People make independent moral decisions"], correctAnswer: "Ordinary people would cause harm when instructed by authority figures" },
      { questionText: "What does social neuroscience reveal about social rejection?", type: "mcq", options: ["It improves performance", "It activates the same neural pathways as physical pain", "It has no biological basis", "It makes people more creative"], correctAnswer: "It activates the same neural pathways as physical pain" },
      { questionText: "What paradox does the passage identify about conformity and dissent?", type: "mcq", options: ["Conformity is always harmful", "Dissent destroys societies", "Societies need conformity for cohesion but dissent for growth", "Individual conscience is irrelevant"], correctAnswer: "Societies need conformity for cohesion but dissent for growth" },
      { questionText: "Reflect on a situation where you conformed despite personal reservations, or dissented despite pressure. What psychological forces were at work? Write 5-6 sentences.", type: "writing" },
    ],
  },
  {
    level: "advanced", order: 8, type: "poem",
    title: "Ode to a Nightingale",
    estimatedMinutes: 15,
    content: `My heart aches, and a drowsy numbness pains\nMy sense, as though of hemlock I had drunk,\nOr emptied some dull opiate to the drains\nOne minute past, and Lethe-wards had sunk:\n'Tis not through envy of thy happy lot,\nBut being too happy in thine happiness,—\nThat thou, light-winged Dryad of the trees,\nIn some melodious plot\nOf beechen green, and shadows numberless,\nSingest of summer in full-throated ease.\n\nAway! away! for I will fly to thee,\nNot charioted by Bacchus and his pards,\nBut on the viewless wings of Poesy,\nThough the dull brain perplexes and retards:\nAway! already with thee! tender is the night,\nAnd haply the Queen-Moon is on her throne,\nThou wast not born for death, immortal Bird!\nNo hungry generations tread thee down;\nThe voice I hear this passing night was heard\nIn ancient days by emperor and clown.`,
    questions: [
      { questionText: "What contrast does Keats draw between the nightingale and humans?", type: "mcq", options: ["Humans are happier than birds", "The nightingale is mortal while humans are immortal", "The nightingale transcends death while humans are subject to it", "Birds are less intelligent than humans"], correctAnswer: "The nightingale transcends death while humans are subject to it" },
      { questionText: "How does the poet wish to reach the nightingale?", type: "mcq", options: ["Through alcohol", "Through sleep", "On the wings of poetry", "By climbing a tree"], correctAnswer: "On the wings of poetry" },
      { questionText: "What does the phrase 'viewless wings of Poesy' suggest about poetry?", type: "mcq", options: ["Poetry is invisible and useless", "Poetry has the power to transcend physical reality", "Poetry is only for educated people", "Poetry describes only nature"], correctAnswer: "Poetry has the power to transcend physical reality" },
      { questionText: "Explore the tension between the desire for transcendence and the reality of human mortality in this poem. How does this tension resonate with contemporary human experience? Write 5-6 sentences.", type: "writing" },
    ],
  },
  {
    level: "advanced", order: 9, type: "paragraph",
    title: "The Ethics of Global Wealth Inequality",
    estimatedMinutes: 15,
    content: `Global wealth inequality has reached levels that many economists and ethicists consider incompatible with democratic governance and human flourishing. According to Oxfam, the world's ten richest individuals possess more combined wealth than the bottom forty percent of humanity. This concentration of economic power translates directly into political influence, as wealthy individuals and corporations shape legislation, fund political campaigns, and influence media narratives in ways unavailable to ordinary citizens. Philosopher John Rawls argued that a just society should be structured so that inequalities benefit the least advantaged members — a principle few would argue our current global economic order satisfies. Meanwhile, utilitarian critics like Peter Singer contend that affluent individuals in wealthy nations have a moral obligation to donate significantly to effective charities addressing global poverty, since the marginal utility of money is vastly greater for someone in extreme poverty than for someone already wealthy. Critics of redistribution argue that market mechanisms, innovation, and economic growth create more effective pathways out of poverty than wealth transfers, pointing to the dramatic reduction in absolute poverty rates over the past three decades. However, others counter that this progress has been uneven and that environmental limits make infinite growth impossible. The debate ultimately raises fundamental questions about the relationship between capitalism, democracy, and human dignity that no society has yet fully resolved.`,
    questions: [
      { questionText: "What does Rawls argue about a just society?", type: "mcq", options: ["Inequality should be eliminated completely", "Inequalities should benefit the least advantaged", "The wealthy deserve their position", "Government should control all wealth"], correctAnswer: "Inequalities should benefit the least advantaged" },
      { questionText: "What is Peter Singer's utilitarian argument?", type: "mcq", options: ["The wealthy have no obligation to help others", "Affluent people have a moral duty to donate significantly to address global poverty", "Poverty is a natural condition", "Markets will solve poverty automatically"], correctAnswer: "Affluent people have a moral duty to donate significantly to address global poverty" },
      { questionText: "What counter-argument do critics of redistribution make?", type: "mcq", options: ["The poor do not deserve help", "Inequality is beneficial to everyone", "Market mechanisms and growth create more effective pathways out of poverty", "Only governments can address poverty"], correctAnswer: "Market mechanisms and growth create more effective pathways out of poverty" },
      { questionText: "Do wealthy individuals have a moral obligation to address global poverty? Construct a philosophically grounded argument drawing on at least two perspectives from the passage. Write 5-6 sentences.", type: "writing" },
    ],
  },
  {
    level: "advanced", order: 10, type: "poem",
    title: "The Love Song of J. Alfred Prufrock",
    estimatedMinutes: 15,
    content: `Let us go then, you and I,\nWhen the evening is spread out against the sky\nLike a patient etherized upon a table;\nLet us go, through certain half-deserted streets,\nThe muttering retreats\nOf restless nights in one-night cheap hotels\nAnd sawdust restaurants with oyster-shells:\nStreets that follow like a tedious argument\nOf insidious intent\nTo lead you to an overwhelming question ...\nOh, do not ask, "What is it?"\nLet us go and make our visit.\n\nDo I dare\nDisturb the universe?\nIn a minute there is time\nFor decisions and revisions which a minute will reverse.\n\nI have measured out my life with coffee spoons;\nI grow old ... I grow old ...\nI shall wear the bottoms of my trousers rolled.\nShall I part my hair behind? Do I dare to eat a peach?\nI am not Prince Hamlet, nor was meant to be;\nI have heard the mermaids singing, each to each.\nI do not think that they will sing to me.`,
    questions: [
      { questionText: "What does 'I have measured out my life with coffee spoons' convey?", type: "mcq", options: ["Prufrock loves coffee", "Prufrock's life has been trivial and lacking in meaningful action", "Prufrock is very organised", "Prufrock is wealthy"], correctAnswer: "Prufrock's life has been trivial and lacking in meaningful action" },
      { questionText: "What does Prufrock's question 'Do I dare disturb the universe?' reveal?", type: "mcq", options: ["His ambition to become a leader", "His paralysing self-doubt and fear of decisive action", "His scientific curiosity", "His desire for adventure"], correctAnswer: "His paralysing self-doubt and fear of decisive action" },
      { questionText: "What does 'I do not think that they will sing to me' suggest about Prufrock?", type: "mcq", options: ["He cannot hear music", "He believes he is unworthy of beauty, love and transcendence", "He prefers silence", "He is too busy to listen"], correctAnswer: "He believes he is unworthy of beauty, love and transcendence" },
      { questionText: "Prufrock is often read as a portrait of modern alienation and existential paralysis. How does this resonate with the psychological experience of contemporary life? Write 5-6 sentences.", type: "writing" },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await ReadingContent.deleteMany({});
    console.log("🗑️  Cleared existing reading content");

    await ReadingContent.insertMany(tasks);
    console.log(`✅ Seeded ${tasks.length} reading tasks successfully!`);

    await mongoose.disconnect();
    console.log("✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();