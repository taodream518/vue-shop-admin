<template>
  <div>
    <TableList ref="table" title="分类列表" :columns="columns" :getData="list">

      <span slot="head-left">
        <Button type="primary" style="margin:2px 5px" @click="add"><Icon type="md-add"/> 添加</Button>
        <Button type="primary" style="margin:2px 5px" @click="$router.push('/category/tree')"><Icon type="md-folder"/> 查看树状图</Button>
        <Button type="warning" v-if="this.isChild" @click="$router.go(-1)"><Icon type="md-arrow-back"/> 返回</Button>
      </span>

      <Form inline slot="head-right">
        <FormItem>
          <Input v-model="search.value" style="width:260px;" @keyup.enter.native="$refs.table.fetchList()">
            <Select v-model="search.type" slot="prepend" style="width:100px">
              <Option
                :value="item.value"
                v-for="(item, index) of searchList"
                :key="index"
              >{{item.title}}</Option>
            </Select>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="info" @click="$refs.table.fetchList()"><Icon type="md-search" /> 搜索</Button>
        </FormItem>
      </Form>
    </TableList>

    <Modal :title="info.title" v-model="info.is_show" @on-ok="ok">
      <Form :model="form" :label-width="100">
        <FormItem label="上级分类">
          <Select v-model="form.parent_id">
            <Option v-for="(item,index) in category" :key="index" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="分类名称">
          <Input v-model="form.name" placeholder="请输入分类名称"></Input>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>


<script>
import TableList from "@/components/TableList";

export default {
  components: {
    TableList
  },
  data() {
    return {
      isChild: false,
      category: [],
      search: {
        value: "",
        type: "name"
      },
      searchList: [
        {
          title: "分类名称",
          value: "name"
        }
      ],
      info: {
        title: "",
        is_show: false
      },
      form: {
        id: 0,
        parent_id: 0,
        name: ""
      },
      columns: [
        {
          title: "ID",
          key: "id",
          align: "center"
        },
        {
          title: "分类名称",
          key: "name",
          align: "center"
        },
        {
          title: "查看下级",
          align: "center",
          render: (h, param) => {
            return h(
              "Button",
              {
                props: {
                  type: "info",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.$router.push({
                      path: "/category",
                      query: {
                        id: param.row.id
                      }
                    });
                  }
                }
              },
              "查看下级"
            );
          }
        },
        {
          title: "操作",
          align: "center",
          render: (h, param) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示",
                        content: "确定删除吗？",
                        onOk: () => {
                          this.delete(param.row.id);
                        }
                      });
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    margin: "0 5px"
                  },
                  on: {
                    click: () => {
                      this.info.is_show = true;
                      this.info.title = "修改分类";
                      this.detail(param.row.id);
                      this.htmlList();
                    }
                  }
                },
                "修改"
              )
            ]);
          }
        }
      ]
    };
  },

  mounted() {
    this.$refs.table.fetchList();
  },

  watch: {
    "$route.query"(val) {
      if (val.id > 0) {
        this.isChild = true;
      } else {
        this.isChild = false;
      }
      this.$refs.table.fetchList();
    }
  },

  methods: {
    ok() {
      if (this.form.id > 0) {
        this.update({
          id: this.form.id,
          parent_id: this.form.parent_id,
          name: this.form.name
        });
      } else {
        this.insert({
          parent_id: this.form.parent_id,
          name: this.form.name
        });
      }

      this.$refs.table.fetchList();
      this.clear();
    },
    add() {
      this.info.is_show = true;
      this.info.title = "添加分类";
      this.htmlList();
    },
    clear() {
      this.form = {};
    },

    list(param) {
      param[this.search.type] = this.search.value;

      if(this.$route.query.id > 0){
				param['id'] = this.$route.query.id;
      }
      
      console.log(param);
      return [this.$api.category.list, param];
    },
    async htmlList() {
      let res = await this.$api.category.htmlList();
      if (res) {
        this.category = res;
      }
    },

    async update(form) {
      let res = await this.$api.category.update(form);
      if (res) {
        this.$Message.success("修改成功");
      }
    },

    async insert(form) {
      let res = await this.$api.category.insert(form);
      if (res) {
        this.$Message.success("添加成功");
      }
    },

    async delete(id) {
      let res = await this.$api.category.delete({ id });
      if (res) {
        this.$Message.success("删除成功");
        this.$refs.table.fetchList();
      }
    },

    async detail(id) {
      this.$Spin.show();
      let res = await this.$api.category.detail({ id });
      if (res) {
        this.form = res;
      }
      this.$Spin.hide();
    }
  }
};
</script>