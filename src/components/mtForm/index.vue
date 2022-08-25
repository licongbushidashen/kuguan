<template>
  <el-form ref="ruleForm" :rules="rules" :label-position="labelPosition" :label-width="labelWidth+'px'" :model="fieldFrom" :class="customClass">
    <el-form-item v-for="(item, index) in fieldList" :key="index" :prop="item.field" :class="[item.width == 1 ? 'form-item' : '']" :show-message="item.showMessage">
      <template slot="label">
        <span :class="{'asterisk': item.isAsterisk == 1}">{{ item.name }}</span>
        <el-tooltip
          v-if="item.tipType == 'tooltip'"
          effect="dark"
          placement="top">
          <div slot="content" v-html="getTips(item)"/>
          <i class="wk wk-help wk-help-tips"/>
        </el-tooltip>
        <span v-else style="color:#999;">
          {{ getTips(item) }}
        </span>
      </template>
      <slot :data="item" :index="index" name="top" />
      <div
        v-if="item.formType == 'open'"
        class="openif"
        @click="opende(item,index,item.field)"
      >
        {{ fieldFrom[item.field] }}
      </div>
      <div
        v-if="item.formType == 'leave'"
        class="openif"
        @click.stop="opende1(item,index,item.field)"
      >
        {{ fieldFrom[item.field] }}
      </div>
      <div
        v-if="item.formType == 'leave1'"
        class="openif"
        @click.stop="opende2(item,index,item.field)"
      >
        {{ fieldFrom[item.field] }}
      </div>
      <el-select
        v-else-if="item.formType == 'seleteload'"
        :multiple="item.multiple || false"
        v-model="fieldFrom[item.field]"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        class="input-width seleteload"
        @focus="openur"
        @blur="blurs"
        @input="commonChange(item, index, $event)">
        <el-option
          v-for="(ite,ind) in options"
          :loading="loading"
          :key="ind"
          :label="ite.name"
          :value="ite.id"/>
      </el-select>
      <el-input
        v-if="item.width1"
        v-model="fieldFrom[item.field]"
        :disabled="item.disabled"
        :maxlength="item.maxLength || 100"
        :placeholder="item.placeholder"
        :type="item.formType"
        class="input-width input-width1"
        @input="commonChange(item, index, $event)"/>
      <el-input
        v-if="(item.formType == 'text' || item.formType == 'number') &&!item.width1"
        v-model="fieldFrom[item.field]"
        :disabled="item.disabled"
        :maxlength="item.maxLength || 100"
        :placeholder="item.placeholder"
        :type="item.formType"
        class="input-width"
        @input="commonChange(item, index, $event)"/>
      <el-date-picker
        v-else-if="item.formType == 'dateYear'"
        v-model="fieldFrom[item.field]"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        class="input-width"
        value-format="yyyy"
        type="year"
        @input="commonChange(item, index, $event)"/>
      <el-select
        v-else-if="item.formType == 'selete' && !item.valuekey"
        :multiple="item.multiple || false"
        v-model="fieldFrom[item.field]"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        class="input-width"
        @input="commonChange(item, index, $event)">
        <el-option
          v-for="(ite,ind) in item.setting"
          :key="ind"
          :label="ite[item.optionL]"
          :value="ite[item.optionV]"/>
      </el-select>
      <el-select
        v-else-if="item.formType == 'selete' && item.valuekey"
        :multiple="item.multiple || false"
        v-model="fieldFrom[item.field]"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        :value-key="item.optionV"
        class="input-width"
        @input="commonChange(item, index, $event)">
        <el-option
          v-for="(ite,ind) in item.setting"
          :key="ind"
          :label="ite[item.optionL]"
          :value="ite"/>
      </el-select>
      <el-date-picker
        v-else-if="item.formType == 'datetime'"
        v-model="fieldFrom[item.field]"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        :append-to-body="false"
        :value-format="item.format?item.format:'yyyy-MM-dd HH:mm:ss'"
        :type="item.date?item.date:'datetime'"
        :picker-options="{disabledDate(time){
          return time.getTime() > new Date(fieldFrom['endTime']).getTime()
        }}"
        class="input-width"
        @click.native.stop="()=>{}"
        @input="commonChange(item, index, $event)"/>
      <el-date-picker
        v-else-if="item.formType == 'datetime1'"
        v-model="fieldFrom[item.field]"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        :append-to-body="false"
        :value-format="item.format?item.format:'yyyy-MM-dd HH:mm:ss'"
        :type="item.date?item.date:'datetime'"
        :picker-options="{disabledDate(time){return time.getTime() <new Date(fieldFrom['startTime']).getTime() ;}}"
        class="input-width"
        @click.native.stop="()=>{}"
        @input="commonChange(item, index, $event)"/>
      <el-radio-group
        v-else-if="item.formType == 'radio'"
        v-model="fieldFrom[item.field]"
        @input="commonChange(item, index, $event)">
        <el-radio v-for="(ite,ind) in item.setting" :label="ite[item.optionV]" :key="ind">{{ ite[item.optionL] }}</el-radio>
      </el-radio-group>
      <el-input
        v-else-if="item.formType == 'textarea'"
        v-model="fieldFrom[item.field]"
        :disabled="item.disabled"
        :rows="item.row || 3"
        :autosize="{ minRows: item.row || 3}"
        :maxlength="item.maxlength || 800"
        :placeholder="item.placeholder"
        :type="item.formType"
        resize="none"
        @input="commonChange(item, index, $event)" />
      <el-select
        v-else-if="item.formType == 'tree'"
        :multiple="item.multiple || false"
        v-model="fieldFrom[item.field]"
        class="input-width"
        @input="commonChange(item, index, $event)">
        <el-option
          :value="name"
        >
          <el-tree
            ref="treeVerNew"
            :props="defaultnewProps"
            :data="treeverData"
            :check-on-click-node="false"
            :check-strictly="true"
            :default-checked-keys="types"
            show-checkbox
            node-key="id"
            empty-text="暂无数据"
            @check="treeCheckClick"

          />
        </el-option>
      </el-select>
      <el-upload
        v-else-if="item.formType=='photo'"
        :on-success="handleAvatarSuccess"
        :on-remove="handleRemove"
        :file-list="fileList"
        action="/api/zjlab/Attachment/UploadProviderFile"
        list-type="picture-card">
        <i class="el-icon-plus"/>
      </el-upload>
      <template v-else>
        <slot :data="item" :index="index" />
      </template>
    </el-form-item>
    <slot name="bot"/>
    <Type :typeling="typeling" :url="url" :name="urlname" :p="p" @changev="typevalu"/>
    <changes :shows="leaveing" @onshow="leaveing=false" @changev="typevalu1"/>
    <changes1 :shows="leaveing1" @onshow="leaveing1=false" @changev="typevalu1"/>
  </el-form>
</template>

<script>
// import {
//   Create,
//   Update
// } from '@/api/admin/amt'
import request from '@/utils/request'
import { isEmpty } from '@/utils/types'
import Type from './type.vue'
import changes from './changes.vue'
import changes1 from './changes1.vue'
export default {
  components: { Type, changes, changes1 },
  props: {
    treeverData: {
      type: Array,
      default: () => {
        return []
      }
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    fieldFrom: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fieldList: {
      type: Array,
      default: () => {
        return []
      }
    },
    customClass: {
      type: String,
      default: 'content-form'
    },
    labelPosition: {
      type: String,
      default: 'top'
    },
    labelWidth: {
      type: Number,
      default: 100
    },
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isSave: Boolean,
    parentIndex: Number
  },
  data() {
    return {
      url: '',
      defaultnewProps: {
        children: 'childen',
        label: 'name',
        id: 'id'
      },
      p: '',
      id: '',
      name: '',
      types: [],
      treeName: '',
      row: '',
      rindex: '',
      typeling: false,
      options: [],
      currentPage: 0,
      pageSize: 100,
      flag: false,
      loading: false,
      dom: null,
      urlname: '',
      leaveing: false,
      leaveing1: false
    }
  },
  watch: {
    fieldFrom: {
      handler() {
        this.$nextTick(() => {
          if (this.fieldFrom.categoryId) {
            const categoryId = this.fieldFrom.categoryId
            this.$refs.treeVerNew[0].setCheckedKeys([categoryId])
            const data = this.$refs.treeVerNew[0].getCheckedNodes()[0] || {}
            if (data.name) {
              this.fieldFrom['categoryId'] = data.name || ''
              this.fieldFrom['categoryName'] = data.id || ''
            }
          }
        })
      },
      immediate: true

    },
    isSave: {
      handler() {
        // if (news) {
        this.onSubmit('ruleForm')
        // }
      }

    }
  },
  mounted() {
    for (let i = 0; i < this.fieldList.length; i++) {
      const item = this.fieldList[i]
      if (item.formType == 'seleteload') {
        this.currentPage = 0
        this.pageSize = 50
        this.seleteload()
      }
    }
  },
  methods: {
    blurs() {
      this.dom.removeEventListener('mousewheel', this.changes)
    },
    openur() {
      this.dom = document.querySelectorAll('.el-select-dropdown')[0].querySelector('.el-scrollbar__wrap')

      this.dom.addEventListener('mousewheel', this.changes())
    },
    changes() {
      if (this.scrollTop + this.clientHeight >= this.scrollHeight) {
        if (!this.flag) {
          this.currentPage = this.pageSize + 1
          this.pageSize = this.pageSize + 100
          this.seleteload()
        }
      }
    },
    changeParam(param) {
      return JSON.stringify(param).replace(/:/g, '=').replace(/,/g, '&').replace(/{/g, '?').replace(/}/g, '').replace(/"/g, '')
    },
    seleteload() {
      const data = { 'maxResultCount': this.pageSize, 'skipCount': this.currentPage }
      return request({
        url: `api/identity/users${this.changeParam(data)}`,
        method: 'get',
        data: data,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        if (res.items.length > 0) {
          this.options = res.items
        } else {
          this.flag = true
        }
      })
    },
    typevalu(row) {
      if (this.urlname == 'dutyUserName') {
        this.fieldFrom['dutyUserName'] = row.name
        this.commonChange(row, 'dutyUserName')
      } else {
        this.fieldFrom['wareHouseName'] = row.name
        this.commonChange(row, 'wareHouseId')
      }
    },
    typevalu1(row) {
      this.fieldFrom['parentName'] = row.specificLocation
      this.fieldFrom['parentId'] = row.id
      this.fieldFrom['spacePointName'] = row.specificLocation
      this.leaveing = false
      this.leaveing1 = false
      this.commonChange(row, 'parentName')
    },

    opende(row, idnex, name) {
      if (name == 'dutyUserName') {
        this.p = '请输入姓名'
        this.urlname = 'dutyUserName'
        this.row = row
        this.rindex = idnex
        this.typeling = !this.typeling
        this.url = '/api/identity/users'
      } else {
        this.p = '请输入关键字'
        this.urlname = 'CompanyPage'
        this.row = row
        this.rindex = idnex
        this.typeling = !this.typeling
        this.url = '/api/zjlab/Warehouse/WarehousePage'
      }
    },
    opende1(row, idnex, name) {
      this.leaveing = true
    },
    opende2(row, idnex, name) {
      debugger
      this.leaveing1 = true
    },
    treeCheckClick(data) {
      if (this.id == data.id) {
        this.id = ''
        this.$refs.treeVerNew[0].setCheckedKeys([])
        this.name = ''
        this.fieldFrom['categoryId'] = ''
        this.fieldFrom['categoryName'] = ''
        this.fieldFrom['goodsCategoryId'] = ''
        this.fieldFrom['goodsCategoryName'] = ''
      } else {
        this.id = data.id
        this.$refs.treeVerNew[0].setCheckedKeys([data.id])
        this.fieldFrom['goodsCategoryId'] = data.name
        this.fieldFrom['goodsCategoryName'] = data.id
        this.fieldFrom['categoryId'] = data.name
        this.fieldFrom['categoryName'] = data.id
      }

      // this.$refs.treeVerNew[0].setCheckedKeys([data.id])
    },
    handleAvatarSuccess(res) {
      this.$emit('change', res.id, 'photo')
    },
    handleRemove(res, val) {
      console.log(res, val)
      this.$emit('change', res, 'phototp')
    },
    /**
       * 常规组件change事件
       */
    commonChange(item, index, value) {
      this.$emit('change', item, index, value, this.parentIndex)
    },
    onSubmit(ruleForm) {
      console.log(this.rules)
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          console.log(this.parentIndex)
          this.$emit('save', true, this.parentIndex)
        } else {
          console.log(this.parentIndex)
          this.$emit('save', false, this.parentIndex)
          return false
        }
      })
    },
    /**
       * 获取提示语
       */
    getTips(data) {
      const tips = data.tips || data.inputTips
      if (data.tipType == 'tooltip') {
        return isEmpty(tips) ? '' : tips
      }
      return isEmpty(tips) ? '' : `（${tips}）`
    }
  }
}
</script>

<style lang="scss" scoped>
  .asterisk {
    position: relative;
    &::before{
      content: "*";
      color: #F56C6C;
      margin-right: 4px;
    }
  }
</style>
<style>
.input-width1{
  width:calc(48% - 15px) !important
}
.el-select-dropdown__item{
    height: 100%;
    /* padding: 0px; */
}
.openif{

    border: 1px solid #e6e6e6;
    height: 33px;
    border-radius: 3px;
    margin-top: 4px;
line-height: 30px;
    padding-left: 7px;
}
.openif:hover {
    outline: none;
    border-color: #2362FB;
}
</style>
