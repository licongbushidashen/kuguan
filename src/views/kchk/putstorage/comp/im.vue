<template>
  <el-dialog
    v-if="showDialog"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    title="导入入库"
  >
    <el-steps
      :space="200"
      :active="active"
      finish-status="success"
      style="margin-left: 34%;"
    >
      <el-step title="基础信息" />
      <el-step title="导入明细" />
    </el-steps>
    <create-sections v-if="active == 0">
      <mtForm
        :rules="fieldsRules"
        :field-from="aoiinfo"
        :field-list="fields"
        :is-save="isSave"
        @change="formChange"
        @save="saveClick"
      />
    </create-sections>
    <div v-if="active == 1">
      <el-upload
        :headers="httpHeader"
        :on-success="handleAvatarSuccess"
        :on-remove="handleRemove"
        :show-file-list="false"
        :action="'/api/zjlab/Order/OderDetailImport/'+id"
        drag
        style="    line-height: 11px;    width: 100%;    margin: 20px 0;    padding: 0px 28px;"
      >
        <el-button
          size="small"
        ><i
          class="wk wk-icon-upload upload-icon"
          style="font-size: 12px;    margin-right: 5px;"
        />导入明细</el-button
        >
      </el-upload>
    </div>
    <!-- <span
      v-if="active == "
      slot="footer"
      class="dialog-footer"
      style="text-align: center !important;"
    >
      <el-button @click="showDialog = false">关闭</el-button>
      <el-button type="primary" @click="saves">提交</el-button>
    </span> -->
    <span
      v-if="active == 0"
      slot="footer"
      class="dialog-footer"
      style="text-align: center !important;"
    >
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="debouncedHandleLogin">下一步</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { filterTimestampToFormatTime } from '@/filters/index'
import { debounce } from 'throttle-debounce'
import { objDeepCopy } from '@/utils'
import { OrderCreate, GetOrder, UpdateOrder } from '@/api/kchk/order'
import { GetGoodsCategoryTreeHasRole } from '@/api/kchk/goods'
import CreateSections from '@/components/CreateSections'
import mtForm from '@/components/mtForm/index'
import GenerateRulesMixin from '@/components/NewCom/WkForm/GenerateRules'
import Cookies from 'js-cookie'
export default {
  components: {
    CreateSections,
    mtForm
  },
  mixins: [GenerateRulesMixin],
  props: {
    showing: {
      type: Boolean
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      httpHeader: {},
      id: '',
      active: 0,
      showDialog: true,
      fieldsRules: {}, // 字段列表需要验证,
      aoiinfo: {
        remark: '',
        goodsCategoryId: '',
        goodsCategoryDutyUserId: ''
      },
      tree: [],
      fields: {},
      isSave: false,
      ts: {}
    }
  },
  // computed: {
  //   httpHeader() {
  //     return {
  //       'Authorization': axios.defaults.headers['Authorization']
  //     }
  //   }
  // },
  watch: {
    showing: {
      handler(val) {
        debugger
        this.active = 0
        this.httpHeader = {
          'Authorization': `Bearer ${Cookies.get('accessToken')}`
        }
        this.showDialog = !this.showDialog
        this.aoiinfo = {
          remark: '',
          goodsCategoryId: '',
          categoryName: '',
          wareHouseId: '',
          wareHouseName: '',
          goodsCategoryDutyUserName: '',
          goodsCategoryDutyUserId: '',
          companyName: '',
          companyId: '',
          memoryCardName: '其他',
          memoryCardNumber: '其他'
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.gettree()
    this.debouncedHandleLogin = debounce(300, this.savechange)
  },
  methods: {
    saves() {
      const arr = []
      for (let i = 0; i < this.ts.detailList.length; i++) {
        const d = this.ts.detailList[i]
        arr.push({
          goodsId: d.goodsId || d.id,
          goodsCode: d.code || d.goodsCode,
          unitId: d.unitId,
          unitPrice: d.unitPrice,
          quantity: d.quantity,
          amountMoney: d.amountMoney,
          DefaultUnitId: d.DefaultUnitId
        })
      }
      const obj = {
        detaiList: arr,
        attachmentList: this.ts.attachmentList.map(e => e.id),
        order: {
          orderNo: this.ts.order.orderNo,
          wareHouseId: this.ts.order.wareHouseId,
          orderCategory: this.ts.order.orderCategory,
          goodsCategoryId: this.ts.order.goodsCategoryId,
          memoryCardNumber: this.ts.order.memoryCardNumber,
          memoryCardName: this.ts.order.memoryCardName,
          receiptDate: this.ts.order.receiptDate,
          remark: this.ts.order.remark,
          identification: 0,
          companyId: this.ts.order.companyId,
          flag: 1,
          goodsCategoryDutyUserId: this.ts.order.goodsCategoryDutyUserId
        }
      }
      UpdateOrder(obj, this.ts.order.id)
        .then(res => {
          debugger
          this.showDialog = false
          this.$store.dispatch('TaskCenterCount')

          this.$emit('change', this.ts.order.id)
        })
        .catch(() => {
        })
    },
    handleAvatarSuccess(v) {
      if (v.success) {
        if (v.data.length) {
          const arr = v.data.map(e => {
            return e + '<br/>'
          })
          this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            message: `删除失败：<br/>${
              arr.length > 0 ? arr.toString() : ''
            }`
          })
        } else {
          GetOrder(this.id).then(res => {
            if (res) { this.ts = res }
            this.showDialog = false
            this.$store.dispatch('TaskCenterCount')
            this.$emit('change', this.ts.order.id)

            // this.saves()
            // this.$confirm('导入成功', '提示', {
            //   confirmButtonText: '提交',
            //   cancelButtonText: '重新导入',
            //   type: 'success'
            // }).then(() => {

            // }).catch(() => {

            // })
          })
        }
      } else {
        this.$message.error(v.msg)
      }
    },
    handleRemove() {},
    gettree() {
      GetGoodsCategoryTreeHasRole().then(res => {
        this.tree = res
        this.getBaseField()
      })
    },
    formChange(id, type) {
      if (type == 'wareHouseId') {
        this.aoiinfo.wareHouseId = id.id
      }
      if (type == 'goodsCategoryDutyUserName') {
        this.aoiinfo.goodsCategoryDutyUserId = id.id
      }
      if (type == 'companyName') {
        this.aoiinfo.companyId = id.id
      }
    },

    /*
     * 当checkbox选择change时事件
     */
    saveClick(data) {
      if (!data) return
      this.aoiinfo.receiptDate = filterTimestampToFormatTime(
        new Date().getTime(),
        'YYYY-MM-DD HH:mm:ss'
      )
      OrderCreate(this.aoiinfo).then(res => {
        this.id = res.id
        this.active = 1
        this.$message.success('新增成功')
      })
    },
    savechange() {
      this.isSave = !this.isSave
    },
    getBaseField() {
      const field = []
      field.push({
        field: 'orderCategory',
        formType: 'selete',
        isNull: 1,
        name: '入库类型',
        placeholder: '请选择入库类型',
        setting: [
          {
            id: 11,
            name: '采购入库'
          },
          {
            id: 12,
            name: '退货入库'
          },
          {
            id: 13,
            name: '借用还库'
          }
        ],
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.orderCategory : ''
      })
      field.push({
        field: 'orderNo',
        formType: 'text',
        isNull: 0,
        name: '单据号',
        placeholder: '系统自动填充',
        disabled: true,
        setting: [],
        inputTips: '',
        value: ''
      })
      field.push({
        field: 'goodsCategoryId',
        formType: 'selete',
        isNull: 1,
        name: '货品类目',
        placeholder: '请选择货品类目',
        setting: this.tree,
        inputTips: '',
        optionL: 'name',
        optionV: 'id',
        value: this.aoiinfo ? this.aoiinfo.goodsCategoryId : ''
      })

      field.push({
        field: 'goodsCategoryDutyUserName',
        formType: 'open',
        isNull: 1,
        name: '类目负责人',
        placeholder: '请选择负责人',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.goodsCategoryDutyUserName : ''
      })
      field.push({
        field: 'wareHouseName',
        formType: 'open',
        isNull: 1,
        name: '仓库',
        placeholder: '请选择仓库',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.wareHouseName : ''
      })
      field.push({
        field: 'companyName',
        formType: 'open',
        isNull: 1,
        name: '往来单位',
        placeholder: '请选择往来单位',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.companyName : ''
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
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-upload {
  width: 100%;
}
/deep/ .el-upload-dragger {
  width: 100%;
  padding-top: 87px;
  height: 260px;
}
/deep/.el-table--fit {
  border: 1px solid #ebeef5 !important;
  border-bottom: 0px solid #ebeef5 !important;
}
// /deep/.el-dialog{
// margin-top:2vh !important;
// }
/deep/.el-dialog__footer {
  text-align: center !important;
}
</style>
<style lang="less">
.create-sections1 {
  .content {
    padding: 0 25px;
  }
}
</style>
