import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

function AuthPage() {
    const navigate = useNavigate();
  
    const [isLogin, setIsLogin] = useState(false);
    const [selectedRole, setSelectedRole] = useState("doctor");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const fullName = document.getElementById("fullName")?.value.trim();
      const email = document.getElementById("email")?.value.trim().toLowerCase();
      const password = document.getElementById("password").value;
      const confirmPassword =
          document.getElementById("confirmPassword")?.value;
  
      // =========================
      // SIGN UP
      // =========================
  
      if (!isLogin) {
  
          if (!fullName || !email || !password || !confirmPassword) {
              alert("Please fill in all required fields.");
              return;
          }
  
          if (password !== confirmPassword) {
              alert("Passwords do not match.");
              return;
          }
  
          const existingUser = localStorage.getItem("herbUser");
  
          if (existingUser) {
              const user = JSON.parse(existingUser);
  
              if (user.email === email) {
                  alert("An account with this email already exists. Please log in.");
                  setIsLogin(true);
                  return;
              }
          }
  
          const newUser = {
              fullName: fullName,
              email: email,
              password: password,
              role: selectedRole
          };
  
          localStorage.setItem("herbUser", JSON.stringify(newUser));
  
          alert("Account created successfully! You can now log in.");
  
          setIsLogin(true);
          return;
      }
  
  
      // =========================
      // LOGIN
      // =========================
  
      if (!email || !password) {
          alert("Please enter your email and password.");
          return;
      }
  
      const savedUser = localStorage.getItem("herbUser");
  
      if (!savedUser) {
          alert("No account found. Please sign up first.");
          return;
      }
  
      const user = JSON.parse(savedUser);
  
      if (user.email !== email || user.password !== password) {
          alert("Invalid email or password.");
          return;
      }
  
      localStorage.setItem("isAuthenticated", "true");
  
      if (user.role === "doctor") {
        navigate("/doctor");
    } else if (user.role === "admin") {
        navigate("/admin");
    }
  };

  return (
    <div className="auth-page">

      {/* Back to Home */}
      <Link to="/" className="back-home-button">
      <span>‹</span>
       Back to home
     </Link>


      {/* Brand */}
      <div className="auth-brand">

        <div className="auth-brand-row">
          <div className="auth-brand-icon">⌁</div>

          <span>Herb Intelligence</span>
        </div>

        <p>Clinical decision support · Ayurveda</p>

      </div>


      {/* Main Authentication Card */}
      <div className="auth-card">

        {/* Login / Sign Up Tabs */}
        <div className="auth-tabs">

          <button
            type="button"
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Log In
          </button>

          <button
            type="button"
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>

        </div>


        {/* Role Selection */}
        <div className="auth-section">

          <label className="auth-label">
            ROLE
          </label>

          <div className="role-options">

            <button
              type="button"
              className={`role-option ${
                selectedRole === "doctor" ? "selected" : ""
              }`}
              onClick={() => setSelectedRole("doctor")}
            >
              <span className="role-icon">♧</span>
              <span>Doctor</span>
            </button>


            <button
              type="button"
              className={`role-option ${
                selectedRole === "admin" ? "selected" : ""
              }`}
              onClick={() => setSelectedRole("admin")}
            >
              <span className="role-icon">♢</span>
              <span>Admin</span>
            </button>

          </div>

        </div>


        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Full Name - Only for Sign Up */}
          {!isLogin && (
            <div className="auth-field">

              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                type="text"
                id="fullName"
                placeholder="Dr. Ananya Sharma"
              />

            </div>
          )}


          {/* Email */}
          <div className="auth-field">

            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              placeholder="doctor@example.com"
            />

          </div>


          {/* Password */}
          <div className="auth-field">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-field">

            <input 
    type={showPassword ? "text" : "password"}
    id="password"
    placeholder="••••••••"
/>

<button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
    aria-label={showPassword ? "Hide password" : "Show password"}
>
    {showPassword ? "◉" : "◌"}
</button>

            </div>

          </div>


          {/* Confirm Password - Only for Sign Up */}
          {!isLogin && (
            <div className="auth-field">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
        type={showConfirmPassword ? "text" : "password"}
        id="confirmPassword"
        placeholder="••••••••"
    />

<button
        type="button"
        className="password-toggle"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        aria-label={
            showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
        }
    >
        {showConfirmPassword ? "◉" : "◌"}
    </button>

            </div>
          )}


          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit"
          >
            {isLogin ? "Log In" : "Create Account"}
          </button>

        </form>


        {/* Bottom Switch */}
        <div className="auth-switch">

          {isLogin ? (
            <>
              <span>Don't have an account?</span>

              <button
                type="button"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>

              <button
                type="button"
                onClick={() => setIsLogin(true)}
              >
                Log In
              </button>
            </>
          )}

        </div>

      </div>


      {/* Disclaimer */}
      <p className="auth-disclaimer">
        For qualified Ayurvedic physicians and licensed
        <br />
        healthcare professionals only.
      </p>

    </div>
  );
}

export default AuthPage;