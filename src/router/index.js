import {
  createRouter,
  createWebHistory
} from 'vue-router';
import {
  useApplicationsStore
} from '../stores/counter';

import Dashboard from '@/views/dashboard.vue';
import AssignedQuizzes from '@/components/studentViews/assignedQuizzes.vue';
import PendingQuizzes from '@/components/studentViews/pendingQuizzes.vue';
import AttemptedQuizzes from '@/components/studentViews/attemptedQuizzes.vue';
import ViewQuizResult from '@/components/studentViews/viewQuizResult.vue';
import AssignQuizzes from '@/components/adminViews/assignQuizzes.vue';
import AdminViewQuizResults from '@/components/adminViews/adminViewQuizResults.vue';
import AddManager from '@/components/adminViews/addRoles.vue';
import StudentRequests from '@/components/adminViews/studentRequests.vue';
import MangViewDetails from '@/components/managerViews/mangViewDetails.vue';
import MangAssignQuizzes from '@/components/managerViews/mangAssignQuizzes.vue';
import SupEditStdsDetails from '@/components/supervisorViews/supEditStdsDetails.vue';
import SupViewStds from '@/components/supervisorViews/supViewStds.vue';

const routes = [{
    path: '/login',
    name: 'Login',
    component: () => import('@/views/log-in.vue'),
  },
  {
    path: '/',
    name: 'ApplicationForm',
    component: () => import('@/views/application.vue'),
  },
  {
    path: '/reset-password/:email/:token',
    name: 'ResetPassword',
    component: () => import('@/views/resetPass.vue'),

    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/forgetPass',
    name: 'ForgetPassword',
    component: () => import('@/views/forgetPass.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [{
        path: 'assignedQuizzes',
        name: 'AssignedQuizzes',
        component: AssignedQuizzes
      },
      {
        path: 'pendingQuizzes',
        name: 'PendingQuizzes',
        component: PendingQuizzes
      },
      {
        path: 'attemptedQuizzes',
        name: 'AttemptedQuizzes',
        component: AttemptedQuizzes
      },
      {
        path: 'viewQuizResult',
        name: 'ViewQuizResult',
        component: ViewQuizResult
      },
      {
        path: 'addManager',
        name: 'AddManager',
        component: AddManager
      },
      {
        path: 'studentRequests',
        name: 'StudentRequests',
        component: StudentRequests
      },
      {
        path: 'assignQuizzes',
        name: 'AssignQuizzes',
        component: AssignQuizzes
      },
      {
        path: 'adminViewQuizResults',
        name: 'AdminViewQuizResults',
        component: AdminViewQuizResults
      },
      {
        path: 'mangAssignQuizzes',
        name: 'MangAssignQuizzes',
        component: MangAssignQuizzes
      },
      {
        path: 'mangViewDetails',
        name: 'MangViewDetails',
        component: MangViewDetails
      },
      {
        path: 'supEditStudDetails',
        name: 'supEditStudDetails',
        component: SupEditStdsDetails
      },
      {
        path: 'supViewStuds',
        name: 'supViewStuds',
        component: SupViewStds
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/dashboard'
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const store = useApplicationsStore();
  console.log(`Navigating to: ${to.path}, isLoggedIn: ${store.isLoggedIn}`);

 
  const publicRoutes = ['/', '/login', '/forgetPass', '/reset-password/:email/:token'];

 
  if (publicRoutes.includes(to.path)) {
    console.log("Accessing public route:", to.path);
    next(); 
  } else if (!store.isLoggedIn) {
    console.log("User is not logged in, redirecting to login");
    next('/login'); 
  } else {
    console.log("User is logged in, proceeding to:", to.path);
    next(); 
  }
});


export default router;