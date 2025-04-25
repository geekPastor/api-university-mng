const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('universite.db', (err) => {
  if (err) return console.error(err.message);
  console.log('🎓 Base de données connectée.');
});

db.serialize(() => {
  // Création de la table des étudiants
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      postnom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      matricule TEXT NOT NULL UNIQUE
    )
  `);

  // Création de la table des cours
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      professeur TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE
    )
  `);

  // Création de la table des notes
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      note_type TEXT NOT NULL,
      note REAL NOT NULL,
      weight REAL,  -- 👈 ajoute cette ligne !
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);
});

module.exports = db;
