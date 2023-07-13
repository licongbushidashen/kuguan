<template>
  <el-dialog v-if="showDialog" :visible.sync="showDialog" :close-on-click-modal="false" style="    " title="新建盘点">
    <create-sections>
      <mtForm :rules="fieldsRules" :field-from="aoiinfo" :field-list="fields" :is-save="isSave" @save="saveClick" @change="formChange"/>
    </create-sections>
    <span slot="footer" class="dialog-footer" style="text-align: center !important;margin-bottom: 20px !important;">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="savechange">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { objDeepCopy } from '@/utils'
import {
  Create,
  Update
} from '@/api/Inventory/kc'
import { parseTime } from '@/utils'
import { GetGoodsCategoryTreeHasRole } from '@/api/kchk/goods'
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
    showing: {
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
      submits: true,
      showDialog: true,
      list: [],
      maxlength: 300,
      checkedAll: [],
      fieldsRules: {}, // 字段列表需要验证,
      aoiinfo: {
        flag: 0,
        remark: '',
        wareHouseId: '',
        wareHouseName: '',
        goodsCategoryId: '',
        goodsCategoryName: ''
      },
      tree: [],
      fields: {},
      isSave: false,
      mining: false,
      isDefault: false

    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    showing: {
      handler(val) {
        this.showDialog = !this.showDialog
        if (!this.info.id) {
          this.aoiinfo = {
            flag: 0,
            remark: '',
            wareHouseId: '',
            wareHouseName: '',
            goodsCategoryId: '',
            goodsCategoryName: ''
          }
        } else {
          this.aoiinfo = this.info
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.gettree()
  },
  methods: {
    gettree() {
      GetGoodsCategoryTreeHasRole().then(res => {
        this.tree = res
        this.getBaseField()
      })
    },
    saveClick(data) {
      debugger
      if (!data) return
      if (!this.submits) {
        return
      }
      this.aoiinfo.startTime = parseTime(this.aoiinfo.startTime)
      this.aoiinfo.endTime = parseTime(this.aoiinfo.endTime)
      delete this.aoiinfo.goodsCategoryName
      this.submits = true
      if (this.aoiinfo.id) {
        Update(this.aoiinfo).then(res => {
          this.submits = false
          this.$message.success('修改成功')
          this.showDialog = false
          this.$emit('change', 'up')
        }).catch(() => {
          this.submits = true
        })
      } else {
        Create(this.aoiinfo).then(res => {
          this.submits = false
          this.$message.success('新增成功')
          this.showDialog = false
          this.$emit('change', 'add')
        }).catch(() => {
          debugger
          this.submits = true
        })
      }
    },
    formChange(id, type) {
      if (type == 'wareHouseId') {
        this.aoiinfo.wareHouseId = id.id
        // this.aoiinfo.wareHouseName = id.name
      }
    },
    savechange() {
      this.isSave = !this.isSave
    },
    getBaseField() {
      const field = []
      field.push({
        field: 'planName',
        formType: 'text',
        isNull: 1,
        name: '计划名称',
        placeholder: '请输入计划名称',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.planName : ''
      })
      field.push({
        field: 'checkWay',
        formType: 'selete',
        isNull: 1,
        name: '盘点方式',
        placeholder: '请选择盘点方式',
        setting: [
          { name: '明盘', id: 0 },
          { name: '暗盘', id: 1 }
        ],
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.checkWay : ''
      })
      field.push({
        field: 'goodsCategoryId',
        formType: 'selete',
        isNull: 1,
        name: '所属类目',
        placeholder: '请选择所属类目',
        setting: this.tree,
        inputTips: '',
        optionL: 'name',
        optionV: 'id',
        value: this.aoiinfo ? this.aoiinfo.goodsCategoryId : ''
      })
      field.push({
        field: 'wareHouseName',
        formType: 'open',
        isNull: 1,
        name: '盘点仓库',
        placeholder: '请选择仓库',
        setting: [
        ],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.wareHouseName : ''
      })

      field.push({
        field: 'startTime',
        formType: 'datetime',
        date: 'date',
        format: 'yyyy-MM-dd',
        isNull: 1,
        name: '开始时间',
        placeholder: '请选择开始时间',
        setting: [],
        inputTips: '',

        value: this.aoiinfo ? this.aoiinfo.startTime : ''
      })
      field.push({
        field: 'endTime',
        formType: 'datetime1',
        format: 'yyyy-MM-dd',
        date: 'date',
        isNull: 1,
        name: '结束时间',
        placeholder: '请选择结束时间',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.endTime : ''
      })
      field.push({
        field: 'operator',
        formType: 'seleteload',
        isNull: 1,
        name: '经办人',
        placeholder: '请选择经办人',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.operator : ''
      })
      // field.push({
      //   field: 'flag',
      //   formType: 'selete',
      //   isNull: 1,
      //   name: '状态',
      //   setting: [
      //     { name: '未开始', id: 0 },
      //     { name: '进行中', id: 1 },
      //     { name: '已完成', id: 2 }
      //   ],
      //   optionL: 'name',
      //   optionV: 'id',
      //   inputTips: ''
      // })
      field.push({
        field: 'remark',
        formType: 'textarea',
        isNull: 0,
        name: '备注',
        placeholder: '请输入备注',
        row: 3,
        maxLength: 200,
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.remark : ''
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
// /deep/.el-dialog{
    // margin-top:2vh !important;
// }
/deep/.el-dialog__footer{
    text-align: center !important;
}
</style>
