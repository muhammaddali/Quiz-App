<template>
    <div class="container">
      <h2 class="my-4">Student Details</h2>
  
      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center">
        <p>Loading...</p>
      </div>
  
      <!-- No Data Found -->
      <div v-if="!loading && paginatedStudents.length === 0" class="alert alert-info">
        No student data available.
      </div>
  
      <!-- Display Student Data in Table -->
      <table v-if="paginatedStudents.length > 0" class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in paginatedStudents" :key="student.id">
            <td>{{ (currentPage - 1) * studentsPerPage + index + 1 }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>
              <span :class="statusClass(student.status)">
                {{ student.status.toUpperCase() }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Pagination Controls -->
      <nav v-if="totalPages > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage" :disabled="currentPage === 1">Previous</button>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import axios from "axios";
  
  // State to hold student data
  const students = ref([]);
  const loading = ref(true);
  
  // Pagination state
  const currentPage = ref(1);
  const studentsPerPage = 5; // Set how many students to show per page
  
  // Fetch student data from API
  const fetchStudents = async () => {
    try {
      loading.value = true; // Show loading state
      const response = await axios.get("http://192.168.15.205:8000/api/show-students");
  
      // Check if response has valid data
      if (response && response.data && response.data.data) {
        students.value = response.data.data; // Store students data
      } else {
        console.error("Invalid API response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching student data:", error.response ? error.response.data : error);
    } finally {
      loading.value = false; // Hide loading state
    }
  };
  
  // Computed property for paginated students
  const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * studentsPerPage;
    const end = start + studentsPerPage;
    return students.value.slice(start, end);
  });
  
  // Total number of pages
  const totalPages = computed(() => {
    return Math.ceil(students.value.length / studentsPerPage);
  });
  
  // Pagination methods
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  
  const goToPage = (page) => {
    currentPage.value = page;
  };
  
  // Class binding for status
  const statusClass = (status) => {
    return {
      'text-success': status === 'accepted',
      'text-danger': status === 'rejected',
      'text-warning': status === 'pending',
      'font-weight-bold': true, // Bold
      'text-uppercase': true // Uppercase
    };
  };
  
  // Fetch student data on component mount
  onMounted(() => {
    fetchStudents();
  });
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
    background-color: white;
  }
  
  .thead-dark {
    background-color: #343a40;
    color: white;
  }
  
  .text-success {
    color: #28a745;
  }
  
  .text-danger {
    color: #dc3545;
  }
  
  .text-warning {
    color: #ffc107;
  }
  
  /* Ensuring bold and uppercase */
  .font-weight-bold {
    font-weight: bold;
  }
  
  .text-uppercase {
    text-transform: uppercase;
  }
  
  .pagination {
    margin-top: 20px;
  }
  
  .page-item.active .page-link {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
  </style>
  