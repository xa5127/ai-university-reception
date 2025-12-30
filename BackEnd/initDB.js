// BackEnd/initDB.js
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csvtojson');

const DB_PATH = path.join(__dirname, '..', 'Database', 'reception.db');
const CSV_FOLDER = path.join(__dirname, '..', 'Database', 'excel_sheets');

if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function createTables() {
  await runAsync(`CREATE TABLE IF NOT EXISTS finance_faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT,
    keywords TEXT
  )`);
  await runAsync(`CREATE TABLE IF NOT EXISTS general_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT,
    keywords TEXT
  )`);
  await runAsync(`CREATE TABLE IF NOT EXISTS it_support (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT,
    keywords TEXT
  )`);
  await runAsync(`CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT,
    keywords TEXT
  )`);
  await runAsync(`CREATE TABLE IF NOT EXISTS major_test (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT,
    keywords TEXT
  )`);
  await runAsync(`CREATE TABLE IF NOT EXISTS human_handoff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT,
    keywords TEXT
  )`);
}

async function importCsvToTable(csvPath, tableName) {
  if (!fs.existsSync(csvPath)) return;
  const jsonArray = await csv().fromFile(csvPath);
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) return;

  // Attempt to detect columns: question, answer, keywords.
  // For safety, we pick lowercased header names.
  const headers = Object.keys(jsonArray[0]).map(h => h.toLowerCase().trim());

  // Insert rows
  const insertStmt = db.prepare(`INSERT INTO ${tableName} (question, answer, keywords) VALUES (?, ?, ?)`);
  jsonArray.forEach(row => {
    const q = (row.question || row.Question || row['Question'] || row[headers.find(h => h.includes('question'))] || '').toString().trim();
    const a = (row.answer || row.Answer || row['Answer'] || row[headers.find(h => h.includes('answer'))] || '').toString().trim();
    const k = (row.keywords || row.keywords || row.Keywords || row['Keywords'] || row[headers.find(h => h.includes('keyword'))] || '').toString().trim();
    if (q || a) {
      insertStmt.run(q, a, k);
    }
  });
  insertStmt.finalize();
}

async function importAllCsvs() {
  const mapping = {
    'finance_faqs.csv': 'finance_faqs',
    'general_questions.csv': 'general_questions',
    'it_support.csv': 'it_support',
    'inquiries.csv': 'inquiries',
    'major_test.csv': 'major_test',
    'human_handoff.csv': 'human_handoff'
  };

  for (const [file, table] of Object.entries(mapping)) {
    const p = path.join(CSV_FOLDER, file);
    if (fs.existsSync(p)) {
      console.log(`Importing ${file} -> ${table}`);
      await importCsvToTable(p, table);
    } else {
      console.log(`${file} not found in ${CSV_FOLDER}, skipping.`);
    }
  }
}

async function main(){
  try {
    await createTables();
    if (!fs.existsSync(CSV_FOLDER)) {
      fs.mkdirSync(CSV_FOLDER, { recursive: true });
      console.log(`Created folder for CSVs: ${CSV_FOLDER}. Add your CSVs there and re-run 'npm run init-db' to import.`);
    }
    await importAllCsvs();
    console.log('Database initialized and CSV import (if any) complete.');
  } catch (err) {
    console.error('Error initializing DB:', err);
  } finally {
    db.close();
  }
}

main();
