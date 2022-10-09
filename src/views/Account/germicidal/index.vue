<template>
  <div class="main">
    <xr-header icon-class="iconfont icon-huaban39" icon-color="#2362fb" label="消杀台账">
      <template v-slot:ft>
        <el-button
          v-if="allAuth['PropertyBillManager.PropertyBill.DisinfectionCreate']"
          class="main-table-header-button "
          type="primary"
          icon="el-icon-plus"
          @click="addJurisdiction"
        >新建</el-button
        >
        <el-button
          v-if="allAuth['PropertyBillManager.PropertyBill.DisinfectionImport']"
          class="main-table-header-button "
          type=""
          icon="iconfont icon-xianxing-daoru"
          @click="bulkImportClick">导入</el-button>
        <el-button
          v-if="allAuth['PropertyBillManager.PropertyBill.DisinfectionExport']"
          class="main-table-header-button "
          type=""
          icon="iconfont icon-daochu1"
          @click="downs">导出</el-button>
      </template>
    </xr-header>
    <div class="main-body">
      <div class="main-table-header">
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
        <el-button type="primary" style="margin-left:20px" @click="handleCurrentChange(0)">搜索</el-button>
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
        <!-- <el-table-column
          show-overflow-tooltip
          type="index"
          width="70"
          align="center"
          label="序号"
        >
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
        </el-table-column> -->
        <el-table-column
          show-overflow-tooltip
          prop="antivirusDate"
          label="消杀日期"
        />
        <el-table-column prop="weatherForecast" label="天气情况" />
        <el-table-column prop="spacePointName" label="空间点位" />
        <el-table-column prop="servicesAvailable" label="服务项目" />
        <el-table-column prop="serviceContent" label="服务内容" />
        <el-table-column prop="pestCategories" label="虫害类别" />
        <el-table-column prop="drugName" label="药物名称" />
        <el-table-column prop="executor" label="作业人员" />
        <el-table-column prop="phone" label="作业人员电话" />
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
    <Ccware :showing="jurisdictionCreateShow" :info="info" @change="handleCurrentChange(0)" />
    <!-- 批量导入 -->
    <bulk-import-user
      :show="bulkImportShow"
      url="api/zjlab/Disinfection/Upload"
      @close="bulkImportShow = false"
      @success="handleCurrentChange(0)"
    />
  </div>
</template>

<script>
import BulkImportUser from '../import.vue'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import { downloadFileWithBuffer } from '@/utils'
import {
  DisinfectionPage,
  DisinfectionDownload

} from '@/api/account'
import Ccware from './comp/add.vue'
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
      // 批量导入
      bulkImportShow: false,
      flag: 0,
      Inventoryid: '',
      lossShow: false,
      Inventoryshow: false,
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
      info: {},
      time: [new Date() - 24 * 3600 * 1000 * 30, new Date()]

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
     * 导出
     */
    downs() {
      DisinfectionDownload({ 'maxResultCount': 1000, 'skipCount': 0, beginTime: parseTime(this.time[0]), endTime: parseTime(this.time[1]) }).then(res => {
        const blob = new Blob([res], {
          type: ''
        })
        downloadFileWithBuffer(blob, '', 'application/vnd.ms-excel;charset=UTF-8')
      })
    },
    /**
     * 批量导入
     */

    bulkImportClick(val) {
      this.bulkImportShow = true
    },
    handleClick(type, row) {
      if (type == 'edit') {
        this.Inventoryid = row.id
        this.flag = row.flag
        this.Inventoryshow = !this.Inventoryshow
      } else {
        this.Inventoryid = row.id
        this.flag = row.flag
        this.lossShow = !this.lossShow
      }
    },
    /**
     *  添加权限
     */
    addJurisdiction() {
      this.info = {}
      this.jurisdictionCreateShow = !this.jurisdictionCreateShow
    },
    /*
   * 当checkbox选择change时事件
   */
    onItemCheckboxChange() {
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
      const data = { 'maxResultCount': this.pageSize + this.currentPage, 'skipCount': this.currentPage, beginTime: parseTime(this.time[0], '{y}-{m}-{d}') + ' 00:00:00', endTime: parseTime(this.time[1], '{y}-{m}-{d}') + ' 23:59:59' }
      DisinfectionPage(data)
        .then(res => {
          for (let i = 0; i < res.items.length; i++) {
            res.items[i].hover = false
            res.items[i].checked = false
            res.items[i].antivirusDate = parseTime(res.items[i].antivirusDate, '{y}-{m}-{d} {h}:{m}')
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
      debugger
      // this.time = [new Date() - 24 * 3600 * 1000 * 30, new Date()]
      const x = val > 0 ? val - 1 : 0
      this.currentPage = x ? x * this.pageSize : x
      this.getList()
    },



    /** 列表操作 */
    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      if (column.label == '序号') {
        return
      }
      this.info = row
      this.jurisdictionCreateShow = !this.jurisdictionCreateShow
    //   GetInfo(row.id).then(res => {
    //     console.log(res)
    //     this.info = res
    //     this.jurisdictionCreateShow = !this.jurisdictionCreateShow
    //   })
    },
    handleClick1(type, scope) {
      this.createAction = {
        type: 'update',
        data: scope.row
      }
      this.dbsyShow = true
    }


  }
}
</script>

<style lang="scss" scoped>
/deep/.el-range-editor.el-input__inner{
  // padding: 0px 10px !important;
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
}
// .main-table{
//       height: calc(100% - 90px ) !important;
// }
.main-table-header {
  height: 50px;
  background-color: white;
  position: relative;
  line-height: 50px;
  padding-left: 20px;
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
.buttonc {
  color: #4f81fc;
  cursor: pointer;
}
</style>
