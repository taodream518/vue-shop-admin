<template>
  <Modal title="图片查看器" v-model="show">
    <div class="pic-warpper">
      <img :src="src" width="100%" />
      <span class="del">&times;</span>
    </div>
    <div slot="footer">
      <Button type="primary" @click="show = false">关闭</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: {
    is_show: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false
    };
  },
  watch: {
    is_show(val) {
      if (val) {
        this.show = true;
        this.$emit("closePicture");
      }
    }
  },
};
</script>

<style scoped lang="less">
.pic-warpper {
	border: 1px solid #ddd;
	position: relative;
  img {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }
  .del {
    font-size: 15px;
    width: 24px;
    height: 24px;
    background: #888;
    color: #eee;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    text-align: center;
    opacity: 0.7;
  }
}
</style>