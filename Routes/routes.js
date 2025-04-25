const express = require('express');
const router = express.Router();
const db = require('../database');

// Route pour créer un étudiant
router.post('/create', (req, res) => {
    const { nom, postnom, prenom } = req.body;
  
    if (!nom || !postnom || !prenom) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires : nom, postnom, prenom." });
    }
  
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const firstLetterNom = nom.charAt(0).toUpperCase();
    const firstLetterPostnom = postnom.charAt(0).toUpperCase();
  
    // Générer les valeurs de matricule et email avant l'insertion
    const matricule = `${currentYear}${firstLetterNom}${firstLetterPostnom}${Date.now().toString().slice(-4)}`;
    const email = `${matricule.toLowerCase()}@udbl.ac.cd`;
  
    db.run(
      'INSERT INTO students (nom, postnom, prenom, matricule, email) VALUES (?, ?, ?, ?, ?)',
      [nom, postnom, prenom, matricule, email],
      function (err) {
        if (err) {
          console.error("Erreur SQL:", err);
          return res.status(500).json({ error: err.message });
        }
        
        const id = this.lastID;
  
        res.status(201).json({
          message: 'Étudiant enregistré avec succès',
          data: { id, nom, postnom, prenom, matricule, email }
        });
      }
    );
  });
  

// Route pour récupérer la liste des étudiants
router.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) {
        console.error("Erreur SQL:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Route pour créer un cours
router.post('/create-course', (req, res) => {
  const { nom, professeur } = req.body;

  if (!nom || !professeur) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires : nom, professeur." });
  }

  const courseCode = `${nom.charAt(0).toUpperCase()}${professeur.charAt(0).toUpperCase()}`;

  db.run(
    'INSERT INTO courses (nom, professeur, code) VALUES (?, ?, ?)',
    [nom, professeur, courseCode],
    function (err) {
      if (err) {
        console.error("Erreur SQL:", err);
        return res.status(500).json({ error: err.message });
      }
      const course = {
        id: this.lastID,
        nom,
        professeur,
        code: courseCode
      };
      res.status(201).json({
        message: 'Cours ajouté avec succès',
        data: course
      });
    }
  );
});

// Route pour récupérer la liste des cours
router.get('/courses', (req, res) => {
  db.all('SELECT * FROM courses', [], (err, rows) => {
    if (err) {
        console.error("Erreur SQL:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ** Nouvelle route pour ajouter une note pour un étudiant dans un cours **
router.post('/add-note', (req, res) => {
  const { student_id, course_id, note_type, note, weight } = req.body;

  // Vérification des champs requis
  if (!student_id || !course_id || !note_type || note === undefined || weight === undefined) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires : student_id, course_id, note_type, note et weight." });
  }

  const query = `
    INSERT INTO notes (student_id, course_id, note_type, note, weight)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [student_id, course_id, note_type, note, weight], function(err) {
    if (err) {
        console.error("Erreur SQL:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Note ajoutée avec succès' });
  });
});

// ** Nouvelle route pour récupérer les étudiants inscrits à un cours spécifique **
router.get('/course-students/:course_id', (req, res) => {
  const { course_id } = req.params;

  const query = `
    SELECT students.id, students.nom, students.postnom, students.matricule, notes.note_type, notes.note, notes.weight
    FROM students
    JOIN students_courses ON students_courses.student_id = students.id
    LEFT JOIN notes ON notes.student_id = students.id AND notes.course_id = ?
    WHERE students_courses.course_id = ?
  `;

  db.all(query, [course_id, course_id], (err, rows) => {
    if (err) {
        console.error("Erreur SQL:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

// ** Nouvelle route pour récupérer les notes d'un étudiant dans un cours spécifique **
router.get('/student-notes/:student_id/:course_id', (req, res) => {
  const { student_id, course_id } = req.params;

  const query = `
    SELECT note_type, note, weight FROM notes
    WHERE student_id = ? AND course_id = ?
  `;

  db.all(query, [student_id, course_id], (err, rows) => {
    if (err) {
        console.error("Erreur SQL:", err);
      return res.status(500).json({ error: err.message });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucune note trouvée pour cet étudiant dans ce cours." });
    }

    res.json(rows);
  });
});

// ** Nouvelle route pour récupérer la moyenne simple d'un étudiant pour un cours **
router.get('/average/:student_id/:course_id', (req, res) => {
  const { student_id, course_id } = req.params;

  const query = `
    SELECT note, weight FROM notes
    WHERE student_id = ? AND course_id = ? AND note_type != 'Examen'
  `;

  db.all(query, [student_id, course_id], (err, rows) => {
    if (err) {
        console.error("Erreur SQL:", err);
      return res.status(500).json({ error: err.message });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucune note trouvée pour cet étudiant dans ce cours." });
    }

    const totalNotes = rows.reduce((sum, row) => sum + (row.note * row.weight), 0);
    const totalWeight = rows.reduce((sum, row) => sum + row.weight, 0);

    const average = totalWeight > 0 ? totalNotes / totalWeight : 0; // Moyenne pondérée

    res.json({ average });
  });
});

// ** Nouvelle route pour récupérer la moyenne annuelle d'un étudiant pour un cours **
router.get('/annual-average/:student_id/:course_id', (req, res) => {
  const { student_id, course_id } = req.params;

  const query = `
    SELECT note, note_type, weight FROM notes
    WHERE student_id = ? AND course_id = ?
  `;

  db.all(query, [student_id, course_id], (err, rows) => {
    if (err) {
        console.error("Erreur SQL:", err);
      return res.status(500).json({ error: err.message });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucune note trouvée pour cet étudiant dans ce cours." });
    }

    let simpleAverage = 0;
    let examNote = 0;
    let totalSimpleNotes = 0;
    let totalWeight = 0;

    rows.forEach(row => {
      if (row.note_type === 'Examen') {
        examNote = row.note;  // Récupérer la note de l'examen
      } else {
        simpleAverage += (row.note * row.weight); // Additionner la note pondérée
        totalSimpleNotes += row.weight;
      }
    });

    if (totalSimpleNotes > 0) {
      simpleAverage /= totalSimpleNotes;  // Moyenne pondérée des autres notes
    }

    const annualAverage = (simpleAverage + (examNote * 1)) / 2;  // Calcul de la moyenne annuelle

    res.json({ simpleAverage, annualAverage });
  });
});

// Route pour récupérer toutes les notes de tous les cours
router.get('/notes', (req, res) => {
    const query = `
      SELECT students.nom, students.postnom, students.matricule, courses.nom AS course_name, 
             notes.note_type, notes.note, notes.weight
      FROM notes
      JOIN students ON students.id = notes.student_id
      JOIN courses ON courses.id = notes.course_id
    `;
  
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Erreur SQL:", err);  // Log d'erreur SQL
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });
  
  

module.exports = router;