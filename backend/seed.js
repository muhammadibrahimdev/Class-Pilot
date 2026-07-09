// seed.js
import mongoose from 'mongoose';
import User from './models/userModel.js';
import dotenv from 'dotenv';
import dns from 'dns';``
dotenv.config();

dns.setServers([
    '1.1.1.1',
    '8.8.8.8',
])

const SCHOOL_ID = '6a45470cf162d509bab3b424'; // replace with your real schoolId

const firstNames = [
  'Ayesha', 'Usman', 'Fatima', 'Ali', 'Sarah', 'Hassan', 'Zainab', 'Bilal',
  'Mariam', 'Omar', 'Sana', 'Hamza', 'Amna', 'Faisal', 'Nida', 'Tariq',
  'Rabia', 'Kamran', 'Saba', 'Adnan', 'Iqra', 'Waqas', 'Hira', 'Naveed',
  'Sadia', 'Imran', 'Farah', 'Shahid', 'Mahnoor', 'Asad',
];

const lastNames = [
  'Khan', 'Ahmed', 'Raza', 'Malik', 'Tariq', 'Hussain', 'Iqbal', 'Sheikh',
  'Butt', 'Chaudhry', 'Farooq', 'Javed', 'Qureshi', 'Siddiqui', 'Baig',
];

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
  'Urdu', 'Computer Science', 'Islamiat', 'Pakistan Studies', 'Economics',
];

const classes = [
  'Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B',
  'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
  const num = Math.floor(1000000 + Math.random() * 9000000);
  return `+9230${Math.floor(Math.random() * 9)}${num}`;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const teachers = [];
  for (let i = 0; i < 50; i++) {
    const first = randomFrom(firstNames);
    const last = randomFrom(lastNames);
    teachers.push({
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@school.edu`, // i keeps emails unique
      phone: randomPhone(),
      subject: randomFrom(subjects),
      assignedClass: randomFrom(classes),
      password: '123456',
      role: 'teacher',
      schoolId: SCHOOL_ID,
      isActive: Math.random() > 0.15, // ~85% active, some inactive for testing that filter/badge
    });
  }

  // NOTE: using insertMany would skip the pre-save hook (no password hashing),
  // so we loop with .create() one by one to keep hashing working correctly.
  for (const t of teachers) {
    await User.create(t);
  }

  console.log(`Seeded ${teachers.length} teachers`);
  await mongoose.disconnect();
}

seed();