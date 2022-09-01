<template>
  <el-dialog :visible.sync="showDialog" title="计划管理" width="500px">
    <create-sections title="">
      <div class="kuwaring"><span class="ku-ap">浮动比例</span><el-tooltip
        effect="dark"
        placement="top">
        <div slot="content" v-html="'每月初根据上月货品的消耗总量分别设置浮动比例作为本月货品计划用量'"/>
        <i class="wk wk-help wk-help-tips" style="margin:0px;margin-left: 5px;"/>
      </el-tooltip><el-input v-model="slidingScales" placeholder="请输入"/></div>
      <!-- <div>
        <span>每月初根据上月货品的消耗总量分别设置浮动比例作为本月货品计划用量</span>
      </div> -->
    </create-sections>
    <span slot="footer" class="dialog-footer" style="text-align: center !important;">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="savechange">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import CreateSections from '@/components/CreateSections'
import {
  Getrole,
  CreateRole
  // updataRole
} from '@/api/kchk/goods'
export default {
  components: {
    CreateSections

  },
  props: {
    planing: {
      type: Boolean
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }},
  data() {
    return {
      showDialog: false,
      ware: {
        allup: null,
        alldown: null,
        oneup: null,
        onedown: null,
        mouthup: null,
        mouthdown: null,
        quarterup: null,
        quarterdown: null
      },
      flag: false,
      slidingScales: ''
    }
  },
  watch: {
    planing: {
      handler(val) {
        this.showDialog = !this.showDialog
        this.slidingScales = ''
        this.getinfo()
      }
    }
  },
  methods: {
    getinfo() {
      Getrole(this.info.id).then(res => {
        this.ware = {
          allup: null,
          alldown: null,
          oneup: null,
          onedown: null,
          mouthup: null,
          mouthdown: null,
          quarterup: null,
          quarterdown: null
        }
        res.length > 0 ? this.flag = true : this.flag = false
        this.alldata = res
        for (let i = 0; i < res.length; i++) {
          if (res[i].warningCategory == 11) {
            this.ware.allup = res[i].upperLimit
            this.ware.alldown = res[i].lowerLimit
          } else if (res[i].warningCategory == 21) {
            this.ware.mouthup = res[i].upperLimit
            this.ware.mouthdown = res[i].lowerLimit
          } else if (res[i].warningCategory == 22) {
            this.ware.quarterup = res[i].upperLimit
            this.ware.quarterdown = res[i].lowerLimit
          } else if (res[i].warningCategory == 23) {
            this.ware.oneup = res[i].upperLimit
            this.ware.onedown = res[i].lowerLimit
          } else if (res[i].warningCategory == 31) {
            this.slidingScales = res[i].slidingScales
          }
        }

        console.log(res)
      })
    },
    savechange() {
      // if (this.flag) {
      const data = {
        listDto: [
          {

            'orderKind': 3,
            'warningCategory': 11,
            'upperLimit': this.ware.allup, // 上线
            'lowerLimit': this.ware.alldown, // 下限
            'slidingScales': 0,
            'flag': this.alldata.length ? this.alldata.filter(e => e.warningCategory == '11')[0].flag : 0

          },
          {

            'orderKind': 3,
            'warningCategory': 23,
            'upperLimit': this.ware.oneup, // 上线
            'lowerLimit': this.ware.onedown, // 下限
            'slidingScales': 0,
            'flag': this.alldata.length ? this.alldata.filter(e => e.warningCategory == '23')[0].flag : 0

          },
          {
            'orderKind': 3,
            'warningCategory': 21,
            'upperLimit': this.ware.mouthup, // 上线
            'lowerLimit': this.ware.mouthdown, // 下限
            'slidingScales': 0,
            'flag': this.alldata.length ? this.alldata.filter(e => e.warningCategory == '21')[0].flag : 0

          },
          {
            'orderKind': 3,
            'warningCategory': 22,
            'upperLimit': this.ware.quarterup, // 上线
            'lowerLimit': this.ware.quarterdown, // 下限
            'slidingScales': 0,
            'flag': this.alldata.length ? this.alldata.filter(e => e.warningCategory == '22')[0].flag : 0
          },
          {
            'orderKind': 3,
            'warningCategory': 31,
            'upperLimit': 0, // 上线
            'lowerLimit': 0, // 下限
            'slidingScales': this.slidingScales == '' ? null : this.slidingScales,
            'flag': this.alldata.length ? this.alldata.filter(e => e.warningCategory == '31')[0].flag : 0
          }
        ],
        ids: [this.info.id]

      }
      CreateRole(data).then(res => {
        this.$message.success('保存')
        this.showDialog = false
      })
      // }
      // else {
      //   const data = [
      //     {
      //       'orderKind': 3,
      //       'warningCategory': 11,
      //       'goodsId': this.info.id,
      //       'upperLimit': this.ware.allup, // 上线
      //       'lowerLimit': this.ware.alldown, // 下限
      //       'slidingScales': 0,
      //       'flag': this.aoiinfo.flag
      //     },
      //     {
      //       'orderKind': 3,
      //       'warningCategory': 23,
      //       'goodsId': this.info.id,
      //       'upperLimit': this.ware.oneup, // 上线
      //       'lowerLimit': this.ware.onedown, // 下限
      //       'slidingScales': 0,
      //       'flag': this.aoiinfo.flag
      //     },
      //     {
      //       'orderKind': 3,
      //       'warningCategory': 21,
      //       'goodsId': this.info.id,
      //       'upperLimit': this.ware.mouthup, // 上线
      //       'lowerLimit': this.ware.mouthdown, // 下限
      //       'slidingScales': 0,
      //       'flag': this.aoiinfo.flag
      //     },
      //     {
      //       'orderKind': 3,
      //       'warningCategory': 22,
      //       'goodsId': this.info.id,
      //       'upperLimit': this.ware.quarterup, // 上线
      //       'lowerLimit': this.ware.quarterdown, // 下限
      //       'slidingScales': 0,
      //       'flag': this.aoiinfo.flag
      //     }, {
      //       'orderKind': 3,
      //       'warningCategory': 31,
      //       'goodsId': this.info.id,
      //       'upperLimit': 0, // 上线
      //       'lowerLimit': 0, // 下限
      //       'slidingScales': 0,
      //       'flag': this.aoiinfo.flag
      //     }
      //   ]
      //   CreateRole(data).then(res => {
      //     this.$message.success('创建成功')
      //     this.showDialog = false
      //   })
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/.el-dialog__body{
    min-height: auto !important;
  }
.kuwaring{
      padding-left: 16px;
}
.kuwaring /deep/.el-input{
    width:200px;
    margin:0px 20px;
    margin-bottom:20px;
        margin-left: 16px;
}
.ku-ap{
    margin-left: 10px;
}
/deep/.el-dialog__body{
    padding-left:50px !important ;
}
/deep/.el-dialog__footer{
    text-align: center !important;
}
</style>
