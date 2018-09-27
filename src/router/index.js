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
// 设置
const Settings = () => import('@/pages/settings/settings');
// 修改手机号
const ChangeMobile = () => import('@/pages/change-mobile/change-mobile');
// 银行卡列表页
const Bankcard = () => import('@/pages/bankcard/bankcard');
// 地址编辑页
const BankcardAddEdit = () => import('@/pages/bankcard-addedit/bankcard-addedit');
// 地址列表页
const Address = () => import('@/pages/address-list/address-list');
// 地址编辑页
const AddressAddEdit = () => import('@/pages/address-addedit/address-addedit');
// 古树认养(列表页）
const TreeList = () => import('@/pages/treeList/treeList');
// 古树详情
const TreeDetail = () => import('@/pages/treeDetail/treeDetail');
// 支付页
const Pay = () => import('@/pages/pay/pay');
// 已认养名单
const AdoptList = () => import('@/pages/adopt-list/adopt-list');
// 林空间
const ForestSpace = () => import('@/pages/forest-space/forest-space');
// 好友排行榜
const Charts = () => import('@/pages/charts/charts');
// 礼物
const Gift = () => import('@/pages/gift/gift');
// 认领礼物
const ClaimGift = () => import('@/pages/claim-gift/claim-gift');
// 认领礼物-地址
const GiftAddress = () => import('@/pages/gift-address/gift-address');
// 我的主页
const HomePage = () => import('@/pages/homepage/homepage');
// 我的树
const MyTree = () => import('@/pages/my-tree/my-tree');
// 攻略
const Strategy = () => import('@/pages/strategy/strategy');
// 养护
const MaintainRecords = () => import('@/pages/maintain-records/maintain-records');
// 养护详情
const MaintainDetail = () => import('@/pages/maintain-detail/maintain-detail');
// 赠送
const Surprise = () => import('@/pages/surprise/surprise');
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
      path: '/settings',
      component: Settings
    },
    {
      path: '/change-mobile',
      component: ChangeMobile
    },
    {
      path: '/bankcard',
      component: Bankcard
    },
    {
      path: '/bankcard-addedit',
      component: BankcardAddEdit
    },
    {
      path: '/address',
      component: Address
    },
    {
      path: '/address-addedit',
      component: AddressAddEdit
    },
    {
      path: '/treeList',
      component: TreeList
    },
    {
      path: '/treeDetail',
      component: TreeDetail
    },
    {
      path: '/pay',
      component: Pay
    },
    {
      path: '/adopt-list',
      component: AdoptList
    },
    {
      path: '/forest-space',
      component: ForestSpace
    },
    {
      path: '/charts',
      component: Charts
    },
    {
      path: '/gift',
      component: Gift
    },
    {
      path: '/claim-gift',
      component: ClaimGift
    },
    {
      path: '/gift-address',
      component: GiftAddress
    },
    {
      path: '/homepage',
      component: HomePage
    },
    {
      path: '/my-tree',
      component: MyTree
    },
    {
      path: '/strategy',
      component: Strategy
    },
    {
      path: '/maintain-records',
      component: MaintainRecords
    },
    {
      path: '/maintain-detail',
      component: MaintainDetail
    },
    {
      path: '/surprise',
      component: Surprise
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
