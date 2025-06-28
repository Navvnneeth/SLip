import React from 'react'
import Login from './pages/Login.jsx'
import {Route, Routes} from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Add from './pages/Add.jsx'
import Edit from './pages/Edit.jsx'
import WebcamCapture from './pages/WebcamCapture.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/add' element={<Add/>}/>
        <Route path='/edit/:id' element={<Edit />}/>
        <Route path='/camera' element={<WebcamCapture/>}/>
      </Routes>
    </div>
  )
}

export default App