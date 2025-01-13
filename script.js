"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Dummy database (for demonstration purposes)
  const dummyDatabase = [
    {
      email: "user@example.com",
      password: "password123", // In a real scenario, passwords should be hashed
    },
    {
      email: "admin@example.com",
      password: "admin123",
    },
  ];

  // Validation messages
  const MESSAGES = {
    REQUIRED_EMAIL: "Please enter your email",
    REQUIRED_PASSWORD: "Please enter your password",
    INVALID_EMAIL: "Please enter a valid email address",
    INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  };

  // DOM Elements
  const form = document.getElementById("login-form");
  const inputs = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    keepMeLoggedIn: document.getElementById("keepMeLoggedIn"),
    togglePassword: document.getElementById("toggle-password"), // SVG for password visibility
  };

  // Utility: Display error message
  const showError = (input, message) => {
    const formGroup = input.closest(".form-group");
    const errorMessage = formGroup?.querySelector(".error-message");
    if (errorMessage) {
      input.classList.add("error");
      errorMessage.textContent = message;
      errorMessage.style.display = "block";
    }
  };

  // Utility: Hide error message
  const hideError = (input) => {
    const formGroup = input.closest(".form-group");
    const errorMessage = formGroup?.querySelector(".error-message");
    if (errorMessage) {
      input.classList.remove("error");
      errorMessage.style.display = "none";
    }
  };

  // Validation: Check if input is required
  const validateRequired = (input, message) => {
    const isValid = input.value.trim() !== "";
    isValid ? hideError(input) : showError(input, message);
    return isValid;
  };

  // Validation: Check email format
  const validateEmail = (input) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(input.value.trim());
    isValid ? hideError(input) : showError(input, MESSAGES.INVALID_EMAIL);
    return isValid;
  };

  // Validate credentials against the dummy database
  const validateCredentials = (email, password) => {
    const user = dummyDatabase.find((u) => u.email === email);
    if (user && user.password === password) {
      return true; // Valid credentials
    } else {
      return false; // Invalid credentials
    }
  };

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const isEmailValid =
      validateRequired(inputs.email, MESSAGES.REQUIRED_EMAIL) &&
      validateEmail(inputs.email);
    const isPasswordValid = validateRequired(
      inputs.password,
      MESSAGES.REQUIRED_PASSWORD
    );

    if (isEmailValid && isPasswordValid) {
      // Get the email and password from the form
      const email = inputs.email.value.trim();
      const password = inputs.password.value.trim();

      // Check credentials in the dummy database
      if (validateCredentials(email, password)) {
        alert("Login Successful!");

        // "Keep me logged in" functionality
        if (inputs.keepMeLoggedIn.checked) {
          // Store credentials in localStorage (only for demonstration purposes)
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("email", email);
          localStorage.setItem("password", password); // Don't store passwords like this in production
        }

        // Clear input fields after successful login
        inputs.email.value = "";
        inputs.password.value = "";

        // Reset floating label class
        document.querySelectorAll(".input-field").forEach((input) => {
          input.classList.remove("has-content");
        });

        // Redirect to a dashboard or home page (optional)
        window.location.href = "/dashboard"; // Redirect to your dashboard
      } else {
        alert(MESSAGES.INVALID_CREDENTIALS);
      }
    }
  };

  // Check if the user is already logged in by checking localStorage
  const checkLoginStatus = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      // Redirect to the dashboard or homepage if the user is logged in
      window.location.href = "/dashboard"; // Redirect to your dashboard
    }
  };

  // Handle logout and clear localStorage (for demonstration purposes)
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    window.location.href = "/login"; // Redirect to login page
  };

  // Set up real-time validation for inputs and toggle 'has-content' class
  document.querySelectorAll(".input-field").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        input.classList.add("has-content");
      } else {
        input.classList.remove("has-content");
      }
    });

    // On page load, check if the input already has content
    if (input.value.trim() !== "") {
      input.classList.add("has-content");
    }
  });

  // Initialize form submit event
  form.addEventListener("submit", handleFormSubmit);

  // Check login status when the page loads
  checkLoginStatus();

  // Password visibility toggle functionality
  document
    .getElementById("togglePassword")
    .addEventListener("click", function () {
      const passwordField = document.getElementById("password");
      const showIcon = document.getElementById("showIcon");
      const hideIcon = document.getElementById("hideIcon");

      if (passwordField.type === "password") {
        passwordField.type = "text"; // Show password
        showIcon.style.display = "none"; // Hide the show icon
        hideIcon.style.display = "block"; // Show the hide icon
      } else {
        passwordField.type = "password"; // Hide password
        showIcon.style.display = "block"; // Show the show icon
        hideIcon.style.display = "none"; // Hide the hide icon
      }
    });
});
