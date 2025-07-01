import { API_BASE_URL } from './config.js';

async function fetchDoctorProfileIfLoggedIn() {
  const token = localStorage.getItem("access");
  const navSection = document.getElementById("nav-user-section");

  if (!token || !navSection) return;

  try {
    const baseURL = API_BASE_URL
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

document.addEventListener("DOMContentLoaded", fetchDoctorProfileIfLoggedIn);