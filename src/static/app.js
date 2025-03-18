document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const removeActivitySelect = document.getElementById("remove-activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <p><strong>Participants:</strong> ${
            details.participants.length > 0
              ? details.participants.join(", ")
              : "No participants yet"
          }</p>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);

        const option2 = document.createElement("option");
        option2.value = name;
        option2.textContent = name;
        removeActivitySelect.appendChild(option2);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  document.getElementById("remove-student-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    const email = document.getElementById("remove-email").value;
    const activity = document.getElementById("remove-activity").value;
    const removeMessage = document.getElementById("remove-message");
  
    try {
      // Send a DELETE request to the server
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const result = await response.json();
        removeMessage.textContent = result.message;
        removeMessage.classList.remove("hidden");
        removeMessage.classList.add("success");
      } else {
        const error = await response.json();
        removeMessage.textContent = error.message || "Failed to remove student.";
        removeMessage.classList.remove("hidden");
        removeMessage.classList.add("error");
      }
    } catch (err) {
      removeMessage.textContent = "An error occurred. Please try again.";
      removeMessage.classList.remove("hidden");
      removeMessage.classList.add("error");
    }
  });

  // Initialize app
  fetchActivities();
});

// Function to populate the activity dropdowns
async function populateActivityDropdowns() {
  const activityDropdown = document.getElementById("activity");
  const removeActivityDropdown = document.getElementById("remove-activity");

  try {
    // Fetch the list of activities from the server
    const response = await fetch("/api/activities");
    if (!response.ok) {
      throw new Error("Failed to fetch activities.");
    }

    const activities = await response.json();

    // Clear existing options
    activityDropdown.innerHTML = '<option value="">-- Select an activity --</option>';
    removeActivityDropdown.innerHTML = '<option value="">-- Select an activity --</option>';

    // Populate both dropdowns with activities
    activities.forEach((activity) => {
      const option = document.createElement("option");
      option.value = activity.id; // Use activity ID or name as the value
      option.textContent = activity.name;

      // Add the option to both dropdowns
      activityDropdown.appendChild(option.cloneNode(true));
      removeActivityDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading activities:", error);
  }
}

// Call the function to populate dropdowns on page load
document.addEventListener("DOMContentLoaded", populateActivityDropdowns);
