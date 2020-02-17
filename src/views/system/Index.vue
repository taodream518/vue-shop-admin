<template>
  <div>
    <TableList ref="table" title="系统管理" :columns="columns" :getData="list">
      <Button type="primary" slot="head-left" @click="form.is_show=true; form.title='添加系统设置'">
        <Icon type="md-add" />添加
      </Button>
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
          <Button type="info" @click="$refs.table.fetchList()">
            <Icon type="md-search" />搜索
          </Button>
        </FormItem>
      </Form>
    </TableList>

    <Modal :title="form.title" v-model="form.is_show" @on-ok="ok">
      <Form :model="form.data" :label-width="100">
        <FormItem label="网站标题">
          <Input v-model="form.data.title" placeholder="请输入网站标题"></Input>
        </FormItem>
        <FormItem label="关键字">
          <Input v-model="form.data.keywords" :rows="3" type="textarea" placeholder="请输入关键字"></Input>
        </FormItem>
        <FormItem label="描述">
          <Input v-model="form.data.description" :rows="6" type="textarea" placeholder="请输入描述"></Input>
        </FormItem>
        <FormItem label="图片">
          <Upload
            ref="uploadFile"
            action="http://api.myvue.com/admin/system/upload"
            :data="ext"
            :on-success="uploadSuccess"
          >
            <Button icon="ios-cloud-upload-outline">上传网站logo</Button>
          </Upload>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import TableList from "@/components/TableList";
import Storage from '@/store/storage'

export default {
  components: {
    TableList,
  },
  data() {
    return {
      ext:{
        token:''
      },
      total:0,// TableList返回的data.total
      picture: {
        is_show: false,
        src: ""
      },
      form: {
        is_show: false,
        title: "",
        data: {
          id: 0,
          title: "",
          logo: "",
          keywords: "",
          description: "",
        }
      },
      search: {
        value: "",
        type: "title"
      },
      searchList: [
        {
          title: "网站标题",
          value: "title"
        }
      ],
      columns: [
        {
          title: "网站标题",
          key: "title",
          align: "center"
        },
        {
          title: "网站logo",
          key: "logo",
          align: "center",
          render: (h, param) => {
            return h("img", {
              attrs: {
                src: param.row.logo
              },
              style: {
                width: "50%"
              },
            });
          }
        },
        {
          title: "关键字",
          key: "keywords",
          align: "center"
        },
        {
          title: "描述",
          key: "description",
          align: "center"
        },
        {
          title: "是否显示",
          key: "status",
          align: "center",
          render:(h,param) => {
            return h('i-switch',{
              props:{
                value:param.row.status,
                size:"small",
                trueValue:1,
                falseValue:0,
                trueColor:"#13ce66",
                falseColor:"#ff4949",
                disabled:this.total == 1 ? true : false,
              },
              on:{
                "on-change": () => {
                  this.changeStatus(param.row.id);
                }
              }
            });
          },
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center"
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
                        title: "删除",
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
                      this.form.is_show = true;
                      this.form.title = "修改系统设置";
                      this.info(param.row.id);
                      this.form.data.id = param.row.id;
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
    this.ext.token = Storage.sessionGet('token');
    //异步函数，返回promise对象
    this.$refs.table.fetchList().then(res => {
      if (res) {
        this.total = res.total;
      }
    });
  },

  watch: {
    "form.is_show"(val) {
      if (val) {
        this.$refs.uploadFile.clearFiles();
      }
    }
  },

  methods: {
    list(param) {
      param[this.search.type] = this.search.value;
      return [this.$api.system.list, param];
    },

    async delete(id) {
      let res = await this.$api.system.delete({ id });
      if (res) {
        this.$Message.success("删除成功");
        this.$refs.table.fetchList();
      }
    },

    async info(id) {
      this.$Spin.show();
      let res = await this.$api.system.info({ id });
      if (res) {
        this.form.data = res;
      }
      this.$Spin.hide();
    },

    clear() {
      this.form.data = {};
      this.$refs.uploadFile.clearFiles();
      this.$refs.table.fetchList();
    },

    async ok() {
      if (this.form.data.id > 0) {
        await this.update({
          id: this.form.data.id,
          title: this.form.data.title,
          keywords: this.form.data.keywords,
          description: this.form.data.description,
          logo: this.form.data.logo
        });
      } else {
        await this.insert({
          title: this.form.data.title,
          keywords: this.form.data.keywords,
          description: this.form.data.description,
          logo: this.form.data.logo
        });
      }

      await this.clear();
    },

    async insert(form) {
      let res = await this.$api.system.insert(form);
      if (res) {
        this.$Message.success("添加成功");
      }
    },

    async update(form) {
      let res = await this.$api.system.update(form);
      if (res) {
        this.$Message.success("修改成功");
      }
    },

    async changeStatus(id){
      let res = await this.$api.system.show({id});
      if (res) {
        this.$Message.success('操作成功');
      }
      this.$refs.table.fetchList();
    },

    uploadSuccess(res) {
      if (res.ret == 200) {
        this.form.data.logo = res.data;
      } else {
        this.$Message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>

