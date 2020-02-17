<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">
            <router-link to="/">
              <img src="../../public/img/logo.png" />
            </router-link>
          </div>
          <div class="layout-nav">
            <MenuItem name="1">
              <Dropdown trigger="click">
                {{ userInfo.username }}
                <Icon type="md-arrow-dropdown" />
                <DropdownMenu slot="list">
                  <DropdownItem @click.native="change = true"><Icon type="md-create" />&nbsp;修改密码</DropdownItem>
                  <DropdownItem @click.native="out"><Icon type="md-power" />&nbsp;退出</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </MenuItem>
            <MenuItem name="2">
              <Avatar :src="userInfo.head_url"></Avatar>
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="1" theme="light" width="auto" :open-names="['1']">
            <MenuItem name="1" to="/">
              <Icon type="md-home" />首页
            </MenuItem>
            <MenuItem name="2" to="/user">
              <Icon type="md-people" />用户
            </MenuItem>
            <MenuItem name="3" to="/category">
              <Icon type="md-share" />分类
            </MenuItem>
            <MenuItem name="4" to="/goods">
              <Icon type="md-shirt" />商品
            </MenuItem>
            <MenuItem name="5" to="/comment">
              <Icon type="md-list" />评论
            </MenuItem>
            <MenuItem name="6" to="/order">
              <Icon type="md-list-box" />订单
            </MenuItem>
            <MenuItem name="7" to="/banner">
              <Icon type="md-photos" />轮播
            </MenuItem>
            <MenuItem name="8" to="/advert">
              <Icon type="md-images" />广告
            </MenuItem>
            <MenuItem name="9" to="/system">
              <Icon type="md-settings" />系统
            </MenuItem>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '24px',margin:'20px', minHeight: '280px', background: '#fff'}">
            <router-view></router-view>
          </Content>
          <Footer class="layout-footer-center">Copyright @2019 Design By Thinkphp5.1 And Vue</Footer>
        </Layout>
      </Layout>
    </Layout>

    <Modal title="修改密码" v-model="change" @on-ok="changePass">
      <Form :model="form" :label-width="100">
        <FormItem label="旧密码">
          <Input type="password" v-model="form.oldpassword" placeholder="请输入旧密码">
            <Icon type="md-lock" />
          </Input>
        </FormItem>
        <FormItem label="新密码">
          <Input type="password" v-model="form.password" placeholder="请输入新密码">
            <Icon type="md-lock" />
          </Input>
        </FormItem>
        <FormItem label="确认密码">
          <Input type="password" v-model="form.repassword" placeholder="请输入确认密码">
            <Icon type="md-lock" />
          </Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      change: false,
      header: {
        title: "",
        logo: "",
        keywords: "",
        description: ""
      },
      userInfo: {
        id: 0,
        username: "",
        head_url: "",
        login_time: ""
      },
      form: {
        id: 0,
        oldpassword: "",
        password: "",
        repassword: ""
      }
    };
  },

  mounted() {
    this.getHeader();
    this.loginInfo();
  },

  updated() {
    this.form.id = this.userInfo.id;
  },

  methods: {
    async getHeader() {
      let res = await this.$api.system.getHeader();
      if (res) {
        this.header = res;
      }
    },

    async loginInfo() {
      let res = await this.$api.common.loginInfo();
      if (res) {
        this.userInfo = res;
        this.$Message.success("登录成功");
      }
    },

    async out() {
      await this.$api.common.out();
      this.$Message.success("退出成功");
    },

    clear() {
      this.form = {};
    },

    async changePass() {
      await this.$api.common.changePass(this.form);
      this.clear();
    }
  },

  metaInfo() {
    return {
      title: this.header.title,
      meta: [
        {
          name: "keywords",
          content: this.header.keywords
        },
        {
          name: "description",
          content: this.header.description
        }
      ],
      link: [
        {
          href: this.header.logo,
          rel: "icon",
          type: "image/x-icon"
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;

  .layout-logo {
    width: 90px;
    height: 40px;
    position: absolute;
    top: 10px;
    left: 10px;
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .layout-nav {
    height: 100%;
    position: absolute;
    padding: 0 5%;
    top: 0;
    right: 0;
  }

  .layout-footer-center {
    text-align: center;
  }
}
</style>