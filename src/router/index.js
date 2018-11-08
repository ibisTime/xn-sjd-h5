import Vue from 'vue';
import Router from 'vue-router';

// const router = new Router({});
//
// router.beforeEach(function (to, from, next) {
//   const agent = navigator.userAgent;
//   const isiOS = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);// ios终端
//   // console.log(to.path + ' == ' + location.pathname)
//   if (isiOS && ('/product-detail' + to.path !== location.pathname) && location.pathname.length < 50) {
//     location.assign('/product-detail' + to.fullPath);
//   } else {
//     next();
//   }
// });

// /
Vue.use(Router);

// 登录页
const Login = () => import('@/pages/login/login');
// 注册页
const Register = () => import('@/pages/register/register');
// 忘记密码
const ForgetPwd = () => import('@/pages/forget-pwd/forget-pwd');
// 首页
const Home = () => import('@/pages/home/home');
// 协议页
const Protocol = () => import('@/pages/protocol/protocol');
// 我的
const Me = () => import('@/pages/me/me');
// 我的文章
const MyArticle = () => import('@/pages/my-article/my-article');
// 发布文章
const WriteArticle = () => import('@/pages/write-article/write-article');
// 我的收藏
const MyCollect = () => import('@/pages/my-collect/my-collect');
// 我的订单
const MyOrder = () => import('@/pages/my-order/my-order');
// 订单详情
const OrderDetail = () => import('@/pages/order-detail/order-detail');
// 余额
const Money = () => import('@/pages/money/money');
// 充值
const Recharge = () => import('@/pages/recharge/recharge');
// 充值成功
const PaySucceed = () => import('@/pages/paySucceed/paySucceed');
// 取现
const Withdraw = () => import('@/pages/withdraw/withdraw');
// 积分
const Score = () => import('@/pages/score/score');
// 积分规则
const ScoreRules = () => import('@/pages/scoreRules/scoreRules');
// 碳泡泡规则
const tppRules = () => import('@/pages/tppRules/tppRules');
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
// 修改手机号
const BindEmail = () => import('@/pages/bind-email/bind-email');
// 设置支付密码
const setMoneyPaw = () => import('@/pages/moneyPaw/moneyPaw');
// 银行卡列表页
const Bankcard = () => import('@/pages/bankcard/bankcard');
// 地址编辑页
const BankcardAddEdit = () => import('@/pages/bankcard-addedit/bankcard-addedit');
// 地址列表页
const Address = () => import('@/pages/address-list/address-list');
// 地址编辑页
const AddressAddEdit = () => import('@/pages/address-addedit/address-addedit');
// 古树认养(列表页）
const ProductList = () => import('@/pages/product-list/product-list');
// 热门古树(列表页）
const HotProductList = () => import('@/pages/hot-product-list/hot-product-list');
// 古树详情
const ProductDetail = () => import('@/pages/product-detail/product-detail');
// 古树认养-树木查看
const ProductTreeList = () => import('@/pages/productTree-list/productTree-list');
// 古树认养-树木查看-详情
const ProductTreeDetail = () => import('@/pages/productTree-detail/productTree-detail');
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
const GiftAddress2 = () => import('@/pages/gift-address2/gift-address2');
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
// 情感频道
const EmotionChannel = () => import('@/pages/emotion-channel/emotion-channel');
// 文章详情
const ArticleDetail = () => import('@/pages/article-detail/article-detail');
// 商城
const Mall = () => import('@/pages/mall/mall');
// 公告
const Notices = () => import('@/pages/notices/notices');
// 公告详情
const NoticeDetail = () => import('@/pages/notice-detail/notice-detail');
// 地图
const Map = () => import('@/pages/map/map');
// 二期

// 预售列表页
const BookingProductList = () => import('@/pages/booking-product-list/booking-product-list');
// 预售产品详情页
const BookingProductDetail = () => import('@/pages/booking-product-detail/booking-product-detail');
// 预售订单
const BookingOrder = () => import('@/pages/booking-order/booking-order');
// 预售订单详情
const BookingOrderDetail = () => import('@/pages/booking-order-detail/booking-order-detail');
// 寄售大厅
const ConsignmentHall = () => import('@/pages/consignment-hall/consignment-hall');
// 寄售产品详情页
const ConsignmentProductDetail = () => import('@/pages/consignment-product-detail/consignment-product-detail');
// 树编号
const TreeCode = () => import('@/pages/tree-code/tree-code');
// 我的寄售
const MyConsignment = () => import('@/pages/my-consignment/my-consignment');
// 二维码寄售
const ConsignmentErweima = () => import('@/pages/consignment-erweima/consignment-erweima');
// 预售地址
const YushouAddress = () => import('@/pages/yushou-address1/yushou-address1');
// 预售地址
const YushouAddressList = () => import('@/pages/yushou-address-list/yushou-address-list');
// 预售地址
const TihuoAddressAddedit = () => import('@/pages/tihuo-address-addedit/tihuo-address-addedit');
// 寄售订单
const ConsignmentOrder = () => import('@/pages/consignment-order/consignment-order');
// 寄售订单详情
const ConsignmentOrderDetail = () => import('@/pages/consignment-order-detail/consignment-order-detail');
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
      component: Register,
      children: [
        {
          path: 'protocol',
          component: Protocol
        }
      ]
    },
    {
      path: '/forget-pwd',
      component: ForgetPwd
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
      path: '/my-article',
      component: MyArticle,
      children: [
        {
          path: 'article-detail',
          component: ArticleDetail
        }
      ]
    },
    {
      path: '/write-article',
      component: WriteArticle
    },
    {
      path: '/my-collect',
      component: MyCollect
    },
    {
      path: '/my-order',
      component: MyOrder,
      children: [
        {
          path: 'order-detail',
          component: OrderDetail
        }
      ]
    },
    {
      path: '/order-detail',
      component: OrderDetail
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
      path: '/bind-email',
      component: BindEmail
    },
    {
      path: '/set-money',
      component: setMoneyPaw
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
      path: '/product-list',
      component: ProductList,
      children: [
        {
          path: 'product-detail',
          component: ProductDetail
        }
      ]
    },
    {
      path: '/product-detail',
      component: ProductDetail
    },
    {
      path: '/hot-product-list',
      component: HotProductList,
      children: [
        {
          path: 'product-detail',
          component: ProductDetail
        }
      ]
    },
    {
      path: '/productTree-list',
      component: ProductTreeList
    },
    {
      path: '/productTree-detail',
      component: ProductTreeDetail
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
      path: '/gift-address2',
      component: GiftAddress2
    },
    {
      path: '/homepage',
      component: HomePage
    },
    {
      path: '/my-tree',
      component: MyTree,
      children: [
        {
          path: 'adopt-list',
          component: AdoptList
        },
        {
          path: 'maintain-records',
          component: MaintainRecords,
          children: [
            {
              path: 'maintain-detail',
              component: MaintainDetail
            }
          ]
        }
      ]
    },
    {
      path: '/maintain-detail',
      component: MaintainDetail
    },
    {
      path: '/strategy',
      component: Strategy
    },
    {
      path: '/surprise',
      component: Surprise
    },
    {
      path: '/emotion-channel',
      component: EmotionChannel,
      children: [
        {
          path: 'article-detail',
          component: ArticleDetail
        }
      ]
    },
    {
      path: '/mall',
      component: Mall
    },
    {
      path: '/money',
      component: Money,
      children: [
        {
          path: 'recharge',
          component: Recharge
        }
      ]
    },
    {
      path: '/withdraw',
      component: Withdraw
    },
    {
      path: '/recharge',
      component: Recharge
    },
    {
      path: '/paySucceed',
      component: PaySucceed
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
    },
    {
      path: '/tpp-rules',
      component: tppRules
    },
    {
      path: '/notices',
      component: Notices
    },
    {
      path: '/notice-detail',
      component: NoticeDetail
    },
    {
      path: '/map',
      component: Map
    },
    // 二期
    {
      path: '/booking-product-list',
      component: BookingProductList,
      children: [
        {
          path: 'booking-product-detail',
          component: BookingProductDetail,
          children: [
            {
              path: 'tree-code',
              component: TreeCode
            }
          ]
        }
      ]
    },
    {
      path: '/booking-order',
      component: BookingOrder,
      children: [
        {
          path: 'booking-order-detail',
          component: BookingOrderDetail
        }
      ]
    },
    {
      path: '/consignment-hall',
      component: ConsignmentHall,
      children: [
        {
          path: 'consignment-product-detail',
          component: ConsignmentProductDetail
        }
      ]
    },
    {
      path: '/tree-code',
      component: TreeCode
    },
    {
      path: '/consignment-erweima',
      component: ConsignmentErweima
    },
    {
      path: '/yushou-address',
      component: YushouAddress
      // children: [
      //   {
      //     path: 'tihuo-address-addedit',
      //     component: TihuoAddressAddedit
      //   }
      // ]
    },
    {
      path: '/yushou-address-list',
      component: YushouAddressList
    },
    {
      path: '/tihuo-address-addedit',
      component: TihuoAddressAddedit
    },
    {
      path: '/consignment-order',
      component: ConsignmentOrder
    },
    {
      path: '/consignment-order-detail',
      component: ConsignmentOrderDetail
    },
    {
      path: '/my-consignment',
      component: MyConsignment
    },
    {
      path: '/consignment-product-detail',
      component: ConsignmentProductDetail
    }
  ]
});
