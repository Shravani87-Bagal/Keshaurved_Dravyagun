import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/AuthPage.css"

function AuthPage() {
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(false)
  const [selectedRole, setSelectedRole] = useState("doctor")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Sign Up fields
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [language, setLanguage] = useState("English")
  const [profession, setProfession] = useState("Ayurvedic Physician")

  // Login
  const [rememberMe, setRememberMe] = useState(false)

  /*
   * Load remembered login information.
   */
  useEffect(() => {
    const rememberedLogin = localStorage.getItem("rememberedLogin")

    if (rememberedLogin) {
      try {
        const savedLogin = JSON.parse(rememberedLogin)

        setEmail(savedLogin.email || "")
        setPassword(savedLogin.password || "")
        setRememberMe(true)

        if (savedLogin.role) {
          setSelectedRole(savedLogin.role)
        }
      } catch {
        localStorage.removeItem("rememberedLogin")
      }
    }
  }, [])

  /*
   * Change role
   */
  const handleRoleChange = (role) => {
    setSelectedRole(role)

    // Clear login information when switching roles
    if (isLogin) {
      setEmail("")
      setPassword("")
      setRememberMe(false)
    }

    // If Admin is selected, profession is not relevant.
    // Keep language because Admin also has a language preference.
    if (role === "admin") {
      setProfession("Ayurvedic Physician")
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const cleanEmail = email.trim().toLowerCase()

    // =========================================
    // SIGN UP
    // =========================================

    if (!isLogin) {
      if (
        !fullName.trim() ||
        !cleanEmail ||
        !password ||
        !confirmPassword
      ) {
        alert("Please fill in all required fields.")
        return
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.")
        return
      }

      if (password.length < 6) {
        alert("Password must contain at least 6 characters.")
        return
      }

      /*
       * Get all registered users.
       *
       * This allows Doctor and Admin accounts
       * to exist independently.
       */
      let users = []

      const savedUsers = localStorage.getItem("herbUsers")

      if (savedUsers) {
        try {
          users = JSON.parse(savedUsers)

          if (!Array.isArray(users)) {
            users = []
          }
        } catch {
          users = []
        }
      }

      /*
       * Check whether this email already exists.
       */
      const existingUser = users.find(
        (user) => user.email === cleanEmail
      )

      if (existingUser) {
        alert(
          "An account with this email already exists. Please log in."
        )

        setEmail(cleanEmail)
        setPassword("")
        setConfirmPassword("")
        setIsLogin(true)

        return
      }

      /*
       * Create new user.
       *
       * Language is saved for both Doctor and Admin.
       *
       * Profession is saved only for Doctor.
       */
      const newUser = {
        fullName: fullName.trim(),
        email: cleanEmail,
        password: password,
        role: selectedRole,
        language: language,
        profession:
          selectedRole === "doctor"
            ? profession
            : null,
      }

      users.push(newUser)

      localStorage.setItem(
        "herbUsers",
        JSON.stringify(users)
      )

      /*
       * Keep the old herbUser key as the
       * currently created account.
       */
      localStorage.setItem(
        "herbUser",
        JSON.stringify(newUser)
      )

      /*
       * Automatically remember login
       * after creating the account.
       */
      localStorage.setItem(
        "rememberedLogin",
        JSON.stringify({
          email: cleanEmail,
          password: password,
          role: selectedRole,
        })
      )

      alert(
        "Account created successfully! You can now log in."
      )

      // Move to login
      setEmail(cleanEmail)
      setPassword(password)
      setConfirmPassword("")
      setIsLogin(true)
      setRememberMe(true)

      return
    }

    // =========================================
    // LOGIN
    // =========================================

    if (!cleanEmail || !password) {
      alert("Please enter your email and password.")
      return
    }

    /*
     * Get all registered users.
     */
    let users = []

    const savedUsers = localStorage.getItem("herbUsers")

    if (savedUsers) {
      try {
        users = JSON.parse(savedUsers)

        if (!Array.isArray(users)) {
          users = []
        }
      } catch {
        users = []
      }
    }

    /*
     * Backward compatibility:
     *
     * If an older account was created using
     * the previous herbUser system, include it.
     */
    const oldUser = localStorage.getItem("herbUser")

    if (oldUser) {
      try {
        const parsedOldUser = JSON.parse(oldUser)

        const alreadyExists = users.some(
          (user) => user.email === parsedOldUser.email
        )

        if (!alreadyExists) {
          users.push(parsedOldUser)
        }
      } catch {
        // Ignore invalid old account
      }
    }

    /*
     * Find account by BOTH email and selected role.
     *
     * This is important because Doctor and Admin
     * are different account types.
     */
    const user = users.find(
      (account) =>
        account.email === cleanEmail &&
        account.role === selectedRole
    )

    /*
     * No matching account.
     */
    if (!user) {
      if (selectedRole === "admin") {
        alert(
          "No admin account found with this email. Please sign up first."
        )
      } else {
        alert(
          "No doctor account found with this email. Please sign up first."
        )
      }

      return
    }

    /*
     * Account exists but password is incorrect.
     */
    if (user.password !== password) {
      alert("Incorrect password. Please try again.")
      return
    }

    /*
     * Remember login if selected.
     */
    if (rememberMe) {
      localStorage.setItem(
        "rememberedLogin",
        JSON.stringify({
          email: cleanEmail,
          password: password,
          role: selectedRole,
        })
      )
    } else {
      localStorage.removeItem("rememberedLogin")
    }

    /*
     * Save currently logged-in user.
     */
    localStorage.setItem(
      "herbUser",
      JSON.stringify(user)
    )

    /*
     * Authentication state.
     */
    localStorage.setItem(
      "isAuthenticated",
      "true"
    )

    /*
     * Redirect according to selected role.
     */
    if (selectedRole === "doctor") {
      navigate("/doctor")
    } else if (selectedRole === "admin") {
      navigate("/admin")
    }
  }

  // =========================================
  // SWITCH TO LOGIN
  // =========================================

  const switchToLogin = () => {
    setIsLogin(true)

    const rememberedLogin =
      localStorage.getItem("rememberedLogin")

    if (rememberedLogin) {
      try {
        const savedLogin =
          JSON.parse(rememberedLogin)

        setEmail(savedLogin.email || "")
        setPassword(savedLogin.password || "")
        setRememberMe(true)

        if (savedLogin.role) {
          setSelectedRole(savedLogin.role)
        }
      } catch {
        setEmail("")
        setPassword("")
      }

      return
    }

    /*
     * If there is no remembered login,
     * leave fields empty.
     */
    setEmail("")
    setPassword("")
    setRememberMe(false)
  }

  // =========================================
  // SWITCH TO SIGN UP
  // =========================================

  const switchToSignUp = () => {
    setIsLogin(false)

    setPassword("")
    setConfirmPassword("")

    /*
     * Keep selected role so the user
     * can continue signup for that role.
     */
  }

  return (
    <div className="auth-page">

      {/* =========================================
          BACK TO HOME
      ========================================= */}

      <Link
        to="/"
        className="back-home-button"
      >
        <span>‹</span>
        Back to home
      </Link>


      {/* =========================================
          BRAND
      ========================================= */}

      <div className="auth-brand">

        <div className="auth-brand-row">

          <div className="auth-brand-icon">
            ⌁
          </div>

          <span>
            Herb Intelligence
          </span>

        </div>

        <p>
          Clinical decision support · Ayurveda
        </p>

      </div>


      {/* =========================================
          AUTH CARD
      ========================================= */}

      <div className="auth-card">


        {/* =========================================
            LOGIN / SIGN UP TABS
        ========================================= */}

        <div className="auth-tabs">

          <button
            type="button"
            className={`auth-tab ${
              isLogin ? "active" : ""
            }`}
            onClick={switchToLogin}
          >
            Log In
          </button>


          <button
            type="button"
            className={`auth-tab ${
              !isLogin ? "active" : ""
            }`}
            onClick={switchToSignUp}
          >
            Sign Up
          </button>

        </div>


        {/* =========================================
            ROLE
        ========================================= */}

        <div className="auth-section">

          <label className="auth-label">
            ROLE
          </label>

          <div className="role-options">

            <button
              type="button"
              className={`role-option ${
                selectedRole === "doctor"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleRoleChange("doctor")
              }
            >
              <span className="role-icon">
                ♧
              </span>

              <span>
                Doctor
              </span>
            </button>


            <button
              type="button"
              className={`role-option ${
                selectedRole === "admin"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleRoleChange("admin")
              }
            >
              <span className="role-icon">
                ♢
              </span>

              <span>
                Admin
              </span>
            </button>

          </div>

        </div>


        {/* =========================================
            SIGN UP OPTIONS
        ========================================= */}

        {!isLogin && (
          <>

            {/* LANGUAGE
                Available for BOTH Doctor and Admin
            */}

            <div className="auth-field">

              <label htmlFor="language">
                Language
              </label>

              <select
                id="language"
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value)
                }
              >
                <option value="English">
                  English
                </option>

                <option value="Marathi">
                  Marathi
                </option>

                <option value="Hindi">
                  Hindi
                </option>
              </select>

            </div>


            {/* =====================================
                PROFESSION
                ONLY FOR DOCTOR
            ===================================== */}

            {selectedRole === "doctor" && (
              <div className="auth-field">

                <label htmlFor="profession">
                  Profession
                </label>

                <select
                  id="profession"
                  value={profession}
                  onChange={(event) =>
                    setProfession(event.target.value)
                  }
                >

                  <option value="Ayurvedic Physician">
                    Ayurvedic Physician
                  </option>

                  <option value="Ayurvedic Practitioner">
                    Ayurvedic Practitioner
                  </option>

                  <option value="Ayurvedic Researcher">
                    Ayurvedic Researcher
                  </option>

                  <option value="Ayurveda Student">
                    Ayurveda Student
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>
            )}

          </>
        )}


        {/* =========================================
            FORM
        ========================================= */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >


          {/* FULL NAME */}

          {!isLogin && (
            <div className="auth-field">

              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                type="text"
                id="fullName"
                placeholder={
                  selectedRole === "admin"
                    ? "Admin Name"
                    : "Dr. Ananya Sharma"
                }
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                autoComplete="name"
              />

            </div>
          )}


          {/* EMAIL */}

          <div className="auth-field">

            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              placeholder={
                selectedRole === "admin"
                  ? "admin@gmail.com"
                  : "doctor@example.com"
              }
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
            />

          </div>


          {/* PASSWORD */}

          <div className="auth-field">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-field">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete={
                  isLogin
                    ? "current-password"
                    : "new-password"
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "◉" : "◌"}
              </button>

            </div>

          </div>


          {/* CONFIRM PASSWORD */}

          {!isLogin && (
            <div className="auth-field">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="password-field">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword
                    ? "◉"
                    : "◌"}
                </button>

              </div>

            </div>
          )}


          {/* =========================================
              REMEMBER ME - LOGIN ONLY
          ========================================= */}

          {isLogin && (
            <div className="remember-login">

              <label className="remember-checkbox">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                />

                <span>
                  Remember me on this device
                </span>

              </label>

            </div>
          )}


          {/* =========================================
              SUBMIT
          ========================================= */}

          <button
            type="submit"
            className="auth-submit"
          >
            {isLogin
              ? "Log In"
              : "Create Account"}
          </button>

        </form>


        {/* =========================================
            BOTTOM SWITCH
        ========================================= */}

        <div className="auth-switch">

          {isLogin ? (
            <>
              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={switchToSignUp}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span>
                Already have an account?
              </span>

              <button
                type="button"
                onClick={switchToLogin}
              >
                Log In
              </button>
            </>
          )}

        </div>

      </div>


      {/* =========================================
          DISCLAIMER
      ========================================= */}

      <p className="auth-disclaimer">

        For qualified Ayurvedic physicians and licensed
        <br />
        healthcare professionals only.

      </p>

    </div>
  )
}

export default AuthPage