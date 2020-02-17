export default {
  //session 设置缓存
  sessionSet(key, value) {
    this.sessionRemove(key);
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  sessionGet(key) {
    return JSON.parse(sessionStorage.getItem(key));
  },
  sessionRemove(key) {
    sessionStorage.removeItem(key);
  },

  //localStorage 设置缓存
  localSet(key, value) {
    this.localRemove(key);
    localStorage.setItem(key, JSON.stringify(value));
  },
  localGet(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  localRemove(key) {
    localStorage.removeItem(key);
  }
};