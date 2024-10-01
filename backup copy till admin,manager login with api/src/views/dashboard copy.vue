<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import navBar from '@/components/navBar.vue';

const user = ref(null);
const isCollapsed = ref(false);
const loading = ref(true); // Add loading state
const router = useRouter();

const roleLinks = {
  student: [
    { path: '/dashboard/assignedQuizzes', icon: 'fas fa-clipboard-check', label: 'Assigned Quizzes' },
    { path: '/dashboard/pendingQuizzes', icon: 'fas fa-hourglass-half', label: 'Pending Quizzes' },
    { path: '/dashboard/attemptedQuizzes', icon: 'fas fa-check-circle', label: 'Attempted Quizzes' },
    { path: '/dashboard/viewQuizResult', icon: 'fas fa-chart-line', label: 'View Quiz Results' },
  ],
  admin: [
    { path: '/dashboard/addManager', icon: 'fas fa-user-plus', label: 'Add Managers' },
    { path: '/dashboard/studentRequests', icon: 'fas fa-clipboard-list', label: 'View/Accept/Reject Student Requests' },
    { path: '/dashboard/assignQuizzes', icon: 'fas fa-tasks', label: 'Assign Quizzes' },
    { path: '/dashboard/adminViewQuizResults', icon: 'fas fa-chart-line', label: 'Admin View Quiz Results' },
  ],
  manager: [
    { path: '/dashboard/mangAssignQuizzes', icon: 'fas fa-tasks', label: 'Assign Quizzes' },
    { path: '/dashboard/mangViewDetails', icon: 'fas fa-chart-line', label: 'View Student Details and Quizzes' },
  ],
};

const getLinksByRole = (role) => {
  return roleLinks[role] || [];
};

onMounted(() => {
  const loggedInUser = localStorage.getItem('user');
  loading.value = false; // End loading state

  if (loggedInUser) {
    user.value = JSON.parse(loggedInUser);
  } else {
    router.push('/login'); // Redirect to login if no user found
  }
});
</script>

<template>
  <div>
    <navBar />
    <div class="container-fluid">
      <div class="row">
        <div class="col-3 sidebar-container" style="padding-left: 0">
          <aside class="sidebar bg-dark p-3" v-if="user && !loading">
            <h4 class="text-warning animated-link" v-if="!isCollapsed">Role: {{ user.role }}</h4>

            <ul class="list-group" v-if="!isCollapsed">
              <template v-for="link in getLinksByRole(user.role)" :key="link.path">
                <router-link :to="link.path" class="list-group-item list-group-item-action">
                  <i :class="link.icon"></i> {{ link.label }}
                </router-link>
              </template>
            </ul>
          </aside>
        </div>

        <div class="col-9 main-content-container bg-white">
          <main class="main-content p-4" v-if="user && !loading">
            <button class="btn btn-outline-primary toggle-button d-md-none" @click="toggleSidebar">
              <span v-if="isCollapsed">☰</span>
              <span v-else>✖</span>
            </button>
            <router-view />
          </main>

          <main class="main-content p-4" v-else>
            <p v-if="loading">Loading user data...</p>
            <p v-else>No user data found. Redirecting to login...</p>
            <router-link to="/login" class="btn btn-danger">Go to Login</router-link>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-fluid {
  padding: 0; /* Remove any container padding */
}

.row {
  margin: 0; /* Remove margin from the row */
}

.sidebar-container {
  position: fixed; /* Fix sidebar to the left */
  top: 0;
  left: 0;
  height: 100vh; /* Full screen height */
  width: 250px; /* Sidebar width */
  z-index: 1000;
}

.main-content-container {
  margin-left: 250px; /* Adjust margin to match sidebar width */
  width: calc(100% - 250px); /* Take the remaining width of the screen */
  min-height: 100vh; /* Ensure full height */
  padding-top: 0; /* Remove top padding */
}

.main-content {
  padding: 20px; /* Optional padding for the main content */
}

.sidebar {
  width: 250px;
  height: 100vh; /* Full height for the sidebar */
  transition: all 0.3s ease;
}

.sidebar.collapsed {
  width: 0;
  overflow: hidden;
}

.toggle-button {
  font-size: 24px;
  position: fixed;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 2000;
}

@media (max-width: 425px) {
  .main-content-container {
    margin-left: 0; /* Remove margin on smaller screens */
    width: 100%; /* Full width on smaller screens */
  }

  .sidebar {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    transform: translateX(-100%);
  }
}

.list-group-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #0c2339; /* Light background */
  color: #ffffff; /* Dark text */
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
}

.list-group-item:hover {
  background-color: #007bff; /* Hover effect */
  color: white; /* Text color on hover */
}

.list-group-item i {
  margin-right: 10px;
  font-size: 18px; /* Icon size */
}

.list-group-item-action {
  border-radius: 5px; /* Rounded corners */
}

.list-group-item + .list-group-item {
  margin-top: 30px; /* Spacing between list items */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .list-group-item {
    font-size: 14px; /* Smaller font on mobile */
    padding: 8px 16px;
  }

  .list-group-item i {
    font-size: 16px; /* Smaller icon size on mobile */
  }
}
</style>
