import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(join(__dirname, 'crm.db'));

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    company TEXT,
    role TEXT,
    status TEXT DEFAULT 'active',
    avatar TEXT,
    lastContact TEXT,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Labels table
  db.run(`CREATE TABLE IF NOT EXISTS labels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // User labels junction table
  db.run(`CREATE TABLE IF NOT EXISTS user_labels (
    userId TEXT,
    labelId TEXT,
    PRIMARY KEY (userId, labelId),
    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (labelId) REFERENCES labels (id) ON DELETE CASCADE
  )`);

  // Insert default labels if they don't exist
  const defaultLabels = [
    { id: 'label-1', name: 'VIP', color: '#ef4444' },
    { id: 'label-2', name: 'Lead', color: '#3b82f6' },
    { id: 'label-3', name: 'Customer', color: '#10b981' },
    { id: 'label-4', name: 'Prospect', color: '#f59e0b' },
    { id: 'label-5', name: 'Partner', color: '#8b5cf6' }
  ];

  defaultLabels.forEach(label => {
    db.run(`INSERT OR IGNORE INTO labels (id, name, color) VALUES (?, ?, ?)`, 
      [label.id, label.name, label.color]);
  });

  // Insert sample users if they don't exist
  const sampleUsers = [
    {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Solutions',
      role: 'CEO',
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      lastContact: '2024-01-15',
      notes: 'Interested in enterprise solutions'
    },
    {
      id: 'user-2',
      name: 'Michael Chen',
      email: 'michael.chen@innovate.io',
      phone: '+1 (555) 234-5678',
      company: 'Innovate Labs',
      role: 'CTO',
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      lastContact: '2024-01-10',
      notes: 'Technical decision maker'
    },
    {
      id: 'user-3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@startup.com',
      phone: '+1 (555) 345-6789',
      company: 'StartupCo',
      role: 'Founder',
      status: 'pending',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      lastContact: '2024-01-08',
      notes: 'Early stage startup'
    }
  ];

  sampleUsers.forEach(user => {
    db.run(`INSERT OR IGNORE INTO users (id, name, email, phone, company, role, status, avatar, lastContact, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.name, user.email, user.phone, user.company, user.role, user.status, user.avatar, user.lastContact, user.notes]);
  });

  // Insert sample user-label relationships
  const userLabels = [
    { userId: 'user-1', labelId: 'label-1' }, // Sarah is VIP
    { userId: 'user-1', labelId: 'label-3' }, // Sarah is Customer
    { userId: 'user-2', labelId: 'label-2' }, // Michael is Lead
    { userId: 'user-3', labelId: 'label-4' }  // Emily is Prospect
  ];

  userLabels.forEach(ul => {
    db.run(`INSERT OR IGNORE INTO user_labels (userId, labelId) VALUES (?, ?)`, 
      [ul.userId, ul.labelId]);
  });
});

// Helper function to get user with labels
const getUserWithLabels = (userId) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
      if (err) {
        reject(err);
        return;
      }
      if (!user) {
        resolve(null);
        return;
      }

      db.all(`SELECT l.* FROM labels l 
              JOIN user_labels ul ON l.id = ul.labelId 
              WHERE ul.userId = ?`, [userId], (err, labels) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ ...user, labels: labels || [] });
      });
    });
  });
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'CRM Backend API is running!', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Get all users with optional filtering
app.get('/api/users', (req, res) => {
  const { search, status, company, role, labels } = req.query;
  
  let query = `
    SELECT u.*, GROUP_CONCAT(l.id) as labelIds, GROUP_CONCAT(l.name) as labelNames, GROUP_CONCAT(l.color) as labelColors
    FROM users u
    LEFT JOIN user_labels ul ON u.id = ul.userId
    LEFT JOIN labels l ON ul.labelId = l.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (search) {
    query += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.company LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  if (status) {
    const statusArray = Array.isArray(status) ? status : [status];
    const placeholders = statusArray.map(() => '?').join(',');
    query += ` AND u.status IN (${placeholders})`;
    params.push(...statusArray);
  }
  
  if (company) {
    query += ` AND u.company LIKE ?`;
    params.push(`%${company}%`);
  }
  
  if (role) {
    query += ` AND u.role LIKE ?`;
    params.push(`%${role}%`);
  }
  
  query += ` GROUP BY u.id ORDER BY u.createdAt DESC`;
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const users = rows.map(row => {
      const labels = [];
      if (row.labelIds) {
        const ids = row.labelIds.split(',');
        const names = row.labelNames.split(',');
        const colors = row.labelColors.split(',');
        
        for (let i = 0; i < ids.length; i++) {
          labels.push({
            id: ids[i],
            name: names[i],
            color: colors[i]
          });
        }
      }
      
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        company: row.company,
        role: row.role,
        status: row.status,
        avatar: row.avatar,
        lastContact: row.lastContact,
        notes: row.notes,
        labels: labels
      };
    });
    
    res.json(users);
  });
});


// Get single user
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  
  getUserWithLabels(id)
    .then(user => {
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Create new user
app.post('/api/users', (req, res) => {
  const { name, email, phone, company, role, status, avatar, lastContact, notes, labels } = req.body;
  const id = uuidv4();
  
  db.run(`INSERT INTO users (id, name, email, phone, company, role, status, avatar, lastContact, notes) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, phone, company, role, status || 'active', avatar, lastContact, notes],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Add labels if provided
      if (labels && labels.length > 0) {
        const labelInserts = labels.map(labelId => 
          new Promise((resolve, reject) => {
            db.run(`INSERT INTO user_labels (userId, labelId) VALUES (?, ?)`, 
              [id, labelId], function(err) {
                if (err) reject(err);
                else resolve();
              });
          })
        );
        
        Promise.all(labelInserts)
          .then(() => getUserWithLabels(id))
          .then(user => res.status(201).json(user))
          .catch(err => res.status(500).json({ error: err.message }));
      } else {
        getUserWithLabels(id)
          .then(user => res.status(201).json(user))
          .catch(err => res.status(500).json({ error: err.message }));
      }
    });
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company, role, status, avatar, lastContact, notes, labels } = req.body;
  
  db.run(`UPDATE users SET 
          name = ?, email = ?, phone = ?, company = ?, role = ?, status = ?, 
          avatar = ?, lastContact = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE id = ?`,
    [name, email, phone, company, role, status, avatar, lastContact, notes, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      // Update labels
      db.run(`DELETE FROM user_labels WHERE userId = ?`, [id], (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        if (labels && labels.length > 0) {
          const labelInserts = labels.map(labelId => 
            new Promise((resolve, reject) => {
              db.run(`INSERT INTO user_labels (userId, labelId) VALUES (?, ?)`, 
                [id, labelId], function(err) {
                  if (err) reject(err);
                  else resolve();
                });
            })
          );
          
          Promise.all(labelInserts)
            .then(() => getUserWithLabels(id))
            .then(user => res.json(user))
            .catch(err => res.status(500).json({ error: err.message }));
        } else {
          getUserWithLabels(id)
            .then(user => res.json(user))
            .catch(err => res.status(500).json({ error: err.message }));
        }
      });
    });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({ message: 'User deleted successfully' });
  });
});

// Get all labels
app.get('/api/labels', (req, res) => {
  db.all(`SELECT * FROM labels ORDER BY name`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new label
app.post('/api/labels', (req, res) => {
  const { name, color } = req.body;
  const id = uuidv4();
  
  db.run(`INSERT INTO labels (id, name, color) VALUES (?, ?, ?)`,
    [id, name, color],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, name, color });
    });
});

// Get available companies and roles for filtering
app.get('/api/filters', (req, res) => {
  db.all(`SELECT DISTINCT company FROM users WHERE company IS NOT NULL AND company != '' ORDER BY company`, (err, companies) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    db.all(`SELECT DISTINCT role FROM users WHERE role IS NOT NULL AND role != '' ORDER BY role`, (err, roles) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        companies: companies.map(c => c.company),
        roles: roles.map(r => r.role)
      });
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CRM Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`🏷️  Labels API: http://localhost:${PORT}/api/labels`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed.');
    }
    process.exit(0);
  });
});

// Serve frontend build
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});
