import { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Calendar,
  User,
  ChevronDown,
  PenLine,
  Rows2,
  CalendarClock,
  Loader,
  CircleCheckBig,
  ListTodoIcon,
  UserRound,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "motion/react";
import { taskAPI, projectAPI, userAPI } from "../services/api";
import TaskModal from "../modals/TaskModal.jsx";
import UserModal from "../modals/UserModal.jsx";
import ProjectModal from "../modals/ProjectModal.jsx";

// Phase B: Step 2 & 7 - Add Imports
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

export default function KanbanBoard({ selectedProject, onDataUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [showBoardAddMenu, setShowBoardAddMenu] = useState(false);
  const [filters, setFilters] = useState({
    assignee: null,
    priority: null,
    dateRange: null,
  });
  const [showFilterDropdown, setShowFilterDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState("pending");

  useEffect(() => {
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksData, usersData, projectsData] = await Promise.all([
        selectedProject
          ? taskAPI.getAll({ project_id: selectedProject.id })
          : taskAPI.getAll(),
        userAPI.getAll(),
        projectAPI.getAll(),
      ]);
      setTasks(tasksData);
      setUsers(usersData);
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = (status) => {
    setNewTaskStatus(status);
    setIsModalOpen(true);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSuccess = async () => {
    // Close the modal first
    setIsModalOpen(false);
    setEditingTask(null);
    
    // Refetch data with a small delay to ensure backend consistency
    await new Promise(resolve => setTimeout(resolve, 100));
    await fetchData();
    
    // Notify parent component
    if (onDataUpdate) onDataUpdate();
  };

  // Phase B: Step 3 - Add Drag Handlers
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }
    const taskId = active.id;
    const newStatus = over.id; // 'pending', 'in_progress', 'completed'

    const task = tasks.find((t) => t.id === taskId);

    if (task && task.status !== newStatus) {
      try {
        await taskAPI.update(taskId, { status: newStatus });
        fetchData();
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    }
    setActiveId(null);
  };

  const tasksByStatus = {
    pending: tasks.filter((t) => t.status === "pending"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  // Filter logic
  const filteredTasksByStatus = {
    pending: filterTasks(tasksByStatus.pending),
    in_progress: filterTasks(tasksByStatus.in_progress),
    completed: filterTasks(tasksByStatus.completed),
  };

  function filterTasks(tasks) {
    return tasks.filter((task) => {
      if (filters.assignee && task.user_id !== filters.assignee) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.dateRange) {
        const today = new Date();
        const dueDate = task.due_date ? new Date(task.due_date) : null;

        if (filters.dateRange === "overdue" && (!dueDate || dueDate >= today))
          return false;
        if (
          filters.dateRange === "today" &&
          (!dueDate || dueDate.toDateString() !== today.toDateString())
        )
          return false;
        if (filters.dateRange === "week") {
          const weekFromNow = new Date(
            today.getTime() + 7 * 24 * 60 * 60 * 1000
          );
          if (!dueDate || dueDate > weekFromNow) return false;
        }
      }
      return true;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 text-sm lg:text-base">
          Loading tasks...
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Rows2 className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mb-4" />
        <h2 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
          No Project Selected
        </h2>
        <p className="text-sm lg:text-base text-gray-500 text-center">
          Select a project from the sidebar to view tasks
        </p>
      </div>
    );
  }

  // Phase B: Step 4 - Wrap Return with DndContext
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full bg-gray-50">
        {/* Board Header */}
        <div className="bg-white border-b border-gray-200 px-3 lg:px-6 py-3 lg:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0 mb-3 lg:mb-4">
            <div className="flex items-center gap-2">
              <span className="text-violet-400">
                <Rows2 className="w-5 h-5 lg:w-6 lg:h-6" />
              </span>
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                {selectedProject.name}
              </h1>
              <button className="p-1 hover:bg-gray-100 rounded hidden lg:block">
                <PenLine className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Share
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-4 lg:gap-6 overflow-x-auto scrollbar-hide">
              <TabButton
                label="List"
                active={activeTab === "List"}
                onClick={() => setActiveTab("List")}
              />
              <TabButton
                label="Board"
                active={activeTab === "Board"}
                onClick={() => setActiveTab("Board")}
              />
              <TabButton
                label="Calendar"
                active={activeTab === "Calendar"}
                onClick={() => setActiveTab("Calendar")}
              />
              <TabButton
                label="Files"
                active={activeTab === "Files"}
                onClick={() => setActiveTab("Files")}
              />
            </div>

            <div className="flex items-center gap-2 lg:gap-3 overflow-visible flex-wrap">
              <FilterButton
                icon={Calendar}
                label="Due Date"
                value={filters.dateRange}
                options={[
                  { value: "today", label: "Today" },
                  { value: "week", label: "This Week" },
                  { value: "overdue", label: "Overdue" },
                ]}
                filterKey="dateRange"
                filters={filters}
                setFilters={setFilters}
                showDropdown={showFilterDropdown}
                setShowDropdown={setShowFilterDropdown}
              />
              <FilterButton
                icon={User}
                label="Assignee"
                value={
                  filters.assignee
                    ? users.find((u) => u.id === filters.assignee)?.name
                    : null
                }
                options={users.map((u) => ({ value: u.id, label: u.name }))}
                filterKey="assignee"
                filters={filters}
                setFilters={setFilters}
                showDropdown={showFilterDropdown}
                setShowDropdown={setShowFilterDropdown}
              />
              <FilterButton
                icon={Filter}
                label="Priority"
                value={filters.priority}
                options={[
                  { value: "Low", label: "Low" },
                  { value: "Normal", label: "Normal" },
                  { value: "High", label: "High" },
                ]}
                filterKey="priority"
                filters={filters}
                setFilters={setFilters}
                showDropdown={showFilterDropdown}
                setShowDropdown={setShowFilterDropdown}
              />
              <button className="flex items-center gap-2 px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                <Filter className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden lg:inline">Advance Filters</span>
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => handleAddTask("pending")}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Columns */}
        <div className="flex-1 overflow-hidden">
          {/* Mobile View */}
          <div className="lg:hidden h-full flex flex-col">
            <div className="flex border-b border-gray-200 bg-white px-3">
              <button
                onClick={() => setActiveTab("Pending")}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "Pending"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600"
                }`}
              >
                Pending ({tasksByStatus.pending.length})
              </button>
              <button
                onClick={() => setActiveTab("In Progress")}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "In Progress"
                    ? "border-yellow-600 text-yellow-600"
                    : "border-transparent text-gray-600"
                }`}
              >
                In Progress ({tasksByStatus.in_progress.length})
              </button>
              <button
                onClick={() => setActiveTab("Completed")}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "Completed"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-600"
                }`}
              >
                Done ({tasksByStatus.completed.length})
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {activeTab === "Pending" && (
                <MobileColumn
                  tasks={tasksByStatus.pending}
                  users={users}
                  onAddTask={() => handleAddTask("pending")}
                  onEditTask={handleEditTask}
                  emptyMessage="No pending tasks"
                />
              )}
              {activeTab === "In Progress" && (
                <MobileColumn
                  tasks={tasksByStatus.in_progress}
                  users={users}
                  onAddTask={() => handleAddTask("in_progress")}
                  onEditTask={handleEditTask}
                  emptyMessage="No tasks in progress"
                />
              )}
              {activeTab === "Completed" && (
                <MobileColumn
                  tasks={tasksByStatus.completed}
                  users={users}
                  onAddTask={() => handleAddTask("completed")}
                  onEditTask={handleEditTask}
                  emptyMessage="No completed tasks"
                />
              )}
            </div>
          </div>

          {/* Desktop View - Phase B: Step 5 - Make Desktop Columns Droppable */}
          <div className="hidden lg:block h-full overflow-x-auto overflow-y-hidden">
            <div className="flex gap-6 p-6 min-w-max h-full">
              <DroppableColumn
                id="pending"
                title="Pending"
                icon={<CalendarClock className="w-4 h-4 text-amber-500" />}
                tasks={filteredTasksByStatus.pending}
                users={users}
                onAddTask={() => handleAddTask("pending")}
                onEditTask={handleEditTask}
              />
              <DroppableColumn
                id="in_progress"
                title="In Progress"
                icon={<Loader className="w-4 h-4 text-blue-600" />}
                tasks={filteredTasksByStatus.in_progress}
                users={users}
                onAddTask={() => handleAddTask("in_progress")}
                onEditTask={handleEditTask}
                statusColor="yellow"
              />
              <DroppableColumn
                id="completed"
                title="Completed"
                icon={<CircleCheckBig className="w-4 h-4 text-green-600" />}
                tasks={filteredTasksByStatus.completed}
                users={users}
                onAddTask={() => handleAddTask("completed")}
                onEditTask={handleEditTask}
                statusColor="green"
              />
            </div>
          </div>
        </div>
      </div>
      {/* NEW: DragOverlay */}
      <DragOverlay>
        {activeId ? (
          <div className="opacity-80 rotate-3 cursor-grabbing scale-105 transition-transform">
            <TaskCard
              task={tasks.find((t) => t.id === activeId)}
              users={users}
              onEdit={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSuccess={handleModalSuccess}
        task={editingTask}
        projects={projects}
        users={users}
        newStatus={newTaskStatus}
        projectId={selectedProject?.id}
      />
    </DndContext>
  );
}

// Mobile Column Component
function MobileColumn({ tasks, users, onAddTask, onEditTask, emptyMessage }) {
  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">{emptyMessage}</p>
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            users={users}
            onEdit={onEditTask}
          />
        ))
      )}
      <button
        onClick={onAddTask}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-600 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Task</span>
      </button>
    </div>
  );
}

// Phase B: Step 6 - Add DroppableColumn and DraggableTask
function DroppableColumn({
  id,
  title,
  icon,
  tasks,
  users,
  onAddTask,
  onEditTask,
  statusColor,
}) {
  const { setNodeRef } = useDroppable({ id });

  const getStatusColor = () => {
    switch (statusColor) {
      case "yellow":
        return "bg-yellow-100 text-yellow-800";
      case "green":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div ref={setNodeRef} className="flex flex-col w-80 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-gray-900 text-base">{title}</span>
        </button>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}
          >
            {tasks.length}
          </span>
          <button className="p-1 hover:bg-gray-100 rounded">
            <span className="text-gray-400">⋯</span>
          </button>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {tasks.map((task) => (
          <DraggableTask
            key={task.id}
            task={task}
            users={users}
            onEdit={onEditTask}
          />
        ))}
        <button
          onClick={onAddTask}
          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-600 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
}

function DraggableTask({ task, users, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0 : 1,
  };

  const assignedUser = users.find((u) => u.id === task.user_id);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Normal":
        return "bg-blue-100 text-blue-700";
      case "Low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing"
      onClick={() => onEdit(task)}
    >
      <h3 className="font-medium text-gray-900 mb-3 text-base">{task.title}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {assignedUser ? (
            <>
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {assignedUser.name[0].toUpperCase()}
              </div>
              <span className="text-xs text-gray-600">
                {assignedUser.name.split(" ")[0]}
              </span>
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {formatDate(task.due_date)}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-1 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-600 hover:text-gray-900 border-b-2 border-transparent"
      }`}
    >
      {label}
    </button>
  );
}

function FilterButton({
  icon: Icon,
  label,
  value,
  options,
  filterKey,
  filters,
  setFilters,
  showDropdown,
  setShowDropdown,
}) {
  const displayValue = value || "All";

  return (
    <div className="relative">
      <button
        onClick={() =>
          setShowDropdown(showDropdown === filterKey ? null : filterKey)
        }
        className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline whitespace-nowrap">{label}</span>
        <span className="text-gray-500 text-xs hidden sm:inline whitespace-nowrap">
          {displayValue}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </button>

      {showDropdown === filterKey && (
        <>
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[160px]">
            <button
              onClick={() => {
                setFilters({ ...filters, [filterKey]: null });
                setShowDropdown(null);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                !value ? "text-blue-600 font-medium" : "text-gray-700"
              }`}
            >
              All
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilters({ ...filters, [filterKey]: option.value });
                  setShowDropdown(null);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  value === option.value
                    ? "text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div
            onClick={() => setShowDropdown(null)}
            className="fixed inset-0 z-40"
          />
        </>
      )}
    </div>
  );
}

function TaskCard({ task, users, onEdit }) {
  const assignedUser = users.find((u) => u.id === task.user_id);
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Normal":
        return "bg-blue-100 text-blue-700";
      case "Low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onEdit(task)}
      className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <h3 className="font-medium text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base line-clamp-2">
        {task.title}
      </h3>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          {assignedUser ? (
            <>
              <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {assignedUser.name[0].toUpperCase()}
              </div>
              <span className="text-xs text-gray-600 truncate">
                {assignedUser.name.split(" ")[0]}
              </span>
            </>
          ) : (
            <button className="text-xs text-gray-400 hover:text-gray-600">
              Assign
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">
            {formatDate(task.due_date)}
          </span>
          <span
            className={`px-1.5 lg:px-2 py-0.5 lg:py-1 text-xs font-medium rounded ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
