import ajax from './axios';

let api = {
  //用户模块
  user: {
    list: param => {
      return ajax.post("user/list", param);
    },
    info: id => {
      return ajax.post("user/info", id);
    },
    insert: param => {
      return ajax.post("user/insert", param);
    },
    delete: id => {
      return ajax.post("user/delete", id);
    },
    update: param => {
      return ajax.post("user/update", param);
    },
    changeStatus: id => {
      return ajax.post("user/changeStatus", id);
    }
  },

  //分类模块
  category: {
    list: param => {
      return ajax.post("category/list", param);
    },
    treeList: () => {
      return ajax.post("category/treelist");
    },
    htmlList: () => {
      return ajax.post("category/htmllist");
    },
    detail: id => {
      return ajax.post("category/info", id);
    },
    insert: param => {
      return ajax.post("category/insert", param);
    },
    delete: id => {
      return ajax.post("category/delete", id);
    },
    update: param => {
      return ajax.post("category/update", param);
    }
  },

  //商品模块
  goods: {
    list: param => {
      return ajax.post("goods/list", param);
    },
    detail: id => {
      return ajax.post("goods/detail", id);
    },
    insert: param => {
      return ajax.post("goods/insert", param);
    },
    delete: id => {
      return ajax.post("goods/delete", id);
    },
    update: param => {
      return ajax.post("goods/update", param);
    },
    changeStatus: id => {
      return ajax.post("goods/changeStatus", id);
    }
  },

  //评论模块
  comment: {
    list: param => {
      return ajax.post("comment/list", param);
    },
    delete: id => {
      return ajax.post("comment/delete", id);
    }
  },

  //订单模块
  order: {
    list: param => {
      return ajax.post("order/list", param);
    },
    info: id => {
      return ajax.post("order/info", id);
    },
    changeStatus: param => {
      return ajax.post("order/changeStatus", param);
    },
    delete: id => {
      return ajax.post("order/delete", id);
    }
  },

  //轮播模块
  banner: {
    list: param => {
      return ajax.post("banner/list", param);
    },
    info: id => {
      return ajax.post("banner/info", id);
    },
    insert: param => {
      return ajax.post("banner/insert", param);
    },
    delete: id => {
      return ajax.post("banner/delete", id);
    },
    update: param => {
      return ajax.post("banner/update", param);
    },
    changeStatus: param => {
      return ajax.post("banner/changeStatus", param);
    }
  },

  //广告模块
  advert: {
    list: param => {
      return ajax.post("advert/list", param);
    },
    info: id => {
      return ajax.post("advert/info", id);
    },
    insert: param => {
      return ajax.post("advert/insert", param);
    },
    delete: id => {
      return ajax.post("advert/delete", id);
    },
    update: param => {
      return ajax.post("advert/update", param);
    },
    changeStatus: param => {
      return ajax.post("advert/changeStatus", param);
    }
  },

  //系统模块
  system: {
    list: param => {
      return ajax.post("system/list", param);
    },
    info: id => {
      return ajax.post("system/info", id);
    },
    insert: param => {
      return ajax.post("system/insert", param);
    },
    delete: id => {
      return ajax.post("system/delete", id);
    },
    update: param => {
      return ajax.post("system/update", param);
    },
    show: id => {
      return ajax.post("system/show", id);
    },
    getHeader: () => {
      return ajax.post("system/getHeader");
    }
  },

  //common
  common: {
    login: param => {
      return ajax.post("common/login", param);
    },
    loginInfo: () => {
      return ajax.post("common/loginInfo");
    },
    out: () => {
      return ajax.post("common/out");
    },
    changePass: param => {
      return ajax.post("common/changePass", param);
    }
  }
};

export default {
    install : Vue => {
        Vue.api = api;
        Vue.prototype.$api = api;
    }
}