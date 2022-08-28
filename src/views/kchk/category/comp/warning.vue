<template>
  <el-dialog :visible.sync="showDialog" title="预警设置" width="750px">
    <create-sections title="库存预警">
      <div class="kuwaring">库存总量 <span class="ku-ap">上限</span><el-input v-model="ware.allup" placeholder="请输入"/><span>下限</span><el-input v-model="ware.alldown" placeholder="请输入"/></div>
    </create-sections>


    <create-sections title="出库预警">
      <div class="kuwaring">每单预警 <span class="ku-ap">上限</span><el-input v-model="ware.oneup" placeholder="请输入"/><span>下限</span><el-input v-model="ware.onedown" placeholder="请输入"/></div>
      <div class="kuwaring">月度预警 <span class="ku-ap">上限</span><el-input v-model="ware.mouthup" placeholder="请输入"/><span>下限</span><el-input v-model="ware.mouthdown" placeholder="请输入"/></div>
      <div class="kuwaring">季度预警 <span class="ku-ap">上限</span><el-input v-model="ware.quarterup" placeholder="请输入"/><span>下限</span><el-input v-model="ware.quarterdown" placeholder="请输入"/></div>
    </create-sections>
    <create-sections>
      <mtForm :rules="fieldsRules" :field-from="aoiinfo" :field-list="fields" :is-save="isSave" @save="saveClick"/>
    </create-sections>
    <span slot="footer" class="dialog-footer" style="text-align: center !important;">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="savechange">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { objDeepCopy } from '@/utils'
import {
  Getrole,
  CreateRole
  // updataRole
} from '@/api/kchk/goods'
import CreateSections from '@/components/CreateSections'
import mtForm from '@/components/mtForm/index'
import GenerateRulesMixin from '@/components/NewCom/WkForm/GenerateRules'
export default {
  components: {
    CreateSections,
    mtForm
  },
  mixins: [GenerateRulesMixin],
  props: {
    warningshowing: {
      type: Boolean
    },
    ids: {
      type: Array,
      default: () => {
        return []
      }
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
      fieldsRules: {}, // 字段列表需要验证,
      aoiinfo: { flag: 1 },
      fields: {},
      isSave: false,
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
      alldata: [],
      slidingScales: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    warningshowing: {
      handler(val) {
        this.getBaseField()
        this.showDialog = !this.showDialog
        this.ware = {
          allup: '',
          alldown: '',
          oneup: '',
          onedown: '',
          mouthup: '',
          mouthdown: '',
          quarterup: '',
          quarterdown: ''
        }
        if (this.ids.length == 0) {
          this.getinfo()
        }
      }
    }
  },
  methods: {
    saveClick(data) {
      if (!data) return
      this.aoiinfo.dutyUserId = this.userInfo.id
      // this.aoiinfo.dutyUserId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    },
    getBaseField() {
      const field = []
      field.push({
        field: 'flag',
        formType: 'radio',
        isNull: 1,
        name: '状态',
        setting: [
          { name: '启用', id: 1 },
          { name: '禁用', id: 0 }
        ],
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.flag : 1
      })

      this.fields = this.handleFields(field).list
      this.fieldsRules = this.handleFields(field).fieldRules
    },
    /**
     * 调整字段
     */
    handleFields(list) {
      const fieldRules = {}
      const fieldForm = {}
      list.forEach(item => {
        fieldRules[item.field] = this.getRules(item)
        fieldForm[item.field] = item.value
      })
      return {
        list: objDeepCopy(list),
        fieldRules: fieldRules
      }
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
            'flag': this.aoiinfo.flag

          },
          {
            'orderKind': 3,
            'warningCategory': 23,
            'upperLimit': this.ware.oneup, // 上线
            'lowerLimit': this.ware.onedown, // 下限
            'slidingScales': 0,
            'flag': this.aoiinfo.flag

          },
          {

            'orderKind': 3,
            'warningCategory': 21,
            'upperLimit': this.ware.mouthup, // 上线
            'lowerLimit': this.ware.mouthdown, // 下限
            'slidingScales': 0,
            'flag': this.aoiinfo.flag

          },
          {
            'orderKind': 3,
            'warningCategory': 22,
            'upperLimit': this.ware.quarterup, // 上线
            'lowerLimit': this.ware.quarterdown, // 下限
            'slidingScales': 0,
            'flag': this.aoiinfo.flag

          },
          {
            'orderKind': 3,
            'warningCategory': 31,
            'upperLimit': 0, // 上线
            'lowerLimit': 0, // 下限
            'slidingScales': this.slidingScales ? this.slidingScales : 0,
            'flag': this.aoiinfo.flag
          }
        ],
        ids: this.ids.length ? this.ids : [this.info.id]

      }
      CreateRole(data).then(res => {
        this.$message.success('保存成功')
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
    },
    getinfo() {
      Getrole(this.info.id).then(res => {
        this.ware = {
          allup: '',
          alldown: '',
          oneup: '',
          onedown: '',
          mouthup: '',
          mouthdown: '',
          quarterup: '',
          quarterdown: ''
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
    }
  }
}
</script>
<style lang="scss" scoped>
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
