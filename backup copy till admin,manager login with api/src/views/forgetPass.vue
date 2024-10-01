<template>
    <section class="text-center d-flex justify-content-center align-items-center fixed-top" style="height: 100vh;">
      <div id="bg-img" class="p-5 bg-image position-absolute w-100 h-100"></div>
  
      <div class="card transparent-card mx-4 mx-md-5 shadow-5-strong position-absolute" style="backdrop-filter: blur(30px); width: 100%; max-width: 400px;">
        <div class="card-body py-4 px-md-5 text-warning">
          <div class="row d-flex justify-content-center fs-6">
            <div class="col-lg-12">
              <h2 class="fw-bold mb-4 text-danger fs-2">Forgot Password</h2>
              <form @submit.prevent="sendPasswordResetLink">
                <!-- Email input field -->
                <div class="form-outline mb-3">
                  <input
                    type="email"
                    id="emailInp"
                    v-model="email"
                    :class="['form-control', { 'is-invalid': errors.email }]"
                    required
                  />
                  <div class="invalid-feedback">{{ errors.email }}</div>
                  <label class="form-label" for="emailInp">Email address</label>
                </div>
  
                <!-- Submit button -->
                <button type="submit" class="btn btn-danger btn-block mb-3 animated-link">
                  Send Reset Link
                </button>
  
                <!-- Error message if something goes wrong -->
                <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
  
                <!-- Success message after email is sent -->
                <p v-if="successMessage" class="text-success">{{ successMessage }}</p>
  
                <!-- Back to login link -->
                <div class="d-flex justify-content-center align-items-center fs-6 mb-3">
                  <p class="text-light mb-0">
                    Remembered your password?
                    <router-link to="/login" class="text-warning fs-6 animated-link">Log in</router-link>
                  </p>
                </div>
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
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const errors = ref({});
  const errorMessage = ref('');
  const successMessage = ref('');
  const router = useRouter();
  
  const sendPasswordResetLink = async () => {
    errors.value = {};
    errorMessage.value = '';
    successMessage.value = '';
  
    // Validate email input
    if (!validateEmail(email.value)) {
      errors.value.email = 'Please enter a valid email address.';
      return;
    }
  
    try {
      const response = await axios.post(
        'http://192.168.15.205:8000/api/reset-password', 
        { email: email.value },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      successMessage.value = 'Password reset link has been sent to your email.';
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'An error occurred. Please try again.';
    }
  };
  
  // Validate email format using regex
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  </script>
  
  <style>
  /* Your styles remain unchanged */
  </style>
  
  
  <style>
  #bg-img {
    background: url("../assets/imgs/giphy.gif");
  }
  
  .transparent-card {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(20px);
  }
  
  .animated-link {
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .animated-link:hover {
    color: #ffc107; /* Change link color on hover */
  }
  
  .form-control.is-invalid {
    border-color: red;
  }
  
  .invalid-feedback {
    color: red;
    font-size: 0.875rem;
  }
  </style>
  