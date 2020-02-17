<template>
  <div class="comment">
    <TableList ref="table" title="评论列表" :right="24" :columns="columns" :getData="list">
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
      search: {
        value: "",
        type: "goods_name"
      },
      searchList: [
        {
          title: "商品名称",
          value: "goods_name"
        },
        {
          title: "用户名",
          value: "username"
        }
      ],
      columns: [
        {
          title: "用户名",
          key: "username",
          align: "center"
        },
        {
          title: "评论商品",
          key: "goods_name",
          align: "center"
        },
        {
          title: "评论内容",
          key: "content",
          align: "center",
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                props: {
                  placement: "right-end",
                  transfer: true,
                  theme: "light",
                  delay: 800
                }
              },
              [
                params.row.content,
                h(
                  "span",
                  {
                    slot: "content",
                    style: {
                      whiteSpace: "normal",
                      wordBreak: "break-all",
                    }
                  },
                  params.row.content
                )
              ]
            );
          }
        },
        {
          title: "创建时间",
          key: "time",
          align: "center"
        },
        {
          title: "操作",
          align: "center",
          render: (h, param) => {
            return h(
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
                      content: "确定要删除吗？",
                      onOk: () => {
                        this.delete(param.row.id);
                      }
                    });
                  }
                }
              },
              "删除"
            );
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
      return [this.$api.comment.list, param];
    },

    async delete(id) {
      let res = await this.$api.comment.delete({ id });
      if (res) {
        this.$refs.table.fetchList();
        this.$Message.success("删除成功");
      }
    }
  }
};
</script>

<style lang="less">
.comment {
  .ivu-tooltip-rel {
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    text-align: center;
  }
}
</style>