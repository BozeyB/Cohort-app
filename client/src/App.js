// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Match from './pages/Match';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import History from './pages/History';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <nav className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="font-bold text-blue-700 text-xl">Cohort</h1>
          <div className="space-x-4">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
            <Link to="/about" className="text-blue-600 hover:underline">About</Link>
            <Link to="/match" className="text-blue-600 hover:underline">Match</Link>

            {!user ? (
              <>
                <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>
                <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/history" className="text-blue-600 hover:underline">My History</Link>
                <span className="text-gray-600 text-sm">Hi, {user.email}</span>
                <button onClick={handleLogout} className="text-red-600 hover:underline ml-2">Log Out</button>
              </>
            )}

          </div>
        </nav>

        <Routes>

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/match"
            element={
              <PrivateRoute>
                <Match />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
