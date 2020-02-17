export default [
  {
    path: "/login",
    name: "后台登录",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/",
    meta: {
      isLogin: true
    },
    component: () => import("../layout/Admin.vue"),
    children: [
      {
        path: "/",
        name: "首页",
        meta: {
          isLogin: true
        },
        component: () => import("../views/Index.vue")
      },
      {
        path: "/user",
        name: "用户模块",
        meta: {
          isLogin: true
        },
        component: () => import("../views/user/Index.vue")
      },
      {
        path: "/category",
        name: "分类模块",
        meta: {
          isLogin: true
        },
        component: () => import("../views/category/Index.vue")
      },
      {
        path: "/category/tree",
        name: "分类树状图",
        meta: {
          isLogin: true
        },
        component: () => import("../views/category/Tree.vue")
      },
      {
        path: "/goods",
        name: "商品模块",
        meta: {
          isLogin: true
        },
        component: () => import("../views/goods/Index.vue")
      },
      {
        path: "/comment",
        name: "评论模块",
        meta: {
          isLogin: true
        },
        component: () => import("../views/comment/Index.vue")
      },
      {
        path: "/order",
        name: "订单模块",
        meta: {
          isLogin: true
        },
        component: () => import("../views/order/Index.vue")
      },
      {
        path: "/banner",
        name: "轮播模块",
        meta: {
          isLogin: true
        },
        component: () => import("../views/banner/Index.vue")
      },
      {
        path: "/advert",
        name: "广告模块",
        meta: {
          isLogin: true
        },
        component: () => import("../views/advert/Index.vue")
      },
      {
        path: "/system",
        name: "系统模块",
        meta: {
          isLogin: true
        },
        component: () => import("../views/system/Index.vue")
      }
    ]
  }
];
