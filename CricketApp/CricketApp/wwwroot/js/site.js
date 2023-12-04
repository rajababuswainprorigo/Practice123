// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
//rajababu swain
// wwwroot/js/site.js

// Import necessary CSS classes for animation
const SUCCESS_ANIMATION_CLASS = "animate-success";
const ERROR_ANIMATION_CLASS = "animate-error";

function toggleAnimation(element, className) {
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, 1000);
}

function validateLogin() {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginMessage = document.getElementById("loginMessage");

  // Validate email format
  if (!isValidEmail(email)) {
    loginMessage.innerText = "Please enter a valid email address.";
    setDynamicColor(loginMessage, "#dc3545");
    toggleAnimation(loginMessage, ERROR_ANIMATION_CLASS);
    return;
  }

  // Send AJAX request for authentication
  fetch("/Login/ValidateCredentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Server response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.isSuccess) {
        // User authentication successful
        loginMessage.innerText = "Login successful!";
        setDynamicColor(loginMessage, "#007bff");
        toggleAnimation(loginMessage, SUCCESS_ANIMATION_CLASS);

        // Redirect to the appropriate page based on user role
        if (data.userRole === "Admin") {
          window.location.href = "/Admin/Index";
        } else if (data.userRole === "User") {
          window.location.href = "/User/Index";
        } else {
          // Handle invalid role
          showMessage("Invalid user role");
        }
      } else {
        // Invalid credentials or other errors
        loginMessage.innerText = data.errorMessage || "Invalid credentials. Please try again.";
        setDynamicColor(loginMessage, "#dc3545");
        toggleAnimation(loginMessage, ERROR_ANIMATION_CLASS);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      loginMessage.innerText = "An error occurred. Please try again.";
      setDynamicColor(loginMessage, "#dc3545");
      toggleAnimation(loginMessage, ERROR_ANIMATION_CLASS);
    });
}

function setDynamicColor(element, color) {
  element.style.color = color;
}

function isValidEmail(email) {
  // Implement more robust email validation if needed
  return email.checkValidity();
}
