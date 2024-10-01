<template>
  <div class="container my-4">
    <div class="card shadow-sm border-0 p-3">
      <h1 class="text-center mb-3 display-6">Add Users</h1>

      <!-- User Table -->
      <div class="table-responsive">
        <table class="table table-hover table-striped text-center">
          <thead class="bg-primary text-white">
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in paginatedUsers" :key="user.id">
              <td>{{ (currentPage - 1) * usersPerPage + (index + 1) }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td> <!-- Ensure email is displayed -->
              <td>{{ user.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="d-flex justify-content-center my-3">
        <button
          class="btn btn-danger me-2"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          class="btn btn-warning ms-2"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>

      <!-- Button to show form to add user -->
      <div class="d-flex justify-content-center my-3">
        <button @click="showForm = !showForm" class="btn btn-danger animated-link btn-sm">
          <i :class="showForm ? 'fas fa-times-circle' : 'fas fa-plus-circle'"></i>
          {{ showForm ? '✖' : 'Add' }}
        </button>
      </div>

      <!-- Add User Form -->
      <div v-if="showForm" class="row justify-content-center">
        <div class="col-md-10 col-lg-8 col-sm-12">
          <div class="card shadow-sm p-3">
            <h2 class="text-center mb-3">Add a New User</h2>
            <form @submit.prevent="addUser">
              <div class="form-floating mb-2">
                <input
                  v-model="userName"
                  type="text"
                  class="form-control form-control-sm"
                  id="name"
                  placeholder="Enter user name"
                  required
                />
                <label for="name">User Name</label>
              </div>
              <div class="form-floating mb-2">
                <input
                  v-model="userEmail"
                  type="email"
                  class="form-control form-control-sm"
                  id="email"
                  placeholder="Enter user email"
                  required
                />
                <label for="email">User Email</label>
              </div>
              <div class="mb-2">
                <label for="role" class="form-label">User Role</label>
                <select v-model="userRole" class="form-select form-select-sm" id="role" @change="updateRoleLabel" required>
                  <option value="" disabled>Select Role</option>
                  <option value="manager">Manager</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </div>
              <!-- Role Notification -->
              <p v-if="roleLabel" class="text-info text-center">Selected Role: {{ roleLabel }}</p>
              <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-success btn-sm">
                  <i class="fas fa-check-circle"></i> Add User
                </button>
              </div>
              <p v-if="errorMessage" class="text-danger text-center mt-2">{{ errorMessage }}</p>
              <p v-if="successMessage" class="text-success text-center mt-2">{{ successMessage }}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Store users and form state
const users = ref([]);
const showForm = ref(false);
const userName = ref('');
const userEmail = ref('');
const userRole = ref('');
const roleLabel = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const currentPage = ref(1);
const usersPerPage = ref(5); // Change this value to show more or fewer users per page

// Function to save users to localStorage
const saveUsersToLocalStorage = () => {
  localStorage.setItem('users', JSON.stringify(users.value));
};

// Function to load users from localStorage
const loadUsersFromLocalStorage = () => {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    users.value = JSON.parse(storedUsers);
  }
};

// Function to fetch users from API
const fetchUsers = async () => {
  try {
    const response = await axios.get('http://192.168.15.205:8000/api/show-roles');
    users.value = response.data.data; // Update users list
    saveUsersToLocalStorage(); // Save the fetched users in localStorage
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Load applications from localStorage (if any)
const loadApplicationsFromLocalStorage = () => {
  const storedApplications = localStorage.getItem('applications');
  if (storedApplications) {
    users.value = JSON.parse(storedApplications);
  }
};

// Function to save applications to localStorage
const saveApplicationsToLocalStorage = () => {
  localStorage.setItem('applications', JSON.stringify(users.value));
};

// Function to update role label based on selection
const updateRoleLabel = () => {
  roleLabel.value = userRole.value.charAt(0).toUpperCase() + userRole.value.slice(1);
};

// Function to add a user
const addUser = async () => {
  if (!userName.value || !userEmail.value || !userRole.value) {
    errorMessage.value = 'Name, email, and role are required';
    return;
  }

  try {
    const newUser = {
      name: userName.value,
      email: userEmail.value,
      role: userRole.value
    };

    // Retrieve token from localStorage
    const token = localStorage.getItem('token'); // Assumes token is stored in localStorage after admin login

    // Ensure the token is present
    if (!token) {
      errorMessage.value = 'Unauthorized: Token is missing';
      return;
    }

    // Set up Axios configuration with Authorization header
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    // Send POST request with the token in headers
    const response = await axios.post('http://192.168.15.205:8000/api/add-role', newUser, config);
    
    if (response.data.success) {
      // Reset form fields
      userName.value = '';
      userEmail.value = '';
      userRole.value = '';
      roleLabel.value = '';
      errorMessage.value = '';
      successMessage.value = 'User added successfully!';
      showForm.value = false;

      // Add new user locally and save to localStorage
      users.value.push(newUser);
      saveUsersToLocalStorage();  // Save users after addition
      currentPage.value = Math.ceil(users.value.length / usersPerPage.value); // Update to the last page
    } else {
      errorMessage.value = response.data.message;
      successMessage.value = '';
    }
  } catch (error) {
    console.error('Error adding user:', error);
    errorMessage.value = 'Failed to add user';
    successMessage.value = '';
  }
};

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(users.value.length / usersPerPage.value));
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage.value;
  return users.value.slice(start, start + usersPerPage.value);
});

// Fetch users on component mount
onMounted(() => {
  loadUsersFromLocalStorage();  // Load users from localStorage first
  loadApplicationsFromLocalStorage(); // Load applications from localStorage
  
  // If no users in localStorage, fetch from API
  if (users.value.length === 0) {
    fetchUsers();
  }
});
</script>

<style scoped>
.container {
  max-width: 900px;
}
.card {
  border-radius: 10px;
}
.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.1); /* Optional: Highlight row on hover */
}
</style>
