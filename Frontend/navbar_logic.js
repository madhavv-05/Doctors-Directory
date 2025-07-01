function getBaseURL() {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://127.0.0.1:8000";
  } else {
    return "http://13.218.59.50";
  }
}

async function fetchDoctorProfileIfLoggedIn() {
  const token = localStorage.getItem("access");
  const navSection = document.getElementById("nav-user-section");

  if (!token || !navSection) return;

  try {
    const baseURL = getBaseURL();
    const response = await fetch(`${baseURL}/doctor/home/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Not logged in");

    const data = await response.json();

    navSection.innerHTML = `
      <a href="Issues.html" class="nav-link-navbar" style="margin-right: 15px;">Raise an Issue</a>
      <span style="margin-right: 15px;">Welcome, Dr. ${data.name}</span>
      <a href="#" class="auth-button-navbar" onclick="logout()">Logout</a>
    `;
  } catch (err) {
    console.warn("Token expired or invalid", err);
    localStorage.removeItem("access");
  }
}

function logout() {
  localStorage.removeItem("access");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", fetchDoctorProfileIfLoggedIn);
