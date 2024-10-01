<template>
    <section class="text-center d-flex justify-content-center align-items-center fixed-top" style="height: 100vh;">
      <div id="bg-img" class="p-5 bg-image position-absolute w-100 h-100"></div>
  
      <div class="card transparent-card mx-4 mx-md-5 shadow-5-strong position-absolute" style="backdrop-filter: blur(30px); width: 100%; max-width: 400px;">
        <div class="card-body py-4 px-md-5 text-warning">
          <div class="row d-flex justify-content-center fs-6">
            <div class="col-lg-12">
              <h2 class="fw-bold mb-4 text-danger fs-2">Reset Password</h2>
              <form @submit.prevent="resetPassword">
                <!-- Password input field -->
                <div class="form-outline mb-3">
                  <input
                    type="password"
                    id="password"
                    v-model="password"
                    :class="['form-control', { 'is-invalid': errors.password }]"
                    required
                  />
                  <div class="invalid-feedback">{{ errors.password }}</div>
                  <label class="form-label" for="password">New Password</label>
                </div>
  
                <!-- Confirm password field -->
                <div class="form-outline mb-3">
                  <input
                    type="password"
                    id="confirmPassword"
                    v-model="confirmPassword"
                    :class="['form-control', { 'is-invalid': errors.confirmPassword }]"
                    required
                  />
                  <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
                  <label class="form-label" for="confirmPassword">Confirm Password</label>
                </div>
  
                <!-- Submit button -->
                <button type="submit" class="btn btn-danger btn-block mb-3 animated-link">
                  Reset Password
                </button>
  
                <!-- Error message if something goes wrong -->
                <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
  
                <!-- Success message after password is reset -->
                <p v-if="successMessage" class="text-success">{{ successMessage }}</p>
  
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const router = useRouter();
  
  const password = ref('');
  const confirmPassword = ref('');
  const errors = ref({});
  const errorMessage = ref('');
  const successMessage = ref('');
  
  const resetPassword = async () => {
    errors.value = {};
    errorMessage.value = '';
    successMessage.value = '';
  
    // Validate password and confirmPassword match
    if (password.value !== confirmPassword.value) {
      errors.value.confirmPassword = 'Passwords do not match.';
      return;
    }
  
    try {
      // Call the backend API to reset the password using the email and token
      const response = await axios.post(
        `http://192.168.15.203:5173/set-password/${route.params.email}/${route.params.token}`, // Updated API endpoint
        {
          password: password.value // New password
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      // Handle successful response
      if (response.data.success) {
        successMessage.value = 'Your password has been reset successfully. You can now log in.';
        setTimeout(() => router.push('/login'), 3000); // Redirect to login after success
      } else {
        errorMessage.value = response.data.message || 'An error occurred. Please try again.';
      }
    } catch (error) {
      console.error("Error details:", error); // Log the complete error object
      errorMessage.value = error.response?.data?.message || 'An error occurred. Please try again.';
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
  