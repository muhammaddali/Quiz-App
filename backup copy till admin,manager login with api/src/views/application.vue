<template>
    <section class="text-center d-flex justify-content-center align-items-center fixed-top" style="height: 100vh;">
        <!-- Background image -->
        <div id="bg-img" class="p-5 bg-image position-absolute w-100 h-100"></div>

        <div class="card transparent-card mx-4 mx-md-5 shadow-5-strong position-absolute" style="
            backdrop-filter: blur(30px);
            width: 100%;            
            max-width: 400px; /* Adjusted width */
        ">
            <div class="card-body py-4 px-md-5 text-warning"> 
                <div class="row d-flex justify-content-center fs-6">
                    <div class="col-lg-12">
                        <h2 class="fw-bold mb-4 text-danger fs-2">Application Form</h2> 
                        <form @submit.prevent="handleSubmit">

                            <!-- Name input -->
                            <div class="form-outline mb-3"> 
                                <input type="text" id="Name" v-model="Name"
                                    :class="['form-control', { 'is-invalid': errors.Name }]" />
                                <div class="invalid-feedback">{{ errors.Name }}</div>
                                <label class="form-label" for="Name">Full Name</label>
                            </div>

                            <!-- Email input -->
                            <div class="form-outline mb-3"> 
                                <input type="email" id="emailInp" v-model="email"
                                    :class="['form-control', { 'is-invalid': errors.email }]" />
                                <div class="invalid-feedback">{{ errors.email }}</div>
                                <label class="form-label" for="emailInp">Email address</label>
                            </div>

                            <!-- File input -->
                            <div class="form-outline mb-3"> 
                                <input type="file" id="fileInput" @change="handleFileChange"
                                    :class="['form-control', { 'is-invalid': errors.file }]" />
                                <div class="invalid-feedback">{{ errors.file }}</div>
                                <label class="form-label" for="fileInput">Attach Your CV</label>
                            </div>

                            <div class="d-flex justify-content-center align-items-center fs-6 mb-3">
                                <p class="text-light mb-0">
                                    Already filled the form?
                                    <router-link to="/login" class="text-warning fs-6 animated-link">Log in</router-link>
                                </p>
                            </div>

                            <!-- Submit button -->
                            <button type="submit" class="btn btn-danger btn-block mb-3 animated-link">
                                Submit
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import validateRegistration from '../validation/validateRegister';
import { useApplicationsStore } from '../stores/counter'; 

const Name = ref('');
const email = ref('');
const file = ref(null);
const errors = ref({});
const applicationsStore = useApplicationsStore(); // Pinia store instance

// Handle file change for file input (CV)
const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    file.value = selectedFile || null;
};

// Handle form submission
const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', Name.value); // API expects 'name'
    formData.append('email', email.value);
    formData.append('cv', file.value); // API expects 'cv'
    
    // Validate form fields
    const application = {
        Name: Name.value,
        email: email.value,
        file: file.value,
        status: 'pending',
    };

    const { isInvalid, errors: validationErrors } = validateRegistration(application);
    if (isInvalid) {
        errors.value = validationErrors;
    } else {
        errors.value = {};
        // Add application to Pinia store
        applicationsStore.addApplication(application);
        
        // Save application to local storage
        saveToLocalStorage(application);

        // Send application to the server (API)
        try {
            const response = await axios.post('http://192.168.15.205:8000/api/form-submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                // Clear input fields after success
                Name.value = '';
                email.value = '';
                file.value = null;

                // Redirect to login page or show success message
                $router.push('/login');
            } else {
                // Handle error from API response
                console.error('API error:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }
};

// Save application to local storage
const saveToLocalStorage = (application) => {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));
};
</script>

<style>
#bg-img {
    background: url("../assets/imgs/giphy.gif"); 
}

.transparent-card {
    background-color: rgba(0, 0, 0, 0.5); 
    backdrop-filter: blur(20px); 
}
</style>
