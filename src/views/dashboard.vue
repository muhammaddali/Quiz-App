<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import navBar from '@/components/navBar.vue';
import { useApplicationsStore } from '../stores/counter';

const store = useApplicationsStore();
const user = ref(null);
const isCollapsed = ref(false); // Sidebar collapse state
const loading = ref(true);
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
  supervisor: [
    { path: '/dashboard/supViewStuds', icon: 'fas fa-thumbs-up', label: 'View Students' },
    { path: '/dashboard/supEditStudDetails', icon: 'fas fa-eye', label: 'Edit Student Details' },


  ],
};

const getLinksByRole = (role) => {
  return roleLinks[role] || [];
};

const saveUserRoleToLocalStorage = (user) => {
  if (user && user.role) {
    localStorage.setItem('userRole', user.role); // Store user role in localStorage
  }
};

const loadUserRoleFromLocalStorage = () => {
  const storedRole = localStorage.getItem('userRole');
  if (storedRole) {
    return storedRole;
  }
  return null; // Return null if no role found
};

onMounted(async () => {
  if (store.isLoggedIn) {
    const storedRole = loadUserRoleFromLocalStorage();
    user.value = {
      ...store.user,
      role: storedRole || store.role || 'guest',
    };
    saveUserRoleToLocalStorage(user.value);
    loading.value = false;
  } else {
    router.push('/login');
  }
});

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <div>
    <navBar :user-role="user?.role" />
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar Section -->
        <div :class="['sidebar-container', { 'collapsed': isCollapsed }]" style="padding-left: 0">
          <aside class="sidebar bg-dark p-3" v-if="user && !loading">
            <h5 class="text-warning" v-if="!isCollapsed"> {{ user.role || 'Role not defined' }}</h5>
            <ul class="list-group" v-if="!isCollapsed">
              <template v-for="link in getLinksByRole(user.role)" :key="link.path">
                <router-link :to="link.path" class="list-group-item list-group-item-action">
                  <i :class="link.icon"></i> {{ link.label }}
                </router-link>
              </template>
            </ul>
          </aside>
        </div>

        <!-- Main Content Section -->
        <div :class="['main-content-container', { 'collapsed': isCollapsed }, 'bg-white']">
          <main class="main-content p-4" v-if="user && !loading">
            <button class="btn btn-outline-primary toggle-button" @click="toggleSidebar" aria-label="Toggle Sidebar">
              <i :class="isCollapsed ? 'fas fa-bars' : 'fas fa-times'"></i>
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
  padding: 0;
  height: 100vh;
  /* Ensure full height */
  overflow: auto;
  /* Allow scrolling */
}

.row {
  margin: 0;
}

.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  /* Full height */
  width: 250px;
  /* Sidebar width */
  z-index: 1000;
  transition: all 0.3s ease;
  overflow-y: auto;
  /* Allow scrolling in sidebar */
}

.main-content-container {
  margin-left: 250px;
  /* Margin for the sidebar */
  width: calc(100% - 250px);
  /* Main content width */
  min-height: 100vh;
  /* Ensure full height */
  padding-top: 0;
  transition: margin-left 0.3s ease, width 0.3s ease;
  overflow-y: auto;
  /* Allow scrolling in main content */
}

.collapsed.sidebar-container {
  width: 0;
  /* Sidebar width when collapsed */
}

.collapsed.main-content-container {
  margin-left: 0;
  /* Main content full width when collapsed */
  width: 100%;
  /* Full width for main content */
}

.sidebar {
  height: 100vh;
  /* Full height */
}

.toggle-button {
  font-size: 24px;
  position: fixed;
  top: 20px;
  /* Adjusted to avoid overlap */
  left: 10px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 2000;
}

h4,
h5 {
  margin-top: 20px;
  /* Adjusted to avoid overlap with toggle button */
}

.list-group-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #0c2339;
  color: #ffffff;
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
}

.list-group-item:hover {
  background-color: #007bff;
  color: white;
}

.list-group-item i {
  margin-right: 10px;
  font-size: 18px;
}

.list-group-item-action {
  border-radius: 5px;
}

.list-group-item+.list-group-item {
  margin-top: 30px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    height: auto;
    /* Adjust height to auto for mobile */
    width: 100%;
    /* Full width for mobile */
    overflow-y: auto;
    /* Allow scrolling in sidebar */
  }

  .main-content-container {
    margin-left: 0;
    /* Main content full width on mobile */
    width: 100%;
    /* Full width for main content */
  }

  .collapsed.sidebar-container {
    width: 0;
    /* Hide sidebar */
  }

  .collapsed.main-content-container {
    margin-left: 0;
    /* Adjust content margin when collapsed */
  }
}

@media (min-width: 769px) {
  .sidebar-container {
    display: block;
    /* Show the sidebar on tablet and larger screens */
    width: 250px;
    /* Ensure the sidebar is at its full width */
  }

  .collapsed.sidebar-container {
    display: block;
    /* Ensure the sidebar still occupies space when collapsed */
    width: 0;
    /* Prevent the sidebar from showing */
  }

  .main-content-container {
    margin-left: 250px;
    /* Ensure the main content margin is adjusted */
    width: calc(100% - 250px);
    /* Adjust main content width */
  }
}
</style>
