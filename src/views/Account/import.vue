<template>
  <el-dialog
    v-loading="loading"
    :visible.sync="showDialog"
    :append-to-body="true"
    :show-close="showCancel"
    :close-on-click-modal="false"
    title="批量导入"
    width="750px"
    @close="closeView"
  >
    <div class="dialog-body">
      <el-upload
        v-if="flag==true"
        :show-file-list="false"
        :http-request="fileUpload"
        action="http"
        drag
        multiple>
        <i class="wk wk-icon-upload upload-icon" />
        <div class="upload-name">点击或拖拽上传</div>
        <!-- <div class="content content-tips">
          <div>1、支持.xlsx格式，单次最多500条数据</div>
          <div>
            2、为确保上传数据与列表内容匹配，请先下载<span class="download" @click.stop="download">实例文件</span>
          </div>
          <div>3、数据标题单据号仅支持覆盖导入</div>
        </div> -->
      </el-upload>
      <div v-if="flag==false" style="border:1px dashed #d9d9d9;    width: 100%;   padding-top: 60px;height: 260px;    text-align: center;">
        <img src="../../assets/img/excel.png" alt="">
        <h1 style="font-size:15px">{{ params1.name }}({{ params1.sizev }}) <span class="el-icon-circle-close" @click="news"/></h1>
        <el-progress :stroke-width="12" :percentage="100" status="success" style="    padding: 0px 110px;"/>
      </div>
      <div v-if="flag==3">
        <el-table
          v-loading="loading"
          id="examine-table"
          :data="list"
          height="300"
          class="main-table"
          highlight-current-row>

          <el-table-column
            show-overflow-tooltip
            prop="creationTime"
            label="导入时间"/>

          <el-table-column
            prop="creatorName"
            label="操作人"
          />
          <el-table-column
            prop="importResult"
            label="导入结果"
          />
        </el-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        :class="{ 'is-hidden': !showCancel }" @click="closeView"
      >{{ flag==3?'关闭':'取消' }}</el-button
      >
      <el-button
        v-if="mbxz"
        :class="{ 'is-hidden': !showCancel }"
        @click="DownloadGoodsInfoExcel"
      >模板下载</el-button
      >
      <el-button v-if="flag!=3" :disabled="flag" type="primary" @click="uploads">{{
        sureTitle
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { downloadFileWithBuffer } from '@/utils'
import {
  userImportTemplateAPI,
  userErrorExcelDownAPI,
  ImportLogPageAysnc
} from '@/api/admin/employeeDep'
import request from '@/utils/request'
import axios from 'axios'
import { downloadExcelWithResData, verifyFileTypeWithFileName } from '@/utils'

export default {
  // 批量导入员工股
  name: 'BulkImportUser',
  components: {},
  props: {
    mbxz: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    // CRM类型
    crmType: {
      type: String,
      default: ''
    },
    // 地址
    url: {
      type: String,
      default: ''
    },
    importCategory: {
      type: String,
      default: 'Company'
    }
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      file: { name: '' },
      stepsActive: 1,
      percentage: 0,
      params: new FormData(),
      params1: {},
      flag: true,
      list: []
    }
  },
  computed: {
    sureTitle() {
      return '导入'
    },

    showCancel() {
      return this.stepsActive != 2
    }
  },
  watch: {
    show: function(val) {
      this.showDialog = val
      this.flag = true
      this.resetData()
    }
  },
  mounted() {},
  methods: {
    news() {
      this.flag = true
    },
    /** 附件上传 */
    fileUpload(val) {
      debugger
      window.valqwe = val
      if (val.file.name.indexOf('.xlsx') == -1) {
        this.$message.error('请上传xlsx格式文件')
        return
      } else if (val.file.type.indexOf('application/vnd.') == -1) {
        this.$message.error('请上传xlsx格式文件')
        return
      }
      this.params = new FormData()
      this.params1 = val.file
      this.params1.sizev = this.dateunit(this.params1.size)
      this.params.append('file', val.file)
      this.flag = false
    },
    dateunit(val) {
      if (val < 1024) {
        return val + 'B'
      } else if (
        val >= 1024 &&
        val < Math.pow(1024, 2)
      ) {
        return (
          parseFloat(val / 1024).toFixed(2) + 'KB'
        )
      } else if (
        val >= Math.pow(1024, 2) &&
        val < Math.pow(1024, 3)
      ) {
        return parseFloat(val / Math.pow(1024, 2)).toFixed(2) + 'MB'
      } else if (val > Math.pow(1024, 3)) {
        return (
          parseFloat(val / Math.pow(1024, 3)).toFixed(
            2
          ) + 'GB'
        )
      } else {
        return 0 + 'B'
      }
    },
    uploads() {
      const CancelToken = axios.CancelToken
      const self = this
      const config = {
        onUploadProgress: progressEvent => {
          console.log(progressEvent)
          const percentage =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0
          this.percentage = percentage
        },
        cancelToken: new CancelToken(function executor(c) {
          self.cancel = c
        })
      }
      this.loading = true
      return request({
        url: this.url,
        method: 'post',
        data: this.params,
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.$emit('success', 0)
        this.loading = false
        if (res.data.length > 0) {
          this.$message.error(res.data.join())
        }
        if (res.success == false) {
          this.$message.error(res.msg)
        }
        ImportLogPageAysnc({ 'maxResultCount': 20, 'skipCount': 0, importCategory: this.importCategory }).then(res => {
          this.list = res.items
          this.flag = 3
        })
      })
    },

    /**
     * 下载错误
     */
    downloadErrData() {
      this.getImportError(this.resultData.token)
    },

    /**
     * 导入错误下载
     */
    getImportError(token) {
      this.loading = true
      userErrorExcelDownAPI({
        token
      })
        .then(res => {
          downloadExcelWithResData(res)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 下载模板操作
     */
    download() {
      userImportTemplateAPI()
        .then(res => {
          downloadExcelWithResData(res)
        })
        .catch(() => {})
    },

    /**
     * 选择文件选择文件
     */
    selectFile() {
      this.$refs.userFileInput.click()
    },

    /**
     * 选择触发
     */
    uploadFile(event) {
      var files = event.target.files
      const file = files[0]
      if (verifyFileTypeWithFileName(file.name)) {
        this.file = file
        this.stepList[0].status = 'finish'
      }
      event.target.value = ''
    },
    DownloadGoodsInfoExcel() {
      return request({
        url: this.mbxz,
        method: 'post',
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        this.loading = false
        downloadFileWithBuffer(res).then((res) => {
          debugger
          this.list = res.items
          this.flag = 3
        })
      })
    },

    /**
     * 关闭
     */
    closeView() {
      this.$emit('close')
    },

    /**
     * 重置数据
     */
    resetData() {
      this.file = { name: '' }
      this.stepList = [
        {
          icon: 'wk wk-upload',
          title: '上传文件',
          status: 'wait'
        },
        {
          icon: 'wk wk-data-import',
          title: '导入数据',
          status: 'wait'
        },
        {
          icon: 'wk wk-success',
          title: '导入完成',
          status: 'wait'
        }
      ]
      this.stepsActive = 1
      this.resultData = null
    }
  }
}
</script>

<style scoped lang="scss">
.el-steps {
  margin-bottom: 15px;

  /deep/ .el-step__title {
    font-size: 14px;
  }

  /deep/ .el-step.is-simple .el-step__arrow::before,
  /deep/ .el-step.is-simple .el-step__arrow::after {
    height: 10px;
    width: 2px;
  }

  /deep/ .el-step.is-simple .el-step__arrow::after {
    transform: rotate(45deg) translateY(3px);
  }
  /deep/ .el-step.is-simple .el-step__arrow::before {
    transform: rotate(-45deg) translateY(-2px);
  }
}
  .download {
    cursor: pointer;
    color: #2362fb;

  }
.sections {
  font-size: 14px;
  min-height: 215px;
  .download {
    cursor: pointer;
    color: #2362fb;
    margin-bottom: 15px;
  }

  /deep/ .el-loading-spinner {
    top: 45%;
    .el-icon-loading {
      font-size: 40px;
      color: #999;
    }

    .el-loading-text {
      color: #333;
    }
  }
}

.content {
  padding: 10px 0;
}

.content-tips {
font-size: 13px;
    color: #999;
    text-align: left;
    margin-left: 147px;
    margin-top: 20px;
    line-height: 20px;
}

#importInputFile {
  display: none;
}

.file-select {
  .el-input {
    width: 400px;
  }
  button {
    margin-left: 20px;
  }
}

.is-hidden {
  visibility: hidden;
}

// 结果信息
.result-info {
  text-align: center;
  padding-top: 30px;

  &__icon {
    font-size: 40px;
    color: $xr-color-primary;
  }

  &__des {
    margin-top: 15px;
    color: #333;
    font-size: 14px;
  }

  &__detail {
    margin-top: 15px;
    font-size: 12px;
    color: #666;
    &--all {
      color: #333;
      font-weight: 600;
    }

    &--suc {
      color: $xr-color-primary;
      font-weight: 600;
    }

    &--err {
      color: #f94e4e;
      font-weight: 600;
    }
  }

  &__btn--err {
    margin-top: 10px;
  }
}
/deep/.el-upload {
      width: 100%;
          padding-top: 30px;
}
/deep/.el-upload-dragger{
  width: 100%;
  padding-top: 87px;
  height: 260px;
.upload-icon{

    font-size: 50px;

}
}
</style>
