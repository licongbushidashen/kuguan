<template>
  <el-dialog v-if="showDialog" :visible.sync="showDialog" style="    " destroy-on-close title="消杀台账">
    <create-sections >
      <mtForm :rules="fieldsRules" :field-from="aoiinfo" :field-list="fields" :is-save="isSave" @save="saveClick" @change="formChange"/>
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
  CreateDisinfection,
  UpdateDisinfection,
  GetSpacePointTree
} from '@/api/account'
import { parseTime } from '@/utils'
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
      tt: true,
      fieldsRules: {}, // 字段列表需要验证,
      setting2: [],
      setting1: [],
      aoiinfo: {
        drugName: '',
        parentId1: null,
        parentId2: null
      },
      tree: [],
      fields: {},
      isSave: false,
      mining: false,
      isDefault: false,
      yq: {},
      settings: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    showing: {
      async handler(val) {
        this.showDialog = !this.showDialog
        if (!this.info.id) {
          this.aoiinfo = {
          }
          this.getBaseField()
        } else {
          this.aoiinfo = { ...this.info, ...{ parentId1: null, parentId2: null }}
          this.aoiinfo.parentId = this.info.spacePointId

          debugger
          if (this.info.spacePointId) {
            await this.pointTree(this.info.spacePointId, 'parentId', 0, 'chs')
            this.aoiinfo.parentId1 = this.info.spacePointId1
          }
          if (this.info.spacePointId1) {
            await this.pointTree(this.info.spacePointId1, 'parentId', 1, 'chs')
            this.aoiinfo.parentId2 = this.info.spacePointId2
          }
          this.getBaseField()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.pointTree()
    this.debouncedHandleLogin = debounce(300, this.savechange)
  },
  methods: {
    pointTree(item, name, j, chs) {
      debugger
      const data = item ? { parentId: item } : {}
      GetSpacePointTree(data)
        .then(response => {
          debugger
          if (j == 1) {
            for (let i = 0; i < this.fields.length; i++) {
              if (this.fields[i].field == 'parentId') {
                if (!chs) {
                  this.aoiinfo.parentId2 = null
                }
                this.setting2 = response
                this.$set(this.fields[i], 'setting2', response)
              }
            }
          } else if (j == 2) {
            this.tt = false
            this.aoiinfo = { ...this.aoiinfo }
          } else if (name == 'parentId') {
            for (let i = 0; i < this.fields.length; i++) {
              if (this.fields[i].field == 'parentId') {
                this.setting1 = response
                this.setting2 = []
                this.$set(this.fields[i], 'setting1', response)
                this.fields[i].setting2 = []
                if (!chs) {
                  this.aoiinfo.parentId1 = null
                  this.aoiinfo.parentId2 = null
                }
              }
            }
          } else {
            this.settings = response || []
            this.getBaseField()
          }
          this.fieldsRules['parentId'] = this.getRules({
            field: 'parentId',
            formType: 'seleteAll',
            isNull: 1,
            name: '空间点位',
            array1: 1,
            placeholder: '请选择空间点位',
            setting: this.settings,
            setting1: this.setting1,
            setting2: this.setting2,
            parentId2: this.aoiinfo.parentId2,
            parentId1: this.aoiinfo.parentId1,
            optionL: 'specificLocation',
            optionV: 'id',
            inputTips: '',
            value: this.aoiinfo ? this.aoiinfo.parentId : ''
          })
        })
        .catch(() => {
        })
    },
    saveClick(data) {
      debugger
      if (!data) return
      this.aoiinfo.antivirusDate = parseTime(this.aoiinfo.antivirusDate)
      if (this.aoiinfo.parentId2) {
        this.aoiinfo.spacePointId = this.aoiinfo.parentId2
      } if (this.aoiinfo.parentId1) {
        this.aoiinfo.spacePointId1 = this.aoiinfo.parentId1
      } if (this.aoiinfo.parentId) {
        this.aoiinfo.spacePointId = this.aoiinfo.parentId
      }
      this.aoiinfo.servicesAvailableRemark = this.aoiinfo.servicesAvailableRemark ? this.aoiinfo.servicesAvailableRemark : ''
      this.aoiinfo.pestCategoriesRemark = this.aoiinfo.pestCategoriesRemark ? this.aoiinfo.pestCategoriesRemark : ''
      this.aoiinfo.serviceContentRemark = this.aoiinfo.serviceContentRemark ? this.aoiinfo.serviceContentRemark : ''
      this.aoiinfo.drugNameRemark = this.aoiinfo.drugNameRemark ? this.aoiinfo.drugNameRemark : ''
      this.aoiinfo.drugNameRemark2 = this.aoiinfo.drugNameRemark2 ? this.aoiinfo.drugNameRemark2 : ''
      this.aoiinfo.drugNameRemark2Remark = this.aoiinfo.drugNameRemark2Remark ? this.aoiinfo.drugNameRemark2Remark : ''
      if (this.aoiinfo.id) {
        UpdateDisinfection(this.aoiinfo).then(res => {
          this.$message.success('修改成功')
          this.showDialog = false
          this.$emit('change', 'up')
        })
      } else {
        CreateDisinfection(this.aoiinfo).then(res => {
          this.$message.success('新增成功')
          this.showDialog = false
          this.$emit('change', 'add')
        })
      }
    },
    formChange(id, type, type1, i, j) {
      if (id.field == 'parentId') {
        debugger
        this.pointTree(type1, id.field, j)
      }
      switch (id.field) {
        case 'servicesAvailable':
          this.setBaseField(id.field, type1, 'servicesAvailableRemark', '请输入其它服务项目')
          break
        case 'serviceContent':
          this.setBaseField(id.field, type1, 'serviceContentRemark', '请输入其它服务内容')
          break
        case 'drugName':
          this.setBaseField(id.field, type1, 'drugNameRemark', '请输入其它药物名称')
          break
        case 'drugNameRemark2':
          this.setBaseField(id.field, type1, 'drugNameRemark2Remark', '请输入其它药物器具')
          break
        default:
          break
      }
      if (id.field == 'pestCategories' && type1 != '其它') {
        let setting = []
        if (type1 == '蟑螂') {
          setting = [
            { name: '杀蟑胶饵', id: '杀蟑胶饵' },
            { name: '蟑螂颗粒剂', id: '蟑螂颗粒剂' },
            { name: '杀蟑烟剂', id: '杀蟑烟剂' },
            { name: '其它', id: '其它' }
          ]
        } else if (type1 == '鼠类') {
          setting = [
            { name: '拜耳立克命', id: '拜耳立克命' },
            { name: '溴敌隆', id: '溴敌隆' },
            { name: '溴鼠灵', id: '溴鼠灵' },
            { name: '腊块', id: '腊块' },
            { name: '其它', id: '其它' }
          ]
        } else if (type1 == '蚊子' || type1 == '苍蝇' || type1 == '跳蚤' || type1 == '白蚁') {
          setting = [
            { name: '拜耳列喜镇', id: '拜耳列喜镇' },
            { name: '拜耳素花', id: '拜耳素花' },
            { name: '高氯残杀威', id: '高氯残杀威' },
            { name: '倍（幸）硫磷', id: '倍（幸）硫磷' },
            { name: '高效氟氯氰菊酯', id: '高效氟氯氰菊酯' },
            { name: '毒死蜱', id: '毒死蜱' },
            { name: '其它', id: '其它' }
          ]
        }
        for (let i = 0; i < this.fields.length; i++) {
          if (this.fields[i].field == 'drugName') {
            this.fields[i].setting = setting
            this.aoiinfo = { ...this.aoiinfo, ...{ drugName: null }}
          }
          if (this.fields[i].field == 'drugNameRemark') {
            delete this.fieldsRules[this.fields[i].field]
            this.fields.splice(i, 1)
            this.yq.setting = setting
            this.fields.splice(i, 0, this.yq)
          }
        }
      } else if (id.field == 'pestCategories' && type1 == '其它') {
        const field = []
        let num = 0
        let num1 = 0
        field.push({
          field: 'drugNameRemark',
          formType: 'text',
          show: false,
          isNull: 1,
          name: '其它',
          placeholder: '请输入其它药物名称',
          setting: [],
          inputTips: '',
          value: this.aoiinfo ? this.aoiinfo['drugNameRemark'] : ''
        })
        const fields = this.handleFields(field).list
        const fieldsRules = this.handleFields(field).fieldRules
        for (let i = 0; i < this.fields.length; i++) {
          if (this.fields[i].field == 'pestCategories') {
            num = i
          }
          if (this.fields[i].field == 'drugNameRemark') {
            num1 = i
          }
        }
        this.yq = JSON.parse(JSON.stringify(this.fields[num + 1]))
        console.log(this.yq)
        if (num1) {
          this.fields.splice(num1, 1)
        }
        this.fields.splice(num + 1, 1)
        this.fields.splice(num + 1, 0, fields[0])
        this.fieldsRules[Object.keys(fieldsRules)[0]] = Object.values(fieldsRules)[0]
      }
      // this.fields = this.handleFields(field).list
      // this.fieldsRules = this.handleFields(field).fieldRules
    },
    savechange() {
      this.isSave = !this.isSave
    },
    setBaseField(name, type, field1, p) {
      const field = []
      if ((name == 'servicesAvailable') && type == '其它') {
        field.push({
          field: field1,
          formType: 'text',
          show: false,
          isNull: 1,
          width: 1,
          width1: 1,
          name: '其它',
          placeholder: p,
          setting: [],
          inputTips: '',
          value: this.aoiinfo ? this.aoiinfo[field1] : ''
        })
      } else if ((name == 'serviceContent' || name == 'drugName' || name == 'drugNameRemark2') && type == '其它') {
        field.push({
          field: field1,
          formType: 'text',
          show: false,
          isNull: 1,
          name: '其它',
          placeholder: p,
          setting: [],
          inputTips: '',
          value: this.aoiinfo ? this.aoiinfo[field1] : ''
        })
      }
      let num = null
      let num1 = null
      for (let i = 0; i < this.fields.length; i++) {
        if (this.fields[i].field == name) {
          // eslint-disable-next-line no-const-assign
          num = i
        }
        if (this.fields[i].field == name + 'Remark') {
          num1 = 1
        }
      }
      if (type == '其它') {
        const fields = this.handleFields(field).list
        const fieldsRules = this.handleFields(field).fieldRules

        this.fields.splice(num + 1, 0, fields[0])
        this.fieldsRules[Object.keys(fieldsRules)[0]] = Object.values(fieldsRules)[0]
      } else {
        if (num1 == 1) {
          delete this.fieldsRules[this.fields[num].field]
          this.fields.splice(num + 1, 1)
        }
      }
    },
    getBaseField() {
      const field = []
      field.push({
        field: 'antivirusDate',
        formType: 'datetime',
        isNull: 1,
        name: '消杀日期',
        placeholder: '请选择日期',
        format: 'yyyy-MM-dd HH:mm',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.antivirusDate : ''
      })
      field.push({
        field: 'executor',
        formType: 'text',
        isNull: 1,
        name: '作业人员',
        placeholder: '请输入作业人员姓名',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.executor : ''
      })
      field.push({
        field: 'phone',
        formType: 'text',
        isNull: 1,
        name: '手机号',
        expres: 'mobile',
        placeholder: '请输入手机号',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.phone : ''
      })
      field.push({
        field: 'parentId',
        formType: 'seleteAll',
        isNull: 1,
        name: '空间点位',
        array1: 1,
        placeholder: '请选择空间点位',
        setting: this.settings,
        setting1: this.setting1,
        setting2: this.setting2,
        optionL: 'specificLocation',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.parentId : ''
      })
      field.push({
        field: 'weatherForecast',
        formType: 'selete',
        isNull: 1,
        name: '天气情况',
        placeholder: '请选择天气',
        setting: [
          { name: '晴天', id: '晴天' },
          { name: '雨天', id: '雨天' },
          { name: '阴天', id: '阴天' }
        ],
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.weatherForecast : ''
      })
      field.push({
        field: 'servicesAvailable',
        formType: 'selete',
        isNull: 1,
        name: '服务项目',
        placeholder: '请选择服务项目',
        setting: [
          { name: '首次服务', id: '首次服务' },
          { name: '常规服务', id: '常规服务' },
          { name: '增值服务', id: '特殊服务' },
          { name: '其它', id: '其它' }
        ],
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.servicesAvailable : ''
      })
      if (this.aoiinfo.servicesAvailable == '其它') {
        field.push({
          field: 'servicesAvailableRemark',
          formType: 'text',
          isNull: 1,
          name: '其它',
          placeholder: '请输入其它服务项目',
          inputTips: '',
          value: this.aoiinfo ? this.aoiinfo.servicesAvailableRemark : ''
        })
      }
      field.push({
        field: 'serviceContent',
        formType: 'selete',
        isNull: 1,
        name: '服务内容',
        placeholder: '请选择服务内容',
        setting: [
          { name: '虫情消杀', id: '虫情消杀' },
          { name: '密度测试', id: '密度测试' },
          { name: '宣传培训', id: '宣传培训' },
          { name: '其它', id: '其它' }
        ],
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.serviceContent : ''
      })
      if (this.aoiinfo.serviceContent == '其它') {
        field.push({
          field: 'serviceContentRemark',
          formType: 'text',
          isNull: 1,
          name: '其它',
          placeholder: '请输入其它服务内容',
          inputTips: '',
          value: this.aoiinfo ? this.aoiinfo.serviceContentRemark : ''
        })
      }
      field.push({
        field: 'pestCategories',
        formType: 'selete',
        isNull: 1,
        name: '虫害类别',
        placeholder: '请选择虫害类别',
        setting: [
          { name: '鼠类', id: '鼠类' },
          { name: '蟑螂', id: '蟑螂' },
          { name: '蚊子', id: '蚊子' },
          { name: '白蚁', id: '白蚁' },
          { name: '苍蝇', id: '苍蝇' },
          { name: '跳蚤', id: '跳蚤' },
          { name: '其它', id: '其它' }
        ],
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.pestCategories : ''
      })
      if (this.aoiinfo.pestCategories == '其它') {
        field.push({
          field: 'drugNameRemark',
          formType: 'text',
          isNull: 1,
          name: '其它',
          placeholder: '请输入其它服务内容',
          inputTips: '',
          value: this.aoiinfo ? this.aoiinfo.drugNameRemark : ''
        })
      }
      field.push({
        field: 'drugName',
        formType: 'selete',
        isNull: 1,
        name: '药物名称',
        placeholder: '请选择药物名称',
        setting: [

        ],
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.drugName : ''
      })
      if (this.aoiinfo.drugName == '其它') {
        field.push({
          field: 'drugNameRemark1',
          formType: 'text',
          isNull: 1,
          name: '其它',
          placeholder: '请输入其它药物名称',
          inputTips: '',
          value: this.aoiinfo ? this.aoiinfo.drugNameRemark1 : ''
        })
      }
      field.push({
        field: 'drugNameRemark2',
        formType: 'selete',
        isNull: 0,
        name: '药物器具',
        placeholder: '请选择药物器具',
        setting: [
          { name: '粘鼠板', id: '粘鼠板' },
          { name: '粘蝇纸', id: '粘蝇纸' },
          { name: '粘蟑板', id: '粘蟑板' },
          { name: '其它', id: '其它' }
        ],
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.drugNameRemark2 : ''
      })
      if (this.aoiinfo.drugNameRemark2 == '其它') {
        field.push({
          field: 'drugNameRemark2Remark',
          formType: 'text',
          isNull: 1,
          name: '其它',
          placeholder: '请输入其它药物器具',
          inputTips: '',
          value: this.aoiinfo ? this.aoiinfo.drugNameRemark2Remark : ''
        })
      }
      field.push({
        field: 'dosage',
        formType: 'text',
        isNull: 1,
        name: '药物用量',
        placeholder: '请输入药物用量',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.dosage : ''
      })
      field.push({
        field: 'linkMan',
        formType: 'text',
        isNull: 1,
        name: '客户联系人',
        placeholder: '请输入客户联系人',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.linkMan : ''
      })
      field.push({
        field: 'linkPhone',
        formType: 'text',
        isNull: 1,
        name: '联系人电话',
        expres: 'mobile',
        placeholder: '请输入联系人电话',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.linkPhone : ''
      })
      field.push({
        field: 'workCondition',
        formType: 'textarea',
        isNull: 1,
        name: '作业情况',
        placeholder: '请输入作业情况',
        row: 3,
        maxLength: 200,
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.workCondition : ''

      })
      field.push({
        field: 'customerProblem',
        formType: 'textarea',
        isNull: 1,
        name: '客户反映问题',
        placeholder: '请输入客户反映问题',
        row: 3,
        maxLength: 200,
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.customerProblem : ''

      })
      field.push({
        field: 'processWay',
        formType: 'textarea',
        isNull: 1,
        name: '存在的问题与建议',
        placeholder: '请输入存在的问题与建议',
        row: 3,
        maxLength: 200,
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.processWay : ''

      })
      field.push({
        field: 'suggest',
        formType: 'textarea',
        isNull: 1,
        name: '处理方式与结果',
        placeholder: '请输入处理方式与结果',
        row: 3,
        maxLength: 200,
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.suggest : ''

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
