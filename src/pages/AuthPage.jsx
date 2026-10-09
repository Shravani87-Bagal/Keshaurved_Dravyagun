import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/AuthPage.css"

function AuthPage() {
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(false)
  const [selectedRole, setSelectedRole] = useState("doctor")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // =========================================
  // SIGN UP FIELDS
  // =========================================

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [language, setLanguage] = useState("English")
  const [profession, setProfession] =
    useState("Ayurvedic Physician")

  // =========================================
  // LOGIN
  // =========================================

  const [rememberMe, setRememberMe] = useState(false)

  // =========================================
  // ROLE NORMALIZATION
  // =========================================

  const getDisplayRole = (role) => {
    if (!role) {
      return ""
    }

    const normalizedRole = role.toLowerCase().trim()

    if (normalizedRole === "admin") {
      return "Admin"
    }

    if (
      normalizedRole === "doctor"
    ) {
      return "Doctor"
    }

    if (
      normalizedRole === "ayurvedic reviewer" ||
      normalizedRole === "reviewer"
    ) {
      return "Ayurvedic Reviewer"
    }

    return role
  }

  // =========================================
  // LOAD REMEMBERED LOGIN
  // =========================================

  useEffect(() => {
    const rememberedLogin =
      localStorage.getItem("rememberedLogin")

    if (!rememberedLogin) {
      return
    }

    try {
      const savedLogin =
        JSON.parse(rememberedLogin)

      setEmail(savedLogin.email || "")
      setPassword(savedLogin.password || "")
      setRememberMe(true)

      if (savedLogin.role) {
        setSelectedRole(
          savedLogin.role.toLowerCase()
        )
      }
    } catch {
      localStorage.removeItem("rememberedLogin")
    }
  }, [])

  // =========================================
  // ROLE CHANGE
  // =========================================

  const handleRoleChange = (role) => {
    setSelectedRole(role)

    if (isLogin) {
      setEmail("")
      setPassword("")
      setRememberMe(false)
    }

    if (role === "admin") {
      setProfession("Ayurvedic Physician")
    }
  }

  // =========================================
  // GET DRAVYAGUNA USERS
  // =========================================

  const getDravyagunaUsers = () => {
    const savedUsers =
      localStorage.getItem("dravyaguna_users")

    if (!savedUsers) {
      return []
    }

    try {
      const users = JSON.parse(savedUsers)

      if (!Array.isArray(users)) {
        return []
      }

      return users
    } catch {
      return []
    }
  }

  // =========================================
  // GET HERB USERS
  // =========================================

  const getHerbUsers = () => {
    const savedUsers =
      localStorage.getItem("herbUsers")

    if (!savedUsers) {
      return []
    }

    try {
      const users = JSON.parse(savedUsers)

      if (!Array.isArray(users)) {
        return []
      }

      return users
    } catch {
      return []
    }
  }

  // =========================================
  // SIGN UP
  // =========================================

  const handleSignUp = () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      alert(
        "Please fill in all required fields."
      )

      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.")

      return
    }

    if (password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      )

      return
    }

    const cleanEmail =
      email.trim().toLowerCase()

    // =========================================
    // CHECK DRAVYAGUNA USERS
    // =========================================

    const dravyagunaUsers =
      getDravyagunaUsers()

    const existingDravyagunaUser =
      dravyagunaUsers.find(
        (user) =>
          user.email?.toLowerCase() ===
          cleanEmail
      )

    if (existingDravyagunaUser) {
      alert(
        "An account with this email already exists. Please log in."
      )

      setEmail(cleanEmail)
      setPassword("")
      setConfirmPassword("")
      setIsLogin(true)

      return
    }

    // =========================================
    // CHECK HERB USERS
    // =========================================

    const herbUsers =
      getHerbUsers()

    const existingHerbUser =
      herbUsers.find(
        (user) =>
          user.email?.toLowerCase() ===
          cleanEmail
      )

    if (existingHerbUser) {
      alert(
        "An account with this email already exists. Please log in."
      )

      setEmail(cleanEmail)
      setPassword("")
      setConfirmPassword("")
      setIsLogin(true)

      return
    }

    // =========================================
    // CREATE USER
    // =========================================

    const roleForManagement =
      getDisplayRole(selectedRole)

    const initials =
      fullName
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

    const now =
      new Date().toISOString()

    // =========================================
    // CREATE USER FOR ADMIN MANAGEMENT
    // =========================================

    const newManagementUser = {
      id:
        "USR-" +
        Date.now(),

      name:
        fullName.trim(),

      fullName:
        fullName.trim(),

      initials:
        initials,

      email:
        cleanEmail,

      password:
        password,

      role:
        roleForManagement,

      status:
        "Active",

      language:
        language,

      profession:
        selectedRole === "doctor"
          ? profession
          : null,

      lastActive:
        now,

      createdAt:
        now,
    }

    // =========================================
    // SAVE TO DRAVYAGUNA USERS
    // =========================================

    const updatedDravyagunaUsers = [
      ...dravyagunaUsers,
      newManagementUser,
    ]

    localStorage.setItem(
      "dravyaguna_users",
      JSON.stringify(
        updatedDravyagunaUsers
      )
    )

    // =========================================
    // ALSO SAVE TO HERB USERS
    // =========================================

    const newHerbUser = {
      fullName:
        fullName.trim(),

      email:
        cleanEmail,

      password:
        password,

      role:
        selectedRole,

      language:
        language,

      profession:
        selectedRole === "doctor"
          ? profession
          : null,
    }

    const updatedHerbUsers = [
      ...herbUsers,
      newHerbUser,
    ]

    localStorage.setItem(
      "herbUsers",
      JSON.stringify(
        updatedHerbUsers
      )
    )

    // =========================================
    // CURRENT USER
    // =========================================

    localStorage.setItem(
      "herbUser",
      JSON.stringify(
        newManagementUser
      )
    )

    // =========================================
    // REMEMBER LOGIN
    // =========================================

    localStorage.setItem(
      "rememberedLogin",
      JSON.stringify({
        email:
          cleanEmail,

        password:
          password,

        role:
          selectedRole,
      })
    )

    alert(
      "Account created successfully! You can now log in."
    )

    // =========================================
    // MOVE TO LOGIN
    // =========================================

    setEmail(cleanEmail)
    setPassword(password)
    setConfirmPassword("")
    setIsLogin(true)
    setRememberMe(true)
  }

  // =========================================
  // LOGIN
  // =========================================

  
const handleLogin = () => {
  const cleanEmail = email.trim().toLowerCase()

  if (!cleanEmail || !password) {
    alert("Please enter your email and password.")
    return
  }

  // Read users from both storage locations
  const dravyagunaUsers = getDravyagunaUsers()
  const herbUsers = getHerbUsers()

  // Match common role variations
  const normalizeRole = (role) => {
    const value = (role || "").trim().toLowerCase()

    if (value === "doctor") return "doctor"
    if (value === "admin") return "admin"
    if (value === "ayurvedic reviewer" || value === "reviewer") {
      return "reviewer"
    }

    return value
  }

  const selectedNormalizedRole = normalizeRole(selectedRole)

  // Find matching email and role in the main user list
  let user = dravyagunaUsers.find((account) => {
    const accountEmail = (account.email || "").trim().toLowerCase()
    const accountRole = normalizeRole(account.role)

    return (
      accountEmail === cleanEmail &&
      accountRole === selectedNormalizedRole
    )
  })

  // If not found there, check the other user list
  if (!user) {
    user = herbUsers.find((account) => {
      const accountEmail = (account.email || "").trim().toLowerCase()
      const accountRole = normalizeRole(account.role)

      return (
        accountEmail === cleanEmail &&
        accountRole === selectedNormalizedRole
      )
    })
  }

  if (!user) {
    alert(
      `No ${getDisplayRole(selectedRole)} account found with this email. Please check your selected role or sign up first.`
    )
    return
  }

  // Check password
  if (user.password !== password) {
    alert("Incorrect password. Please try again.")
    return
  }

  // Check account status, if available
  const status = (user.status || "Active").trim().toLowerCase()

  if (status === "inactive" || status === "blocked") {
    alert("This account is blocked. Please contact the admin.")
    return
  }

  if (status === "pending") {
    alert("This account is pending approval. Please contact the admin.")
    return
  }

  const now = new Date().toISOString()

  // Update last active in the main user list if the account exists there
  const updatedUsers = dravyagunaUsers.map((account) => {
    const matchesEmail =
      (account.email || "").trim().toLowerCase() === cleanEmail

    const matchesRole =
      normalizeRole(account.role) === selectedNormalizedRole

    return matchesEmail && matchesRole
      ? { ...account, lastActive: now }
      : account
  })

  localStorage.setItem(
    "dravyaguna_users",
    JSON.stringify(updatedUsers)
  )

  const loggedInUser = {
    ...user,
    lastActive: now,
    role: getDisplayRole(user.role || selectedRole),
  }

  localStorage.setItem("herbUser", JSON.stringify(loggedInUser))
  localStorage.setItem("isAuthenticated", "true")

  if (rememberMe) {
    localStorage.setItem(
      "rememberedLogin",
      JSON.stringify({
        email: cleanEmail,
        password,
        role: selectedRole,
      })
    )
  } else {
    localStorage.removeItem("rememberedLogin")
  }

  if (selectedNormalizedRole === "doctor") {
    navigate("/doctor")
  } else if (selectedNormalizedRole === "admin") {
    navigate("/admin")
  } else {
    alert("This role does not have a configured destination.")
  }
}

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = (event) => {
    event.preventDefault()

    if (isLogin) {
      handleLogin()
    } else {
      handleSignUp()
    }
  }

  // =========================================
  // SWITCH TO LOGIN
  // =========================================

  const switchToLogin = () => {
    setIsLogin(true)

    const rememberedLogin =
      localStorage.getItem(
        "rememberedLogin"
      )

    if (!rememberedLogin) {
      setEmail("")
      setPassword("")
      setRememberMe(false)

      return
    }

    try {
      const savedLogin =
        JSON.parse(
          rememberedLogin
        )

      setEmail(
        savedLogin.email || ""
      )

      setPassword(
        savedLogin.password || ""
      )

      setRememberMe(true)

      if (savedLogin.role) {
        setSelectedRole(
          savedLogin.role.toLowerCase()
        )
      }
    } catch {
      localStorage.removeItem(
        "rememberedLogin"
      )

      setEmail("")
      setPassword("")
      setRememberMe(false)
    }
  }

  // =========================================
  // SWITCH TO SIGN UP
  // =========================================

  const switchToSignUp = () => {
    setIsLogin(false)

    setPassword("")
    setConfirmPassword("")
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="auth-page">

      {/* BACK TO HOME */}

      <Link
        to="/"
        className="back-home-button"
      >
        <span>‹</span>
        Back to home
      </Link>


      {/* BRAND */}

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


      {/* AUTH CARD */}

      <div className="auth-card">


        {/* LOGIN / SIGN UP */}

        <div className="auth-tabs">

          <button
            type="button"
            className={`auth-tab ${
              isLogin
                ? "active"
                : ""
            }`}
            onClick={switchToLogin}
          >
            Log In
          </button>


          <button
            type="button"
            className={`auth-tab ${
              !isLogin
                ? "active"
                : ""
            }`}
            onClick={switchToSignUp}
          >
            Sign Up
          </button>

        </div>


        {/* ROLE */}

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
                handleRoleChange(
                  "doctor"
                )
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
                handleRoleChange(
                  "admin"
                )
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


        {/* SIGN UP OPTIONS */}

        {!isLogin && (
          <>

            {/* LANGUAGE */}

            <div className="auth-field">

              <label htmlFor="language">
                Language
              </label>

              <select
                id="language"
                value={language}
                onChange={(event) =>
                  setLanguage(
                    event.target.value
                  )
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


            {/* PROFESSION */}

            {selectedRole ===
              "doctor" && (

              <div className="auth-field">

                <label htmlFor="profession">
                  Profession
                </label>

                <select
                  id="profession"
                  value={profession}
                  onChange={(event) =>
                    setProfession(
                      event.target.value
                    )
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


        {/* FORM */}

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
                  setFullName(
                    event.target.value
                  )
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
                setEmail(
                  event.target.value
                )
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
                  setPassword(
                    event.target.value
                  )
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
                  setShowPassword(
                    !showPassword
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword
                  ? "◉"
                  : "◌"}
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


          {/* REMEMBER ME */}

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


          {/* SUBMIT */}

          <button
            type="submit"
            className="auth-submit"
          >
            {isLogin
              ? "Log In"
              : "Create Account"}
          </button>

        </form>


        {/* BOTTOM SWITCH */}

        <div className="auth-switch">

          {isLogin ? (
            <>
              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={
                  switchToSignUp
                }
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
                onClick={
                  switchToLogin
                }
              >
                Log In
              </button>
            </>
          )}

        </div>

      </div>


      {/* DISCLAIMER */}

      <p className="auth-disclaimer">

        For qualified Ayurvedic physicians and licensed
        <br />
        healthcare professionals only.

      </p>

    </div>
  )
}

export default AuthPage