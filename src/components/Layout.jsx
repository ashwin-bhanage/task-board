import { useState } from 'react'
import { Menu, X, Plus, LayoutDashboard, Inbox, Users, Settings, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{
              x: 0,
              width: sidebarCollapsed ? 80 : 256
            }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TB</span>
                  </div>
                  <span className="font-semibold text-gray-900">TaskBoard</span>
                </motion.div>
              )}

              {sidebarCollapsed && (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-sm">TB</span>
                </div>
              )}

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Workspace Selector */}
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4"
              >
                <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  <span>OnPoint Studio</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Add New Button */}
            <div className="px-4 pb-4">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5" />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium"
                  >
                    Add New
                  </motion.span>
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              <NavItem
                icon={LayoutDashboard}
                label="Dashboard"
                collapsed={sidebarCollapsed}
              />
              <NavItem
                icon={Inbox}
                label="Inbox"
                badge={3}
                collapsed={sidebarCollapsed}
              />
              <NavItem
                icon={Users}
                label="Teams"
                collapsed={sidebarCollapsed}
              />
              <NavItem
                icon={Settings}
                label="Settings"
                collapsed={sidebarCollapsed}
              />

              {/* Projects Section */}
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pt-6"
                >
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Projects</span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Plus className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <ProjectItem name="Design Project" active />
                  <ProjectItem name="Carl UI/UX" />
                  <ProjectItem name="Hajime Illustrations" />
                </motion.div>
              )}
            </nav>

            {/* Collapse Toggle Button (Desktop Only) */}
            <div className="hidden lg:block p-4 border-t border-gray-200">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <>
                    <ChevronLeft className="w-5 h-5" />
                    <span className="ml-2 text-sm font-medium">Collapse</span>
                  </>
                )}
              </button>
            </div>

            {/* Invite Team Footer (Mobile) */}
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden p-4 border-t border-gray-200"
              >
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Invite Team
                </button>
              </motion.div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg w-96">
              <span className="text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <span className="text-gray-600">📋</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <span className="text-gray-600">🔔</span>
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

// Nav Item Component
function NavItem({ icon: Icon, label, badge, collapsed }) {
  return (
    <button
      className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg group"
      title={collapsed ? label : ''}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-medium"
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
          className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full"
        >
          {badge}
        </motion.span>
      )}
    </button>
  )
}

// Project Item Component
function ProjectItem({ name, active }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
        active
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{name}</span>
    </button>
  )
}
