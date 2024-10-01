<template>
    <div class="container mt-5">
        <!-- Quiz Creation Section -->
        <h2 class="text-center mb-4">Create a Quiz</h2>

        <!-- Step 1: Quiz Details -->
        <div class="form-group">
            <label for="quizName" class="form-label">Quiz Name:</label>
            <input type="text" id="quizName" v-model="quizName" class="form-control" placeholder="Enter quiz name" />
        </div>

        <div class="form-group">
            <label for="duration" class="form-label">Duration (in minutes):</label>
            <input type="number" id="duration" v-model="duration" class="form-control" placeholder="Enter quiz duration" />
        </div>

        <div class="form-group">
            <label for="totalMarks" class="form-label">Total Marks:</label>
            <input type="number" id="totalMarks" v-model="totalMarks" class="form-control" placeholder="Enter total marks" />
        </div>

        <!-- Step 2: Choose number of questions -->
        <div class="form-group mt-4">
            <label for="numberOfQuestions" class="form-label">How many questions do you want to add?</label>
            <input type="number" id="numberOfQuestions" v-model="numberOfQuestions" class="form-control" min="1"
                placeholder="Enter number of questions" />
            <button class="btn btn-primary mt-3" @click="generateQuestionFields">
                Generate Questions
            </button>
        </div>

        <!-- Step 3: Display question fields dynamically -->
        <div v-if="questions.length > 0" class="mt-3">
            <div v-for="(question, index) in questions" :key="index" class="card mb-3 p-3">
                <h5>Question {{ index + 1 }}</h5>
                <div class="form-group">
                    <label for="questionText">Question:</label>
                    <input type="text" v-model="question.questionText" class="form-control"
                        placeholder="Enter the question" />
                </div>

                <div class="form-group mt-2">
                    <label>Answer Options:</label>
                    <div v-for="(option, optIndex) in question.answerOptions" :key="optIndex" class="mt-2">
                        <input type="text" v-model="question.answerOptions[optIndex]" class="form-control"
                            placeholder="Option {{ optIndex + 1 }}" />
                    </div>
                </div>

                <div class="form-group mt-2">
                    <label for="correctAnswer">Correct Answer (Option Number):</label>
                    <input type="number" v-model="question.correctAnswer" class="form-control" min="1" max="4"
                        placeholder="Enter the correct answer option number (1-4)" />
                </div>
            </div>

            <button class="btn btn-success" @click="saveQuiz">Save Quiz</button>
        </div>

        <!-- Quiz List Section -->
        <div v-if="quizzes.length > 0" class="mt-5">
            <h2 class="text-center mb-4">Quizzes</h2>
            <ul class="list-group">
                <li v-for="quiz in quizzes" :key="quiz.id" class="list-group-item">
                    Quiz ID: {{ quiz.id }} | Quiz Name: {{ quiz.quiz_name }} | Duration: {{ quiz.duration }} mins
                    <button class="btn btn-info float-right" @click="selectedQuiz = quiz">Assign to Students</button>
                </li>
            </ul>
        </div>

        <!-- Student Assignment Section -->
        <div v-if="selectedQuiz && students.length > 0" class="mt-5">
            <h2 class="text-center mb-4">Assign Quiz to Students</h2>
            <p>Selected Quiz: {{ selectedQuiz.quiz_name }} (ID: {{ selectedQuiz.id }})</p>

            <div class="table-responsive"> <!-- Added responsive wrapper -->
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Select</th>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in students" :key="student.id">
                            <td>
                                <input type="checkbox" :value="student.id" v-model="selectedStudents" />
                            </td>
                            <td>{{ student.id }}</td>
                            <td>{{ student.name }}</td>
                            <td>{{ student.email }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button class="btn btn-info mt-3" @click="assignQuizToStudents">Assign Quiz to Selected Students</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Initial data
const quizName = ref('');
const duration = ref(0);
const totalMarks = ref(0);
const numberOfQuestions = ref(0);
const quizzes = ref([]);  // Will store list of quizzes
const questions = ref([]);
const students = ref([]);
const selectedStudents = ref([]);  // Array to hold selected student IDs
const selectedQuiz = ref(null);  // Selected quiz to assign

// Fetch students dynamically from the API
const fetchStudents = async () => {
    try {
        const response = await axios.get('http://192.168.15.205:8000/api/show-students');
        students.value = response.data.data || []; // Safeguard if data is undefined
    } catch (error) {
        console.error('Error fetching students:', error);
    }
};

// Generate question fields based on the number entered
const generateQuestionFields = () => {
    questions.value = []; // Reset questions

    for (let i = 0; i < numberOfQuestions.value; i++) {
        questions.value.push({
            questionText: '',
            answerOptions: ['', '', '', ''], // 4 answer options
            correctAnswer: 1, // Default to first option as correct, can be changed
        });
    }
};

// Save quiz and make API call to store the quiz
const saveQuiz = async () => {
    if (!quizName.value || questions.value.length === 0) {
        alert("Please fill in all the required fields.");
        return;
    }

    const quizData = {
        quiz_name: quizName.value,
        duration: duration.value,
        total_marks: totalMarks.value,
        questions: questions.value.map((q) => ({
            question_text: q.questionText,
            correct_answer: q.answerOptions[q.correctAnswer - 1], // Correct answer as string
            options: q.answerOptions,
        })),
    };

    try {
        const response = await axios.post('http://192.168.15.205:8000/api/add-quiz', quizData);
        if (response.data.success) {
            alert("Quiz saved successfully!");
            quizzes.value.push(response.data.data); // Add new quiz to the list
            // Clear form after saving
            quizName.value = '';
            duration.value = 0;
            totalMarks.value = 0;
            numberOfQuestions.value = 0;
            questions.value = [];
        }
    } catch (error) {
        console.error('Error saving quiz:', error);
    }
};

// Fetch quizzes on component mount
const fetchQuizzes = async () => {
    try {
        const response = await axios.get('http://192.168.15.205:8000/api/show-quiz'); // Change URL if needed
        quizzes.value = response.data.data || []; // Safeguard if data is undefined
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
};

// Assign the quiz to selected students
const assignQuizToStudents = async () => {
    if (!selectedQuiz.value || selectedStudents.value.length === 0) {
        alert("Please select a quiz and at least one student to assign.");
        return;
    }

    try {
        const response = await axios.post(`http://192.168.15.205:8000/api/assign-quiz`, {
            quizId: selectedQuiz.value.id,
            studentIds: selectedStudents.value,
        });

        if (response.data.success) {
            alert("Quiz assigned to selected students successfully!");
            selectedStudents.value = []; // Reset after assignment
        }
    } catch (error) {
        console.error('Error assigning quiz to students:', error);
    }
};

// Fetch students and quizzes on component mount
onMounted(() => {
    fetchStudents();
    fetchQuizzes();
});
</script>

<style scoped>
/* Styling to make the UI look clean and minimal */
.container {
    max-width: 800px;
    margin: auto;
}

.card {
    background-color: #f9f9f9;
}

.btn {
    width: 100%;
}

h2 {
    color: #343a40;
}

label {
    font-weight: bold;
}

.table {
    margin-top: 20px;
}
</style>
