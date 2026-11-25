# TaskFlow — Smart To-Do List

A professional full-stack task manager built with HTML, CSS, JavaScript, Node.js, Express and MongoDB.

## Features
- Create, read, update and delete tasks (CRUD)
- Mark tasks as completed or pending
- Low, Medium and High priority
- Optional due dates and descriptions
- Search and filter tasks
- Sort by newest, oldest, priority or due date
- Dashboard statistics and completion percentage
- Responsive desktop and mobile layout
- MongoDB persistence

## Requirements
- Node.js 18 or newer
- MongoDB Community Server running locally, or a MongoDB Atlas connection string
- A modern browser

## Setup
1. Install Node.js and MongoDB.
2. Extract this project folder.
3. Open a terminal inside the `smart-todo-list` folder.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Copy `.env.example` to a new file named `.env`.
6. If MongoDB is local, keep:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/smart_todo
   ```
   For MongoDB Atlas, replace the URI with your own connection string. Do not share your database password or commit `.env`.
7. Start the application:
   ```bash
   npm run dev
   ```
   Or use `npm start`.
8. Open `http://localhost:5000` in your browser.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update task or completion status |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Check API status |

Example POST body:
```json
{
  "title": "Prepare project report",
  "description": "Complete documentation",
  "priority": "High",
  "dueDate": "2026-11-26"
}
```

## Troubleshooting
- **MongoDB connection failed:** Start the local MongoDB service or verify the Atlas URI and network access.
- **npm is not recognized:** Install Node.js, then close and reopen the terminal.
- **Port already in use:** Change `PORT=5000` in `.env` to another free port, such as `5001`.
- **Cannot load tasks:** Confirm the server is running and visit `/api/health`.

## Project structure
```text
smart-todo-list/
├── models/
│   └── Task.js
├── routes/
│   └── tasks.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```
