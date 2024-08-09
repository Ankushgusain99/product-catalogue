
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Users from './components/Auth/Users';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
