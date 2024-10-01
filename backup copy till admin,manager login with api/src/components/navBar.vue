<template>
  <nav class="navbar navbar-light bg-dark fixed-top">
      <div class="container-fluid px-4">

         <!-- Display username (Left side) -->
      <span v-if="isLoggedIn" class="navbar-text ms-auto  text-white fs-4">
        Welcome: <strong class="text-warning fs-4">{{ userName.toUpperCase() }}</strong>
      </span>
          <!-- Logout button (Right side) only visible if logged in -->
          <button v-if="isLoggedIn" class="btn btn-danger ms-auto animated-link" @click="logout">
              Logout
          </button>
      </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicationsStore } from '../stores/counter'; // Adjust the path accordingly

// Using Vue Router to handle logout navigation
const router = useRouter();
const store = useApplicationsStore(); // Access the store

// Computed property for reactive login status
const isLoggedIn = computed(() => store.isLoggedIn);

const userName = computed(() => {
  const storedUser = JSON.parse(localStorage.getItem('user')); // Retrieve user object from localStorage
  return storedUser?.name || 'Guest'; // Use 'Guest' as a fallback if no name is found
});

const logout = () => {
  // Clear any user-related data (from localStorage or state)
  store.logout(); // Ensure you have this method in your store to handle logout
  localStorage.removeItem('user'); // Clear user info from local storage if applicable
  localStorage.removeItem('userRole');
  localStorage.removeItem('users');
  // Redirect to the login page or landing page after logout
  router.push('/login');
};
</script>

<style scoped>
/* Ensure the navbar spans the full width and stays fixed at the top */
.navbar {
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* Make sure the container-fluid takes the full width */
.container-fluid {
  max-width: 100%;
}

/* Add margin to push the logout button to the right */
.ms-auto {
  margin-left: auto;
}

/* Optional: Adjustments for smaller screens */
@media (max-width: 768px) {
  .btn-outline-danger {
      margin-top: 0; /* Keep it aligned at the top without extra margin */
  }
}
</style>
