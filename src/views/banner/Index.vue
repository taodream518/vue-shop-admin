<template>
  <div>
    <TableList ref="table" title="轮播列表" :columns="columns" :getData="list">
      <Button type="primary" slot="head-left" @click="form.is_show=true; form.title='添加轮播'"><Icon type="md-add" /> 添加</Button>
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

    <Modal :title="form.title" v-model="form.is_show" @on-ok="ok">
      <Form :model="form.data" :label-width="100">
        <FormItem label="标题">
          <Input v-model="form.data.title" placeholder="请输入标题"></Input>
        </FormItem>
        <FormItem label="链接">
          <Input v-model="form.data.url" type="url" placeholder="请输入链接"></Input>
        </FormItem>
        <FormItem label="位置">
          <Input v-model="form.data.pos" type="number" placeholder="请输入位置"></Input>
        </FormItem>
        <FormItem label="图片">
          <!-- <UploadFile /> -->
          <Upload
            ref="upload"
            action="http://api.myvue.com/admin/system/upload"
            :data="ext"
            :on-success="uploadSuccess"
          >
            <Button icon="ios-cloud-upload-outline">上传轮播</Button>
          </Upload>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import TableList from "@/components/TableList";
import PictureView from "@/components/PictureView";
// import UploadFile from '../../components/UploadFile'
import Storage from '@/store/storage'

export default {
  components: {
    TableList,
    PictureView,
    // UploadFile
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
      form: {
        is_show: false,
        title: "",
        data: {
          id: 0,
          title: "",
          img: "",
          url: "",
          pos: 0
        }
      },
      search: {
        value: "",
        type: "title"
      },
      searchList: [
        {
          title: "轮播标题",
          value: "title"
        },
        {
          title: "轮播位置",
          value: "pos"
        }
      ],
      columns: [
        {
          title: "标题",
          key: "title",
          align: "center"
        },
        {
          title: "图片",
          key: "img",
          align: "center",
          render: (h, param) => {
            return h("img", {
              attrs: {
                src: param.row.img
              },
              style: {
                width: "50%"
              },
              on: {
                click: () => {
                  this.picture = {
                    is_show: true,
                    src: param.row.img
                  };
                }
              }
            });
          }
        },
        {
          title: "链接",
          key: "url",
          align: "center"
        },
        {
          title: "位置",
          key: "pos",
          align: "center"
        },
        {
          title: "创建时间",
          key:"create_time",
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
                      this.form.title = "修改轮播";
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
    this.$refs.table.fetchList();
  },

  watch: {
    "form.is_show"(val) {
      if (val) {
        this.$refs.upload.clearFiles();
      }
    }
  },

  methods: {
    list(param) {
      param[this.search.type] = this.search.value;

      return [this.$api.banner.list, param];
    },

    async delete(id) {
      let res = await this.$api.banner.delete({ id });
      if (res) {
        this.$Message.success("删除成功");
        this.$refs.table.fetchList();
      }
    },

    async info(id) {
      this.$Spin.show();
      let res = await this.$api.banner.info({ id });
      if (res) {
        this.form.data = res;
      }
      this.$Spin.hide();
    },

    clear() {
      this.form.data = {};
      this.$refs.upload.clearFiles();
      this.$refs.table.fetchList();
    },

    async ok() {
      if (this.form.data.id > 0) {
        await this.update({
          id: this.form.data.id,
          title: this.form.data.title,
          img: this.form.data.img,
          pos: this.form.data.pos,
          url: this.form.data.url
        });
      } else {
        await this.insert({
          title: this.form.data.title,
          img: this.form.data.img,
          pos: this.form.data.pos,
          url: this.form.data.url
        });
      }

      await this.clear();
    },

    async insert(form) {
      let res = await this.$api.banner.insert(form);
      if (res) {
        this.$Message.success("添加成功");
      }
    },

    async update(form) {
      let res = await this.$api.banner.update(form);
      if (res) {
        this.$Message.success("修改成功");
      }
    },

    uploadSuccess(res) {
      if (res.ret == 200) {
        this.form.data.img = res.data;
      } else {
        this.$Message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>

