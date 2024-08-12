import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/loginUser',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('Login successful!');
        console.log(response)
        const role=response.data.user.role
        // Optionally store the token and user details (e.g., in localStorage)
       // localStorage.setItem('token', response.data.token);
        //localStorage.setItem('user', JSON.stringify(response.data.user));

        // Clear form fields
        setUsername('');
        setPassword('');
        setError('');
        if (role==='admin')
          navigate('/register')
        else
          navigate('/productForm')
        // Optionally redirect or perform another action
        // For example: window.location.href = '/dashboard';
      } else {
        // Handle other status codes or errors
        setError('Login failed: ' + response.data.message);
        setTimeout(() => {
            setError('');
          }, 5000);
      }
    } catch (error) {
      // Handle network or server errors
      setError('An error occurred: ' + error.response?.data?.message || error.message);
      setTimeout(() => {
        setError('');
      },5000);
    
      
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
    </form>
  );
};

export default Login;
