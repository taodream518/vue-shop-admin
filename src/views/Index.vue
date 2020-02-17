<template>
  <div class="admin-container">
    <div class="admin-content">
      <h2>
        <Icon type="md-alert" />&nbsp;尊敬的
        <span>{{userInfo.username}}</span> 用户，您好！欢迎登录到后台管理系统！
      </h2>
      <img src="../../public/img/index.png" />
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    };
  },

  mounted() {
    this.loginInfo();
  },
  methods: {
    async loginInfo() {
      this.$Spin.show();
      let res = await this.$api.common.loginInfo();
      if (res) {
        this.userInfo = res;
      }
      this.$Spin.hide();

    }
  }
};
</script>

<style lang="less" scoped>
.admin-container {
  max-width: 768px;
  .admin-content {
    h2 {
      padding: 15px 5px;
      color: #464849;
      span {
        color: #5470f0;
        font-weight: bold;
      }
    }
    img {
      width: 100%;
      border-radius: 4px;
    }
	}
}
</style>