<template>
  <el-dialog :visible.sync="showDialog" style="    margin-top: 2vh;">
    <create-sections title="基础信息">
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
  Create,
  Update
} from '@/api/kchk/warn'
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
      showDialog: true,
      list: [],
      maxlength: 300,
      checkedAll: [],
      fieldsRules: {}, // 字段列表需要验证,
      aoiinfo: {
        flag: 1,
        remark: ''

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
            flag: 1,
            remark: ''
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
    this.getBaseField()
  },
  methods: {
    saveClick(data) {
      if (!data) return
      this.aoiinfo.dutyUserId = this.userInfo.id
      if (this.aoiinfo.id) {
        Update(this.aoiinfo).then(res => {
          this.$message.success('修改成功')
          this.showDialog = false
          this.$emit('change', 'up')
        })
      } else {
        Create(this.aoiinfo).then(res => {
          this.$message.success('新增成功')
          this.showDialog = false
          this.$emit('change', 'add')
        })
      }
    },
    savechange() {
      this.isSave = !this.isSave
    },
    getBaseField() {
      const field = []
      field.push({
        field: 'code',
        formType: 'text',
        isNull: 1,
        name: '仓库编码',
        placeholder: '请输入',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.code : ''
      })
      field.push({
        field: 'name',
        formType: 'text',
        isNull: 1,
        name: '仓库名称',
        placeholder: '',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.name : ''
      })
      field.push({
        field: 'address',
        formType: 'text',
        isNull: 1,
        width: 1,
        name: '仓库地址',
        placeholder: '请输入',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.address : ''
      })
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
      field.push({
        field: 'remark',
        formType: 'textarea',
        isNull: 0,
        name: '说明',
        placeholder: '请输入',
        row: 3,
        maxLength: 200,
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.remark : '',
        width: 1
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
/deep/.el-dialog{
    margin-top:2vh !important;
}
/deep/.el-dialog__footer{
    text-align: center !important;
}
</style>
