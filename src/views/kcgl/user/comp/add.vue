<template>
  <el-dialog v-if="showDialog" :visible.sync="showDialog" :title="info.id?'新增用户':'修改用户'" :close-on-click-modal="false" :destroy-on-close="true"	style="" >
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
  Createusers,
  Updateusers
} from '@/api/kcjl/user'
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
        isActive: true
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
            isActive: true
          }
          this.getBaseField()
        } else {
          this.aoiinfo = this.info
          this.getBaseField(1)
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
      //   this.aoiinfo.dutyUserId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      if (this.aoiinfo.id) {
        Updateusers(this.aoiinfo).then(res => {
          this.$message.success('修改成功')
          this.showDialog = false
          this.$emit('change', 'up')
        })
      } else {
        Createusers(this.aoiinfo).then(res => {
          this.$message.success('新增成功')
          this.showDialog = false
          this.$emit('change', 'add')
        })
      }
    },
    savechange() {
      this.isSave = !this.isSave
    },
    getBaseField(val) {
      const field = []
      field.push({
        field: 'name',
        formType: 'text',
        isNull: 1,
        name: '姓名',
        placeholder: '请输入',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.name : ''
      })
      field.push({
        field: 'phoneNumber',
        formType: 'text',
        expres: 'mobile',
        isNull: 1,
        name: '手机号',
        placeholder: '',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.phoneNumber : ''
      })
      field.push({
        field: 'userName',
        formType: 'text',
        isNull: 1,
        disabled: val,
        name: '用户账号',
        placeholder: '请输入',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.userName : ''
      })
      if (!val) {
        field.push({
          field: 'password',
          formType: 'text',
          expres: 'password',
          isNull: 1,
          name: '用户密码',
          placeholder: '请输入',
          setting: [],
          inputTips: '',
          value: this.aoiinfo ? this.aoiinfo.password : ''
        })
      }

      field.push({
        field: 'email',
        formType: 'text',
        isNull: 1,
        expres: 'email',
        name: '邮箱',
        placeholder: '请输入',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.email : ''
      })
      field.push({
        field: 'isActive',
        formType: 'radio',
        isNull: 1,
        name: '状态',
        setting: [
          { name: '启用', id: true },
          { name: '禁用', id: false }
        ],
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.isActive : true
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
