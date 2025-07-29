import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Emergencies from './pages/emergency/Emergencies'
import Layout from './pages/Layout'

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/*' element ={<Layout />}>
          <Route index element ={<Dashboard />} />
          <Route path='emergencies' element = {<Emergencies />} />
          <Route path='emergency/:emergency_id' element = {<Emergencies />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
