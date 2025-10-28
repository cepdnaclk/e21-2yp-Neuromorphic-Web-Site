// Logout functionality
function logout() {
  localStorage.removeItem("adminToken");
  authToken = null;
  showLoginPage();
}

// UI functions
function showLoginPage() {
  loginPage.classList.remove("hidden-section");
  adminPanel.classList.add("hidden-section");
  loginError.classList.add("hidden-section");
}

function showAdminPanel() {
  loginPage.classList.add("hidden-section");
  adminPanel.classList.remove("hidden-section");
  adminPanel.classList.add("show-flex");
  document.getElementById("adminName").textContent =
    localStorage.getItem("adminName") || "Admin";
}

function showLoading(show) {
  if (show) {
    loadingSpinner.classList.remove("hidden-section");
  } else {
    loadingSpinner.classList.add("hidden-section");
  }
}

function showLoginError(message) {
  loginError.textContent = message;
  loginError.classList.remove("hidden-section");
   loginError.style.opacity = "1";

   // Automatically fade out after 3 seconds
  setTimeout(() => {
    loginError.classList.add("fade-out");
    setTimeout(() => {
      loginError.classList.add("hidden-section");
      loginError.style.opacity = "0";
    }, 500); // matches the transition duration below
  }, 3000);
}


// Authentication functions
async function handleLogin(e) {
  e.preventDefault();
  showLoading(true);
  loginError.classList.add("hidden-section");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log(`Attempting login with: ${email} and ${password}`);

  try {
    console.log('try......');
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Response status:", response.status);

    const data = await response.json();
    console.log("Response data:", data);

    if (data.success && data.token) {
      console.log("Login successful, storing token");
      authToken = data.token;

      localStorage.setItem("adminToken", authToken);

      if (data.adminName) {
        localStorage.setItem("adminName", data.adminName);
      }

      showAdminPanel();
      loadDashboard();
    } else {
      console.log("Login failed:", data);
      showLoginError(data.error || "Invalid credentials. Please try again.");
    }
  } catch (error) {
    console.log("Login error:", error);
    showLoginError("Login failed. Please check your connection and try again.");
  } finally {
    showLoading(false);
  }
}
