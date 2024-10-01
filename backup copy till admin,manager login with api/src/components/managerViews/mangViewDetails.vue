<template>
    <div class="container">
        <h2 class="my-4">Student Details</h2>

        <!-- Loading Indicator -->
        <div v-if="loading" class="text-center">
            <p>Loading...</p>
        </div>

        <!-- No Data Found -->
        <div v-if="!loading && students.length === 0" class="alert alert-info">
            No student data available.
        </div>

        <!-- Display Student Data in Table -->
        <table v-if="students.length > 0" class="table table-striped table-hover">
            <thead class="thead-dark">
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(student, index) in students" :key="student.id">
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// State to hold student data
const students = ref([]);
const loading = ref(true);

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

// Class binding for status
const statusClass = (status) => {
    return {
        'text-success': status === 'accepted',
        'text-danger': status === 'rejected',
        'text-warning': status === 'pending'
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
</style>
