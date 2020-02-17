<template>
  <div>
    <TableList ref="table" title="订单列表" :right="24" :columns="columns" :getData="list">
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

    <Modal title="修改订单状态" @on-ok="changeStatus" v-model="form.is_show">
      <Select prefix="md-checkmark-circle" v-model="form.status">
        <Option
          v-for="(item,index) in form.select"
          :key="index"
          :value="item.status"
        >{{ item.value }}</Option>
      </Select>
    </Modal>

    <Modal title="订单详情" v-model="info.is_show" width="800">
      <div class="order-title">
        <span>当前订单状态：{{ info.data.status_text }}</span>
      </div>
      <Divider>基本信息</Divider>
      <table class="order-table" border="1">
        <tr>
          <th>订单号</th>
          <th>订单商品</th>
          <th>下单人</th>
          <th>下单时间</th>
          <th>是否确认</th>
        </tr>
        <tr>
          <td>{{ info.data.code }}</td>
          <td>{{ info.data.title }}</td>
          <td>{{ info.data.username }}</td>
          <td>{{ info.data.time }}</td>
          <td>{{ info.data.affirm }}</td>
        </tr>
      </table>

      <Divider>商品信息</Divider>
      <table class="order-table" border="1">
        <tr>
          <th>商品名称</th>
          <th>图片</th>
          <th>所属分类</th>
          <th>数量</th>
          <th>价格</th>
        </tr>
        <tr v-for="(goods,index) in info.data.order_goods" :key="index">
          <td>{{ goods.name }}</td>
          <td>
            <img
              :src="goods.img"
              :alt="goods.name"
              @click="picture.is_show = true; picture.src = goods.img"
            />
          </td>
          <td>{{ goods.cate }}</td>
          <td>{{ goods.num }}</td>
          <td>{{ goods.sell_price }}</td>
        </tr>
      </table>

      <Divider>联系方式</Divider>
      <table class="order-table" border="1">
        <tr>
          <th>联系人</th>
          <th>联系电话</th>
          <th>邮箱</th>
          <th>联系地址</th>
        </tr>
        <tr>
          <td>{{ info.data.contact.name }}</td>
          <td>{{ info.data.contact.mobile }}</td>
          <td>{{ info.data.contact.email }}</td>
          <td>{{ info.data.contact.address }}</td>
        </tr>
      </table>
    </Modal>
    <PictureView
      :is_show="picture.is_show"
      :src="picture.src"
      @closePicture="picture.is_show = false"
    />
  </div>
</template>

<script>
import TableList from "@/components/TableList";
import PictureView from "@/components/PictureView";

export default {
  components: {
    TableList,
    PictureView
  },
  data() {
    return {
      picture: {
        is_show: false,
        src: ""
      },
      form: {
        is_show: false,
        id: 0,
        status: 0,
        select: [
          {
            value: "待收货",
            status: 2
          },
          {
            value: "已取消",
            status: 6
          }
        ]
      },
      info: {
        is_show: false,
        data: {
          affirm: "",
          code: "",
          contact: {},
          id: 0,
          is_delete: 0,
          is_pay: 0,
          order_goods: [],
          status: 0,
          status_text: "",
          time: "",
          title: "",
          user_id: 0,
          username: ""
        }
      },
      search: {
        value: "",
        type: "code"
      },
      searchList: [
        {
          title: "订单号",
          value: "code"
        },
        {
          title: "下单人",
          value: "username"
        }
      ],
      columns: [
        {
          title: "订单号",
          key: "code",
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
              param.row.code
            );
          }
        },
        {
          title: "订单商品",
          key: "title",
          align: "center"
        },
        {
          title: "下单人",
          key: "username",
          align: "center"
        },
        {
          title: "下单时间",
          key: "time",
          align: "center"
        },
        {
          title: "订单状态",
          key: "",
          align: "center",
          render: (h, param) => {
            //已完成和已支付
            if (param.row.status == 5 || param.row.is_pay == 2) {
              return h("Tag",{
                props: {
                  type:"dot",
                  color: "success"
                }
              },param.row.status_text);
            //已取消
            }else if(param.row.status == 6){
              return h("Tag",{
                props: {
                  type:"dot",
                  color: "error"
                }
              },param.row.status_text);
            //已发货
            }else{
              return h("Tag",{
                props: {
                  type:"dot",
                  color: "warning"
                }
              },param.row.status_text);
            }
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
                    size: "small",
                    disabled: param.row.status == 6 ? false : true
                  },
                  style: {
                    margin: "0 2px"
                  },

                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示",
                        content: "确定要删除此订单吗？",
                        
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
                    size: "small",
                    // 大于4禁用
                    disabled: param.row.status > 4 ? true : false
                  },
                  style: {
                    margin: "0 2px"
                  },
                  on: {
                    click: () => {
                      this.form.is_show = true;
                      this.form.id = param.row.id;
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

  methods: {
    list(param) {
      param[this.search.type] = this.search.value;
      console.log(param);
      return [this.$api.order.list, param];
    },

    async detail(id) {
      this.$Spin.show();
      let res = await this.$api.order.info({ id });
      if (res) {
        console.log(res);
        this.info.data = res;
      }
      this.$Spin.hide();
    },

    async delete(id) {
      let res = await this.$api.order.delete({ id });
      if (res) {
        this.$refs.table.fetchList();
        this.$Message.success("删除成功");
      }
    },

    async changeStatus() {
      let res = await this.$api.order.changeStatus({
        id: this.form.id,
        status: this.form.status
      });

      if (res) {
        this.$refs.table.fetchList();
        this.$Message.success("操作成功");
      }
    }
  }
};
</script>

<style scoped lang="less">
.order-title {
  padding: 10px 10px;
  font-size: 14px;
  color: #17233d;
  background: #ddd;
  border-radius: 4px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  th,
  td {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
}
</style>