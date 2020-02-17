<template>
  <div class="table">
    <h2 class="admin-title">{{title}}</h2>
    <Row>
      <Col :span="left" class="admin-operation">
        <slot name="head-left"></slot>
      </Col>
      <Col :span="right" class="admin-search">
        <slot name="head-right"></slot>
      </Col>
    </Row>

    <Table :data="data.data" :loading="loading" :columns="columns" border></Table>

    <Page class="page" :total="data.total" @on-change="page"></Page>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    left: {
      type: Number,
      default: 8
    },
    right: {
      type: Number,
      default: 16
    },
    columns: {
      type: Array,
      default: []
    },
    getData: {
      type: Function,
      default: null
    }
  },

  data() {
    return {
      loading: false,
      data: {
        total: 0,
        data: []
      }
    };
  },

  methods: {
    page(page) {
      this.fetchList(page);
    },

    async fetchList(page = 1) {
      if (!this.getData) {
        return false;
      }

      this.loading = true;

      let param = {
        page
      };

      let res = this.getData(param);

      // return [api,param] // getData返回[api,param]

      res = await res[0](res[1]);

      if (res) {
        this.data = res;
      } else {
        this.data = {
          // 没有值 初始化状态
          total: 0,
          data: []
        };
      }

      this.loading = false;

      return this.data;
    }
  }
};
</script>

<style lang="less">
.table {
  a {
    color: #2196f3;
  }
  .admin-title {
    padding-bottom: 10px;
    margin: 15px 5px;
    border-bottom: 1px solid #ddd;
    color: #5d616b;
  }
  .admin-operation {
    text-align: left;
  }
  .admin-search {
    text-align: right;
  }
  .page {
    text-align: right;
    margin: 10px 10px;
  }
}
</style>