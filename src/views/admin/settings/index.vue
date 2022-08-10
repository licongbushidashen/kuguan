<template>
  <div>
    <p>钉钉消息通知<span>未设置</span></p>
    <p>邮箱消息通知<span>未设置</span></p>
    <p>短信消息通知<span>未设置</span></p>
    <el-button
      class="xr-btn--green"
    >编辑</el-button
    >
    <!-- <el-dialog
    v-loading="loading"
    :title="title"
    :width="width"
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="showDialog"
    @close="hiddenView"
  >
    <flexbox class="content">
      <div class="cropper-box">
        <vueCropper
          ref="cropper"
          :can-move="true"
          :auto-crop="true"
          :fixed="true"
          :fixed-number="fixedNumber"
          :img="cropperImg"
          output-type="png"
          @realTime="realTime"
        />
      </div>
      <div class="preview">
        <div class="preview-name">预览</div>
        <img
          :style="{
            width: previewWidth,
            height: previewHeight,
            'border-radius': previewRadius
          }"
          :src="previewImg"
          class="preview-img"
        >
      </div>
    </flexbox>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submiteImage()">{{
        saveButtonTitle
      }}</el-button>
    </div>
  </el-dialog> -->
  </div>
</template>
<style  lang="scss" scoped>
.xr-btn--green{
    color: #fff;
    margin-left: 20px;
    margin-top: 20px;
}
p{
    margin: 0 20px;
    font-size: 16px;
    font-weight: 500;
    color: #2a304d;
    line-height: 36px;
    span{
        margin-left: 30px;
    }
}
</style>
<style>

</style>
