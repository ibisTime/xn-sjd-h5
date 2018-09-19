import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 登陆页
const Login = () => import('@/pages/login/login');
// 注册页
const Register = () => import('@/pages/register/register');
// 首页
const Home = () => import('@/pages/home/home');
// 协议页
const Protocol = () => import('@/pages/protocol/protocol');

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/protocol',
      component: Protocol
    }
  ]
});
