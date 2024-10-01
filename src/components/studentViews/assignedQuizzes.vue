<template>
    <div class="container mt-5">
      <div class="card shadow-lg">
        <div class="card-header bg-primary text-white">
          <h3 class="mb-0">{{ quizData.quiz.title }}</h3>
        </div>
        <div class="card-body">
          <h5 class="card-title">Assigned to: {{ quizData.student.name }}</h5>
          <p class="card-text"><strong>Description:</strong> {{ quizData.quiz.description }}</p>
  
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Schedule Date:</strong> {{ formatDate(quizData.quiz.schedule_date) }}
            </li>
            <li class="list-group-item">
              <strong>Expiration Date:</strong> {{ formatDate(quizData.quiz.expiration_date) }}
            </li>
          </ul>
        </div>
        <div class="card-footer text-muted text-end">
          <small>Created at: {{ formatDate(quizData.quiz.created_at) }}</small>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';  // Make sure axios is installed
  
  // Placeholder to store the quiz data
  const quizData = ref({
    quiz: {
      title: "",
      description: "",
      schedule_date: "",
      expiration_date: "",
      created_at: ""
    },
    student: {
      name: ""
    }
  });
  
  // Function to format dates
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };
  
  // Fetch data from API when the component is mounted
  onMounted(async () => {
    try {
      const response = await axios.get('YOUR_API_URL_HERE');  // Replace with your API URL
      quizData.value = response.data;
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
  }
  .card {
    border-radius: 10px;
  }
  .card-header {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  </style>
  