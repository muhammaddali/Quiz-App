<template>
    <div>
      <h1>Supervisor Panel: Edit Student Details</h1>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in paginatedStudents" :key="student.id">
            <td>
              <input v-model="student.id" class="form-control" disabled />
            </td>
            <td>
              <input v-model="student.name" class="form-control" />
            </td>
            <td>
              <input v-model="student.email" class="form-control" />
            </td>
            <td>
              <button class="btn btn-primary" @click="updateStudent(student)">
                Save
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Pagination Controls -->
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage" :disabled="currentPage === 1">Previous</button>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
          </li>
        </ul>
      </nav>
  
      <!-- Display success or error messages -->
      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    data() {
      return {
        students: [],
        currentPage: 1,
        studentsPerPage: 5, // Number of students per page
        successMessage: '',
        errorMessage: '',
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.students.length / this.studentsPerPage);
      },
      paginatedStudents() {
        const start = (this.currentPage - 1) * this.studentsPerPage;
        const end = start + this.studentsPerPage;
        return this.students.slice(start, end);
      },
    },
    methods: {
      fetchStudents() {
        axios
          .get("http://192.168.15.205:8000/api/show-students")
          .then((response) => {
            if (response.data.success) {
              this.students = response.data.data;
            }
          })
          .catch((error) => {
            console.error("Error fetching students:", error);
          });
      },
      updateStudent(student) {
        axios
          .put(`http://192.168.15.205:8000/api/update-student/${student.id}`, {
            name: student.name,
            email: student.email,
          })
          .then((response) => {
            if (response.data.success) {
              this.successMessage = "Student updated successfully!";
              this.errorMessage = "";
              this.fetchStudents(); // Optionally, refresh the student list
            } else {
              this.errorMessage = "Failed to update student.";
              this.successMessage = "";
            }
          })
          .catch((error) => {
            console.error("Error updating student:", error);
            this.errorMessage = "An error occurred while updating.";
            this.successMessage = "";
          });
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      goToPage(page) {
        this.currentPage = page;
      },
    },
    mounted() {
      this.fetchStudents();
    },
  };
  </script>
  
  <style scoped>
  .table {
    width: 100%;
    border: 1px solid #ccc;
  }
  .form-control {
    width: 100%;
  }
  .btn {
    margin-top: 10px;
  }
  .alert {
    margin-top: 20px;
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .page-item.disabled .page-link {
    pointer-events: none;
    opacity: 0.5;
  }
  .page-item.active .page-link {
    background-color: #007bff;
    color: white;
  }
  </style>
  