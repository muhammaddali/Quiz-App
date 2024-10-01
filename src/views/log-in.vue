<template>
    <section v-if="!isLoggedIn" class="text-center d-flex justify-content-center align-items-center fixed-top"
        style="height: 100vh;">
        <div id="bg-img" class="p-5 bg-image position-absolute w-100 h-100"></div>

        <div class="card transparent-card mx-4 mx-md-5 shadow-5-strong position-absolute"
            style="backdrop-filter: blur(30px); width: 100%; max-width: 400px;">
            <div class="card-body py-4 px-md-5 text-warning">
                <div class="row d-flex justify-content-center fs-6">
                    <div class="col-lg-12">
                        <h2 class="fw-bold mb-4 text-danger fs-2">Log-in</h2>
                        <form @submit.prevent="loginUser">
                            <div class="form-outline mb-3">
                                <input type="email" id="emailInp" v-model="email"
                                    :class="['form-control', { 'is-invalid': errors.email }]" />
                                <div class="invalid-feedback">{{ errors.email }}</div>
                                <label class="form-label" for="emailInp">Email address</label>
                            </div>

                            <div class="form-outline mb-3">
                                <input type="password" id="psw" v-model="password"
                                    :class="['form-control', { 'is-invalid': errors.password }]" />
                                <div class="invalid-feedback">{{ errors.password }}</div>
                                <label class="form-label" for="psw">Password</label>
                            </div>

                            <div class="d-flex justify-content-center align-items-center fs-6 mb-3">
                                <p class="text-light mb-0">
                                    UnRemember?
                                    <router-link to="/forgetPass" class="text-warning fs-6 animated-link">Forget
                                        Password</router-link>
                                </p>
                            </div>

                            <div class="d-flex justify-content-center align-items-center fs-6 mb-3">
                                <p class="text-light mb-0">
                                    Not Registered?
                                    <router-link to="/" class="text-warning fs-6 animated-link">Application
                                        Form</router-link>
                                </p>
                            </div>


                            <button type="submit" class="btn btn-danger btn-block mb-3 animated-link">
                                Login
                            </button>

                            <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useApplicationsStore } from '../stores/counter';

const email = ref('');
const password = ref('');
const errors = ref({});
const errorMessage = ref('');
const router = useRouter();
const store = useApplicationsStore();

const isLoggedIn = computed(() => store.isLoggedIn);

onMounted(() => {
    if (isLoggedIn.value) {
        const user = store.user;
        if (user && user.role) {
            router.push(`/${user.role}-dashboard`);
        } else {
            errorMessage.value = 'User role is not defined';
        }
    }
});
const loginUser = async () => {
    errorMessage.value = '';
    errors.value = {};

    try {
        // const response = await axios.post('http://192.168.15.80:8000/api/login', { Tayab's Api
            const response = await axios.post('http://192.168.15.205:8000/api/login', {     //Ali's api
            // const response = await axios.post('http://localhost:3000/login', {
            email: email.value,
            password: password.value
        });

        const { token, user, role, permissions } = response.data.data;

        // Validate that token, user, role, and permissions are defined
        if (token && user && Array.isArray(role) && role.length > 0 && Array.isArray(permissions)) {
            store.login(token, user, role, permissions);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            router.push(`/${role[0]}-dashboard`);
        } else {
            errorMessage.value = 'Invalid response data';
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            errorMessage.value = 'Invalid email or password';
        } else {
            errorMessage.value = 'An error occurred during login';
        }
        console.error('Login error:', error);
    }
};


// Optional: Listen to storage events for login status
window.addEventListener('storage', () => {
    if (store.isLoggedIn) {
        const user = store.user;
        if (user && user.role) {
            router.push(`/${user.role}-dashboard`);
        }
    }
});
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
