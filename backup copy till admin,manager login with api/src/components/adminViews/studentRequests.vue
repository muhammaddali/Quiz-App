<template>
    <div class="container">
        <h2 class="my-4">Student Applications</h2>

        <div v-if="!loading && applications.length === 0" class="alert alert-info">
            No student applications found.
        </div>

        <table v-if="applications.length > 0" class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(applicant, index) in paginatedApplications" :key="applicant.id">
                    <td>{{ applicant.name }}</td>
                    <td>{{ applicant.email }}</td>
                    <td>
                        <span :class="statusClass(applicant.status)">
                            {{ applicant.status }}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <i class="fas fa-check-circle cus-icon-acp mx-3"
                                @click="updateStatus(applicant.id, 'accepted', index)"
                                :disabled="applicant.status === 'accepted' || applicant.status === 'rejected'"
                                :class="{ 'disabled-icon': applicant.status === 'accepted' || applicant.status === 'rejected' }"
                                title="Accept" style="font-size: 30px;"></i>

                            <i class="fas fa-times-circle cus-icon-rej"
                                @click="updateStatus(applicant.id, 'rejected', index)"
                                :disabled="applicant.status === 'rejected' || applicant.status === 'accepted'"
                                :class="{ 'disabled-icon': applicant.status === 'rejected' || applicant.status === 'accepted' }"
                                title="Reject" style="font-size: 30px;"></i>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="pagination">
            <button class="btn btn-danger" @click="previousPage" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="btn btn-warning" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const applications = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = 5;

const fetchApplications = async () => {
    try {
        loading.value = true;
        const response = await axios.get("http://192.168.15.205:8000/api/show-students");
        if (response && response.data && response.data.data) {
            applications.value = response.data.data;
        } else {
            console.error("Invalid API response structure:", response.data);
        }
    } catch (error) {
        console.error("Error fetching applications:", error.response ? error.response.data : error);
    } finally {
        loading.value = false;
    }
};

const statusClass = (status) => {
    switch (status) {
        case 'accepted':
            return 'status-accepted';
        case 'rejected':
            return 'status-rejected';
        case 'pending':
            return 'status-pending';
        default:
            return '';
    }
};

const updateStatus = async (studentId, newStatus, index) => {
    if (!studentId) {
        console.error("Invalid student ID:", studentId);
        alert("Error: Invalid student ID.");
        return;
    }

    try {
        const endpoint =
            newStatus === "accepted"
                ? `http://192.168.15.205:8000/api/accept-form/${studentId}`
                : `http://192.168.15.205:8000/api/reject-form/${studentId}`;

        const response = await axios.post(endpoint);
        if (response.data.message && response.data.message.includes("successfully")) {
            applications.value[index].status = newStatus;
            alert(`Status updated: ${response.data.message}`);
        } else {
            console.error("Failed to update status:", response.data.message);
            alert("Failed to update status: " + response.data.message);
        }
    } catch (error) {
        console.error("Error updating status:", error.response ? error.response.data : error);
        alert("Error updating status: " + error.message);
    }
};

const totalPages = computed(() => Math.ceil(applications.value.length / itemsPerPage));
const paginatedApplications = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    // Reverse the applications array and slice for pagination
    return applications.value.slice().reverse().slice(start, start + itemsPerPage);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

onMounted(() => {
    fetchApplications();
    setInterval(fetchApplications, 10000);
});
</script>

<style>
.table {
    margin-top: 20px;
}

.table th,
.table td {
    text-align: center;
}

.action-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
}

.cus-icon {
    cursor: pointer;
    color: #471842;
    transition: color 0.3s;
}

.cus-icon-acp:hover {
    color: #35f809;
}

.cus-icon-rej:hover {
    color: #f80909;
}

.disabled-icon {
    color: #99bbdd;
    cursor: not-allowed;
}

.status-accepted {
    color: green;
    font-weight: bold;
    font-size: 1.2em;
    text-transform: uppercase;
}

.status-rejected {
    color: red;
    font-weight: bold;
    font-size: 1.2em;
    text-transform: uppercase;
}

.status-pending {
    color: orange;
    font-weight: bold;
    font-size: 1.2em;
    text-transform: uppercase;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.pagination button {
    margin: 0 10px;
    padding: 5px 10px;
}
</style>
