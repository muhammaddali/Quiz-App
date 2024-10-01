<template>
    <div class="container">
      <h2 class="my-4 text-center">Student Details</h2>
  
      <!-- Filter Dropdown -->
      <div class="row justify-content-center">
        <div class="col-md-4 mb-4">
          <label for="statusFilter" class="form-label">Filter by Status:</label>
          <select v-model="selectedStatus" @change="filterStudents" id="statusFilter" class="form-select">
            <option value="all">All</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
  
      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center">
        <p>Loading...</p>
      </div>
  
      <!-- No Data Found -->
      <div v-if="!loading && filteredStudents.length === 0" class="alert alert-info text-center">
        No students found with selected status.
      </div>
  
      <!-- Display Student Data in Table -->
      <div class="table-responsive">
        <table v-if="filteredStudents.length > 0" class="table table-striped table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in filteredStudents" :key="student.id">
              <td>{{ index + 1 }}</td>
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>
                <span :class="statusClass(student.status)">
                  {{ student.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  

  const students = ref([]);
  const filteredStudents = ref([]);
  const selectedStatus = ref("all");
  const loading = ref(true);
  
  
  const fetchStudents = async () => {
    try {
      loading.value = true;
      const response = await axios.get("http://192.168.15.205:8000/api/show-students");
      if (response && response.data && response.data.data) {
        students.value = response.data.data; 
        filteredStudents.value = students.value; 
      } else {
        console.error("Invalid API response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error.response ? error.response.data : error);
    } finally {
      loading.value = false;
    }
  };
  
 
  const filterStudents = () => {
    if (selectedStatus.value === "all") {
      filteredStudents.value = students.value; 
    } else {
      filteredStudents.value = students.value.filter(student => student.status === selectedStatus.value);
    }
  };
  
  
  const statusClass = (status) => {
    return {
      'text-success': status === 'accepted',
      'text-danger': status === 'rejected',
    };
  };
  
 
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
  
  /* Make table responsive on mobile */
  .table-responsive {
    overflow-x: auto;
  }
  
  @media (max-width: 768px) {
    /* Adjust table for smaller screens */
    .table thead {
      display: none;
    }
  
    .table tbody tr {
      display: block;
      margin-bottom: 15px;
    }
  
    .table tbody tr td {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border-top: none;
      border-bottom: 1px solid #dee2e6;
    }
  
    .table tbody tr td::before {
      content: attr(data-label);
      font-weight: bold;
    }
  }
  </style>
  