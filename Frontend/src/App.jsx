import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  
  return (
   <Routes>
      <Route path='/' element={<Home/> }/>
      <Route path='/dashboard' element={<Dashboard/> }/>
      <Route path='/login' element={<Login/> }/>
      <Route path='/register' element={<Register/> }/>
      <Route path='/admin' element={<Admin/> }/>
   </Routes>
  )
}

export default App
