import { useEffect, useState } from 'react';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: '' });
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const[id,setId]=useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/getAllUsers');
        if (response.data.success) {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data); // Initialize filteredUsers
        } else {
          setError('Failed to fetch users');
        }
      } catch (error) {
        setError('An error occurred: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filterUsers = () => {
      switch (selectedRole) {
        case 'admin':
          setFilteredUsers(users.filter(user => user.role === 'admin'));
          break;
        case 'user':
          setFilteredUsers(users.filter(user => user.role === 'user'));
          break;
        default:
          setFilteredUsers(users); // 'all'
          break;
      }
    };

    filterUsers();
  }, [selectedRole, users]);

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/deleteUser/${userId}`);
      if (response.data.success) {
        setUsers(users.filter(user => user._id !== userId));
      } else {
        setError('Failed to delete user');
      }
    } catch (error) {
      setError('An error occurred: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setId(user._id)
    setFormData({
      username: user.username,
      password: '',
      role: user.role
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (!editingUser) {
      setError('No user selected for update');
      return;
    }

    if (!formData.username || !formData.role) {
      setError('Username and role are required');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/updateUser/${editingUser._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.success) {
        //const updatedUser = response.data.data;
        //console.log(response.data.data)
        console.log(formData)
        setUsers(users.map(user => user._id === id ? formData : user));
        
        setEditingUser(null);
        setFormData({ username: '', password: '', role: '' });
        setError('');
      } else {
        setError('Failed to update user');
      }
    } catch (error) {
      setError('An error occurred: ' + (error.response?.data?.message || error.message));
    }
  };
  


  return (
    <div>
      <h1>Users List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <label htmlFor="roleFilter">Filter by role:</label>
        <select
          id="roleFilter"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>
      
      <ul>
        {filteredUsers.map((user) => (
          <li key={user._id}>
            {user.username} - {user.role}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editingUser && (
        <div>
          <h2>Edit User</h2>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="" disabled>Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default UsersList;



















/*import  { useEffect, useState } from 'react';
import axios from 'axios';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', password: '', role: '' });
    const [error, setError] = useState('');
    const[id,setId]=useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/getAllUsers');
        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          setError('Failed to fetch users');
        }
      } catch (error) {
        setError('An error occurred: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/deleteUser/${userId}`);
      if (response.data.success) {
        setUsers(users.filter(user => user._id !== userId));
      } else {
        setError('Failed to delete user');
      }
    } catch (error) {
      setError('An error occurred: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setId(user._id)
    setFormData({
      username: user.username,
      password: '',
      role: user.role
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (!editingUser) {
      setError('No user selected for update');
      return;
    }

    if (!formData.username || !formData.role) {
      setError('Username and role are required');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/updateUser/${editingUser._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.success) {
        //const updatedUser = response.data.data;
        //console.log(response.data.data)
        console.log(formData)
        setUsers(users.map(user => user._id === id ? formData : user));
        
        setEditingUser(null);
        setFormData({ username: '', password: '', role: '' });
        setError('');
      } else {
        setError('Failed to update user');
      }
    } catch (error) {
      setError('An error occurred: ' + (error.response?.data?.message || error.message));
    }
  };
  


  return (
    <div>
      <h1>Users List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.username} - {user.role}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editingUser && (
        <div>
          <h2>Edit User</h2>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="" disabled>Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default UsersList;*/
