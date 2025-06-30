const host = window.location.hostname;

export const API_BASE_URL = 
  host === "localhost" || host === "127.0.0.1" || host === "accounts.google.com"
    ? "http://127.0.0.1:8000" // Local Django backend
<<<<<<< HEAD
    : "https://45b5-13-218-59-50.ngrok-free.app"; // Production backend
=======
    :    "https://45b5-13-218-59-50.ngrok-free.app"; // ngrok HTTPS tunnel URL
 // Production backend
>>>>>>> 7f0df097ec07faef7577ad96424b6431147f597a
