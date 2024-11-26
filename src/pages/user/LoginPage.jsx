import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Checkbox,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import "./LoginPage.css";
import { handleGoogleLogin, handleEmailPasswordLogin } from "../../services/AuthService";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    try {
      const response = await handleGoogleLogin(credential);
      if (response.email) {
        setSuccess("Google login successful! Redirecting...");
        setTimeout(() => navigate("/home"), 2000);
      } else {
        setError("Google login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Google login failed. Please try again.");
    }
  };

  const handleGoogleFailure = () => {
    setError("Google login failed. Please try again.");
  };

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle form submission for email/password login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const response = await handleEmailPasswordLogin(email, password);
      if (response.userInfo.email) {
        // Save login info to sessionStorage
        sessionStorage.setItem("accessToken", response.accessToken);
        sessionStorage.setItem("userInfo", JSON.stringify(response.userInfo));
  
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Box className="login-page" sx={{ display: "flex", height: "100vh" }}>
        {/* Left Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #1E90FF, #00BFFF)",
            color: "#ffffff",
          }}
        >
          <img
            src="/assets/images/login-thumb.png"
            alt="Login Illustration"
            className="login-image"
            style={{ width: "80%", maxWidth: "400px" }}
          />
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: 3,
            bgcolor: "#ffffff",
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
            Welcome to <span style={{ color: "#FFC107" }}>Alumni Connect</span>
          </Typography>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            render={(renderProps) => (
              <Button
                variant="outlined"
                startIcon={<Google />}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                sx={{
                  width: "100%",
                  mb: 2,
                  textTransform: "none",
                  color: "#757575",
                  borderColor: "#757575",
                  ":hover": { borderColor: "#424242", color: "#424242" },
                }}
              >
                Login with Google
              </Button>
            )}
          />

          <Box sx={{ display: "flex", alignItems: "center", width: "100%", my: 2 }}>
            <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
            <Typography sx={{ mx: 2, fontWeight: "bold", color: "#757575" }}>OR</Typography>
            <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
          </Box>

          {/* Email and Password Login */}
          <form onSubmit={handleLoginSubmit} style={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox />
                <Typography>Remember me</Typography>
              </Box>
              <Typography sx={{ color: "#1976d2", cursor: "pointer" }}>Forgot Password?</Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mb: 2,
                bgcolor: "#FFC107",
                ":hover": { bgcolor: "#FFA000" },
                textTransform: "none",
              }}
            >
              Login
            </Button>
          </form>

          {/* Display Success or Error Message */}
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          {success && <Typography color="success" sx={{ mt: 2 }}>{success}</Typography>}

          <Typography sx={{ mt: 10 }}>
            Don't have an account?{" "}
            <span style={{ color: "#1976d2", cursor: "pointer" }}>Register</span>
          </Typography>
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
