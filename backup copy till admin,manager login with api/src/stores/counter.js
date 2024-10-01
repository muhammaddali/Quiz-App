import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useApplicationsStore = defineStore('applications', () => {
    // Define state variables
    const pendingApplications = ref([]);
    const isLoggedIn = ref(false);
    const user = ref(null);
    const role = ref(null); // Store role as a string
    const permissions = ref([]);

    // Method to initialize state from local storage
    const initializeState = () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');
        const storedPermissions = localStorage.getItem('permissions');
        const storedApplications = localStorage.getItem('pendingApplications'); // Fetch applications from local storage

        isLoggedIn.value = !!token; // Convert token to boolean
        user.value = storedUser ? JSON.parse(storedUser) : null; // Parse stored user data
        role.value = storedRole; // Keep role as a string (already null if not found)
        permissions.value = storedPermissions ? JSON.parse(storedPermissions) : []; // Parse stored permissions

        // Initialize pending applications from local storage
        pendingApplications.value = storedApplications ? JSON.parse(storedApplications) : []; // Parse stored applications
    };

    // Method to add a new application
    const addApplication = (application) => {
        application.id = Date.now(); // Assign a unique ID for the application
        application.status = 'pending'; // Set default status
        pendingApplications.value.push(application);
        localStorage.setItem('pendingApplications', JSON.stringify(pendingApplications.value)); // Persist to local storage
    };

    // Updated login method to store role as a string
    const login = (token, userData, userRole, userPermissions) => {
        // Validate the inputs
        if (!token || !userData || !userRole || !Array.isArray(userPermissions) || userPermissions.length === 0) {
            console.error('Invalid token, user data, role, or permissions');
            return; // Prevent further action if inputs are invalid
        }

        // Store user data and token in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userRole); // Store role as a string
        localStorage.setItem('permissions', JSON.stringify(userPermissions));

        // Update local state
        isLoggedIn.value = true; // Mark as logged in
        user.value = userData; // Update user data
        role.value = userRole; // Store role
        permissions.value = userPermissions; // Store permissions
    };

    // Method to log out the user
    const logout = () => {
        // Clear token, user data, role, and permissions from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('permissions');
        localStorage.removeItem('pendingApplications'); 
        localStorage.removeItem('applications'); 

        // Reset local state
        isLoggedIn.value = false;
        user.value = null;
        role.value = null;
        permissions.value = [];
        pendingApplications.value = []; // Reset pending applications
    };

    // Call initializeState on store creation
    initializeState();

    return {
        pendingApplications,
        addApplication,
        isLoggedIn,
        user,
        role,
        permissions,
        login,
        logout,
    };
});
