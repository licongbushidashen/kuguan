<template>
  <div class="main">
    <xr-header
      icon-class="iconfont icon-cangku"
      icon-color="#2362FB"
      label="仓库管理" >
      <template v-slot:ft>
        <el-button
          v-if="allAuth['OrderSetting.Warehouses.Create']"
          class="main-table-header-button "
          type="primary"
          icon="el-icon-plus"
          @click="addJurisdiction">新建</el-button>
        <el-button
          v-if="allAuth['OrderSetting.Warehouses.Import']"
          class="main-table-header-button "
          type=""
          icon="iconfont icon-xianxing-daoru"
          @click="bulkImportClick">导入</el-button>
        <el-button
          class="main-table-header-button "
          type=""
          icon="iconfont icon-daochu1"
          @click="downs">导出</el-button>
        <el-button
          v-if="allAuth['OrderSetting.Warehouses.Delete']"
          :disabled="JSON.stringify(obj)=='{}'"
          class="main-table-header-button "
          type=""
          icon="wk wk-delete"
          @click="handleClick('delete')">删除</el-button>
      </template>
    </xr-header>
    <div class="main-body">
      <div class="main-table-header">
        <el-input v-model="inputs" style="width:200px;padding: 10px 0px 0px 10px;" placeholder="请输入仓库名称">
          <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(0)"/>
        </el-input>

      </div>
      <el-table
        v-loading="loading"
        id="examine-table"
        :data="list"
        :height="tableHeight"
        class="main-table"
        highlight-current-row

        @row-click="handleRowClick">
        <el-table-column
          show-overflow-tooltip
          type="index"
          width="50"
          label="序号">
          <template slot="header" slot-scope="scope">
            <div style="text-align: center; display: block;">
              <el-checkbox
                v-model="checkedAll"
                :disabled="!list || !list.length"
                @change="selectAll"
              />
            </div>
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

                  v-model="row.checked"
                  @change="onItemCheckboxChange"
                />
                <!-- v-show="row.hover || row.checked"
                <span v-show="!row.hover && !row.checked" class="text">{{
                  $index+1
                }}</span> -->
              </span>

            </span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="仓库名称"/>

        <!-- <el-table-column
          prop="code"
          label="仓库编码"
        /> -->
        <el-table-column
          prop="address"
          label="仓库地址"
        />
        <el-table-column
          prop="remark"
          label="说明"
        />
        <el-table-column
          prop="creationTime"
          label="创建时间"
        />
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
          :page-sizes="pageSizes"
          :page-size.sync="pageSize"
          :total="total"
          class="p-bar"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
    <Ccware :showing="jurisdictionCreateShow" :info="info" @change="getList"/>
    <!-- 批量导入 -->
    <bulk-import-user
      :show="bulkImportShow"
      url="/api/zjlab/Warehouse/Upload"
      @close="bulkImportShow = false"
      @success="handleCurrentChange(0)"
    />
  </div>
</template>

<script>

import {
  WarehousePage,
  DeleteMany,
  GetInfo,
  DownloadWarehouseExcel
} from '@/api/kchk/warn'
import { filterTimestampToFormatTime } from '@/filters/index'
import { mapGetters } from 'vuex'
import Ccware from './comp/add.vue'
import BulkImportUser from '../import.vue'
import XrHeader from '@/components/XrHeader'
import CreateSections from '@/components/CreateSections'
import pagest from '@/mixins/pagest'
export default {
  /** 系统管理 的 项目管理 */
  name: 'SystemProject',
  components: {
    XrHeader,
    CreateSections,
    Ccware,
    BulkImportUser
  },
  mixins: [pagest],
  data() {
    return {
      checkedAll: [],
      bulkImportShow: false,
      showing: false,
      planing: true,
      warningshow: true,
      jurisdictionCreateShow: false,
      inputs: '',
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 230, // 表的高度
      list: [],
      createAction: {
        type: 'save'
      },
      currentPage: 0,
      pageSize: 15,
      total: 0,
      obj: {},
      info: {}
    }
  },
  computed: {
    ...mapGetters(['allAuth'])
  },
  mounted() {
    var self = this
    /** 控制table的高度 */
    window.onresize = function() {
      self.tableHeight = document.documentElement.clientHeight - 196
    }
    if (this.$route.query.add == '1') {
      this.addJurisdiction()
    }
    this.getList()
  },
  methods: {
    /**
     * 批量导入
     */
    bulkImportClick(val) {
      this.bulkImportShow = true
    },
    openplan(row) {
      this.planing = !this.planing
    },
    openwarn(row) {
      this.warningshow = !this.warningshow
    },

    /**
   * 全选
   */
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
      const isCheckedItems = this.list.filter(d => d.checked)
      this.isCheckedItems = isCheckedItems.length
      if (isCheckedItems.length < this.list.length) {
        this.checkedAll = false
      } else {
        this.checkedAll = true
      }
      this.obj = {}
      this.list.filter((d) => d.checked).map(e => {
        const key = e.id; const val = e.code
        this.obj[key] = val
        return { [key]: val }
      })
    },
    /**
     * 获取列表数据
     */
    getList() {
      this.loading = true
      const data = { 'maxResultCount': this.pageSize + this.currentPage, 'skipCount': this.currentPage, searchKey: this.inputs }
      WarehousePage(data)
        .then(res => {
          for (let i = 0; i < res.items.length; i++) {
            res.items[i].hover = false
            res.items[i].checked = false
            res.items[i].creationTime = filterTimestampToFormatTime(new Date(res.items[i].creationTime).getTime(), 'YYYY-MM-DD HH:mm')
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
      const x = val > 0 ? val - 1 : 0
      this.currentPage = x ? x * this.pageSize : x
      this.getList()
    },

    /**
     *  添加权限
     */
    addJurisdiction() {
      this.info = {}
      this.jurisdictionCreateShow = !this.jurisdictionCreateShow
    },

    /** 列表操作 */
    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      if (column.label == '序号') {
        return
      }
      if (!this.allAuth['OrderSetting.Warehouses.Edit']) {
        this.$message.error('无详情权限')
        return
      }
      GetInfo(row.id).then(res => {
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
    },
    /**
     * 编辑删除
     */
    handleClick(type) {
      if (type === 'delete') {
        // 启用停用
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            DeleteMany(this.obj)
              .then(res => {
                const arr = res.data.failMsg.map(e => {
                  return e + '<br/>'
                })
                if (!res.data.failCount) {
                  this.$message({
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: `删除成功${res.data.successCount}条`
                  })
                } else {
                  this.$message({
                    type: 'error',
                    dangerouslyUseHTMLString: true,
                    message: `删除成功${res.data.successCount}条，失败${res.data.failCount}条，失败原因<br/>${arr.length > 0 ? arr.toString() : ''}`
                  })
                }
                this.getList()
              })
              .catch(() => {})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    /**
     * 导出
     */
    downs() {
      DownloadWarehouseExcel({ maxResultCount: 1000, skipCount: 0 }).then(res => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  height:100%;

  /deep/ .xr-header {
    padding: 15px 30px;
  }
}

.main-body {
      // height: calc(100% - 61px);
  background-color: white;
  border-top: 1px solid $xr-border-line-color;
  border-bottom: 1px solid $xr-border-line-color;
}
// .main-table{
//       height: calc(100% - 90px ) !important;
// }
.main-table-header {
  height: 50px;
  background-color: white;
  position: relative;
  .main-table-header-button {
    float: right;
    margin-right: 20px;
    margin-top: 10px;
  }
}

.project-reminder {
  width: auto;
  float: left;
  margin-left: 20px;
  margin-top: 10px;
}
@import '../styles/table.scss';
.buttonc{
  color:#4f81fc;
   cursor: pointer;
}
</style>
