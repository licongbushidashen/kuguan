<template>
  <el-dialog v-if="showDialog" :visible.sync="showDialog" :close-on-click-modal="false" style="    " title="货品管理" >
    <create-sections title="基础信息">
      <mtForm :file-list="attachmentList" :rules="fieldsRules" :field-from="aoiinfo" :field-list="fields" :is-save="isSave" @change="formChange" @save="saveClick"/>
    </create-sections>
    <create-sections title="单位管理" style="margin:0px;" class="create-sections1">
      <div>
        <el-button
          style="margin-top:10px"
          type="primary"
          icon="el-icon-plus" @click="addpush">新建</el-button>
        <el-button
          icon="el-icon-plus" style="margin-bottom:20px" @click="dellist">删除</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          show-overflow-tooltip
          type="index"
          width="80"
          align="center"
          label="序号">
          <template slot="header" slot-scope="scope" >
            <el-checkbox
              v-model="checkedAll"
              :disabled="!list || !list.length"
              @change="selectAll"
            />
          </template>
          <template slot-scope="{ row, column, $index}">
            <span class="status-name">
              <span
                class="index"
                style="text-align: center; display: block;"
                @mouseenter="row.hover = true"
                @mouseleave="row.hover = false"
              >
                <el-checkbox
                  v-show="row.hover || row.checked"
                  v-model="row.checked"
                  @change="onItemCheckboxChange"
                />
                <span v-show="!row.hover && !row.checked" class="text">{{
                  $index+1
                }}</span>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="单位名称"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.name"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="换算数量"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.num" />
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="默认单位"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.isDefault" placeholder="请选择" @change="defaultchang">
              <el-option key="1" :disabled="isDefault" :value="1" label="是"/>
              <el-option key="0" :value="0" label="否"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="是否最小单位"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.isMin" placeholder="请选择" @change="minchange">
              <el-option key="1" :disabled="mining" :value="1" label="是"/>
              <el-option key="0" :value="0" label="否"/>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <span style="margin:20px 0px;display: block;">说明</span>
        <el-input
          v-model="aoiinfo.remark"
          :autosize="{ minRows: 3, maxRows: 4}"
          :maxlength="maxlength || 800"
          type="textarea"
          placeholder="请输入"
          resize="none"/>
        <span style="margin:20px 0px;display: block;"><i style="color:red;margin-right: 5px;">*</i> 状态</span>
        <el-radio-group
          v-model="aoiinfo.flag">
          <el-radio key="1" :label="1">启用</el-radio>
          <el-radio key="0" :label="0">禁用</el-radio>
        </el-radio-group>
      </div>
    </create-sections>
    <span slot="footer" class="dialog-footer" style="text-align: center !important;">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="debouncedHandleLogin">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { debounce } from 'throttle-debounce'
import { objDeepCopy } from '@/utils'
import {
  CreateGoodsInfo,
  UpdateGoodsInfo
} from '@/api/kchk/goods'
import {
  GoodsCategoryDetailGetList
} from '@/api/kchk/company'
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
      showDialog: true,
      list: [],
      maxlength: 300,
      checkedAll: [],
      fieldsRules: {}, // 字段列表需要验证,
      aoiinfo: {
        flag: 1,
        remark: '',
        categoryId: '',
        categoryName: ''
      },
      tree: [],
      type: [],
      fields: {},
      isSave: false,
      mining: false,
      isDefault: false,
      attachmentList: [],
      disabled1: false
    }
  },
  watch: {
    showing: {
      handler(val) {
        this.isDefault = false
        this.mining = false
        this.showDialog = !this.showDialog
        if (this.info.goodsInfo) {
          this.disabled1 = true
          this.aoiinfo = JSON.parse(JSON.stringify(this.info.goodsInfo))
          this.list = this.info.unitList.map(e => {
            return { ...e, hover: false, checked: false }
          })
          this.getBaseField()
          this.minchange()
          this.defaultchang()
          this.getType(this.aoiinfo.categoryId)
          this.attachmentList = this.info.attachmentList.map(e => {
            return { url: `/api/zjlab/Attachment/FileMsg?id=${e.id}` }
          })
        } else {
          this.disabled1 = false
          this.getBaseField()
          this.list = []
          this.addpush()
          this.attachmentList = []
          this.aoiinfo = {
            flag: 1,
            remark: '',
            categoryId: '',
            categoryName: '',
            goodsCategoryDetailId: ''
          }
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
    gettree() {
      GetGoodsCategoryTreeHasRole().then(res => {
        this.tree = res
        this.getBaseField()
      })
    },
    changeParam(param) {
      return JSON.stringify(param).replace(/:/g, '=').replace(/,/g, '&').replace(/{/g, '?').replace(/}/g, '').replace(/"/g, '')
    },
    getType(id) {
      const data = { 'maxResultCount': 1000, 'skipCount': 0, categoryId: id }
      GoodsCategoryDetailGetList(this.changeParam(data)).then(res => {
        this.fields[3].setting = res.items
      })
    },
    formChange(id, type) {
      if (id.field == 'categoryId') {
        this.aoiinfo.goodsCategoryDetailId = ''
        this.getType(this.aoiinfo.categoryId)
      }
      if (type == 'photo') {
        this.attachmentList.push({ url: `/api/zjlab/Attachment/FileMsg?id=${id}` })
      } else if (type == 'phototp') {
        for (let index = 0; index < this.attachmentList.length; index++) {
          if (this.attachmentList[index].url === id.url) {
            this.attachmentList.splice(index, 1)
            index--
          }
        }
      }
    },
    defaultchang(val) {
      let num = 0
      console.log(this.list)
      this.list.forEach(e => {
        if (e.isDefault == 1) {
          this.isDefault = true
        } else {
          num++
        }
      })

      if (num == this.list.length) {
        this.isDefault = false
      }
    },
    minchange(val) {
      let num = 0
      console.log(this.list)
      this.list.forEach(e => {
        if (e.isMin == 1) {
          this.mining = true
        } else {
          num++
        }
      })
      if (num == this.list.length) {
        this.mining = false
      }
    },
    addpush() {
      this.list.push({ hover: false, checked: false, isMin: 0, isDefault: 0 })
    },
    dellist() {
      const arr = []
      this.list.forEach((e) => {
        if (!e.checked) {
          arr.push(e)
        } else {
          if (e.isDefault) {
            this.isDefault = false
          }
          if (e.isMin) {
            this.isMin = false
          }
        }
      })
      this.list = arr
      console.log(arr)
    },
    /*
   * 当checkbox选择change时事件
   */
    /**
   * 全选
   */
    selectAll(e) {
      const isChecked = e
      if (isChecked) {
        this.list.forEach((item) => {
          item.checked = true
        })
      } else {
        this.list.forEach((item) => {
          item.checked = false
        })
      }
    },
    onItemCheckboxChange() {
      this.obj = {}
      const isCheckedItems = this.list.filter(d => d.checked)
      if (isCheckedItems.length < this.list.length) {
        this.checkedAll = false
      } else {
        this.checkedAll = true
      }
      this.list.filter((d) => d.checked).map(e => {
        const key = e.id; const val = e.code
        this.obj[key] = val
        return { [key]: val }
      })
    },
    saveClick(data) {
      if (!data) return
      let fl = false
      this.list.forEach(e => {
        if (e.isDefault == '1' || e.isMin == '1') {
          fl = true
        }
        if (!e.name) {
          this.$message.error('请选择请输入单位名称')
          return
        }
        if (!e.num) {
          this.$message.error('请选择请输入换算数量')
          return
        }
      })
      if (!fl) {
        this.$message.error('请选择默认单位或最小单位')
        return
      }
      const attachmentList = this.attachmentList.map(e => {
        return e.url.split('=')[1]
      })
      const list = []
      this.list.forEach(e => {
        list.push({ id: e.id, unit: e })
      })
      this.aoiinfo.goodsCategoryDetailId = this.aoiinfo.goodsCategoryDetailId || null
      const obj = JSON.parse(JSON.stringify({
        goodsInfo: this.aoiinfo,
        attachmentList: attachmentList,
        unitList: list
      }))
      if (this.aoiinfo.id) {
        UpdateGoodsInfo(obj).then(res => {
          this.$message.success('修改成功')
          this.showDialog = false
          this.$emit('change', 'up')
        })
      } else {
        CreateGoodsInfo(obj).then(res => {
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
        name: '货品编码',
        placeholder: '请输入货品编码',
        setting: [],
        disabled: this.disabled1,
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.code : ''
      })
      field.push({
        field: 'categoryId',
        formType: 'selete',
        isNull: 1,
        name: '所属类目',
        placeholder: '请选择类目',
        setting: this.tree,
        inputTips: '',
        optionL: 'name',
        optionV: 'id',
        value: this.aoiinfo ? this.aoiinfo.goodsCategoryId : ''
      })
      field.push({
        field: 'name',
        formType: 'text',
        isNull: 1,
        name: '商品名称',
        placeholder: '请输入商品名称',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.name : ''
      })
      field.push({
        field: 'goodsCategoryDetailId',
        formType: 'selete',
        isNull: 0,
        name: '大类名称',
        placeholder: '请选择大类名称',
        setting: this.type,
        inputTips: '',
        optionL: 'goodsCategoryDetailName',
        optionV: 'id',
        value: this.aoiinfo ? this.aoiinfo.goodsCategoryDetailId : ''
      })
      field.push({
        field: 'brand',
        formType: 'text',
        isNull: 0,
        name: '品牌',
        placeholder: '请输入品牌',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.brand : ''
      })
      field.push({
        field: 'ean13',
        formType: 'text',
        isNull: 0,
        name: '商品条码',
        placeholder: '请输入商品条码',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.ean13 : ''
      })
      field.push({
        field: 'size',
        formType: 'text',
        isNull: 0,
        name: '规格',
        setting: [],
        placeholder: '请输入货品规格',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.size : ''
      })
      field.push({
        field: 'photo',
        formType: 'photo',
        isNull: 0,
        name: '图片',
        setting: [],
        inputTips: '',
        fileList: [],
        width: 1,
        value: this.aoiinfo ? this.aoiinfo.photo : ''
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
  /deep/.el-table--fit{
    border: 1px solid #EBEEF5 !important;
    border-bottom: 0px solid #EBEEF5 !important;
  }
// /deep/.el-dialog{
    // margin-top:2vh !important;
// }
/deep/.el-dialog__footer{
    text-align: center !important;
}
</style>
<style lang="less">
.create-sections1{
  .content{
        padding: 0 25px;
  }
}
</style>
