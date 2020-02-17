<template>
  <div>
    <TableList ref="table" title="用户列表" :columns="columns" :getData="list">
      <Button type="primary" @click="add" slot="head-left"><Icon type="md-add" /> 添加</Button>

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

    <PictureView
      :is_show="picture.is_show"
      :src="picture.src"
      @closePicture="picture.is_show = false"
    />

    <Modal :title="info.title" v-model="info.is_show" @on-ok="ok">
      <Form :model="form" :label-width="100">
        <FormItem label="用户名">
          <Input v-model="form.username" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem label="状态">
          <RadioGroup v-model="form.status">
            <Radio label="1">
              <span>启用</span>
            </Radio>
            <Radio label="2">
              <span>禁用</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="角色">
          <RadioGroup v-model="form.admin">
            <Radio label="0">
              <span>用户</span>
            </Radio>
            <Radio label="1">
              <span>管理员</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="头像">
          <Upload
            ref="uploadFile"
            action="http://api.myvue.com/admin/system/upload"
            :data="ext"
            :on-success="uploadSuccess"
          >
            <Button icon="ios-cloud-upload-outline">上传头像</Button>
          </Upload>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import TableList from "@/components/TableList";
import PictureView from "@/components/PictureView";
import Storage from '@/store/storage'

export default {
  components: {
    TableList,
    PictureView
  },

  data() {
    return {
      ext:{
        token:''
      },
      picture: {
        is_show: false,
        src: ""
      },
      info: {
        is_show: false,
        title: ""
      },
      search: {
        value: "",
        type: "username"
      },
      searchList: [
        {
          title: "用户名",
          value: "username"
        }
      ],
      form: {
        id: 0,
        username: "",
        head_url: "",
        admin: 0,
        status: 0
      },

      columns: [
        {
          title: "ID",
          key: "id",
          align: "center",
          width: "100px"
        },
        {
          title: "用户名",
          key: "username",
          align: "center"
        },
        {
          title: "头像",
          key: "head_url",
          align: "center",
          render: (h, param) => {
            return h("img", {
              attrs: {
                src: param.row.head_url
              },
              style: {
                width: "50%"
              },
              on: {
                click: () => {
                  this.picture.is_show = true;
                  this.picture.src = param.row.head_url;
                }
              }
            });
          }
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          render: (h, param) => {
            let btnType = "primary";
            if (param.row.status == 2) {
              btnType = "default";
            }
            return h(
              "Button",
              {
                props: {
                  type: btnType,
                  size: "small"
                },
                on: {
                  click: () => {
                    let status_text = "启用";
                    let status = 1;
                    if (param.row.status == 1) {
                      status_text = "禁用";
                      status = 2;
                    }
                    this.$Modal.confirm({
                      title: "提示",
                      content: "确定要" + status_text + "此账户吗",
                      onOk: () => {
                        this.changeStatus(param.row.id);
                      }
                    });
                  }
                }
              },
              param.row.status == 1 ? "禁用" : "启用"
            );
          }
        },
        {
          title: "创建时间",
          key: "time",
          align: "center"
        },
        {
          title: "角色",
          key: "admin_text",
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
                        title: "提示",
                        content: "确定要删除此账户吗",
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
                      this.info.title = "修改用户";
                      this.form.id = param.row.id;
                      this.detail();
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
    this.$refs.table.fetchList();
  },

  methods: {
    list(param) {
      param[this.search.type] = this.search.value;
      console.log(param);
      return [this.$api.user.list, param];
    },

    async detail() {
      this.$Spin.show();
      let res = await this.$api.user.info({ id: this.form.id });
      if (res) {
        this.form = res;
      }
      this.$Spin.hide();
    },
    async changeStatus(id) {
      let res = await this.$api.user.changeStatus({ id });
      if (res) {
        this.$refs.table.fetchList();
        this.$Message.success("操作成功");
      }
    },
    async delete(id) {
      // console.log(id);
      let res = await this.$api.user.delete({ id });
      // console.log(res);//true
      if (res) {
        this.$refs.table.fetchList();
        this.$Message.success("删除成功");
      }
    },
    add() {
      this.info.is_show = true;
      this.info.title = "添加账户";
    },
    async insert(form) {
      let res = await this.$api.user.insert(form);
      if (res) {
        this.$Message.success("添加成功");
        this.$refs.table.fetchList();
      }
      this.clear();
    },
    async update(form) {
      let res = await this.$api.user.update(form);
      if (res) {
        this.$Message.success("修改成功");
        this.$refs.table.fetchList();
      }
      this.clear();
    },
    clear() {
      this.form = {};
      this.$refs.uploadFile.clearFiles();
    },
    ok() {
      if (this.form.id > 0) {
        this.update(this.form);
      } else {
        // 添加
        this.insert({
          username: this.form.username,
          head_url: this.form.head_url,
          admin: this.form.admin,
          status: this.form.status
        });
      }
    },
    uploadSuccess(res) {
      if (res.ret == 200) {
        this.form.head_url = res.data;
      } else {
        this.$Message.error(res.msg);
      }
    }
  }
};
</script>

