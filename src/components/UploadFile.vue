<template>
  <Upload
    ref="upload"
    :on-success="uploadSuccess"
    :action="uploadFileUrl"
    :accept="Accept"
    :format="Format"
    :on-format-error="handleFormatError"
    :max-size="FileMaxSize"
    :on-exceeded-size="handleMaxSize"
    :show-upload-list="true"
    :data="uploadData"
  >
    <Button icon="ios-cloud-upload-outline">图片上传</Button>
  </Upload>
</template>

<script>
import Storage from '@/store/storage'

export default {

  mounted() {
    this.uploadData.token = Storage.sessionGet('token');
  },

  updated() {
    console.log(this.img);
    
  },

  data() {
    return {
      uploadFileUrl: "http://api.myvue.com/admin/system/upload",
      img: '',
      isShow: false,
      isShowTxt: "",
      Accept: "png,jpg,jpeg", //上传文件格式限制
      Format: ["png", "jpg", "jpeg"], //上传文件格式限制
      FileMaxSize: 1024 * 20, // 最大Kb
      uploadData: {
        token:''
      },
      // headers: { "Content-Type": "application/x-www-form-urlencoded" }
    };
  },

  methods: {
    // 判断上传类型是否错误
    handleFormatError(file) {
      console.log(file);
      this.isShowTxt = "*只支持jpg,png格式图片和pdf文件";
      this.isShow = true;
    },
    // 判断文件大小
    handleMaxSize(file) {
      console.log(file);
      this.isShowTxt = "文件不能超过2M";
      this.isShow = true;
    },
  
    // 上传成功
    uploadSuccess(res) {
      if (res.ret == 200) {
        this.img = res.data;
        // this.$refs.upload.clearFiles();
      } else {
        this.$Message.error(res.msg);
        // this.isShow = false;
      }
    },
    // successImgFile(e) {
    //   console.log(e);
    //   if (e.flag == 1) {
    //     this.getOrderDetail();
    //     this.$refs.upload.clearFiles();
    //     this.isShow = false;
    //   } else {
    //     this.isShowTxt = "上传失败，请从新上传";
    //     this.isShow = true;
    //   }
    // },
  }
};
</script>

  