import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Available from "./pages/Available";
import Description from "./pages/Description";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/profile"
            element={<ProtectedRoute component={Profile} />}
          />{" "}
          <Route path="/available" element={<Available />} />
          <Route
            path="/description/:id"
            element={<ProtectedRoute component={Description} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route
            path="/settings"
            element={<ProtectedRoute component={Settings} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// test to merge branches
