import { useState, useEffect } from "react";
import {
  X,
  Calendar as CalendarIcon,
  User,
  Flag,
  Book,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { taskAPI } from "../services/api.js";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";

export default function TaskModal({
  isOpen,
  onClose,
  task,
  users,
  projects,
  onSuccess,
  newStatus,
  projectId,
}) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    user_id: "",
    project_id: "",
    title: "",
    description: "",
    status: "pending",
    priority: "Normal",
    due_date: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        user_id: task.user_id || "",
        project_id: task.project_id || "",
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
        priority: task.priority || "Normal",
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
      });
    } else {
      setFormData({
        user_id: "",
        project_id: projectId || projects?.[0]?.id || "",
        title: "",
        description: "",
        status: newStatus || "pending",
        priority: "Normal",
        due_date: "",
      });
    }
    setErrors({});
  }, [task, projects, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.user_id) newErrors.user_id = "Please assign a user";
    if (!formData.project_id) newErrors.project_id = "Please select a project";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        user_id: parseInt(formData.user_id),
        project_id: parseInt(formData.project_id),
        due_date: formData.due_date ? `${formData.due_date}T00:00:00` : null,
      };

      if (task) {
        await taskAPI.update(task.id, submitData);
      } else {
        await taskAPI.create(submitData);
      }

      // Wait a brief moment to ensure the backend has processed the request
      await new Promise((resolve) => setTimeout(resolve, 300));
      toast.success(
        task ? "Task updated successfully" : "Task created successfully"
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
      toast.error(error.message || "Failed to save task");
      setErrors({ submit: error.message || "Failed to save task" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this task? This action cannot be undone."
      )
    ) {
      try {
        await taskAPI.delete(task.id);
        toast.success("Task deleted successfully");
        onSuccess();
        onClose();
      } catch (error) {
        console.error("Failed to delete task:", error);
        toast.error("Failed to delete task");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`${
                isDarkMode
                  ? "bg-neutral-900 border-neutral-800"
                  : "bg-white border-gray-100"
              } rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden border`}
            >
              {/* Modal Header */}
              <div
                className={`flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-b shrink-0 ${
                  isDarkMode
                    ? "border-neutral-800 bg-neutral-900"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div>
                  <h2
                    className={`text-lg sm:text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {task ? "Edit Task" : "Create New Task"}
                  </h2>
                  <p
                    className={`text-xs sm:text-sm mt-1 ${
                      isDarkMode ? "text-neutral-400" : "text-gray-500"
                    }`}
                  >
                    {task
                      ? "Update task details"
                      : "Fill in the details to create a new task"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors shrink-0 ${
                    isDarkMode
                      ? "hover:bg-neutral-800 text-neutral-400"
                      : "hover:bg-gray-200 text-gray-500"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <form
                onSubmit={handleSubmit}
                className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1"
              >
                {/* Title */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-neutral-200" : "text-gray-900"
                    }`}
                  >
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="e.g., Design homepage mockup"
                    className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      isDarkMode
                        ? "bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    } ${errors.title ? "border-red-400 bg-red-50/10" : ""}`}
                  />
                  {errors.title && (
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-neutral-200" : "text-gray-900"
                    }`}
                  >
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Add details..."
                    rows={4}
                    className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none ${
                      isDarkMode
                        ? "bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    }`}
                  />
                </div>

                {/* Row: Assignee & Project */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label
                      className={`flex text-sm font-semibold mb-2 items-center gap-2 ${
                        isDarkMode ? "text-neutral-200" : "text-gray-900"
                      }`}
                    >
                      <User className="w-4 h-4 text-blue-500" />
                      Assignee <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.user_id}
                      onChange={(e) => handleChange("user_id", e.target.value)}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        isDarkMode
                          ? "bg-neutral-800 border-neutral-700 text-white"
                          : "bg-white border-gray-200 text-gray-900"
                      } ${errors.user_id ? "border-red-400" : ""}`}
                    >
                      <option
                        value=""
                        className={isDarkMode ? "bg-neutral-900" : ""}
                      >
                        Select user...
                      </option>
                      {users.map((u) => (
                        <option
                          key={u.id}
                          value={u.id}
                          className={isDarkMode ? "bg-neutral-900" : ""}
                        >
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`flex text-sm font-semibold mb-2 items-center gap-2 ${
                        isDarkMode ? "text-neutral-200" : "text-gray-900"
                      }`}
                    >
                      <Book className="w-4 h-4 text-purple-500" />
                      Project <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.project_id}
                      onChange={(e) =>
                        handleChange("project_id", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        isDarkMode
                          ? "bg-neutral-800 border-neutral-700 text-white"
                          : "bg-white border-gray-200 text-gray-900"
                      } ${errors.project_id ? "border-red-400" : ""}`}
                    >
                      <option
                        value=""
                        className={isDarkMode ? "bg-neutral-900" : ""}
                      >
                        Select project...
                      </option>
                      {projects.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          className={isDarkMode ? "bg-neutral-900" : ""}
                        >
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row: Status, Priority, Due Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? "text-neutral-200" : "text-gray-900"
                      }`}
                    >
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        isDarkMode
                          ? "bg-neutral-800 border-neutral-700 text-white"
                          : "bg-white border-gray-200 text-gray-900"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`flex text-sm font-semibold mb-2 items-center gap-2 ${
                        isDarkMode ? "text-neutral-200" : "text-gray-900"
                      }`}
                    >
                      <Flag className="w-4 h-4 text-orange-500" /> Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleChange("priority", e.target.value)}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        isDarkMode
                          ? "bg-neutral-800 border-neutral-700 text-white"
                          : "bg-white border-gray-200 text-gray-900"
                      }`}
                    >
                      <option value="Low">Low</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 md:col-span-1">
                    <label
                      className={`flex text-sm font-semibold mb-2 items-center gap-2 ${
                        isDarkMode ? "text-neutral-200" : "text-gray-900"
                      }`}
                    >
                      <CalendarIcon className="w-4 h-4 text-green-500" /> Due
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => handleChange("due_date", e.target.value)}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        isDarkMode
                          ? "bg-neutral-800 border-neutral-700 text-white color-scheme-dark"
                          : "bg-white border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border-2 rounded-lg flex items-start gap-3 ${
                      isDarkMode
                        ? "bg-red-900/20 border-red-900/50 text-red-400"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{errors.submit}</p>
                  </motion.div>
                )}
              </form>

              {/* Modal Footer */}
              <div
                className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-t gap-3 shrink-0 ${
                  isDarkMode
                    ? "bg-neutral-900 border-neutral-800"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div>
                  {task && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      Delete Task
                    </button>
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2.5 text-sm font-medium border-2 rounded-lg transition-all ${
                      isDarkMode
                        ? "text-neutral-300 bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                        : "text-gray-700 bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-60 shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {task ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
