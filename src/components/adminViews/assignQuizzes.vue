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
            <input type="number" id="numberOfQuestions" v-model="numberOfQuestions" class="form-control" min="1" placeholder="Enter number of questions" />
            <button class="btn btn-primary mt-3" @click="generateQuestionFields">Generate Questions</button>
        </div>

        <!-- Step 3: Display question fields dynamically -->
        <div v-if="questions.length > 0" class="mt-3">
            <div v-for="(question, index) in questions" :key="index" class="card mb-3 p-3">
                <h5>Question {{ index + 1 }}</h5>
                <div class="form-group">
                    <label for="questionText">Question:</label>
                    <input type="text" v-model="question.questionText" class="form-control" placeholder="Enter the question" />
                </div>

                <div class="form-group mt-2">
                    <label>Answer Options:</label>
                    <div v-for="(option, optIndex) in question.answerOptions" :key="optIndex" class="mt-2">
                        <input type="text" v-model="question.answerOptions[optIndex]" class="form-control" placeholder="Option {{ optIndex + 1 }}" />
                    </div>
                </div>

                <div class="form-group mt-2">
                    <label for="correctAnswer">Correct Answer (Option Number):</label>
                    <input type="number" v-model="question.correctAnswer" class="form-control" min="1" max="4" placeholder="Enter the correct answer option number (1-4)" />
                </div>
            </div>

            <button class="btn btn-success" @click="saveQuiz">Save Quiz</button>
        </div>

        <!-- Quiz List Section -->
        <div v-if="quizzes.length > 0" class="mt-5">
            <h2 class="text-center mb-4">Quizzes</h2>
            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Quiz ID</th>
                            <th>Quiz Name</th>
                            <th>Duration (minutes)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="quiz in paginatedQuizzes" :key="quiz.id">
                            <td>{{ quiz.id }}</td>
                            <td>{{ quiz.quiz_name }}</td>
                            <td>{{ quiz.duration }}</td>
                            <td>
                                <button class="btn btn-info" @click="selectQuiz(quiz)">Assign to Students</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination mt-3">
                <button class="btn btn-secondary" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
                <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
                <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
            </div>
        </div>

        <!-- Student Assignment Section -->
        <div v-if="selectedQuiz && students.length > 0" class="mt-5">
            <h2 class="text-center mb-4">Assign Quiz to Students</h2>
            <p>Selected Quiz: {{ selectedQuiz.quiz_name }} (ID: {{ selectedQuiz.id }})</p>

            <div class="table-responsive">
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
                                <input type="checkbox" :value="student.student_id" v-model="selectedStudents" />
                            </td>
                            <td>{{ student.student_id }}</td>
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Initial data
const quizName = ref('');
const duration = ref(0);
const totalMarks = ref(0);
const numberOfQuestions = ref(0);
const quizzes = ref([]);
const questions = ref([]);
const students = ref([]);
const selectedStudents = ref([]);
const selectedQuiz = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Computed property for paginated quizzes
const paginatedQuizzes = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return quizzes.value.slice(start, start + itemsPerPage.value);
});

// Computed property for total pages
const totalPages = computed(() => {
    return Math.ceil(quizzes.value.length / itemsPerPage.value);
});

// Fetch students dynamically from the API
const fetchStudents = async () => {
    try {
        const response = await axios.get('http://192.168.15.205:8000/api/show-students');
        
        // Filter the students to include only those with status "accepted"
        students.value = response.data.data.filter(student => student.status === 'accepted') || [];
    } catch (error) {
        console.error('Error fetching students:', error);
    }
};

// Generate question fields based on the number entered
const generateQuestionFields = () => {
    questions.value = [];
    for (let i = 0; i < numberOfQuestions.value; i++) {
        questions.value.push({
            questionText: '',
            answerOptions: ['', '', '', ''],
            correctAnswer: 1,
        });
    }
};

// Save quiz and update quizzes array
const saveQuiz = async () => {
    if (!quizName.value || questions.value.length === 0) {
        alert("Please fill in all the required fields.");
        return;
    }

    const quizData = {
        quiz_name: quizName.value,
        duration: duration.value,
        total_marks: totalMarks.value,
    };

    try {
        const quizResponse = await axios.post('http://192.168.15.205:8000/api/add-quiz', quizData);
        if (quizResponse.data.success) {
            const quizId = quizResponse.data.data.id;
            alert("Quiz saved successfully!");

            // Add the new quiz to the quizzes array
            quizzes.value.unshift(quizResponse.data.data); // Add the new quiz at the beginning

            // Loop through each question and add it to the created quiz
            for (const question of questions.value) {
                const questionData = {
                    question_text: question.questionText,
                    options: question.answerOptions,
                    answer: question.correctAnswer, // Changed from correct_answer to answer
                    marks: question.marks || 1, // Assuming you want to send marks, default to 1
                };
                await addQuestionToQuiz(quizId, questionData); // Call the new function
            }

            resetForm();
        }
    } catch (error) {
        console.error('Error saving quiz or adding questions:', error);
    }
};

// Function to add a question to the quiz
const addQuestionToQuiz = async (quizId, question) => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("token");

        // Make the API call to add the question
        await axios.post(
            `http://192.168.15.205:8000/api/add-question/${quizId}`,
            question,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            }
        );
    } catch (error) {
        console.error("Error adding question:", error);
        alert("An error occurred while adding a question.");
    }
};

// Fetch quizzes from API
const fetchQuizzes = async () => {
    try {
        const response = await axios.get('http://192.168.15.205:8000/api/show-quiz');
        quizzes.value = response.data.data || [];
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
};

// Select quiz for assignment
const selectQuiz = (quiz) => {
    selectedQuiz.value = quiz;
};

// Assign quiz to selected students
const assignQuizToStudents = async () => {
    if (selectedStudents.value.length === 0) {
        alert("Please select at least one student.");
        return;
    }

    const quizId = selectedQuiz.value.id;

    for (const studentId of selectedStudents.value) {
        try {
            const response = await axios.post(`http://192.168.15.205:8000/api/assign-quiz/${quizId}/${studentId}`);
            if (response.data.success) {
                console.log(`Quiz assigned successfully to student ID ${studentId}!`);
            } else {
                console.error(`Failed to assign quiz to student ID ${studentId}: ${response.data.message}`);
            }
        } catch (error) {
            console.error(`Error assigning quiz to student ID ${studentId}:`, error);
            alert(`Error assigning quiz to student ID ${studentId}: ${error.response ? error.response.data.message : 'Server not reachable'}`);
        }
    }

    // Optionally clear selections or update UI after processing all assignments
    selectedStudents.value = [];
    selectedQuiz.value = null;
};

// Reset the quiz creation form
const resetForm = () => {
    quizName.value = '';
    duration.value = 0;
    totalMarks.value = 0;
    numberOfQuestions.value = 0;
    questions.value = [];
};

// On component mount, fetch quizzes and students
onMounted(() => {
    fetchQuizzes();
    fetchStudents();
});
</script>


<style scoped>
.table th, .table td {
    vertical-align: middle;
}
</style>




