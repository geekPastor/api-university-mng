# api-university-mng



# 📘 Documentation de l'API

## 🧭 Introduction

Cette API permet de gérer les étudiants, les cours et les notes associées. Elle offre des fonctionnalités pour créer et lister des étudiants et des cours, ajouter des notes, et calculer des moyennes. L'API a été developpé en Node JS.

---


## Base URL

> https://api-university-mng.onrender.com/api


## 🔐 Authentification

> Aucune authentification requise pour l'instant.

---

## 📚 Endpoints

### 1. ➕ Créer un étudiant

- **URL** : `/create`
- **Méthode** : `POST`
- **Description** : Crée un nouvel étudiant avec un matricule et un email générés automatiquement.

#### 📩 Paramètres

| Nom       | Type   | Obligatoire | Description           |
|-----------|--------|-------------|-----------------------|
| `nom`     | string | Oui         | Nom de l'étudiant     |
| `postnom` | string | Oui         | Postnom de l'étudiant |
| `prenom`  | string | Oui         | Prénom de l'étudiant  |

#### 📥 Exemple de requête

```json
{
  "nom": "Kasani",
  "postnom": "Ilunga",
  "prenom": "Narcisse"
}
```

#### 📤 Exemple de réponse

```json
{
  "message": "Étudiant enregistré avec succès",
  "data": {
    "id": 1,
    "nom": "Kasani",
    "postnom": "Ilunga",
    "prenom": "Narcisse",
    "matricule": "25KI001",
    "email": "25KI001@udbl.ac.cd"
  }
}
```

#### 🧾 Codes de réponse

- `201 Created` : Étudiant créé avec succès.
- `400 Bad Request` : Champs requis manquants.
- `500 Internal Server Error` : Erreur serveur.

---

### 2. 📄 Liste des étudiants

- **URL** : `/students`
- **Méthode** : `GET`
- **Description** : Récupère la liste de tous les étudiants.

#### 📤 Exemple de réponse

```json
[
  {
    
    "id": 1,
    "nom": "Kasani",
    "postnom": "Ilunga",
    "prenom": "Narcisse",
    "matricule": "25KI001",
    "email": "25KI001@udbl.ac.cd"
  },
  {
    
    "id": 2,
    "nom": "Mukeba",
    "postnom": "Mukeba",
    "prenom": "Chrinovic",
    "matricule": "25MM002",
    "email": "25MM002@udbl.ac.cd"
  }
]
```

#### 🧾 Codes de réponse

- `200 OK` : Liste récupérée.
- `500 Internal Server Error` : Erreur serveur.

---

### 3. ➕ Créer un cours

- **URL** : `/create-course`
- **Méthode** : `POST`
- **Description** : Crée un nouveau cours avec un code généré automatiquement.

#### 📩 Paramètres

| Nom          | Type   | Obligatoire | Description         |
|--------------|--------|-------------|---------------------|
| `nom`        | string | Oui         | Nom du cours        |
| `professeur` | string | Oui         | Nom du professeur   |

#### 📥 Exemple de requête

```json
{
  "nom": "Génie Logiciel",
  "professeur": "Pol Wenzi"
}
```

#### 📤 Exemple de réponse

```json
{
  "message": "Cours ajouté avec succès",
  "data": {
    "id": 1,"nom": "Génie Logiciel",
    "professeur": "Pol Wenzi",
    "code": "GP"
  }
}
```

#### 🧾 Codes de réponse

- `201 Created` : Cours créé.
- `400 Bad Request` : Champs manquants.
- `500 Internal Server Error` : Erreur serveur.

---

### 4. 📄 Liste des cours

- **URL** : `/courses`
- **Méthode** : `GET`
- **Description** : Récupère la liste de tous les cours.

#### 📤 Exemple de réponse

```json
[
  {
    "id": 1,"nom": "Génie Logiciel",
    "professeur": "Pol Wenzi",
    "code": "GP"
  },
  {
    "id": 2,"nom": "Ergonomie Logicielle",
    "professeur": "Allegra Nzeba",
    "code": "EA"
  }
]
```

#### 🧾 Codes de réponse

- `200 OK` : Liste récupérée.
- `500 Internal Server Error` : Erreur serveur.

---

### 5. ➕ Ajouter une note

- **URL** : `/add-note`
- **Méthode** : `POST`
- **Description** : Ajoute une note pour un étudiant dans un cours.

#### 📩 Paramètres

| Nom         | Type    | Obligatoire | Description                          |
|--------------|---------|-------------|--------------------------------------|
| `student_id` | integer | Oui         | ID de l'étudiant                     |
| `course_id`  | integer | Oui         | ID du cours                          |
| `note_type`  | string  | Oui         | Type de note (e.g. "TP", "Examen")   |
| `note`       | float   | Oui         | Valeur de la note                    |
| `weight`     | float   | Oui         | Poids de la note                     |

#### 📥 Exemple de requête

```json
{
  "student_id": 1,
  "course_id": 1,
  "note_type": "TP",
  "note": 15,
  "ponderation": 0.3
}
```

#### 📤 Exemple de réponse

```json
{
  "message": "Note ajoutée avec succès"
}
```

#### 🧾 Codes de réponse

- `201 Created` : Note ajoutée.
- `400 Bad Request` : Champs manquants ou invalides.
- `500 Internal Server Error` : Erreur serveur.

---

### 6. 👥 Étudiants inscrits à un cours

- **URL** : `/course-students/:course_id`
- **Méthode** : `GET`
- **Description** : Liste des étudiants inscrits à un cours avec leurs notes.

#### 📩 Paramètre d'URL

- `:course_id` – ID du cours

#### 📤 Exemple de réponse

```json
[
  {
    "id": 1,
    "nom": "Kasani",
    "postnom": "Ilunga",
    "matricule": "25KI001",
    "notes": [
      {
        "cours": "Genie Logiciel",
        "note_type": "TP",
        "note": 15,
        "weight": 15
      },
      {
        "cours": "Genie Logiciel",
        "note_type": "Examen",
        "note": 17,
        "weight": 20
      }
    ],
    "moyenne": 16.4
  }
]
```

#### 🧾 Codes de réponse

- `200 OK` : Liste retournée avec succès.
- `500 Internal Server Error` : Erreur serveur.

---

## 📌 Notes

- Le code du cours est automatiquement dérivé du nom.
- Le matricule de l'étudiant est généré à partir de l'année courante et des initiales.
- L’email suit le format : `[matricule]@udbl.ac.cd`.

---

## 👨‍💻 Auteur

Développé par **Geek Pastor**.