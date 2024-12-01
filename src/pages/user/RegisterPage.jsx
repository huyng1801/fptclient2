import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { handleUserRegistration } from '../../services/AuthService';
import MajorCodeService from '../../services/MajorCodeService'; // Import your service for fetching major codes
import './RegisterPage.css'; // Add custom styles for the register page

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [major, setMajor] = useState(''); // State for major selection
  const [role, setRole] = useState(''); // State for role selection
  const [majors, setMajors] = useState([]); // State to store the list of majors
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch majors when the component mounts
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await MajorCodeService.getAllMajorCodes();
        setMajors(response.items); // Assuming response is an array of major objects
      } catch (err) {
        console.error('Error fetching majors:', err);
        setError('Failed to load majors.');
      }
    };
    fetchMajors();
  }, []);

  // Handle form submission for registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !major || !role) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const response = await handleUserRegistration(firstName, lastName, email, password, code);
      if (response?.message) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000); // Redirect to login page after successful registration
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Box className="register-page" sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1E90FF, #00BFFF)',
          color: '#ffffff',
        }}
      >
        <img
          src="/assets/images/login-thumb.png"
          alt="Register Illustration"
          className="register-image"
          style={{ width: '80%', maxWidth: '400px' }}
        />
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 3,
          bgcolor: '#ffffff',
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Create a new account
        </Typography>
        {/* Display Success or Error Message */}
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {success && <Typography color="success" sx={{ mt: 2 }}>{success}</Typography>}

        {/* Registration Form */}
        <form onSubmit={handleRegisterSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            fullWidth
            label="Referral Code (Optional)"
            variant="outlined"
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {/* Major Selection */}
          <FormControl fullWidth variant="outlined">
            <InputLabel>Major</InputLabel>
            <Select
              label="Major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              required
            >
              {majors.map((major) => (
                <MenuItem key={major.majorId} value={major.majorId}>
                  {major.majorName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Role Selection */}
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <MenuItem value={2}>Alumni</MenuItem>
              <MenuItem value={3}>Student</MenuItem>
              <MenuItem value={5}>Recruiter</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              bgcolor: '#FFC107',
              ':hover': { bgcolor: '#FFA000' },
              textTransform: 'none',
            }}
          >
            Register
          </Button>
          <Typography sx={{ mt: 1 }}>
          Already have an account?{' '}
          <span
            style={{ color: '#1976d2', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </Typography>
        </form>


        
      </Box>
    </Box>
  );
};

export default RegisterPage;
