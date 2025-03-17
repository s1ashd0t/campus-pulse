import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import logo from "./assets/icon.png";
import "./App.css";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
<<<<<<< Updated upstream
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
=======
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Navigation from "./pages/Navigation";
import close from './assets/close.svg'
import menu from './assets/menu.svg'
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';


// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <div className="app-container">
<<<<<<< Updated upstream
        {/* Keeping logo in App.jsx to appear in all pages for testing */}
        <div>
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={logo} className="logo" alt="logo" />
          </a>
        </div>

        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/leaderboard">Leaderboard</Link> |{" "}
          <Link to="/notifications">Notifications</Link> |{" "}
          <Link to="/login">Login</Link>
        </nav>

        {/* Defining the routes */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
=======
        {/* Keep the logo in App.jsx */}
        
        <Navigation />



        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/leaderboard" element={<PrivateRoute element={<Leaderboard />} />} />
          <Route path="/notifications" element={<PrivateRoute element={<Notifications />} />} />
        </Routes>


        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
        </footer>
>>>>>>> Stashed changes
      </div>
    </Router>
  );
}

export default App;