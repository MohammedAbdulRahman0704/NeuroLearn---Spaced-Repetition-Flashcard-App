import initSqlJs from 'sql.js';
import { DatabaseSchema } from '../types';

// We'll store a reference to the database instance
let db: any = null;

// Initialize the database
export const initializeDatabase = async () => {
  try {
    // Load SQL.js
    const SQL = await initSqlJs({
      // Specify the location of the wasm file
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    });

    // Create a new database
    db = new SQL.Database();

    // Create tables if they don't exist
    createTables();
    
    console.log('Database initialized');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

// Get the database instance
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

// Create the database tables
const createTables = () => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      streak_days INTEGER DEFAULT 0,
      last_activity TEXT
    )
  `);

  // Decks table
  db.run(`
    CREATE TABLE IF NOT EXISTS decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      cover_image TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Flashcards table
  db.run(`
    CREATE TABLE IF NOT EXISTS flashcards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deck_id INTEGER NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      front_type TEXT DEFAULT 'text',
      back_type TEXT DEFAULT 'text',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      due_date TEXT DEFAULT CURRENT_TIMESTAMP,
      interval REAL DEFAULT 0,
      ease_factor REAL DEFAULT 2.5,
      review_count INTEGER DEFAULT 0,
      lapses INTEGER DEFAULT 0,
      FOREIGN KEY (deck_id) REFERENCES decks (id)
    )
  `);

  // Tags table
  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);

  // Flashcard tags (junction table)
  db.run(`
    CREATE TABLE IF NOT EXISTS flashcard_tags (
      flashcard_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (flashcard_id, tag_id),
      FOREIGN KEY (flashcard_id) REFERENCES flashcards (id),
      FOREIGN KEY (tag_id) REFERENCES tags (id)
    )
  `);

  // Reviews table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flashcard_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      review_date TEXT DEFAULT CURRENT_TIMESTAMP,
      rating TEXT NOT NULL,
      time_spent INTEGER DEFAULT 0,
      FOREIGN KEY (flashcard_id) REFERENCES flashcards (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      user_id INTEGER PRIMARY KEY,
      theme TEXT DEFAULT 'system',
      new_cards_per_day INTEGER DEFAULT 20,
      max_reviews_per_day INTEGER DEFAULT 100,
      show_timer BOOLEAN DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
};

// Export a function to seed the database with sample data (for development)
export const seedDatabase = () => {
  // Check if we already have data
  const result = db.exec("SELECT COUNT(*) AS count FROM users");
  if (result[0]?.values[0]?.[0] > 0) {
    console.log('Database already has data, skipping seed');
    return;
  }

  // Create a sample user
  db.run(`
    INSERT INTO users (email, username, password, streak_days, last_activity)
    VALUES ('user@example.com', 'Demo User', '$2a$10$JrPJnIYBB.UDmXjFU6MET.0GvUxV5MJrKJ5IleTtKcWcnHfRSBm1a', 5, date('now'))
  `);

  // Get the user ID
  const userId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];

  // Create user settings
  db.run(`
    INSERT INTO settings (user_id, theme, new_cards_per_day, max_reviews_per_day, show_timer)
    VALUES (?, 'system', 20, 100, 1)
  `, [userId]);

  // Create sample decks
  const deckIds = [];
  const deckData = [
    { title: 'JavaScript Basics', description: 'Core concepts of JavaScript programming language' },
    { title: 'Spanish Vocabulary', description: 'Common Spanish words and phrases' },
    { title: 'Biology Terms', description: 'Important terminology in biology' }
  ];

  for (const deck of deckData) {
    db.run(`
      INSERT INTO decks (user_id, title, description, created_at, updated_at)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `, [userId, deck.title, deck.description]);
    
    const deckId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
    deckIds.push(deckId);
  }

  // Create sample tags
  const tagData = ['javascript', 'programming', 'spanish', 'language', 'biology', 'science', 'beginner', 'advanced'];
  const tagIds = {};

  for (const tag of tagData) {
    db.run(`INSERT INTO tags (name) VALUES (?)`, [tag]);
    const tagId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
    tagIds[tag] = tagId;
  }

  // Create sample flashcards for JavaScript deck
  const jsCards = [
    { front: 'What is a closure in JavaScript?', back: 'A closure is a function that has access to its own scope, the outer function scope, and the global scope', tags: ['javascript', 'programming', 'advanced'] },
    { front: 'What is the difference between let and var?', back: 'var is function scoped, while let is block scoped. let was introduced in ES6.', tags: ['javascript', 'programming', 'beginner'] },
    { front: 'What is the purpose of the Promise object?', back: 'The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.', tags: ['javascript', 'programming', 'advanced'] }
  ];

  for (const card of jsCards) {
    db.run(`
      INSERT INTO flashcards (deck_id, front, back, due_date, interval, ease_factor, review_count)
      VALUES (?, ?, ?, datetime('now'), ?, ?, ?)
    `, [deckIds[0], card.front, card.back, Math.random() * 5, 2.5 - Math.random() * 0.5, Math.floor(Math.random() * 5)]);
    
    const cardId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
    
    // Add tags to the flashcard
    for (const tag of card.tags) {
      db.run(`
        INSERT INTO flashcard_tags (flashcard_id, tag_id)
        VALUES (?, ?)
      `, [cardId, tagIds[tag]]);
    }
  }

  // Create sample flashcards for Spanish deck
  const spanishCards = [
    { front: 'Hello', back: 'Hola', tags: ['spanish', 'language', 'beginner'] },
    { front: 'Thank you', back: 'Gracias', tags: ['spanish', 'language', 'beginner'] },
    { front: 'How are you?', back: '¿Cómo estás?', tags: ['spanish', 'language', 'beginner'] }
  ];

  for (const card of spanishCards) {
    db.run(`
      INSERT INTO flashcards (deck_id, front, back, due_date, interval, ease_factor, review_count)
      VALUES (?, ?, ?, datetime('now'), ?, ?, ?)
    `, [deckIds[1], card.front, card.back, Math.random() * 5, 2.5 - Math.random() * 0.5, Math.floor(Math.random() * 5)]);
    
    const cardId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
    
    // Add tags to the flashcard
    for (const tag of card.tags) {
      db.run(`
        INSERT INTO flashcard_tags (flashcard_id, tag_id)
        VALUES (?, ?)
      `, [cardId, tagIds[tag]]);
    }
  }

  // Create sample flashcards for Biology deck
  const biologyCards = [
    { front: 'What is photosynthesis?', back: 'The process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.', tags: ['biology', 'science', 'beginner'] },
    { front: 'What is the function of mitochondria?', back: 'Mitochondria are the powerhouse of the cell, generating most of the cell\'s supply of ATP.', tags: ['biology', 'science', 'beginner'] },
    { front: 'What is DNA?', back: 'Deoxyribonucleic acid, a self-replicating material present in nearly all living organisms as the main constituent of chromosomes.', tags: ['biology', 'science', 'beginner'] }
  ];

  for (const card of biologyCards) {
    db.run(`
      INSERT INTO flashcards (deck_id, front, back, due_date, interval, ease_factor, review_count)
      VALUES (?, ?, ?, datetime('now'), ?, ?, ?)
    `, [deckIds[2], card.front, card.back, Math.random() * 5, 2.5 - Math.random() * 0.5, Math.floor(Math.random() * 5)]);
    
    const cardId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
    
    // Add tags to the flashcard
    for (const tag of card.tags) {
      db.run(`
        INSERT INTO flashcard_tags (flashcard_id, tag_id)
        VALUES (?, ?)
      `, [cardId, tagIds[tag]]);
    }
  }

  // Create sample reviews
  for (let i = 0; i < 50; i++) {
    const flashcardId = Math.floor(Math.random() * 9) + 1; // Random from 1-9
    const daysAgo = Math.floor(Math.random() * 14); // Random day in the last 2 weeks
    const rating = ['again', 'hard', 'good', 'easy'][Math.floor(Math.random() * 4)];
    const timeSpent = Math.floor(Math.random() * 20000) + 1000; // 1-21 seconds
    
    db.run(`
      INSERT INTO reviews (flashcard_id, user_id, review_date, rating, time_spent)
      VALUES (?, ?, datetime('now', '-${daysAgo} days'), ?, ?)
    `, [flashcardId, userId, rating, timeSpent]);
  }

  console.log('Database seeded with sample data');
};

// Export CRUD operations for each entity
export const userRepository = {
  findByEmail: (email: string) => {
    const result = db.exec(`
      SELECT id, email, username, created_at as createdAt, streak_days as streakDays, last_activity as lastActivity
      FROM users 
      WHERE email = ?
    `, [email]);
    
    if (result.length > 0 && result[0].values.length > 0) {
      const user = {};
      result[0].columns.forEach((col: string, i: number) => {
        user[col] = result[0].values[0][i];
      });
      return user as DatabaseSchema['users'][0];
    }
    return null;
  },
  
  create: (email: string, username: string, password: string) => {
    db.run(`
      INSERT INTO users (email, username, password, created_at, last_activity)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `, [email, username, password]);
    
    return userRepository.findByEmail(email);
  },
  
  authenticate: (email: string, password: string) => {
    // In a real app, you'd validate the password hash
    // For this example, we'll just return the user
    return userRepository.findByEmail(email);
  },
  
  updateLastActivity: (userId: number) => {
    db.run(`
      UPDATE users
      SET last_activity = datetime('now')
      WHERE id = ?
    `, [userId]);
  },
  
  updateStreak: (userId: number, streakDays: number) => {
    db.run(`
      UPDATE users
      SET streak_days = ?
      WHERE id = ?
    `, [streakDays, userId]);
  }
};

export const deckRepository = {
  findAll: (userId: number) => {
    const result = db.exec(`
      SELECT 
        d.id, 
        d.user_id as userId, 
        d.title, 
        d.description, 
        d.cover_image as coverImage, 
        d.created_at as createdAt, 
        d.updated_at as updatedAt,
        COUNT(f.id) as cardCount,
        SUM(CASE WHEN f.due_date <= datetime('now') THEN 1 ELSE 0 END) as dueCardCount,
        (
            SELECT GROUP_CONCAT(t.name)
            FROM tags t
            INNER JOIN flashcard_tags ft ON ft.tag_id = t.id
            INNER JOIN flashcards f2 ON f2.id = ft.flashcard_id
            WHERE f2.deck_id = d.id
            GROUP BY f2.deck_id
        ) as tags
      FROM decks d
      LEFT JOIN flashcards f ON f.deck_id = d.id
      WHERE d.user_id = ?
      GROUP BY d.id
      ORDER BY d.updated_at DESC
    `, [userId]);

    if (result.length > 0) {
      return result[0].values.map((row: any[]) => {
        const deck = {};
        result[0].columns.forEach((col: string, i: number) => {
          if (col === 'tags' && row[i]) {
            deck[col] = row[i].split(',');
          } else {
            deck[col] = row[i];
          }
        });
        return deck;
      }) as DatabaseSchema['decks'];
    }
    return [];
  },
  
  findById: (deckId: number, userId: number) => {
    const result = db.exec(`
      SELECT 
        d.id, 
        d.user_id as userId, 
        d.title, 
        d.description, 
        d.cover_image as coverImage, 
        d.created_at as createdAt, 
        d.updated_at as updatedAt,
        COUNT(f.id) as cardCount,
        SUM(CASE WHEN f.due_date <= datetime('now') THEN 1 ELSE 0 END) as dueCardCount,
        (
            SELECT GROUP_CONCAT(t.name)
            FROM tags t
            INNER JOIN flashcard_tags ft ON ft.tag_id = t.id
            INNER JOIN flashcards f2 ON f2.id = ft.flashcard_id
            WHERE f2.deck_id = d.id
            GROUP BY f2.deck_id
        ) as tags
      FROM decks d
      LEFT JOIN flashcards f ON f.deck_id = d.id
      WHERE d.id = ? AND d.user_id = ?
      GROUP BY d.id
    `, [deckId, userId]);
    
    if (result.length > 0 && result[0].values.length > 0) {
      const deck = {};
      result[0].columns.forEach((col: string, i: number) => {
        if (col === 'tags' && result[0].values[0][i]) {
          deck[col] = result[0].values[0][i].split(',');
        } else {
          deck[col] = result[0].values[0][i];
        }
      });
      return deck as DatabaseSchema['decks'][0];
    }
    return null;
  },
  
  create: (deck: Partial<DatabaseSchema['decks'][0]>) => {
    db.run(`
      INSERT INTO decks (user_id, title, description, cover_image, created_at, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [deck.userId, deck.title, deck.description, deck.coverImage]);
    
    const deckId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
    return deckRepository.findById(deckId, deck.userId!);
  },
  
  update: (deckId: number, userId: number, deck: Partial<DatabaseSchema['decks'][0]>) => {
    db.run(`
      UPDATE decks
      SET title = ?, description = ?, cover_image = ?, updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `, [deck.title, deck.description, deck.coverImage, deckId, userId]);
    
    return deckRepository.findById(deckId, userId);
  },
  
  delete: (deckId: number, userId: number) => {
    // Delete all flashcards in the deck first
    db.run(`
      DELETE FROM flashcard_tags
      WHERE flashcard_id IN (SELECT id FROM flashcards WHERE deck_id = ?)
    `, [deckId]);
    
    db.run(`
      DELETE FROM reviews
      WHERE flashcard_id IN (SELECT id FROM flashcards WHERE deck_id = ?)
    `, [deckId]);
    
    db.run(`
      DELETE FROM flashcards
      WHERE deck_id = ?
    `, [deckId]);
    
    // Delete the deck
    db.run(`
      DELETE FROM decks
      WHERE id = ? AND user_id = ?
    `, [deckId, userId]);
    
    return true;
  }
};

export const flashcardRepository = {
  findByDeckId: (deckId: number) => {
    const result = db.exec(`
      SELECT 
        f.id, 
        f.deck_id as deckId, 
        f.front, 
        f.back, 
        f.front_type as frontType, 
        f.back_type as backType, 
        f.created_at as createdAt, 
        f.updated_at as updatedAt,
        f.due_date as dueDate,
        f.interval,
        f.ease_factor as easeFactor,
        f.review_count as reviewCount,
        f.lapses,
        (
            SELECT GROUP_CONCAT(t.name)
            FROM tags t
            INNER JOIN flashcard_tags ft ON ft.tag_id = t.id
            WHERE ft.flashcard_id = f.id
        ) as tags
      FROM flashcards f
      WHERE f.deck_id = ?
      ORDER BY f.created_at DESC
    `, [deckId]);
    
    if (result.length > 0) {
      return result[0].values.map((row: any[]) => {
        const flashcard = {};
        result[0].columns.forEach((col: string, i: number) => {
          if (col === 'tags' && row[i]) {
            flashcard[col] = row[i].split(',');
          } else {
            flashcard[col] = row[i];
          }
        });
        return flashcard;
      }) as DatabaseSchema['flashcards'];
    }
    return [];
  },
  
  findDueCards: (deckId: number, limit: number = 20) => {
    const result = db.exec(`
      SELECT 
        f.id, 
        f.deck_id as deckId, 
        f.front, 
        f.back, 
        f.front_type as frontType, 
        f.back_type as backType, 
        f.created_at as createdAt, 
        f.updated_at as updatedAt,
        f.due_date as dueDate,
        f.interval,
        f.ease_factor as easeFactor,
        f.review_count as reviewCount,
        f.lapses,
        (
            SELECT GROUP_CONCAT(t.name)
            FROM tags t
            INNER JOIN flashcard_tags ft ON ft.tag_id = t.id
            WHERE ft.flashcard_id = f.id
        ) as tags
      FROM flashcards f
      WHERE f.deck_id = ? AND f.due_date <= datetime('now')
      ORDER BY f.due_date ASC
      LIMIT ?
    `, [deckId, limit]);
    
    if (result.length > 0) {
      return result[0].values.map((row: any[]) => {
        const flashcard = {};
        result[0].columns.forEach((col: string, i: number) => {
          if (col === 'tags' && row[i]) {
            flashcard[col] = row[i].split(',');
          } else {
            flashcard[col] = row[i];
          }
        });
        return flashcard;
      }) as DatabaseSchema['flashcards'];
    }
    return [];
  },
  
  findById: (flashcardId: number) => {
    const result = db.exec(`
      SELECT 
        f.id, 
        f.deck_id as deckId, 
        f.front, 
        f.back, 
        f.front_type as frontType, 
        f.back_type as backType, 
        f.created_at as createdAt, 
        f.updated_at as updatedAt,
        f.due_date as dueDate,
        f.interval,
        f.ease_factor as easeFactor,
        f.review_count as reviewCount,
        f.lapses,
        (
            SELECT GROUP_CONCAT(t.name)
            FROM tags t
            INNER JOIN flashcard_tags ft ON ft.tag_id = t.id
            WHERE ft.flashcard_id = f.id
        ) as tags
      FROM flashcards f
      WHERE f.id = ?
    `, [flashcardId]);
    
    if (result.length > 0 && result[0].values.length > 0) {
      const flashcard = {};
      result[0].columns.forEach((col: string, i: number) => {
        if (col === 'tags' && result[0].values[0][i]) {
          flashcard[col] = result[0].values[0][i].split(',');
        } else {
          flashcard[col] = result[0].values[0][i];
        }
      });
      return flashcard as DatabaseSchema['flashcards'][0];
    }
    return null;
  },
  
  create: (flashcard: Partial<DatabaseSchema['flashcards'][0]>) => {
    db.run(`
      INSERT INTO flashcards (
        deck_id, front, back, front_type, back_type, 
        created_at, updated_at, due_date, interval, ease_factor
      )
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'), 0, 2.5)
    `, [flashcard.deckId, flashcard.front, flashcard.back, flashcard.frontType || 'text', flashcard.backType || 'text']);
    
    const flashcardId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
    
    // If there are tags, add them
    if (flashcard.tags && flashcard.tags.length > 0) {
      for (const tagName of flashcard.tags) {
        // First, ensure the tag exists
        let tagId;
        const tagResult = db.exec("SELECT id FROM tags WHERE name = ?", [tagName]);
        
        if (tagResult.length > 0 && tagResult[0].values.length > 0) {
          tagId = tagResult[0].values[0][0];
        } else {
          db.run("INSERT INTO tags (name) VALUES (?)", [tagName]);
          tagId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
        }
        
        // Then link the tag to the flashcard
        db.run(`
          INSERT INTO flashcard_tags (flashcard_id, tag_id)
          VALUES (?, ?)
        `, [flashcardId, tagId]);
      }
    }
    
    // Update the deck's updated_at timestamp
    db.run(`
      UPDATE decks
      SET updated_at = datetime('now')
      WHERE id = ?
    `, [flashcard.deckId]);
    
    return flashcardRepository.findById(flashcardId);
  },
  
  update: (flashcardId: number, flashcard: Partial<DatabaseSchema['flashcards'][0]>) => {
    db.run(`
      UPDATE flashcards
      SET front = ?, back = ?, front_type = ?, back_type = ?, updated_at = datetime('now')
      WHERE id = ?
    `, [flashcard.front, flashcard.back, flashcard.frontType, flashcard.backType, flashcardId]);
    
    // Update tags if provided
    if (flashcard.tags) {
      // Remove existing tags
      db.run(`
        DELETE FROM flashcard_tags
        WHERE flashcard_id = ?
      `, [flashcardId]);
      
      // Add new tags
      for (const tagName of flashcard.tags) {
        // First, ensure the tag exists
        let tagId;
        const tagResult = db.exec("SELECT id FROM tags WHERE name = ?", [tagName]);
        
        if (tagResult.length > 0 && tagResult[0].values.length > 0) {
          tagId = tagResult[0].values[0][0];
        } else {
          db.run("INSERT INTO tags (name) VALUES (?)", [tagName]);
          tagId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
        }
        
        // Then link the tag to the flashcard
        db.run(`
          INSERT INTO flashcard_tags (flashcard_id, tag_id)
          VALUES (?, ?)
        `, [flashcardId, tagId]);
      }
    }
    
    // Update the deck's updated_at timestamp
    const deckIdResult = db.exec("SELECT deck_id FROM flashcards WHERE id = ?", [flashcardId]);
    if (deckIdResult.length > 0 && deckIdResult[0].values.length > 0) {
      const deckId = deckIdResult[0].values[0][0];
      db.run(`
        UPDATE decks
        SET updated_at = datetime('now')
        WHERE id = ?
      `, [deckId]);
    }
    
    return flashcardRepository.findById(flashcardId);
  },
  
  updateSpacedRepetition: (flashcardId: number, interval: number, easeFactor: number, reviewCount: number, lapses: number) => {
    // Calculate the new due date
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + interval);
    
    db.run(`
      UPDATE flashcards
      SET interval = ?, ease_factor = ?, review_count = ?, lapses = ?, due_date = ?, updated_at = datetime('now')
      WHERE id = ?
    `, [interval, easeFactor, reviewCount, lapses, newDueDate.toISOString(), flashcardId]);
    
    return flashcardRepository.findById(flashcardId);
  },
  
  delete: (flashcardId: number) => {
    // Get the deck ID first for updating its timestamp later
    const deckIdResult = db.exec("SELECT deck_id FROM flashcards WHERE id = ?", [flashcardId]);
    let deckId = null;
    if (deckIdResult.length > 0 && deckIdResult[0].values.length > 0) {
      deckId = deckIdResult[0].values[0][0];
    }
    
    // Delete related records
    db.run(`
      DELETE FROM flashcard_tags
      WHERE flashcard_id = ?
    `, [flashcardId]);
    
    db.run(`
      DELETE FROM reviews
      WHERE flashcard_id = ?
    `, [flashcardId]);
    
    // Delete the flashcard
    db.run(`
      DELETE FROM flashcards
      WHERE id = ?
    `, [flashcardId]);
    
    // Update the deck's updated_at timestamp
    if (deckId) {
      db.run(`
        UPDATE decks
        SET updated_at = datetime('now')
        WHERE id = ?
      `, [deckId]);
    }
    
    return true;
  }
};

export const reviewRepository = {
  create: (review: Partial<DatabaseSchema['reviews'][0]>) => {
    db.run(`
      INSERT INTO reviews (flashcard_id, user_id, review_date, rating, time_spent)
      VALUES (?, ?, datetime('now'), ?, ?)
    `, [review.flashcardId, review.userId, review.rating, review.timeSpent]);
    
    const reviewId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
    
    // Update the user's last activity
    userRepository.updateLastActivity(review.userId!);
    
    return { ...review, id: reviewId, reviewDate: new Date().toISOString() };
  },
  
  getReviewStats: (userId: number, days: number = 30) => {
    const result = db.exec(`
      SELECT 
        date(r.review_date) as date, 
        COUNT(*) as cardsReviewed,
        SUM(CASE WHEN r.rating IN ('good', 'easy') THEN 1 ELSE 0 END) as correctCount,
        SUM(r.time_spent) as timeSpent
      FROM reviews r
      WHERE r.user_id = ? AND r.review_date >= datetime('now', '-${days} days')
      GROUP BY date(r.review_date)
      ORDER BY date(r.review_date)
    `, [userId]);
    
    if (result.length > 0) {
      return result[0].values.map((row: any[]) => {
        const stats = {};
        result[0].columns.forEach((col: string,i: number) => {
          stats[col] = row[i];
        });
        return stats;
      });
    }
    return [];
  },
  
  getTagStats: (userId: number) => {
    const result = db.exec(`
      SELECT 
        t.name as tag,
        COUNT(DISTINCT ft.flashcard_id) as cardCount,
        COALESCE(
          SUM(CASE WHEN r.rating IN ('good', 'easy') THEN 1 ELSE 0 END) * 100.0 / 
          NULLIF(COUNT(r.id), 0),
          0
        ) as masteryPercentage
      FROM tags t
      INNER JOIN flashcard_tags ft ON ft.tag_id = t.id
      INNER JOIN flashcards f ON f.id = ft.flashcard_id
      INNER JOIN decks d ON d.id = f.deck_id
      LEFT JOIN (
        SELECT flashcard_id, rating, MAX(review_date) as max_date
        FROM reviews
        WHERE user_id = ?
        GROUP BY flashcard_id
      ) r ON r.flashcard_id = f.id
      WHERE d.user_id = ?
      GROUP BY t.name
      ORDER BY cardCount DESC
    `, [userId, userId]);
    
    if (result.length > 0) {
      return result[0].values.map((row: any[]) => {
        const stats = {};
        result[0].columns.forEach((col: string, i: number) => {
          stats[col] = row[i];
        });
        return stats;
      });
    }
    return [];
  }
};

export const settingsRepository = {
  getSettings: (userId: number) => {
    const result = db.exec(`
      SELECT 
        user_id as userId,
        theme,
        new_cards_per_day as newCardsPerDay,
        max_reviews_per_day as maxReviewsPerDay,
        show_timer as showTimer
      FROM settings
      WHERE user_id = ?
    `, [userId]);
    
    if (result.length > 0 && result[0].values.length > 0) {
      const settings = {};
      result[0].columns.forEach((col: string, i: number) => {
        settings[col] = result[0].values[0][i];
      });
      return settings as DatabaseSchema['settings'][0];
    }
    
    // If no settings exists, create default settings
    db.run(`
      INSERT INTO settings (user_id, theme, new_cards_per_day, max_reviews_per_day, show_timer)
      VALUES (?, 'system', 20, 100, 1)
    `, [userId]);
    
    return {
      userId,
      theme: 'system',
      newCardsPerDay: 20,
      maxReviewsPerDay: 100,
      showTimer: true
    } as DatabaseSchema['settings'][0];
  },
  
  updateSettings: (userId: number, settings: Partial<DatabaseSchema['settings'][0]>) => {
    db.run(`
      UPDATE settings
      SET theme = ?, new_cards_per_day = ?, max_reviews_per_day = ?, show_timer = ?
      WHERE user_id = ?
    `, [settings.theme, settings.newCardsPerDay, settings.maxReviewsPerDay, settings.showTimer ? 1 : 0, userId]);
    
    return settingsRepository.getSettings(userId);
  }
};

// Export tag-related functions
export const tagRepository = {
  getAllTags: () => {
    const result = db.exec(`
      SELECT name
      FROM tags
      ORDER BY name
    `);
    
    if (result.length > 0) {
      return result[0].values.map((row: any[]) => row[0]);
    }
    return [];
  },
  
  getTagsForDeck: (deckId: number) => {
    const result = db.exec(`
      SELECT DISTINCT t.name
      FROM tags t
      INNER JOIN flashcard_tags ft ON ft.tag_id = t.id
      INNER JOIN flashcards f ON f.id = ft.flashcard_id
      WHERE f.deck_id = ?
      ORDER BY t.name
    `, [deckId]);
    
    if (result.length > 0) {
      return result[0].values.map((row: any[]) => row[0]);
    }
    return [];
  }
};

// Export a function to save the database to localStorage
export const saveDatabase = () => {
  if (!db) return;
  
  try {
    // Export the database to an Array Buffer
    const data = db.export();
    const buffer = new Uint8Array(data);
    
    // Convert to a base64 string for storage
    let binary = '';
    for (let i = 0; i < buffer.length; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    const base64 = btoa(binary);
    
    // Save to localStorage
    localStorage.setItem('neurolearn_db', base64);
    console.log('Database saved to localStorage');
  } catch (error) {
    console.error('Failed to save database:', error);
  }
};

// Export a function to load the database from localStorage
export const loadDatabase = async () => {
  try {
    // Check if we have a saved database
    const base64 = localStorage.getItem('neurolearn_db');
    if (!base64) {
      console.log('No saved database found, starting fresh');
      return;
    }
    
    // Convert base64 to Uint8Array
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Load SQL.js
    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    });
    
    // Create a new database with the saved data
    db = new SQL.Database(bytes);
    console.log('Database loaded from localStorage');
  } catch (error) {
    console.error('Failed to load database:', error);
    // If loading fails, initialize a fresh database
    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    });
    db = new SQL.Database();
    createTables();
  }
};

// Call loadDatabase when initializing
export const setupDatabase = async () => {
  await loadDatabase();
  
  // If no database was loaded or it doesn't have tables, initialize fresh tables
  if (!db) {
    await initializeDatabase();
  }
  
  // Check if we have users, if not seed the database
  const result = db.exec("SELECT COUNT(*) FROM users");
  if (!result.length || result[0].values[0][0] === 0) {
    seedDatabase();
  }
  
  // Save every 5 minutes
  setInterval(saveDatabase, 5 * 60 * 1000);
  
  // Also save on unload
  window.addEventListener('beforeunload', saveDatabase);
};