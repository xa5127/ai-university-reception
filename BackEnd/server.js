// BackEnd/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend (Public folder)
app.use(express.static(path.join(__dirname, '..', 'Public')));

const DB_PATH = path.join(__dirname, '..', 'Database', 'reception.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open DB:', err.message);
  } else {
    console.log('Connected to reception.db');
  }
});

// Flexible search helper: searches both keywords and question
function searchTable(table, text) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT answer FROM ${table}
      WHERE LOWER(keywords) LIKE ? OR LOWER(question) LIKE ?
      LIMIT 1
    `;
    const param = `%${text}%`;
    db.get(sql, [param, param], (err, row) => {
      if (err) return reject(err);
      resolve(row ? row.answer : null);
    });
  });
}

app.post('/ask', async (req, res) => {
  try {
    const questionRaw = (req.body.question || '').toString().trim().toLowerCase();
    if (!questionRaw) return res.json({ answer: 'Please type a question.' });

    const tables = ['finance_faqs','general_questions','it_support','inquiries','major_test','human_handoff'];

    for (const t of tables) {
      try {
        const ans = await searchTable(t, questionRaw);
        if (ans) return res.json({ answer: ans });
      } catch (err) {
        // If table missing or other error, continue
        console.warn(`Warning searching ${t}:`, err.message || err);
      }
    }

    return res.json({ answer: "Sorry, I don't know the answer to that." });
  } catch (err) {
    console.error('Error in /ask:', err);
    return res.json({ answer: 'Server error. Try again later.' });
  }
});

// Optional debug route: list tables (safe)
app.get('/_tables', (req, res) => {
  db.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ tables: rows.map(r => r.name) });
  });
});

// Start server function — try ports if busy
function startServer(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port)
      .on('listening', () => resolve({ server, port }))
      .on('error', (err) => reject(err));
  });
}

async function boot() {
  let port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  for (let i = 0; i < 10; i++) { // try 10 ports
    try {
      const result = await startServer(port);
      console.log(`Server running at http://localhost:${result.port}`);
      return;
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} busy — trying ${port + 1}`);
        port++;
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    }
  }
  console.error('Could not start server on ports 3000-3009');
  process.exit(1);
}

boot();
