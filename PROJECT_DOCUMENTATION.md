# PROJECT DOCUMENTATION
## SMART TO-DO LIST MANAGEMENT SYSTEM

### 1. Introduction
The Smart To-Do List Management System is a full-stack web application designed to help users plan, organize and track daily activities. It provides an easy interface for creating tasks, updating task information, setting priorities and due dates, and tracking completed work.

### 2. Problem statement
People often manage daily work using memory or scattered notes. This can lead to forgotten activities, poor prioritization and missed deadlines. The proposed application provides one organized place to maintain and monitor tasks.

### 3. Objectives
- Develop a user-friendly task management website.
- Allow users to add, view, edit and delete tasks.
- Allow tasks to be marked completed or pending.
- Support priority levels and due dates.
- Store task information in MongoDB.
- Provide search, filters and task statistics.
- Build a responsive interface for different screen sizes.

### 4. Scope
The application is suitable for personal daily task management and academic demonstrations of full-stack development. This version is a single-workspace demonstration and does not include user accounts, multi-user access, notifications or cloud deployment.

### 5. Technologies
- HTML5: structures the web pages.
- CSS3: styles the responsive user interface.
- JavaScript: handles browser-side interaction and API communication.
- Node.js: runs JavaScript on the server.
- Express.js: defines HTTP routes and handles API requests.
- MongoDB: stores task documents.
- Mongoose: defines the task schema and communicates with MongoDB.
- npm: installs and manages project dependencies.

### 6. System requirements
**Hardware:** Computer/laptop, minimum 4 GB RAM recommended, internet connection for initial package installation.

**Software:** Windows/macOS/Linux, Node.js 18+, MongoDB Community Server or MongoDB Atlas, modern web browser, code editor such as Visual Studio Code.

### 7. System architecture
The project follows a three-layer architecture:
1. Presentation layer: HTML, CSS and browser JavaScript.
2. Application layer: Node.js and Express API.
3. Data layer: MongoDB database accessed using Mongoose.

The browser sends HTTP requests to the Express API. The server validates input, performs database operations and returns JSON responses. The browser updates the displayed task list and statistics.

### 8. Modules
**Task creation:** Accepts title, optional description, priority and due date.

**Task display:** Retrieves all saved tasks from the database and displays them.

**Task update:** Allows users to edit task details and completion status.

**Task deletion:** Removes a selected task after confirmation.

**Search and filtering:** Searches task titles/descriptions and filters all, pending or completed tasks.

**Dashboard:** Displays total, completed and pending tasks and percentage of completion.

### 9. Database design
Database name: `smart_todo`  
Collection: `tasks`

| Field | Type | Description |
|---|---|---|
| _id | ObjectId | Unique task identifier |
| title | String | Task title; required |
| description | String | Optional task notes |
| priority | String | Low, Medium or High |
| dueDate | Date | Optional deadline |
| completed | Boolean | Completion status |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

### 10. API design
- `GET /api/tasks`: retrieves all tasks.
- `POST /api/tasks`: creates a new task.
- `PUT /api/tasks/:id`: updates task fields.
- `DELETE /api/tasks/:id`: deletes a task.
- `GET /api/health`: checks whether the API is running.

### 11. Working procedure
1. User opens the application in a browser.
2. The frontend requests tasks from the backend.
3. Express receives the request and uses the Mongoose model.
4. MongoDB returns the saved task documents.
5. The frontend displays tasks and dashboard statistics.
6. When the user creates, edits, completes or deletes a task, the frontend sends the appropriate API request.
7. The backend updates MongoDB and returns a response.
8. The frontend refreshes the displayed information.

### 12. Testing
| Test case | Input/action | Expected result |
|---|---|---|
| Add task | Enter a valid title | Task is saved and displayed |
| Empty title | Submit without a title | Validation message appears |
| Edit task | Change title or priority | Updated task is displayed |
| Complete task | Click check control | Task is marked completed |
| Reopen task | Click completed check control | Task becomes pending |
| Delete task | Confirm delete | Task disappears |
| Search | Enter matching keyword | Matching tasks are displayed |
| Filter | Select Pending | Only pending tasks appear |
| Refresh | Reload browser | Saved tasks remain visible |

### 13. Advantages
- Easy to use.
- Keeps tasks organized in one place.
- Helps identify important work.
- Stores tasks persistently in a database.
- Responsive interface.
- Demonstrates real full-stack CRUD operations.

### 14. Limitations
- No login or user-specific accounts.
- No email or push notifications.
- Requires the server and database to be running.
- Current version is intended for local demonstration.

### 15. Future enhancements
- User registration and secure login.
- Multiple users and private task lists.
- Email reminders and notifications.
- Recurring tasks and calendar integration.
- Cloud hosting and deployment.
- Export tasks to PDF or CSV.

### 16. Conclusion
The Smart To-Do List Management System demonstrates how frontend technologies, a backend server and a database work together to create a useful web application. It provides core task management operations and gives practical experience with REST APIs, CRUD operations, Node.js, Express, MongoDB and responsive web design.
