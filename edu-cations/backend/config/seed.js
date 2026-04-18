require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://yt:D3DbToAUCFNNph0v@backend.a55kvrm.mongodb.net/edu-cations');
  console.log('✅ MongoDB Connected for seeding...');
};

// Models
const ClassModel = require('../models/Class');
const Chapter = require('../models/Chapter');
const Video = require('../models/Video');
const User = require('../models/User');

const seedData = async () => {
  await connectDB();

  // Clear existing
  await ClassModel.deleteMany({});
  await Chapter.deleteMany({});
  await Video.deleteMany({});
  await User.deleteMany({});

  console.log('🗑️  Cleared existing data...');

  // Create Admin User
  const hashedPwd = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Admin',
    email: 'admin@edu-cations.com',
    password: hashedPwd,
    role: 'admin'
  });
  console.log('👤 Admin user created: admin@edu-cations.com / admin123');

  // Create Classes
  const classes = await ClassModel.insertMany([
    { number: 9,  label: 'Class 9',  tagline: 'Foundation Builder',      description: 'Science, Math, Social Science & English — strong basics for board success.',      color: '#6c63ff', tag: '5 Subjects · 30+ Chapters' },
    { number: 10, label: 'Class 10', tagline: 'Board Ready',             description: 'Board exam focused content — every important topic covered with clarity.',          color: '#ff6584', tag: '5 Subjects · 35+ Chapters' },
    { number: 11, label: 'Class 11', tagline: 'Stream Explorer',         description: 'PCM, PCB, Commerce & Arts — build your stream from the ground up.',               color: '#43e97b', tag: '3 Streams · 40+ Chapters' },
    { number: 12, label: 'Class 12', tagline: 'JEE / NEET / Boards',    description: 'High-stakes year — mastery-level content for toppers & competitive exams.',        color: '#ffd700', tag: '3 Streams · 45+ Chapters' },
  ]);
  console.log('📚 Classes created...');

  const class10 = classes.find(c => c.number === 10);
  const class9  = classes.find(c => c.number === 9);
  const class11 = classes.find(c => c.number === 11);
  const class12 = classes.find(c => c.number === 12);

  // ---- CLASS 10 CHAPTERS ----
  const ch10_1 = await Chapter.create({ classId: class10._id, subject: 'Mathematics', name: 'Real Numbers', order: 1, nextSteps: ['NCERT Exercise 1.1 se 1.4 solve karo','Phir Chapter 2: Polynomials shuru karo','Irrational numbers ke proofs practice karo','Previous year ke Real Number questions dekho'] });
  const ch10_2 = await Chapter.create({ classId: class10._id, subject: 'Mathematics', name: 'Polynomials', order: 2, nextSteps: ['Zeroes of polynomials graph se dhundh practice karo','Chapter 3: Pair of Linear Equations start karo','Division algorithm ke questions solve karo'] });
  const ch10_3 = await Chapter.create({ classId: class10._id, subject: 'Mathematics', name: 'Pair of Linear Equations', order: 3, nextSteps: ['Substitution & Elimination dono methods practice karo','Chapter 4: Quadratic Equations next','Word problems solve karo'] });
  const ch10_4 = await Chapter.create({ classId: class10._id, subject: 'Mathematics', name: 'Quadratic Equations', order: 4, nextSteps: ['50 quadratic equations solve karo','Chapter 5: Arithmetic Progressions shuru karo','Board me aise questions aate hain — PYQ dekho'] });
  const ch10_5 = await Chapter.create({ classId: class10._id, subject: 'Mathematics', name: 'Arithmetic Progressions', order: 5, nextSteps: ['nth term aur sum ka formula yaad karo','Chapter 6: Triangles start karo','Real life AP examples socho'] });
  const ch10_s1 = await Chapter.create({ classId: class10._id, subject: 'Science', name: 'Chemical Reactions & Equations', order: 1, nextSteps: ['Chemical equations balance karna practice karo','Chapter 2: Acids Bases Salts next','Valency table yaad karo'] });
  const ch10_s2 = await Chapter.create({ classId: class10._id, subject: 'Science', name: 'Acids, Bases and Salts', order: 2, nextSteps: ['pH scale yaad karo (0-14)','Indicators ki list banao — litmus, phenolphthalein','Chapter 3: Metals & Non-Metals shuru karo'] });
  const ch10_s3 = await Chapter.create({ classId: class10._id, subject: 'Science', name: 'Life Processes', order: 3, nextSteps: ['Diagrams: heart, nephron, alimentary canal draw karo','Chapter: Control & Coordination next','NCERT examples revise karo'] });
  const ch10_ss1 = await Chapter.create({ classId: class10._id, subject: 'Social Science', name: 'The Rise of Nationalism in Europe', order: 1, nextSteps: ['Timeline 1830-1871 yaad karo','Unification of Germany & Italy compare karo','Next: Nationalism in India'] });

  // ---- CLASS 9 CHAPTERS ----
  const ch9_1 = await Chapter.create({ classId: class9._id, subject: 'Mathematics', name: 'Number Systems', order: 1, nextSteps: ['Practice NCERT Exercise 1.1 to 1.5','Try Chapter 2: Polynomials next','Solve 10 MCQs on Number Line'] });
  const ch9_2 = await Chapter.create({ classId: class9._id, subject: 'Mathematics', name: 'Polynomials', order: 2, nextSteps: ['Solve all NCERT examples','Chapter 3: Coordinate Geometry hai next','Algebraic identities revise karo'] });
  const ch9_s1 = await Chapter.create({ classId: class9._id, subject: 'Science', name: 'Matter in Our Surroundings', order: 1, nextSteps: ['Yad karo: solid, liquid, gas ke properties','Is Pure Chemistry ka ek aur chapter karo','NCERT Q&A revise karo'] });

  // ---- CLASS 11 CHAPTERS ----
  const ch11_p1 = await Chapter.create({ classId: class11._id, subject: 'Physics', name: 'Physical World & Units', order: 1, nextSteps: ['SI units ki complete table yaad karo','Chapter 2: Motion in Straight Line start karo','Dimensional analysis ke 20 questions solve karo'] });
  const ch11_p2 = await Chapter.create({ classId: class11._id, subject: 'Physics', name: 'Motion in a Straight Line', order: 2, nextSteps: ['v-t aur x-t graphs draw karna practice karo','Chapter 3: Motion in Plane next','3 equations of motion memorise karo'] });
  const ch11_c1 = await Chapter.create({ classId: class11._id, subject: 'Chemistry', name: 'Some Basic Concepts of Chemistry', order: 1, nextSteps: ['Mole concept ki practice NCERT se karo','Molarity aur Molality formulas revise karo','Chapter 2: Structure of Atom next'] });

  // ---- CLASS 12 CHAPTERS ----
  const ch12_p1 = await Chapter.create({ classId: class12._id, subject: 'Physics', name: 'Electric Charges and Fields', order: 1, nextSteps: ['Gauss Law ke 20 numerical solve karo','Chapter 2: Electrostatic Potential next','JEE previous year questions dekho'] });
  const ch12_m1 = await Chapter.create({ classId: class12._id, subject: 'Mathematics', name: 'Relations and Functions', order: 1, nextSteps: ['NCERT miscellaneous exercise solve karo','Chapter 2: Inverse Trigonometry next','Board exam ke liye 5-mark questions dekho'] });
  const ch12_m2 = await Chapter.create({ classId: class12._id, subject: 'Mathematics', name: 'Inverse Trigonometric Functions', order: 2, nextSteps: ['Principal value aur range yaad karo','Chapter 3: Matrices next','ITF ke identities revise karo'] });

  console.log('📖 Chapters created...');

  // ---- VIDEOS ----
  const videos = [
    // Class 10 Math Ch1
    { chapterId: ch10_1._id, title: 'Real Numbers - Complete Chapter | Class 10', creator: 'Vedantu Class 9 & 10', handle: '@VedantuClass910', url: 'https://www.youtube.com/watch?v=0V5pPNqxMB4', thumb: 'https://img.youtube.com/vi/0V5pPNqxMB4/hqdefault.jpg', tags: ['NCERT','Euclid','HCF','LCM'], order: 1 },
    { chapterId: ch10_1._id, title: "Euclid's Division Lemma - Trick & Examples", creator: 'MathonGo', handle: '@MathonGo', url: 'https://www.youtube.com/watch?v=6uisBaMBvUQ', thumb: 'https://img.youtube.com/vi/6uisBaMBvUQ/hqdefault.jpg', tags: ['Euclid','HCF','Trick'], order: 2 },
    { chapterId: ch10_1._id, title: 'Fundamental Theorem of Arithmetic', creator: 'Khan Academy India', handle: '@KhanAcademyIndia', url: 'https://www.youtube.com/watch?v=DZIbQXNbOHM', thumb: 'https://img.youtube.com/vi/DZIbQXNbOHM/hqdefault.jpg', tags: ['Arithmetic','Prime','Factorization'], order: 3 },
    // Class 10 Math Ch2
    { chapterId: ch10_2._id, title: 'Polynomials Class 10 - Full Chapter', creator: 'Doubtnut', handle: '@Doubtnut', url: 'https://www.youtube.com/watch?v=t4mG9RzJ3j8', thumb: 'https://img.youtube.com/vi/t4mG9RzJ3j8/hqdefault.jpg', tags: ['Zeroes','Graph','Quadratic'], order: 1 },
    { chapterId: ch10_2._id, title: 'Relationship Between Zeroes & Coefficients', creator: 'Magnet Brains', handle: '@MagnetBrains', url: 'https://www.youtube.com/watch?v=N0Nh1MHxLgQ', thumb: 'https://img.youtube.com/vi/N0Nh1MHxLgQ/hqdefault.jpg', tags: ['Alpha Beta','Coefficients'], order: 2 },
    // Class 10 Math Ch3
    { chapterId: ch10_3._id, title: 'Pair of Linear Equations - Class 10', creator: 'Vedantu', handle: '@VedantuClass910', url: 'https://www.youtube.com/watch?v=z3nCeZ3jMoU', thumb: 'https://img.youtube.com/vi/z3nCeZ3jMoU/hqdefault.jpg', tags: ['Substitution','Elimination','Graph'], order: 1 },
    // Class 10 Math Ch4
    { chapterId: ch10_4._id, title: 'Quadratic Equations - Complete Chapter', creator: 'Physics Wallah - Alakh Pandey', handle: '@PhysicsWallah', url: 'https://www.youtube.com/watch?v=RFXJ2DH9vb4', thumb: 'https://img.youtube.com/vi/RFXJ2DH9vb4/hqdefault.jpg', tags: ['Discriminant','Factorisation','Formula'], order: 1 },
    { chapterId: ch10_4._id, title: 'Quadratic Formula & Nature of Roots', creator: 'Unacademy Class 9 & 10', handle: '@Unacademy', url: 'https://www.youtube.com/watch?v=lBb-G2AKQG8', thumb: 'https://img.youtube.com/vi/lBb-G2AKQG8/hqdefault.jpg', tags: ['Formula','Roots','Real','Imaginary'], order: 2 },
    // Class 10 Math Ch5
    { chapterId: ch10_5._id, title: 'Arithmetic Progressions - Class 10 Full', creator: 'Magnet Brains', handle: '@MagnetBrains', url: 'https://www.youtube.com/watch?v=ZIfrmIMVLdw', thumb: 'https://img.youtube.com/vi/ZIfrmIMVLdw/hqdefault.jpg', tags: ['AP','nth term','Sum'], order: 1 },
    // Class 10 Science
    { chapterId: ch10_s1._id, title: 'Chemical Reactions & Equations - Full Chapter', creator: 'Vedantu Class 9 & 10', handle: '@VedantuClass910', url: 'https://www.youtube.com/watch?v=6dxHjkQBF_8', thumb: 'https://img.youtube.com/vi/6dxHjkQBF_8/hqdefault.jpg', tags: ['Chemistry','Balancing','Reactions'], order: 1 },
    { chapterId: ch10_s1._id, title: 'Types of Chemical Reactions', creator: 'Magnet Brains', handle: '@MagnetBrains', url: 'https://www.youtube.com/watch?v=xJaLsapNTSU', thumb: 'https://img.youtube.com/vi/xJaLsapNTSU/hqdefault.jpg', tags: ['Combination','Decomposition','Redox'], order: 2 },
    { chapterId: ch10_s2._id, title: 'Acids Bases Salts - Complete Chapter | Class 10', creator: 'Physics Wallah', handle: '@PhysicsWallah', url: 'https://www.youtube.com/watch?v=Oew7iuqJI7g', thumb: 'https://img.youtube.com/vi/Oew7iuqJI7g/hqdefault.jpg', tags: ['pH','Indicators','Salts'], order: 1 },
    { chapterId: ch10_s3._id, title: 'Life Processes - Class 10 Biology Full Chapter', creator: 'Doubtnut', handle: '@Doubtnut', url: 'https://www.youtube.com/watch?v=C5vApMH1VYk', thumb: 'https://img.youtube.com/vi/C5vApMH1VYk/hqdefault.jpg', tags: ['Nutrition','Respiration','Transport','Excretion'], order: 1 },
    { chapterId: ch10_s3._id, title: 'Photosynthesis & Nutrition in Plants', creator: 'Khan Academy India', handle: '@KhanAcademyIndia', url: 'https://www.youtube.com/watch?v=WJFoVSUrYlA', thumb: 'https://img.youtube.com/vi/WJFoVSUrYlA/hqdefault.jpg', tags: ['Photosynthesis','Biology'], order: 2 },
    { chapterId: ch10_ss1._id, title: 'Rise of Nationalism in Europe - Class 10', creator: 'Unacademy Class 9 & 10', handle: '@Unacademy', url: 'https://www.youtube.com/watch?v=FQEiEBEG2j4', thumb: 'https://img.youtube.com/vi/FQEiEBEG2j4/hqdefault.jpg', tags: ['History','Nationalism','Europe'], order: 1 },
    // Class 9
    { chapterId: ch9_1._id, title: 'Number Systems - Full Chapter Explained', creator: 'Khan Academy India', handle: '@KhanAcademyIndia', url: 'https://www.youtube.com/watch?v=5MkleW5v0BM', thumb: 'https://img.youtube.com/vi/5MkleW5v0BM/hqdefault.jpg', tags: ['NCERT','Basics','Class 9'], order: 1 },
    { chapterId: ch9_2._id, title: 'Polynomials Class 9 - Complete Chapter', creator: 'MathonGo', handle: '@MathonGo', url: 'https://www.youtube.com/watch?v=lCISAFaOfVE', thumb: 'https://img.youtube.com/vi/lCISAFaOfVE/hqdefault.jpg', tags: ['Polynomials','Class 9'], order: 1 },
    { chapterId: ch9_s1._id, title: 'Matter in Our Surroundings - Full Chapter', creator: 'Magnet Brains', handle: '@MagnetBrains', url: 'https://www.youtube.com/watch?v=f3tIDQgf5ck', thumb: 'https://img.youtube.com/vi/f3tIDQgf5ck/hqdefault.jpg', tags: ['Physics','States of Matter'], order: 1 },
    // Class 11
    { chapterId: ch11_p1._id, title: 'Physical World - Class 11 Physics', creator: 'Physics Wallah - Alakh Pandey', handle: '@PhysicsWallah', url: 'https://www.youtube.com/watch?v=rNUn66kd8g4', thumb: 'https://img.youtube.com/vi/rNUn66kd8g4/hqdefault.jpg', tags: ['SI Units','Dimensions','Class 11'], order: 1 },
    { chapterId: ch11_p2._id, title: 'Motion in Straight Line - Full Chapter Class 11', creator: 'Vedantu JEE', handle: '@VedantuJEE', url: 'https://www.youtube.com/watch?v=6c3o7UjYMus', thumb: 'https://img.youtube.com/vi/6c3o7UjYMus/hqdefault.jpg', tags: ['Kinematics','Velocity','Acceleration'], order: 1 },
    { chapterId: ch11_c1._id, title: 'Basic Concepts of Chemistry - Class 11', creator: 'Physics Wallah', handle: '@PhysicsWallah', url: 'https://www.youtube.com/watch?v=fKb5VoUSbso', thumb: 'https://img.youtube.com/vi/fKb5VoUSbso/hqdefault.jpg', tags: ['Mole Concept','Stoichiometry','Molarity'], order: 1 },
    // Class 12
    { chapterId: ch12_p1._id, title: 'Electric Charges & Fields - Full Chapter | Class 12', creator: 'Physics Wallah - Alakh Pandey', handle: '@PhysicsWallah', url: 'https://www.youtube.com/watch?v=OcVJ5jwdWzc', thumb: 'https://img.youtube.com/vi/OcVJ5jwdWzc/hqdefault.jpg', tags: ['Coulomb','Gauss Law','Field Lines'], order: 1 },
    { chapterId: ch12_m1._id, title: 'Relations & Functions - Class 12 Full Chapter', creator: 'Vedantu', handle: '@VedantuClass1112', url: 'https://www.youtube.com/watch?v=sVLfENFfqZQ', thumb: 'https://img.youtube.com/vi/sVLfENFfqZQ/hqdefault.jpg', tags: ['Bijective','Injective','Surjective','Functions'], order: 1 },
    { chapterId: ch12_m2._id, title: 'Inverse Trigonometric Functions - Full Chapter', creator: 'MathonGo', handle: '@MathonGo', url: 'https://www.youtube.com/watch?v=j_pF7djZvC8', thumb: 'https://img.youtube.com/vi/j_pF7djZvC8/hqdefault.jpg', tags: ['arcsin','arccos','arctan','Properties'], order: 1 },
  ];

  await Video.insertMany(videos);
  console.log('🎬 Videos seeded...');

  console.log('\n✅ Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Admin Login: admin@edu-cations.com / admin123');
  console.log('🚀 Run: npm start');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
};

seedData().catch(err => { console.error(err); process.exit(1); });
