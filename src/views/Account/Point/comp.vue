<template>
  <el-dialog v-if="showDialog" :visible.sync="showDialog" :close-on-click-modal="false" :title="title" style="    ">
    <create-sections>
      <mtForm :rules="fieldsRules" :field-from="aoiinfo" :field-list="fields" :is-save="isSave" @change="formChange" @save="saveClick" />
    </create-sections>
    <span slot="footer" class="dialog-footer" style="text-align: center !important;">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="debouncedHandleLogin">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { debounce } from 'throttle-debounce'
import { mapGetters } from 'vuex'
import { objDeepCopy } from '@/utils'
import {
  CreateSpacePoint
} from '@/api/account'
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
    }
  },
  data() {
    return {
      showDialog: true,
      list: [],
      maxlength: 300,
      checkedAll: [],
      fieldsRules: {}, // 字段列表需要验证,
      aoiinfo: { flag: 1, dutyUserName: '' },
      tree: [],
      fields: {},
      isSave: false,
      mining: false,
      isDefault: false,
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
        this.title = '新增点位'
        this.aoiinfo = {
          flag: 1, dutyUserName: ''
        }
      },
      deep: true,
      immediate: true
    }
  },

  created() {
    this.debouncedHandleLogin = debounce(300, this.savechange)
    this.getBaseField()
  },
  methods: {

    formChange(item, index, value) {
      if (index == 'dutyUserName') {
        this.aoiinfo.dutyUserId = item.id
        this.aoiinfo.dutyUserName = item.name
      }
      // this.aoiinfo[item.field] = value
    },
    saveClick(data) {
      if (!data) return
      CreateSpacePoint(this.aoiinfo).then(res => {
        console.log(this.aoiinfo, 255)
        this.$message.success('新增成功')
        this.showDialog = false
        this.$emit('change')
      })
    },
    savechange() {
      this.isSave = !this.isSave
    },
    getBaseField() {
      const field = []

      field.push({
        field: 'parentName',
        formType: 'leave1',
        isNull: 0,
        name: '上级目录',
        placeholder: '',
        disabled: false,
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.parentName : ''
      })
      field.push({
        field: 'specificLocation',
        formType: 'text',
        isNull: 1,
        name: '具体位置',
        placeholder: '请输入具体位置',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.specificLocation : ''
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
        value: this.aoiinfo ? this.aoiinfo.remark : ''
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
        value: this.aoiinfo.flag ? this.aoiinfo.flag : 1
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
    /deep/.el-dialog__footer {
      text-align: center !important;
    }
    </style>


