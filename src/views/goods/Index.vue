<template>
  <div>
    <TableList ref="table" title="商品列表" :right="24" :columns="columns" :getData="list">
      <Button type="primary" @click="add" slot="head-left">
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
            <Icon type="ios-search" />搜索
          </Button>
        </FormItem>
      </Form>
    </TableList>

    <Modal title="商品详情" v-model="info.is_show" :width="800">
      <Divider>基本信息</Divider>
      <table class="goods-table" border="1">
        <tr>
          <th>商品名称</th>
          <th>商品分类</th>
          <th>价格</th>
          <th>库存</th>
        </tr>
        <tr>
          <td>{{info.data.name}}</td>
          <td>{{info.data.class_name}}</td>
          <td>{{info.data.sell_price}}</td>
          <td>{{info.data.stock}}</td>
        </tr>
      </table>
      <Divider>商品描述</Divider>
      <Input type="textarea" readonly v-model="info.data.desc"></Input>
      <Divider>商品图片</Divider>
      <Row :gutter="20">
        <Col span="4" v-for="(item, index) of info.data.imgs" :key="index">
          <img
            :src="item"
            width="100%"
            style="cursor:pointer"
            @click="picture.is_show = true; picture.src = item"
          />
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" @click="info.is_show = false">关闭</Button>
      </div>
    </Modal>

    <PictureView
      :is_show="picture.is_show"
      :src="picture.src"
      @closePicture="picture.is_show = false"
    />
    <Modal :title="operation.title" v-model="operation.is_show" @on-ok="ok">
      <Form :model="form" :label-width="100">
        <FormItem label="商品名称">
          <Input v-model="form.name" placeholder="请输入商品名称"></Input>
        </FormItem>
        <FormItem label="商品分类">
          <Select v-model="form.class_id">
            <Option
              v-for="(item, index) of category"
              :disabled="item.parent_id == 0 ? true : false"
              :value="item.id"
              :key="index"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="价格">
          <Input type="number" placeholder="请输入价格" v-model="form.sell_price"></Input>
        </FormItem>
        <FormItem label="库存">
          <Input type="number" placeholder="请输入库存" v-model="form.stock"></Input>
        </FormItem>
        <FormItem label="描述">
          <Input type="textarea" v-model="form.desc" placeholder="请输入商品描述"></Input>
        </FormItem>
        <FormItem label="上传图片">
          <Upload
            ref="uploadFile"
            action="http://api.myvue.com/admin/system/upload"
            :on-success="uploadSuccess"
            :data="ext"
            multiple
          >
            <Button icon="ios-cloud-upload-outline">上传商品图片</Button>
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
        token:'',
      },
      picture: {
        is_show: false,
        src: ""
      },
      info: {
        is_show: false,
        data: {}
      },
      operation: {
        is_show: false,
        title: ""
      },
      category: [],
      form: {
        id: 0,
        name: "",
        class_id: 0,
        sell_price: 0.0,
        stock: 0,
        imgs: [],
        desc: ""
      },
      search: {
        type: "name",
        value: ""
      },
      searchList: [
        {
          title: "商品名称",
          value: "name"
        },
        {
          title: "分类名称",
          value: "class_name"
        }
      ],
      columns: [
        {
          title: "商品名称",
          key: "name",
          align: "center",
          render: (h, param) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.info.is_show = true;
                    this.detail(param.row.id);
                  }
                }
              },
              param.row.name
            );
          }
        },
        {
          title: "缩略图",
          key: "thumb",
          align: "center",
          render: (h, param) => {
            return h(
              "img",
              {
                style: {
                  width: "50%",
                  cursor: "pointer"
                },
                attrs: {
                  src: param.row.thumb
                },
                on: {
                  click: () => {
                    this.picture.is_show = true;
                    this.picture.src = param.row.thumb;
                  }
                }
              },
              param.row.name
            );
          }
        },
        {
          title: "所属分类",
          key: "class_name",
          align: "center"
        },
        {
          title: "商品名称",
          key: "name",
          align: "center"
        },
        {
          title: "价格",
          key: "sell_price",
          align: "center"
        },
        {
          title: "库存",
          key: "stock",
          align: "center"
        },
        {
          title: "上下架",
          key: "shelf",
          align: "center",
          render: (h, param) => {
            return h("i-switch", {
              props: {
                value: param.row.shelf == 1 ? true : false,
                size: "small",
                trueColor:"#13ce66",
                falseColor:"#ff4949",
              },
              on: {
                "on-change": () => {
                  this.changeStatus(param.row.id);
                }
              }
            });
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
                      this.operation.is_show = true;
                      this.operation.title = "修改商品";
                      this.detail(param.row.id);
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
    "operation.is_show"(val) {
      this.categoryList();
    }
  },

  methods: {
    add() {
      this.operation.is_show = true;
      this.operation.title = "添加商品";
    },

    async ok() {
      if (this.form.id > 0) {
        await this.update({
          id: this.form.id,
          name: this.form.name,
          class_id: this.form.class_id,
          sell_price: this.form.sell_price,
          stock: this.form.stock,
          imgs: this.form.imgs,
          desc: this.form.desc
        });
      } else {
        await this.insert({
          name: this.form.name,
          class_id: this.form.class_id,
          sell_price: this.form.sell_price,
          stock: this.form.stock,
          imgs: this.form.imgs,
          desc: this.form.desc
        });
      }
      this.clear();
    },
    clear() {
      this.form = {
        id: 0,
        name: "",
        class_id: 0,
        sell_price: 0.0,
        stock: 0,
        imgs: [],
        desc: ""
      };
      this.$refs.uploadFile.clearFiles();
      this.$refs.table.fetchList();
    },
    uploadSuccess(res) {
      if (res.ret == 200) {
        this.form.imgs.push(res.data);
      } else {
        this.$Message.error(res.msg);
        return false;
      }
      console.log(this.form.imgs);
    },

    list(param) {
      param[this.search.type] = this.search.value;
      console.log(param);
      return [this.$api.goods.list, param];
    },

    async insert(form) {
      let res = await this.$api.goods.insert(form);
      if (res) {
        this.$Message.success("添加成功");
      }
    },

    async update(form) {
      let res = await this.$api.goods.update(form);
      if (res) {
        this.$Message.success("修改成功");
      }
    },

    async detail(id) {
      this.$Spin.show();
      let res = await this.$api.goods.detail({ id });
      if (res) {
        this.info.data = res;
        this.form = res;
      }
      this.$Spin.hide();
    },

    async changeStatus(id) {
      let res = await this.$api.goods.changeStatus({ id });
      if (res) {
        this.$Message.success("操作成功");
        this.$refs.table.fetchList();
      }
    },
    async delete(id) {
      let res = await this.$api.goods.delete({ id });
      if (res) {
        this.$Message.success("删除成功");
        this.$refs.table.fetchList();
      }
    },

    async categoryList() {
      let res = await this.$api.category.htmlList();
      if (res) {
        this.category = res;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.goods-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  th,td {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
}
</style>
