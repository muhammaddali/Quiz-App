<template>
  <div class="container">
    <h2 class="my-4">Assign Quizzes to Students</h2>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center">
      <p>Loading...</p>
    </div>

    <!-- Quizzes Table -->
    <div v-if="!loading && quizzes.length > 0">
      <h3>Select Quizzes</h3>
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th>Select</th>
            <th>Quiz Name</th>
            <th>Duration (mins)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="quiz in paginatedQuizzes" :key="quiz.id">
            <td>
              <input type="checkbox" v-model="selectedQuizzes" :value="quiz.id" />
            </td>
            <td>{{ quiz.quiz_name }}</td>
            <td>{{ quiz.duration }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination for Quizzes -->
      <div class="pagination-controls">
        <button class="btn btn-danger" @click="prevQuizPage" :disabled="currentQuizPage === 1">Previous</button>
        <span>Page {{ currentQuizPage }} of {{ totalQuizPages }}</span>
        <button class="btn btn-warning" @click="nextQuizPage" :disabled="currentQuizPage === totalQuizPages">Next</button>
      </div>
    </div>

    <!-- Students Table -->
    <div v-if="!loading && acceptedStudents.length > 0">
      <h3>Select Accepted Students</h3>
      <table class="table table-striped table-hover mt-4">
        <thead class="thead-dark">
          <tr>
            <th>Select</th>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in paginatedStudents" :key="student.id">
            <td>
              <input type="checkbox" v-model="selectedStudents" :value="student.id" />
            </td>
            <td>{{ student.id }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination for Students -->
      <div class="pagination-controls">
        <button class="btn btn-danger" @click="prevStudentPage" :disabled="currentStudentPage === 1">Previous</button>
        <span>Page {{ currentStudentPage }} of {{ totalStudentPages }}</span>
        <button class="btn btn-warning" @click="nextStudentPage" :disabled="currentStudentPage === totalStudentPages">Next</button>
      </div>
    </div>

    <!-- Assign Button -->
    <div class="mt-3">
      <button @click="assignQuizzes" class="btn btn-primary" :disabled="!selectedQuizzes.length || !selectedStudents.length">
        Assign Selected Quizzes to Selected Students
      </button>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="alert mt-3" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// State variables
const students = ref([]);
const quizzes = ref([]);
const loading = ref(true);
const selectedQuizzes = ref([]);
const selectedStudents = ref([]);
const message = ref('');
const messageType = ref('');

// Pagination state for quizzes
const currentQuizPage = ref(1);
const itemsPerQuizPage = 5; // Adjust as needed
const totalQuizPages = computed(() => Math.ceil(quizzes.value.length / itemsPerQuizPage));
const paginatedQuizzes = computed(() => {
  const start = (currentQuizPage.value - 1) * itemsPerQuizPage;
  return quizzes.value.slice(start, start + itemsPerQuizPage);
});

// Pagination state for students
const currentStudentPage = ref(1);
const itemsPerStudentPage = 5; // Adjust as needed
const totalStudentPages = computed(() => Math.ceil(acceptedStudents.value.length / itemsPerStudentPage));
const paginatedStudents = computed(() => {
  const start = (currentStudentPage.value - 1) * itemsPerStudentPage;
  return acceptedStudents.value.slice(start, start + itemsPerStudentPage);
});

// Fetch quizzes and students data
const fetchData = async () => {
  try {
    loading.value = true;
    const [studentsResponse, quizzesResponse] = await Promise.all([
      axios.get('http://192.168.15.205:8000/api/show-students'),
      axios.get('http://192.168.15.205:8000/api/show-quiz')
    ]);

    if (studentsResponse && studentsResponse.data && studentsResponse.data.data) {
      students.value = studentsResponse.data.data;
    }

    if (quizzesResponse && quizzesResponse.data && quizzesResponse.data.data) {
      quizzes.value = quizzesResponse.data.data;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
};

// Computed property to filter accepted students
const acceptedStudents = computed(() => {
  return students.value.filter(student => student.status === 'accepted');
});

// Assign quizzes to students
const assignQuizzes = async () => {
  if (selectedStudents.value.length === 0) {
    message.value = 'Please select at least one student.';
    messageType.value = 'danger';
    return;
  }

  if (selectedQuizzes.value.length === 0) {
    message.value = 'Please select at least one quiz.';
    messageType.value = 'danger';
    return;
  }

  try {
    // Prepare assignments
    const assignments = selectedStudents.value.flatMap(studentId => 
      selectedQuizzes.value.map(quizId => ({ studentId, quizId }))
    );

    const response = await axios.post('http://192.168.15.205:8000/api/assign-quiz', { assignments });

    if (response.data.success) {
      message.value = 'Quizzes assigned successfully!';
      messageType.value = 'success';
    } else {
      message.value = 'Failed to assign quizzes: ' + response.data.message;
      messageType.value = 'danger';
    }
  } catch (error) {
    console.error('Error assigning quizzes:', error);
    message.value = 'Error assigning quizzes: ' + (error.response ? error.response.data.message : 'Server not reachable');
    messageType.value = 'danger';
  } finally {
    // Clear selections after assignment
    selectedStudents.value = [];
    selectedQuizzes.value = [];
  }
};

// Pagination methods for quizzes
const prevQuizPage = () => {
  if (currentQuizPage.value > 1) currentQuizPage.value--;
};

const nextQuizPage = () => {
  if (currentQuizPage.value < totalQuizPages.value) currentQuizPage.value++;
};

// Pagination methods for students
const prevStudentPage = () => {
  if (currentStudentPage.value > 1) currentStudentPage.value--;
};

const nextStudentPage = () => {
  if (currentStudentPage.value < totalStudentPages.value) currentStudentPage.value++;
};

// Fetch data on component mount
onMounted(() => {
  fetchData();
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

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>
