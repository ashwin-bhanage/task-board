import { useState, useEffect } from "react";
import {
  Menu, X, Plus, LayoutDashboard, Inbox, Users, Settings, ChevronDown,
  ListTodoIcon, BellRing, UserRound, HelpCircle, PanelLeftClose, PanelLeftOpen
} from 'lucide-react'
import { motion, AnimatePresence } from "motion/react";
import Logo from "../../assets/Logo.png";
import UserModal from "../modals/UserModal";
import ProjectModal from "../modals/ProjectModal";

export default function Layout({ children, users, projects, onDataUpdate, onProjectSelect, selectedProject }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddMenuClick = (type) => {
    if (type === 'user') {
      setIsUserModalOpen(true);
    } else if (type === 'project') {
      setIsProjectModalOpen(true);
    }
    setShowAddMenu(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{
              x: 0,
              width: sidebarCollapsed ? 72 : 256,
            }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <img
                    src={Logo}
                    alt="TaskBoard Logo"
                    className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg object-contain"
                  />
                  <span className="font-semibold text-gray-900 text-sm lg:text-base">
                    TaskBoard
                  </span>
                </motion.div>
              )}

              {sidebarCollapsed && (
                <img
                  src={Logo}
                  alt="TaskBoard"
                  className="w-7 h-7 rounded-lg object-contain mx-auto"
                />
              )}

              {!sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose className="w-5 h-5 text-gray-600" />
                </button>
              )}

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {sidebarCollapsed && (
              <div className="hidden lg:flex justify-center pt-4 pb-2">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Expand sidebar"
                >
                  <PanelLeftOpen className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}

            <div
              className={`px-3 lg:px-4 py-3 lg:py-4 ${
                sidebarCollapsed ? "flex justify-center px-2" : ""
              } relative`}
            >
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className={`flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md ${
                  sidebarCollapsed ? "w-10 h-10 p-0" : "w-full py-2 lg:py-2.5"
                }`}
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-semibold text-sm lg:text-base"
                  >
                    Add New
                  </motion.span>
                )}
              </button>

              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 ${
                    sidebarCollapsed
                      ? "left-14 top-2 w-56"
                      : "left-3 right-3 lg:left-4 lg:right-4 top-full mt-2 w-auto"
                  }`}
                >
                  <button
                    onClick={() => handleAddMenuClick("user")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserRound className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Add User</p>
                      <p className="text-xs text-gray-500">
                        Create new team member
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAddMenuClick("project")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <LayoutDashboard className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Add Project</p>
                      <p className="text-xs text-gray-500">Start new project</p>
                    </div>
                  </button>
                </motion.div>
              )}
            </div>

            {showAddMenu && (
              <div
                onClick={() => setShowAddMenu(false)}
                className="fixed inset-0 z-40"
              />
            )}

            <nav
              className={`flex-1 space-y-1 overflow-y-auto ${
                sidebarCollapsed ? "px-2" : "px-3 lg:px-4"
              }`}
            >
              <NavItem
                icon={LayoutDashboard}
                label="Dashboard"
                collapsed={sidebarCollapsed}
                active={activeItem === "Dashboard"}
                onClick={() => setActiveItem("Dashboard")}
              />
              <NavItem
                icon={Inbox}
                label="Inbox"
                badge={3}
                collapsed={sidebarCollapsed}
                active={activeItem === "Inbox"}
                onClick={() => setActiveItem("Inbox")}
              />
              <NavItem
                icon={Users}
                label="Teams"
                collapsed={sidebarCollapsed}
                active={activeItem === "Teams"}
                onClick={() => setActiveItem("Teams")}
              />
              <NavItem
                icon={Settings}
                label="Settings"
                collapsed={sidebarCollapsed}
                active={activeItem === "Settings"}
                onClick={() => setActiveItem("Settings")}
              />

              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pt-4 lg:pt-6"
                >
                  <button
                    onClick={() => setProjectsExpanded(!projectsExpanded)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Projects ({projects?.length || 0})
                    </span>
                    <motion.div
                      animate={{ rotate: projectsExpanded ? 0 : -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {projectsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 mt-2">
                          {projects && projects.length > 0 ? (
                            projects.map((project) => (
                              <ProjectItem
                                key={project.id}
                                name={project.name}
                                active={selectedProject?.id === project.id}
                                onClick={() => {
                                  onProjectSelect(project);
                                  if (window.innerWidth < 1024) {
                                    setSidebarOpen(false);
                                  }
                                }}
                              />
                            ))
                          ) : (
                            <p className="px-3 py-2 text-xs text-gray-400">
                              No projects yet
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </nav>

            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-3 lg:p-4 border-t border-gray-200"
              >
                <div className="flex items-center justify-between gap-2">
                  <button className="text-xs lg:text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    Invite Team
                  </button>
                  <button className="flex items-center gap-1 text-xs lg:text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    <HelpCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Help</span>
                  </button>
                </div>
              </motion.div>
            )}

            {sidebarCollapsed && (
              <div className="hidden lg:flex flex-col items-center gap-2 p-2 border-t border-gray-200">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Invite Team"
                >
                  <Users className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Help"
                >
                  <HelpCircle className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 lg:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 lg:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 flex justify-center px-2 lg:px-4">
            <div className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gray-100 rounded-lg w-full max-w-md border border-gray-300/60">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 lg:gap-2">
            <button className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ListTodoIcon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            </button>
            <button className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <BellRing className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            </button>
            <button className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <UserRound className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={onDataUpdate}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        users={users}
        onSuccess={onDataUpdate}
      />
    </div>
  );
}

function NavItem({ icon: Icon, label, badge, collapsed, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2 lg:px-3 py-2 rounded-lg group transition-colors ${
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-100'
      } ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? label : ""}
    >
      <div className="flex items-center gap-2 lg:gap-3">
        <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`text-xs lg:text-sm font-medium ${active ? 'text-blue-600' : ''}`}
          >
            {label}
          </motion.span>
        )}
      </div>
      {badge && !collapsed && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-1.5 lg:px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full"
        >
          {badge}
        </motion.span>
      )}
    </button>
  );
}

function ProjectItem({ name, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 text-xs lg:text-sm rounded-lg transition-colors ${
        active
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-blue-600' : 'bg-gray-400'}`} />
      <span className="truncate">{name}</span>
    </button>
  );
}
