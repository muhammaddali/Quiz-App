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
                                    <router-link to="/login" class="text-warning fs-5 animated-link">Log in</router-link>
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
import { useApplicationsStore } from '../stores/counter'; // Import Pinia store
import validateRegistration from '../validation/validateRegister';

const Name = ref('');
const email = ref('');
const file = ref('');
const errors = ref({});
const applicationsStore = useApplicationsStore(); // Pinia store instance

// Handle file change for file input (CV)
const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    file.value = selectedFile ? selectedFile.name : '';
};

// Handle form submission
const handleSubmit = () => {
    const application = {
        Name: Name.value,
        email: email.value,
        file: file.value
    };

    // Validate form fields
    const { isInvalid, errors: validationErrors } = validateRegistration(application);
    if (isInvalid) {
        errors.value = validationErrors;
    } else {
        errors.value = {};
        // Add application to the Pinia store
        applicationsStore.addApplication(application);
        
        // Clear the input fields
        Name.value = '';
        email.value = '';
        file.value = '';
        
        // Redirect to login page or show success message
        $router.push('/login');
    }
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
