<template>
  <div v-loading="loading" class="rc-cont">
    <template v-if="receivablesPlanIndex">
      <flexbox
        v-if="!isSeas"
        class="rc-head"
        direction="row-reverse">
        <el-button
          v-if="receivablesPlanSave"
          class="xr-btn--orange rc-head-item"
          icon="el-icon-plus"
          type="primary"
          @click="createClick('receivablesPlan')">新建回款计划</el-button>
      </flexbox>
      <el-table
        :data="palnList"
        :height="tableHeight"
        :cell-class-name="planCellClassName"
        stripe
        style="width: 100%;border: 1px solid #E6E6E6;"
        @row-click="handlePlanRowClick">
        <el-table-column
          v-for="(item, index) in planFieldList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip/>
        <el-table-column
          v-if="(receivablesPlanUpdate || receivablesPlanDelete || receivablesSaveAuth) && !isSeas"
          label="操作"
          fixed="right"
          width="150">
          <template slot-scope="{ row, $index }">
            <flexbox justify="center">
              <el-button
                v-if="receivablesSaveAuth"
                :disabled="!!row.receivablesId"
                type="text"
                @click.native="handleFile('createReceivables', row, $index )">新建回款</el-button>
              <el-button
                v-if="receivablesPlanUpdate"
                type="text"
                @click.native="handleFile('edit', row, $index )">编辑</el-button>
              <el-button
                v-if="receivablesPlanDelete"
                type="text"
                @click.native="handleFile('delete', row, $index )">删除</el-button>
            </flexbox>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template v-if="receivablesIndex">
      <flexbox
        class="rc-head"
        direction="row-reverse"
        style="margin-top: 15px;">
        <el-button
          v-if="!isSeas && receivablesSave"
          class="xr-btn--orange rc-head-item"
          icon="el-icon-plus"
          type="primary"
          @click="createClick('money')">新建回款</el-button>
      </flexbox>
      <el-table
        :data="list"
        :height="tableHeight"
        :cell-class-name="cellClassName"
        stripe
        style="width: 100%;border: 1px solid #E6E6E6;"
        @row-click="handleRowClick">
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.prop"
          :formatter="fieldFormatter"
          :label="item.label"
          show-overflow-tooltip/>
      </el-table>
    </template>

    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :crm-type="showFullCrmType"
      :id="showFullId"
      @handle="detailHandle"/>


    <c-r-m-all-create
      v-if="isCreate"
      :crm-type="createCrmType"
      :action="createActionInfo"
      @save-success="saveSuccess"
      @close="isCreate=false"/>

  </div>
</template>

<script type="text/javascript">
import CRMAllCreate from './CRMAllCreate'
import {
  crmCustomerQueryReceivablesAPI,
  crmCustomerQueryReceivablesPlanAPI
} from '@/api/crm/customer'
import {
  crmContractQueryReceivablesAPI,
  crmContractQueryReceivablesPlanAPI
} from '@/api/crm/contract'
import {
  crmReceivablesPlanDeleteAPI
} from '@/api/crm/receivables'
/** 注意  需要删除接口 */
import { objDeepCopy, getWkDateTime } from '@/utils'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { separator } from '@/filters/vueNumeralFilter/filters'
import { getPermissionByKey } from '@/utils'
import moment from 'moment'

export default {
  name: 'RelativeReturnMoney', // 相关回款  可能再很多地方展示 放到客户管理目录下

  components: {
    CRMAllCreate,
    CRMFullScreenDetail: () => import('@/components/CRMFullScreenDetail')
  },

  mixins: [CheckStatusMixin],

  props: {
    /** 模块ID */
    id: [String, Number],
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
    /** 是公海 默认是客户 */
    isSeas: {
      type: Boolean,
      default: false
    },
    /** 客户和 合同下 可新建 回款计划 */
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data() {
    return {
      loading: false,
      list: [],
      fieldList: [],
      tableHeight: '250px',
      showFullDetail: false,
      showFullCrmType: 'receivables',
      showFullId: '', // 查看全屏详情的 ID
      createCrmType: 'receivablesPlan', // 创建回款计划
      isCreate: false, // 新建回款回款
      palnList: [],
      planFieldList: [],
      createActionInfo: {} // 新建回款计划的时候 在客户 合同下导入关联信息
    }
  },

  inject: ['rootTabs'],

  computed: {
    receivablesPlanIndex() {
      return !!getPermissionByKey('crm.receivablesPlan.index')
    },
    receivablesPlanSave() {
      return !!getPermissionByKey('crm.receivablesPlan.save')
    },
    receivablesPlanUpdate() {
      return !!getPermissionByKey('crm.receivablesPlan.update')
    },
    receivablesPlanDelete() {
      return !!getPermissionByKey('crm.receivablesPlan.delete')
    },
    receivablesIndex() {
      return !!getPermissionByKey('crm.receivables.index')
    },
    receivablesSave() {
      return !!getPermissionByKey('crm.receivables.save')
    },
    receivablesSaveAuth() {
      return !!getPermissionByKey('crm.receivables.save')
    }
  },

  watch: {
    id(val) {
      this.list = []
      this.palnList = []
      this.getList()
      this.getPlanList()
    },

    'rootTabs.currentName'(val) {
      if (val === 'RelativeReturnMoney') {
        this.getList(false)
        this.getPlanList(false)
      }
    }
  },

  mounted() {
    this.planFieldList = [
      { prop: 'num', width: '200', label: '期数' },
      { prop: 'customerName', width: '200', label: '客户名称' },
      { prop: 'contractNum', width: '200', label: '合同编号' },
      { prop: 'money', width: '200', label: '计划回款金额' },
      { prop: 'returnDate', width: '200', label: '计划回款日期' },
      { prop: 'returnType', width: '200', label: '计划回款方式' },
      { prop: 'remind', width: '200', label: '提前几日提醒' },
      { prop: 'remark', width: '200', label: '备注' }
    ]

    this.getPlanList()

    this.fieldList = [
      { prop: 'receivablesNum', width: '200', label: '回款编号' },
      { prop: 'contractName', width: '200', label: '合同名称' },
      { prop: 'contractMoney', width: '200', label: '合同金额' },
      { prop: 'receivablesMoney', width: '200', label: '回款金额' },
      { prop: 'planNum', width: '200', label: '期数' },
      { prop: 'ownerUserName', width: '200', label: '负责人' },
      { prop: 'checkStatus', width: '200', label: '状态' },
      { prop: 'returnTime', width: '200', label: '回款日期' }
    ]
    this.getList()
  },

  methods: {
    /**
     * 回款计划列表
     */
    getPlanList(loading = true) {
      this.loading = loading
      const request = {
        customer: crmCustomerQueryReceivablesPlanAPI,
        contract: crmContractQueryReceivablesPlanAPI
      }[this.crmType]
      request(this.getParams())
        .then(res => {
          this.loading = false
          const list = res.data.list || []
          list.forEach(item => {
            item.returnDate = getWkDateTime(item.returnDate)
          })
          this.palnList = list
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 回款列表
     */
    getList(loading = true) {
      this.loading = loading
      const request = {
        customer: crmCustomerQueryReceivablesAPI,
        contract: crmContractQueryReceivablesAPI
      }[this.crmType]
      request(this.getParams())
        .then(res => {
          this.loading = false
          this.list = res.data.list
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 获取上传参数
     */
    getParams() {
      if (this.crmType === 'customer') {
        return { customerId: this.id, pageType: 0 }
      } else if (this.crmType === 'contract') {
        return { contractId: this.id, pageType: 0 }
      }
      return {}
    },

    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      if (column.property == 'receivablesNum') {
        this.showFullId = row.receivablesId
        this.showFullCrmType = 'receivables'
        this.showFullDetail = true
      }
    },

    /**
     * 当某一行被点击时会触发该事件
     */
    handlePlanRowClick(row, column, event) {
      if (column.property == 'num') {
        this.showFullId = row.receivablesPlanId
        this.showFullCrmType = 'receivablesPlan'
        this.showFullDetail = true
      }
    },

    /**
     * 新建回款和回款计划
     */
    createClick(type) {
      this.createActionInfo = {
        type: 'relative',
        crmType: this.crmType,
        data: {}
      }
      if (type == 'money') {
        if (this.crmType === 'contract') {
          this.createActionInfo.data['customer'] = objDeepCopy(this.detail)
          this.createActionInfo.data['contract'] = objDeepCopy(this.detail)
        } else if (this.crmType === 'customer') {
          this.createActionInfo.data['customer'] = this.detail
        }
        this.createCrmType = 'receivables'
        this.isCreate = true
      } else if (type == 'receivablesPlan') {
        if (this.crmType === 'contract') {
          this.createActionInfo.data['customer'] = objDeepCopy(this.detail)
          this.createActionInfo.data['contract'] = objDeepCopy(this.detail)
        } else if (this.crmType === 'customer') {
          this.createActionInfo.data['customer'] = this.detail
        }
        this.createCrmType = 'receivablesPlan'
        this.isCreate = true
      }
    },

    /**
     * 新建成功
     */
    saveSuccess() {
      if (this.createCrmType == 'receivables') {
        this.$bus.emit('crm-tab-num-update')
        this.getList()
      } else {
        this.getPlanList()
      }
    },

    /**
     * 编辑操作
     */
    handleFile(type, row, index) {
      console.log(type, row, index)
      if (type == 'edit') {
        this.createActionInfo = { type: 'update', id: row.receivablesPlanId }
        this.createCrmType = 'receivablesPlan'
        this.isCreate = true
      } else if (type == 'delete') {
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            crmReceivablesPlanDeleteAPI([row.receivablesPlanId])
              .then(res => {
                this.palnList.splice(index, 1)
                this.$message.success('删除成功')
              })
              .catch(() => {})
          })
          .catch(() => {})
      } else if (type == 'createReceivables') {
        this.createCrmType = 'receivables'
        this.createActionInfo = {
          type: 'relative',
          crmType: this.crmType,
          data: {
            customer: {
              customerName: row.customerName,
              customerId: row.customerId
            },
            contract: {
              contractNum: row.contractNum,
              contractId: row.contractId
            },
            receivablesPlanId: row.receivablesPlanId,
            returnTime: moment().format('YYYY-MM-DD'),
            money: row.money,
            returnType: row.returnType
          }
        }
        this.isCreate = true
      }
    },

    /**
     * 格式化字段
     */
    fieldFormatter(row, column) {
      // 如果需要格式化
      if (column.property === 'checkStatus') {
        return this.getStatusName(row.checkStatus)
      } else if (column.property == 'contractMoney' || column.property == 'receivablesMoney') {
        return separator(row[column.property] || 0)
      }
      return row[column.property]
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'receivablesNum') {
        return 'can-visit--underline'
      } else {
        return ''
      }
    },

    /**
     * 通过回调控制class
     */
    planCellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'num') {
        return 'can-visit--underline'
      } else {
        return ''
      }
    },

    /**
     * 详情操作
     */
    detailHandle(data) {
      if (data.type === 'delete') {
        this.getList()
        this.$nextTick(() => {
          this.$bus.emit('crm-tab-num-update')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/relativecrm.scss';
</style>
