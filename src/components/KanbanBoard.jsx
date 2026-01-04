import { useState, useEffect } from 'react'
import { Plus, Filter, Calendar, User, ChevronDown, PenLine, Rows2 } from 'lucide-react'
import { motion } from 'motion/react'
import { taskAPI, projectAPI, userAPI } from '../services/api'

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('List') // Track active tab
  const [filters, setFilters] = useState({
    assignee: 'All',
    priority: 'All',
    dateRange: 'All'
  })
  const [loading, setLoading] = useState(true)

  // Fetch data on mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tasksData, usersData] = await Promise.all([
        taskAPI.getAll(),
        userAPI.getAll()
      ])
      setTasks(tasksData)
      setUsers(usersData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group tasks by status
  const tasksByStatus = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Board Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className='text-violet-400'><Rows2 /></span>
            <h1 className="text-2xl font-bold text-gray-900">Design Project</h1>
            <button className="p-1 hover:bg-gray-100 rounded">
              <span className="text-gray-400 cursor-pointer"><PenLine /></span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Share
            </button>
          </div>
        </div>

        {/* Tabs & Filters */}
        <div className="flex items-center justify-between">
          {/* Tabs with Active State */}
          <div className="flex items-center gap-6 ">
            <TabButton
              label="List"
              active={activeTab === 'List'}
              onClick={() => setActiveTab('List')}
            />
            <TabButton
              label="Board"
              active={activeTab === 'Board'}
              onClick={() => setActiveTab('Board')}
            />
            <TabButton
              label="Calendar"
              active={activeTab === 'Calendar'}
              onClick={() => setActiveTab('Calendar')}
            />
            <TabButton
              label="Files"
              active={activeTab === 'Files'}
              onClick={() => setActiveTab('Files')}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <FilterButton
              icon={Calendar}
              label="Due Date"
              value={filters.dateRange}
            />
            <FilterButton
              icon={User}
              label="Assignee"
              value={filters.assignee}
            />
            <FilterButton
              icon={Filter}
              label="Priority"
              value={filters.priority}
            />
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Advance Filters
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 p-6 min-w-max h-full">
          <KanbanColumn
            title="Pending"
            icon="⏸️"
            tasks={tasksByStatus.pending}
            users={users}
            onAddTask={() => console.log('Add pending task')}
          />
          <KanbanColumn
            title="In Progress"
            icon="⚠️"
            tasks={tasksByStatus.in_progress}
            users={users}
            onAddTask={() => console.log('Add in progress task')}
            statusColor="yellow"
          />
          <KanbanColumn
            title="Completed"
            icon="✅"
            tasks={tasksByStatus.completed}
            users={users}
            onAddTask={() => console.log('Add completed task')}
            statusColor="green"
          />
        </div>
      </div>
    </div>
  )
}

// Tab Button Component with Active State
function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-1 text-sm font-medium transition-colors ${
        active
          ? 'text-blue-600 border-b-2 border-blue-600 '
          : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
      }`}
    >
      {label}
    </button>
  )
}

// Filter Button Component
function FilterButton({ icon: Icon, label, value }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      <span className="text-gray-500">{value}</span>
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </button>
  )
}

// Kanban Column Component
function KanbanColumn({ title, icon, tasks, users, onAddTask, statusColor }) {
  const getStatusColor = () => {
    switch(statusColor) {
      case 'yellow': return 'bg-yellow-100 text-yellow-800'
      case 'green': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex flex-col w-80 shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-gray-900">{title}</span>
        </button>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
            {tasks.length}
          </span>
          <button className="p-1 hover:bg-gray-100 rounded">
            <span className="text-gray-400">⋯</span>
          </button>
        </div>
      </div>

      {/* Task Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            users={users}
          />
        ))}

        {/* Add Task Button */}
        <button
          onClick={onAddTask}
          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-600 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  )
}

// Task Card Component
function TaskCard({ task, users }) {
  const assignedUser = users.find(u => u.id === task.user_id)

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-700'
      case 'Normal': return 'bg-blue-100 text-blue-700'
      case 'Low': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Task Title */}
      <h3 className="font-medium text-gray-900 mb-3">
        {task.title}
      </h3>

      {/* Task Meta */}
      <div className="flex items-center justify-between">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          {assignedUser ? (
            <>
              <div className="w-6 h-6 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {assignedUser.name[0].toUpperCase()}
              </div>
              <span className="text-xs text-gray-600">{assignedUser.name.split(' ')[0]}</span>
            </>
          ) : (
            <button className="text-xs text-gray-400 hover:text-gray-600">
              Assign
            </button>
          )}
        </div>

        {/* Due Date & Priority */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {formatDate(task.due_date)}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
            {task.priority === 'Normal' ? 'Normal Priority' : `${task.priority} Priority`}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
