<template>

  <div class="main">
    <xr-header
      icon-class="iconfont icon-daibanshixiang"
      icon-color="#2362FB"
      label="我的待办" >
      <template v-slot:ft>
        <div style="    display: flex;    justify-content: end;">
          <div>
            <el-button
              v-if="activeName==1&&allAuth['OrderSetting.Orders.BatchAgree']"
              :disabled="!disable"
              style="margin:0px 0px 10px 0px"
              type="primary" @click="addJurisdiction(2)">批量同意</el-button>
          </div>
          <div>
            <el-button
              v-if="activeName==2&&allAuth['OrderSetting.Orders.BatchStorageIn']"
              :disabled="!disable"
              style="margin:0px 0px 10px 0px"
              type="primary" @click="addJurisdiction(5)">批量入库</el-button>

          </div>
          <div>
            <el-button
              v-if="activeName==3 &&allAuth['OrderSetting.Orders.BatchStorageOut']"
              :disabled="!disable"
              style="margin:0px 0px 10px 0px"
              type="primary" @click="addJurisdiction(4)">批量出库</el-button>

          </div>
          <div>
            <el-button
              v-if="activeName==6&&allAuth['OrderSetting.Orders.BatchSubmit']"
              :disabled="!disable"
              style="margin:0px 0px 10px 0px"
              type="primary" @click="addJurisdiction(1)">批量提交</el-button>

          </div>
          <div>
            <el-button
              v-if="activeName==0&&allAuth['OrderSetting.Orders.BatchSubmit']"
              :disabled="!disable"
              style="margin:0px 0px 10px 0px"
              type="primary" @click="addJurisdiction(1)">批量提交</el-button>

          </div>
        </div>
      </template>
    </xr-header>
    <div class="main-body">
      <div class="main-table-header">
        <el-tabs v-model="activeName" @tab-click="handleCurrentChange(0)">
          <el-tab-pane label="待我审批" name="1">
            <span slot="label">待我审批<el-badge v-if="quantity['3']>0" :value="quantity['3']" :max="99" class="item" style="    margin: 0px;"/></span>
          </el-tab-pane>
          <el-tab-pane label="待入库确认" name="2">
            <span slot="label">待入库确认<el-badge v-if="quantity['4']>0" :value="quantity['4']" :max="99" class="item" style="    margin: 0px;"/></span>
          </el-tab-pane>
          <el-tab-pane label="待出库确认" name="3">
            <span slot="label">待出库确认<el-badge v-if="quantity['5']>0" :value="quantity['5']" :max="99" class="item" style="    margin: 0px;"/></span>
          </el-tab-pane>
          <el-tab-pane label="被驳回" name="6">
            <span slot="label">被驳回<el-badge v-if="quantity['6']>0" :value="quantity['6']" :max="99" class="item" style="    margin: 0px;"/></span>
          </el-tab-pane>
          <!-- <el-tab-pane label="我的审评" name="5"/> -->
          <el-tab-pane label="草稿" name="0">
            <span slot="label">草稿<el-badge v-if="quantity['0']>0" :value="quantity['0']" :max="99" class="item" style="    margin: 0px;"/></span>
          </el-tab-pane>
        </el-tabs>
      </div>

      <el-table
        v-loading="loading"
        id="examine-table"
        :data="list"
        :height="tableHeight"
        class="main-table"
        highlight-current-row
        @row-click="handleRowClick"
      >
        <el-table-column
          show-overflow-tooltip
          type="index"
          width="50"
          label="序号"
        >
          <template slot="header" slot-scope="scope">
            <div style="text-align: center; display: block;">
              <el-checkbox
                v-model="checkedAll"
                :disabled="!list || !list.length"
                @change="selectAll"
              />
            </div>
          </template>
          <template slot-scope="{ row, column, $index }">
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
                  $index + 1
                }}</span>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="申请事项">
          <template slot-scope="{ row, column, $index }">
            <span>{{ row.orderCategory | ordername }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="单据状态">
          <template slot-scope="{ row, column, $index }">
            <span>{{ row.flag | flagname }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="orderNo" label="单据号" />
        <el-table-column prop="address" label="类型">
          <template slot-scope="{ row, column, $index }">
            <span>{{ row.identification | ident }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsCategoryName" label="所属类目" />
        <el-table-column prop="wareHouseName" label="仓库" />
        <el-table-column prop="createUserName" label="申请人" />
        <el-table-column prop="receiptDate" label="申请时间" />
        <!-- <el-table-column
          prop="ean13"
          label="单位"
          width="200">
          <template slot-scope="{ row, column, $index}">
            <span class="buttonc" @click.stop="openplan(row)">计划管理</span>
            <span class="buttonc" @click.stop="openwarn(row)">预警管理</span>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="p-contianer">
        <el-pagination
          :current-page="currentPage"
          :total="total"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :pager-count="5"
          class="p-bar"

          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <Bill :showing="jurisdictionCreateShow" :info="info" @change="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { filterTimestampToFormatTime } from '@/filters/index'
import { TaskCenter, GetOrder, BatchAgree, BatchSubmit, BatchStorageIn, BatchStorageOut } from '@/api/kchk/order'
// import Ccware from './comp/add.vue'
import XrHeader from '@/components/XrHeader'
import CreateSections from '@/components/CreateSections'
import Bill from './comp/bill'
export default {
  /** 系统管理 的 项目管理 */
  name: 'SystemProject',
  components: {
    XrHeader,
    CreateSections,
    Bill
    // Ccware
  },
  filters: {
    ident: function(value) {
      if (value == 0) {
        return '入库'
      } else if (value == 1) {
        return '出库'
      } else if (value == 2) {
        return '盘点'
      }
    },
    ordername: function(value) {
      if (value == 21) {
        return '领用出库'
      } else if (value == 22) {
        return '退货出库'
      } else if (value == 23) {
        return '借用出库'
      } else if (value == 24) {
        return '销毁出库'
      } else if (value == 11) {
        return '采购入库'
      } else if (value == 12) {
        return '退货入库'
      } else if (value == 13) {
        return '借用还库'
      }
    },
    flagname: function(value) {
      if (value == 0) {
        return '草稿'
      } else if (value == 1) {
        return '审批中'
      } else if (value == 2) {
        return '审批通过'
      } else if (value == 3) {
        return '驳回'
      } else if (value == 4) {
        return '已入库'
      } else if (value == 5) {
        return '已作废'
      }
    }
  },

  mixins: [],
  data() {
    return {
      checkedAll: [],
      activeName: '1',
      flag: '',
      flagName: [
        { name: '草稿', value: 0 },
        { name: '审批中', value: 1 },
        { name: '审批通过', value: 2 },
        { name: '驳回', value: 3 },
        { name: '已作废', value: 5 }
      ],
      morecondition: false,
      company: '',
      warehouse: '',
      startTime: null,
      showing: false,
      planing: true,
      warningshow: true,
      jurisdictionCreateShow: false,
      inputs: '',
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 280, // 表的高度
      list: [],
      createAction: {
        type: 'save'
      },
      currentPage: 0,
      pageSize: 15,
      pageSizes: [15, 30, 60, 100],
      total: 0,
      obj: {},
      info: {},
      disable: false
    }
  },

  computed: {
    ...mapGetters(['allAuth', 'quantity'])
  },
  watch: {
    activeName() {
      this.checkedAll = []
    }
  },
  mounted() {
    var self = this
    /** 控制table的高度 */
    window.onresize = function() {
      self.tableHeight = document.documentElement.clientHeight - 196
    }

    this.getList()
  },
  methods: {
    /**
     * 更改每页展示数量
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },

    openplan(row) {
      this.planing = !this.planing
    },
    openwarn(row) {
      this.warningshow = !this.warningshow
    },
    selectAll(e) {
      const isChecked = e
      if (isChecked) {
        this.list.forEach((item) => {
          item.checked = true
          this.isCheckedItems = 1
        })
      } else {
        this.list.forEach((item) => {
          item.checked = false
          this.isCheckedItems = 0
        })
      }
      this.onItemCheckboxChange()
    },
    /*
     * 当checkbox选择change时事件
     */
    onItemCheckboxChange() {
      this.obj = {}
      this.disable = this.list.filter(d => d.checked).length
      this.list
        .filter(d => d.checked)
        .map(e => {
          const key = e.id
          const val = e.code
          this.obj[key] = val
          return { [key]: val }
        })
    },
    /**
     * 获取列表数据
     */
    getList() {
      this.loading = true
      const data = {
        maxResultCount: this.pageSize,
        skipCount: this.currentPage

      }
      data.status = Number(this.activeName)
      if (this.orderCategory) {
        data.stockCategory = this.orderCategory
      }
      if (this.startTime) {
        data.startTime = filterTimestampToFormatTime(new Date(this.startTime).getTime(), 'YYYY-MM-DD HH:mm:ss')
      }
      TaskCenter(data)
        .then(res => {
          for (let i = 0; i < res.items.length; i++) {
            res.items[i].hover = false
            res.items[i].checked = false
            res.items[i].receiptDate = filterTimestampToFormatTime(new Date(res.items[i].receiptDate).getTime(), 'YYYY-MM-DD HH:mm')
          }
          this.list = res.items
          this.total = res.totalCount
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * 更改当前页数
     * @param {*} val
     */
    handleCurrentChange(val) {
      this.morecondition = false
      const x = val > 0 ? val - 1 : 0
      this.currentPage = x ? x * this.pageSize : x
      this.getList()
    },

    /**
     *  添加权限
     */
    addJurisdiction(val) {
      const ids = this.list.filter(d => d.checked).map(e => e.id)
      switch (val) {
        case 1:
          BatchSubmit(ids).then(res => {
            this.$store.dispatch('TaskCenterCount')
            res.forEach(e => {
              if (e.code) {
                this.handleCurrentChange(0)
                this.showDialog = false
                this.$message.success(e.message)
              } else {
                this.$message.error(e.message)
              }
            })
          })
          break
        case 2:
          BatchAgree(ids).then(res => {
            this.$store.dispatch('TaskCenterCount')
            res.forEach(e => {
              if (e.code) {
                this.handleCurrentChange(0)
                this.showDialog = false
                this.$message.success(e.message)
              } else {
                this.$message.error(e.message)
              }
            })
          })
          break
        case 4:
          BatchStorageOut(ids).then(res => {
            this.$store.dispatch('TaskCenterCount')
            res.forEach(e => {
              if (e.code) {
                this.handleCurrentChange(0)
                this.showDialog = false
                this.$message.success(e.message)
              } else {
                this.$message.error(e.message)
              }
            })
          })
          break
        case 5:
          BatchStorageIn(ids).then(res => {
            this.$store.dispatch('TaskCenterCount')
            res.forEach(e => {
              if (e.code) {
                this.handleCurrentChange(0)
                this.showDialog = false
                this.$message.success(e.message)
              } else {
                this.$message.error(e.message)
              }
            })
          })
          break
        default:
          break
      }
    },

    /** 列表操作 */
    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      if (column.label == '序号') {
        return
      }
      GetOrder(row.id).then(res => {
        console.log(res)
        this.info = res
        this.jurisdictionCreateShow = !this.jurisdictionCreateShow
      })
    },
    handleClick1(type, scope) {
      this.createAction = {
        type: 'update',
        data: scope.row
      }
      this.dbsyShow = true
    }
    /**
     * 编辑删除
     */
    /**
     * 导出
     */
  }
}
</script>

<style lang="scss" scoped>
  /deep/.wk{
    margin-right: 0px !important;
  }
  /deep/.el-table{
    margin-top:10px !important
  }
.morecondition{ padding-left:4px !important;top: -5px;
  margin-top: 4px;
  align-items: baseline;
      position: absolute;
    z-index: 9;
    background: #fff;
    width: 100%;
    border: 1px solid #e6e6e6;
    // display: flex;
    padding: 20px;
    >div{
      // flex: 1;
          display: inline-block;
          line-height: 44px;
          margin-left: 20px;
      label{
        margin-right: 10px;
      }
    }

}
.main {
  height: 100%;

  /deep/ .xr-header {
    padding: 15px 30px;
  }
}

.main-body {
  // height: calc(100% - 61px);
  background-color: white;
  border-top: 1px solid $xr-border-line-color;
  border-bottom: 1px solid $xr-border-line-color;
  padding:20px
}
// .main-table{
//       height: calc(100% - 90px ) !important;
// }
.main-table-header {
  height: 45px;
  background-color: white;
  position: relative;
  .main-table-header-button {
    float: right;
        margin-right: 20px;
    margin-top: 5px;
    margin-bottom: 6px;
    margin-left: 21px;
  }
}

.project-reminder {
  width: auto;
  float: left;
  margin-left: 20px;
  margin-top: 10px;
}
@import '../styles/table.scss';
.buttonc {
  color: #4f81fc;
   cursor: pointer;
}
</style>
