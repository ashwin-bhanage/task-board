import React from 'react'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-200">
          Welcome to Taskie
        </h1>
        <p className='bg-gray-600 mt-2'>
          Layout is ready.Kanban board is on the way.
        </p>
      </div>
    </Layout>
   )
}

export default App
