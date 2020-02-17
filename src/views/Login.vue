<template>
  <div class="login">
    <div class="login-con">
      <Card style="width:280px">
        <p slot="title">欢迎登录</p>
        <Form :model="form" on-submit="return false">
          <FormItem prop="username">
            <Input type="text" v-model="form.username" clearable placeholder="请输入后台管理员账号">
              <Icon type="md-person" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input
              type="password"
              v-model="form.password"
              password
              @keyup.enter.native="login"
              placeholder="请输入后台管理员密码"
            >
              <Icon type="md-lock" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="login" long :loading="loading">登录</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        username: "",
        password: ""
      }
    };
  },

  methods: {
    async login() {
      this.loading = true;
      let res = await this.$api.common.login(this.form);
      if (res) {
        this.$router.push("/");
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  background-image: url("../../public/img/login.png");
  background-size: cover;
  background-position: 50%;
  position: relative;
}
.login-con {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-60%);
}
</style>

