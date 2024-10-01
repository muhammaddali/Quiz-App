<template>
    <div class="container mt-5">
      <!-- Header Section -->
      <h2 class="text-center mb-4">Manage Quizzes</h2>
  
      <!-- Quizzes List -->
      <div v-if="quizzes.length > 0">
        <div class="card mb-4" v-for="(quiz, index) in quizzes" :key="quiz.id">
          <div class="card-header d-flex justify-content-between">
            <h4>Quiz ID: {{ quiz.quizId }} ({{ quiz.questions.length }} Questions)</h4>
            <button class="btn btn-info" @click="toggleQuizDetails(index)">
              {{ quiz.showDetails ? 'Hide' : 'Show' }} Details
            </button>
          </div>
          
          <!-- Quiz details toggle -->
          <div v-if="quiz.showDetails" class="card-body">
            <ul class="list-group mb-3">
              <li v-for="(question, qIndex) in quiz.questions" :key="qIndex" class="list-group-item">
                <strong>Question {{ qIndex + 1 }}: </strong> {{ question.questionText }}
                <ul>
                  <li v-for="(option, optIndex) in question.answerOptions" :key="optIndex">
                    Option {{ optIndex + 1 }}: {{ option }}
                  </li>
                </ul>
              </li>
            </ul>
  
            <!-- Assign Quiz to Students -->
            <div class="assign-quiz-section">
              <h5>Assign Quiz to Students:</h5>
              <div class="form-group">
                <label for="selectStudent">Select Student:</label>
                <select v-model="selectedStudents[index]" class="form-control">
                  <option v-for="student in students" :key="student.id" :value="student.id">
                    {{ student.name }}
                  </option>
                </select>
              </div>
              <button class="btn btn-success mt-3" @click="assignQuizToStudent(index, quiz)">
                Assign Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- No quizzes available message -->
      <div v-else>
        <p class="text-center">No quizzes available. Please create quizzes first.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Sample data for quizzes (you'll replace this with data from your API)
  const quizzes = ref([
    {
      quizId: 'quiz1',
      questions: [
        { questionText: 'What is Vue.js?', answerOptions: ['Framework', 'Library', 'Language', 'Tool'] },
        { questionText: 'What is React?', answerOptions: ['Framework', 'Library', 'Language', 'Tool'] }
      ],
      showDetails: false
    },
    {
      quizId: 'quiz2',
      questions: [
        { questionText: 'What is JavaScript?', answerOptions: ['Language', 'Library', 'Framework', 'Tool'] },
        { questionText: 'What is Python?', answerOptions: ['Language', 'Library', 'Framework', 'Tool'] }
      ],
      showDetails: false
    }
  ]);
  
  // Sample data for accepted students (replace with data from API)
  const students = ref([
    { id: 'student1', name: 'Talha' },
    { id: 'student2', name: 'Tayab' },
    { id: 'student3', name: 'Ali' }
  ]);
  
  // For tracking selected students for each quiz
  const selectedStudents = ref(new Array(quizzes.value.length).fill(''));
  
  // Toggle quiz details visibility
  const toggleQuizDetails = (index) => {
    quizzes.value[index].showDetails = !quizzes.value[index].showDetails;
  };
  
  // Assign quiz to student
  const assignQuizToStudent = (quizIndex, quiz) => {
    const selectedStudentId = selectedStudents.value[quizIndex];
    
    if (!selectedStudentId) {
      alert("Please select a student to assign the quiz.");
      return;
    }
  
    // This is where you'll call the API to assign the quiz to the selected student
    console.log(`Assigning quiz ${quiz.quizId} to student ID: ${selectedStudentId}`);
  
    alert(`Quiz "${quiz.quizId}" assigned to the selected student successfully!`);
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 900px;
    margin: auto;
  }
  
  h2 {
    color: #343a40;
  }
  
  .card {
    border: 1px solid #ced4da;
  }
  
  .card-header {
    background-color: #f8f9fa;
  }
  
  .assign-quiz-section {
    margin-top: 20px;
  }
  
  .btn {
    width: 100px;
  }
  </style>
  