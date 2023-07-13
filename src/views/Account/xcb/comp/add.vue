<template>
  <el-dialog v-if="showDialog" :visible.sync="showDialog" style="    " destroy-on-close title="小厨宝台账">
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
  KitchenCreate,
  KitchenUpdate,
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
      flag: false,
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
      'userInfo',
      'allAuth'
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
          if (this.info.spacePointId) {
            await this.pointTree(this.info.spacePointId, 'parentId', 0, 'chs')

            this.aoiinfo.parentId1 = this.info.spacePointId1
            console.log(this.info.parentId1, 12356)
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
      if (this.flag) {
        return
      }
      this.flag = true
      if (!data) return
      this.aoiinfo.fillingDate = parseTime(this.aoiinfo.fillingDate)
      this.aoiinfo.installationDate = parseTime(this.aoiinfo.installationDate)
      this.aoiinfo.maintenanceDate = parseTime(this.aoiinfo.maintenanceDate)
      if (this.aoiinfo.parentId2) {
        this.aoiinfo.spacePointId2 = this.aoiinfo.parentId2
      } if (this.aoiinfo.parentId1) {
        this.aoiinfo.spacePointId1 = this.aoiinfo.parentId1
      } if (this.aoiinfo.parentId) {
        this.aoiinfo.spacePointId = this.aoiinfo.parentId
      }
      if (this.aoiinfo.id) {
        KitchenUpdate(this.aoiinfo).then(res => {
          this.flag = false
          this.$message.success('修改成功')
          this.showDialog = false
          this.$emit('change', 'up')
        })
      } else {
        KitchenCreate(this.aoiinfo).then(res => {
          this.flag = false
          this.$message.success('新增成功')
          this.showDialog = false
          this.$emit('change', 'add')
        })
      }
    },
    formChange(id, type, type1, i, j) {
      if (id.field == 'parentId') {
        this.pointTree(type1, id.field, j)
      }
    },
    savechange() {
      this.isSave = !this.isSave
    },
    getBaseField() {
      const field = []
      field.push({
        field: 'installationDate',
        formType: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        isNull: 1,
        name: '安装日期',
        placeholder: '请选择日期',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.installationDate : ''
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
        field: 'name',
        formType: 'text',
        isNull: 1,
        name: '名称',
        placeholder: '请输入名称',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.name : ''
      })
      field.push({
        field: 'code',
        formType: 'text',
        isNull: 1,
        name: '编号',
        placeholder: '请输入编号',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.code : ''
      })
      field.push({
        field: 'brand',
        formType: 'text',
        isNull: 1,
        name: '品牌',
        placeholder: '请输入品牌',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.brand : ''
      })
      field.push({
        field: 'model',
        formType: 'text',
        isNull: 1,
        name: '型号',
        placeholder: '请输入型号',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.model : ''
      })
      field.push({
        field: 'rateOfWork',
        formType: 'text',
        isNull: 1,
        name: '功率',
        placeholder: '请输入功率',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.rateOfWork : ''
      })
      field.push({
        field: 'capacity',
        formType: 'text',
        isNull: 1,
        name: '容量',
        placeholder: '请输入容量',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.capacity : ''
      })
      field.push({
        field: 'remark',
        formType: 'textarea',
        isNull: 1,
        name: '说明',
        placeholder: '请输入说明',
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

