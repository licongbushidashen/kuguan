<template>
  <el-dialog v-if="showDialog" :visible.sync="showDialog" :close-on-click-modal="false" :title="title" style="    ">
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
import { objDeepCopy } from '@/utils'
import { mapGetters } from 'vuex'
import {
  Create,
  Update,
  CompanyCategoryPage
} from '@/api/kchk/company'
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
      isDefault: false,
      typeList: [],
      title: ''
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
          this.title = '新增单位'
          this.aoiinfo = {
            flag: 1,
            remark: ''
          }
        } else {
          this.title = '编辑单位'
          this.aoiinfo = this.info
        }
        this.gettype()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getBaseField()
    this.gettype()
  },
  methods: {
    gettype() {
      const data = { 'maxResultCount': 1000, 'skipCount': 0 }
      CompanyCategoryPage(data)
        .then(res => {
          for (let i = 0; i < res.items.length; i++) {
            res.items[i].hover = false
            res.items[i].checked = false
          }
          this.typeList = res.items
          this.fields[4].setting = this.typeList
          console.log(this.fields)
        })
    },
    saveClick(data) {
      if (!data) return
      this.aoiinfo.dutyUserId = this.userInfo.id
      // this.aoiinfo.dutyUserId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
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
      console.log(this.aoiinfo)
      field.push({
        field: 'code',
        formType: 'text',
        isNull: 1,
        name: '单位编码',
        placeholder: '请输入单位编码',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? (this.aoiinfo.code || '') : ''
      })
      field.push({
        field: 'name',
        formType: 'text',
        isNull: 1,
        name: '单位名称',
        placeholder: '请输入单位名称',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.name : ''
      })
      field.push({
        field: 'linkman',
        formType: 'text',
        isNull: 1,
        name: '联系人',
        placeholder: '请输入联系人',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.linkman : ''
      })
      field.push({
        field: 'phone',
        formType: 'text',
        isNull: 1,
        name: '联系方式',
        placeholder: '请输入联系方式',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.phone : ''
      })
      field.push({
        field: 'categoryId',
        formType: 'selete',
        isNull: 1,
        name: '类别',
        placeholder: '请输入类别',
        setting: this.typeList,
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.categoryId : ''
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
        placeholder: '请输入说明',
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
// /deep/.el-dialog{
    // margin-top:2vh !important;
// }
/deep/.el-dialog__footer{
    text-align: center !important;
}
</style>
