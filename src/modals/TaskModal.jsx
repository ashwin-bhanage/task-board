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
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100 shrink-0 bg-linear-to-r from-gray-50 to-white">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                    {task ? "Edit Task" : "Create New Task"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {task
                      ? "Update task details"
                      : "Fill in the details to create a new task"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors shrink-0"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <form
                onSubmit={handleSubmit}
                className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1"
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="e.g., Design homepage mockup"
                    className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                      errors.title
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {errors.title && (
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Add any additional details about this task..."
                    rows={4}
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 outline-none transition-all resize-none hover:border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Row: Assignee & Project */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="flex text-sm font-semibold text-gray-900 mb-2 items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      Assignee <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.user_id}
                      onChange={(e) => handleChange("user_id", e.target.value)}
                      className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 outline-none transition-all text-gray-900 ${
                        errors.user_id
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <option value="">Select a user...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    {errors.user_id && (
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.user_id}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex text-sm font-semibold text-gray-900 mb-2 items-center gap-2">
                      <Book className="w-4 h-4 text-purple-600" />
                      Project <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.project_id}
                      onChange={(e) =>
                        handleChange("project_id", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 outline-none transition-all text-gray-900 ${
                        errors.project_id
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <option value="">Select a project...</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    {errors.project_id && (
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.project_id}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row: Status, Priority, Due Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 outline-none transition-all text-gray-900 hover:border-gray-300"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex text-sm font-semibold text-gray-900 mb-2 items-center gap-2">
                      <Flag className="w-4 h-4 text-orange-600" />
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleChange("priority", e.target.value)}
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 outline-none transition-all text-gray-900 hover:border-gray-300"
                    >
                      <option value="Low">Low</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 md:col-span-1">
                    <label className="flex text-sm font-semibold text-gray-900 mb-2 items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-green-600" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => handleChange("due_date", e.target.value)}
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 outline-none transition-all text-gray-900 hover:border-gray-300"
                    />
                  </div>
                </div>

                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Error</p>
                      <p className="text-sm text-red-700 mt-1">
                        {errors.submit}
                      </p>
                    </div>
                  </motion.div>
                )}
              </form>

              {/* Modal Footer */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-t border-gray-100 bg-gray-50 gap-3 shrink-0">
                <div>
                  {task && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this task? This action cannot be undone."
                          )
                        ) {
                          try {
                            await taskAPI.delete(task.id);
                            toast.success("Task deleted successfully"); // Added feedback
                            onSuccess();
                            onClose();
                          } catch (error) {
                            console.error("Failed to delete task:", error);
                            toast.error("Failed to delete task"); // Added error feedback
                          }
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:text-red-700"
                    >
                      Delete Task
                    </button>
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        {task ? "Update Task" : "Create Task"}
                      </>
                    )}
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
