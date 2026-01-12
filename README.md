# Ergo - Task Management Application

A modern, responsive task management application built with React, Vite, and Tailwind CSS. Features a Kanban board interface with drag-and-drop functionality, real-time filtering, and project management.

## Desktop Screen
![Task Board Screenshot](/task-board/public/ergo-frontend.png)
![Task Board Screenshot](/task-board/public/ergo-frontend-dark.png)

## Mobile Screen
![Task Board Mobile Screenshot](/task-board/public/mobile-version.png)



## 🚀 Features

### Core Functionality
- **Multi-Project Management** - Create and switch between multiple projects
- **Kanban Board** - Visual task organization with drag-and-drop
- **Task Management** - Create, edit, delete, and organize tasks
- **User Management** - Add team members and assign tasks
- **Advanced Filtering** - Filter tasks by assignee, priority, and due date
- **Real-time Updates** - Instant UI updates after any operation.
- **Light and Dark Mode** - Supported with effective light and dark mode switching.

### User Interface
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Collapsible Sidebar** - Minimal (72px) and expanded (256px) modes
- **Accordion Projects** - Expandable project list with active states
- **Smooth Animations** - Motion-powered transitions and interactions
- **Modern UI** - Clean, professional design with Tailwind CSS
- **Drag-Drop TaskCard** - Clean, animated
task drag-and-drop motion for task updation and accessibility.

### Task Features
- Priority levels (Low, Normal, High)
- Due date tracking
- Status management (Pending, In Progress, Completed)
- User assignment with avatar display
- Rich task descriptions
- Task count per column

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 (with Vite plugin)
- **Animations:** Motion (Framer Motion successor)
- **Icons:** Lucide React
- **HTTP Client:** Fetch API
- **State Management:** React Hooks (useState, useEffect)

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd task-board
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API endpoint (if needed)

The default API URL is `http://localhost:8000`. To change it, edit `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000'; // Change this
```

### 4. Start development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Project Structure
```
task-board/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Main layout with sidebar
│   │   └── KanbanBoard.jsx      # Kanban board view
│   ├── modals/
│   │   ├── TaskModal.jsx        # Task create/edit modal
│   │   ├── UserModal.jsx        # User creation modal
│   │   └── ProjectModal.jsx     # Project creation modal
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── assets/
│   │   └── Logo.png             # Application logo
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # App entry point
│   └── index.css                # Tailwind CSS imports
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## 🔌 API Integration

### Backend Requirements

The frontend expects a REST API with these endpoints:

**Users:**
- `POST /users` - Create user
- `GET /users` - List all users
- `GET /users/{id}` - Get user by ID

**Projects:**
- `POST /projects?user_id={id}` - Create project
- `GET /projects` - List all projects
- `GET /projects/{id}` - Get project by ID
- `DELETE /projects/{id}` - Delete project

**Tasks:**
- `POST /tasks` - Create task
- `GET /tasks?project_id={id}&user_id={id}&status={status}` - List tasks with filters
- `GET /tasks/{id}` - Get task by ID
- `PATCH /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

### API Response Format

Expected response formats:
```json
// User
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-01-12T10:00:00"
}

// Project
{
  "id": 1,
  "name": "Design Project",
  "created_by": 1,
  "created_at": "2025-01-12T10:00:00"
}

// Task
{
  "id": 1,
  "user_id": 1,
  "project_id": 1,
  "title": "Complete UI design",
  "description": "Design all main screens",
  "status": "pending",
  "priority": "High",
  "due_date": "2025-01-20T00:00:00",
  "created_at": "2025-01-12T10:00:00",
  "updated_at": "2025-01-12T10:00:00"
}
```

## 📱 Key Features Usage

### Creating a Project
1. Click "Add New" button in sidebar
2. Select "Add Project"
3. Enter project name and select creator
4. Click "Create Project"

### Creating a User
1. Click "Add New" button in sidebar
2. Select "Add User"
3. Enter name and email
4. Click "Create User"

### Creating a Task
1. Select a project from sidebar
2. Click "Add New" in board header OR click "+ Add Task" in any column
3. Fill in task details (title, assignee, priority, due date)
4. Click "Create Task"

### Editing a Task
1. Click on any task card
2. Modify fields as needed
3. Click "Update Task"

### Filtering Tasks
1. Click filter dropdowns (Due Date, Assignee, Priority)
2. Select desired filter option
3. Board updates automatically

### Drag & Drop
1. Click and hold a task card
2. Drag to desired column
3. Release to drop - status updates automatically

## 🎨 Customization

### Changing Theme Colors

Edit `src/index.css` to customize colors:
```css
@import "tailwindcss";

/* Add custom theme variables or overrides here */
```

### Adding New Icons

Import from Lucide React:
```javascript
import { IconName } from 'lucide-react'
```

Browse available icons: [lucide.dev](https://lucide.dev)

## 🐛 Troubleshooting

### CORS Errors
Ensure your backend has CORS configured for `http://localhost:5173`

### Tasks Not Loading
1. Check backend is running on `http://localhost:8000`
2. Verify API endpoint in `src/services/api.js`
3. Check browser console for error messages

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Building for Production
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Build output will be in `dist/` folder.

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop dist/ folder to Netlify
```

### Environment Variables
For production, create `.env` file:
```env
VITE_API_URL=https://your-api-domain.com
```

Update `src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Motion](https://motion.dev/)
- [Lucide Icons](https://lucide.dev/)

## 📧 Contact

Your Name - Ashwin Bhanage

Project Link: [https://github.com/ashwin-bhanage/task-board](https://github.com/ashwin-bhanage/task-board)
