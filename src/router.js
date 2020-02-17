import Vue from "vue";
import VueRouter from "vue-router";
//引入自定义路由配置文件
import Routers from "./routers/index";
import Storage from "./store/storage";

//全局注册VueRouter组件
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash", //hash | history
  base: process.env.BASE_URL,
  routes: Routers //注册路由
});

//解决重复点导航的问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

//路由守卫
router.beforeEach((to, from, next) => {
  let title = "全新VUE电商项目";
  // console.log(to);
  if (to.name && to.name != "") {
    title = "全新VUE电商项目-" + to.name;
  }
  document.title = title;

  if (to.meta.isLogin) {
    let token = Storage.sessionGet("token");
    if (!token) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
