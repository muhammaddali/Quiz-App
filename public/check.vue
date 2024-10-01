<template>

  <div class="quiz-container">

    <h3>Create Your Quiz</h3>


    <!-- Quiz Name Input -->

    <div class="input-group">

      <label for="quizName">Quiz Name:</label>

      <input type="text" v-model="quizStore.quizName" placeholder="Enter Quiz Name" />

      <span v-if="errors.quiz_name" class="error">{{ errors.quiz_name[0] }}</span>

    </div>


    <!-- Duration Input -->

    <div class="input-group">

      <label for="duration">Duration (in minutes):</label>

      <input type="number" v-model="quizStore.duration" placeholder="Enter duration" />

      <!-- Duration ke liye koi error nahi, aap yahan add kar sakte hain agar zarurat ho -->

    </div>


    <!-- Total Marks Input -->

    <div class="input-group">

      <label for="totalMarks">Total Marks:</label>

      <input type="number" v-model="quizStore.totalMarks" @input="generateQuestions" placeholder="Enter total marks" />

      <span v-if="errors.total_marks" class="error">{{ errors.total_marks[0] }}</span>

    </div>


    <!-- Questions Section -->

    <div v-if="quizStore.questions.length > 0" class="question-section">

      <h4>Question {{ currentQuestionIndex + 1 }} of {{ quizStore.totalMarks }}</h4>

      <div class="input-group">

        <label for="question">Question:</label>

        <input type="text" v-model="quizStore.questions[currentQuestionIndex].text" placeholder="Enter your question" />

        <span v-if="errors[`questions.${currentQuestionIndex}.question`]" class="error">{{
          errors[`questions.${currentQuestionIndex}.question`][0] }}</span>

      </div>


      <label>Options:</label>

      <div class="options-container">

        <div v-for="(option, i) in 4" :key="i" class="option-group">

          <input type="text" :placeholder="'Option ' + (i + 1)"
            v-model="quizStore.questions[currentQuestionIndex].options[i]" />

        </div>

      </div>


      <div class="input-group">

        <label for="correctAnswer">Correct Answer:</label>

        <input type="text" v-model="quizStore.questions[currentQuestionIndex].correctAnswer"
          placeholder="Correct answer" />

        <span v-if="errors[`questions.${currentQuestionIndex}.correct_answer`]" class="error">{{
          errors[`questions.${currentQuestionIndex}.correct_answer`][0] }}</span>

      </div>

    </div>


    <!-- Navigation Buttons -->

    <div class="button-container">

      <button @click="nextQuestion" v-if="currentQuestionIndex < quizStore.totalMarks - 1"
        class="next-button">Next</button>

      <button @click="submitQuiz" v-else class="submit-button">Submit Quiz</button>

    </div>

  </div>

</template>


<script>

import { ref } from "vue";

import { useQuizStore } from "@/stores/quizStore";

import { toast } from 'vue3-toastify'; // Make sure to import toast for notifications

export default {

  setup() {

    const quizStore = useQuizStore();

    const errors = ref({}); // For handling API errors

    const currentQuestionIndex = ref(0); // Manage current question index

    const generateQuestions = () => {

      quizStore.questions = [];

      for (let i = 0; i < quizStore.totalMarks; i++) {

        quizStore.questions.push({

          text: "",

          options: ["", "", "", ""], // 4 options for each question

          correctAnswer: ""

        });

      }

    };

    // Validation function to ensure required fields are filled

    const isValidQuiz = () => {

      if (!quizStore.quizName) {

        toast.error("Quiz name is required.");

        return false;

      }

      if (quizStore.questions.some((q) => !q.text || !q.correctAnswer)) {

        toast.error("All questions and correct answers are required.");

        return false;

      }

      return true;

    };

    // Submit function with validation and correct data structure

    const submitQuiz = async () => {

      if (!isValidQuiz()) {

        return;

      }

      const quizData = {

        quiz_name: quizStore.quizName,

        duration: quizStore.duration,

        total_marks: quizStore.totalMarks,

        questions: quizStore.questions.map((question) => ({

          question: question.text,

          correct_answer: question.correctAnswer,

          options: question.options

        })),

      };

      try {

        await quizStore.createQuiz(quizData);

      } catch (error) {

        if (error.response && error.response.data.errors) {

          errors.value = error.response.data.errors;

        } else {

          console.error("Error submitting quiz:", error);

        }

      }

    };

    const nextQuestion = () => {

      if (currentQuestionIndex.value < quizStore.totalMarks - 1) {

        currentQuestionIndex.value++;

      }

    };

    return {

      quizStore,

      generateQuestions,

      submitQuiz,

      nextQuestion,

      currentQuestionIndex,

      errors

    };

  }

};

</script>




<style scoped>
.quiz-container {

  max-width: 600px;

  margin: 20px auto;

  padding: 30px;

  border: 1px solid #e0e0e0;

  border-radius: 10px;

  background-color: #ffffff;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  font-family: 'Arial', sans-serif;

}


h3 {

  text-align: center;

  color: #333;

  margin-bottom: 20px;

}


.input-group {

  margin-bottom: 20px;

}


.input-group label {

  display: block;

  margin-bottom: 5px;

  font-weight: bold;

  color: #555;

}


.input-group input {

  width: 100%;

  padding: 10px;

  border: 1px solid #ddd;

  border-radius: 5px;

  font-size: 14px;

  transition: border-color 0.3s;

}


.input-group input:focus {

  border-color: #007bff;

  outline: none;

}


.options-container {

  margin-bottom: 20px;

}


.option-group {

  margin-bottom: 10px;

}


.option-group input {

  width: 100%;

  padding: 10px;

  border: 1px solid #ddd;

  border-radius: 5px;

  font-size: 14px;

  transition: border-color 0.3s;

}


.option-group input:focus {

  border-color: #007bff;

  outline: none;

}


.button-container {

  text-align: center;

}


.next-button,

.submit-button {

  background-color: #007bff;

  color: white;

  padding: 12px 20px;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  font-size: 16px;

  transition: background-color 0.3s, transform 0.2s;

}


.next-button:hover,

.submit-button:hover {

  background-color: #0056b3;

  transform: translateY(-1px);

}
</style>