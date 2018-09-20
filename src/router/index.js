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
// 我的
const Me = () => import('@/pages/me/me');
// 余额
const Money = () => import('@/pages/money/money');
// 充值
const Recharge = () => import('@/pages/recharge/recharge');
// 取现
const Withdraw = () => import('@/pages/withdraw/withdraw');
// 积分
const Score = () => import('@/pages/score/score');
// 积分规则
const ScoreRules = () => import('@/pages/scoreRules/scoreRules');
// 邀请
const Invitation = () => import('@/pages/invitation/invitation');
// 完善资料
const UserInfo = () => import('@/pages/userInfo/userInfo');
// 我的碳泡泡
const CarbonBubble = () => import('@/pages/carbonBubble/carbonBubble');
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
    },
    {
      path: '/me',
      component: Me
    },
    {
      path: '/invitation',
      component: Invitation
    },
    {
      path: '/userInfo',
      component: UserInfo
    },
    {
      path: '/carbon-bubble',
      component: CarbonBubble
    },
    {
      path: '/money',
      component: Money,
      children: [
        {
          path: 'recharge',
          component: Recharge
        },
        {
          path: 'withdraw',
          component: Withdraw
        }
      ]
    },
    {
      path: '/recharge',
      component: Recharge
    },
    {
      path: '/score',
      component: Score,
      children: [
        {
          path: 'score-rules',
          component: ScoreRules
        }
      ]
    }
  ]
});
