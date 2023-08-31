<template>
  <div class="upload-box relative overflow-h cursor-point">
    <i class="el-icon-plus avatar-uploader-icon"></i>
    <input type="file" @change="fileUpload" class="file-input absolute top-0 left-0 cursor-point opacity-0">
  </div>
</template>

<script>
import { encryptionUpload } from '@/utils/tools.js'
export default {
  name: 'FileUpload',
  methods: {
    async fileUpload(file) {
      const url = await encryptionUpload(file)
      this.$emit('fileUpload', url)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-box {
  width: 158px;
  height: 158px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  &:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 158px;
    height: 158px;
    line-height: 158px;
    text-align: center;
    z-index: -1;
  }
  .file-input {
    width: 100%;
    height: 100%;
  }
}
</style>