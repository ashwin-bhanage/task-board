import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import KanbanBoard from './components/KanbanBoard'
import { userAPI, projectAPI } from './services/api'

function App() {
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  const fetchData = async () => {
    try {
      const [usersData, projectsData] = await Promise.all([
        userAPI.getAll(),
        projectAPI.getAll()
      ])
      setUsers(usersData)
      setProjects(projectsData)

      // Set first project as selected if none selected
      if (!selectedProject && projectsData.length > 0) {
        setSelectedProject(projectsData[0])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleDataUpdate = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
  }

  return (
    <Layout
      users={users}
      projects={projects}
      selectedProject={selectedProject}
      onProjectSelect={handleProjectSelect}
      onDataUpdate={handleDataUpdate}
    >
      <KanbanBoard
        selectedProject={selectedProject}
        onDataUpdate={handleDataUpdate}
      />
    </Layout>
  )
}

export default App
