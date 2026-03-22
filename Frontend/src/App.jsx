import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Employees from "./pages/Employees.jsx";
import Slots from "./pages/Slots.jsx";
import Book from "./pages/Book.jsx";
import AdminEmployees from "./pages/AdminEmployees.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <Admin />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <Employees allowedRoles={["admin", "client"]} />
          </PrivateRoute>
        }
      />
      <Route
        path="/slots/:employeeId"
        element={
          <PrivateRoute>
            <Slots />
          </PrivateRoute>
        }
      />
      <Route
        path="/book/:slotId"
        element={
          <PrivateRoute>
            <Book/>
          </PrivateRoute>
        }
      />
      <Route
        path="/adminEmpoyees"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminEmployees/>
          </PrivateRoute>
        }
      />
      
    
      <Route path="*" element={<h1>Route Not Found</h1>} />
    </Routes>
  );
}

export default App;
