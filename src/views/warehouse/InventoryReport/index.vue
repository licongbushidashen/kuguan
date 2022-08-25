<template>
  <div class="main">
    <xr-header
      icon-class="iconfont icon-baobiao"
      icon-color="#2362fb"
      label="总库存报表" >
      <template v-slot:ft>

        <el-button
          class="main-table-header-button "
          type="primary"
          icon="iconfont icon-xianxing-daoru"
          @click="downs">导出</el-button>
      </template>
    </xr-header>
    <div class="main-body">
      <div class="main-table-header" style="padding-left:20px">
        <label for="">类目名称</label>
        <el-input v-model="categoryName" style="width:200px;padding: 10px 0px 0px 10px;" placeholder="请输入类目名称"/>
        <label for="" style="margin-left:10px">货品名称</label>
        <el-input v-model="goodsName" style="width:200px;padding: 10px 0px 0px 10px;" placeholder="请输入货品名称"/>
        <label for="" style="margin:0px 10px">时间范围</label>
        <el-date-picker
          v-model="time"
          style="    vertical-align: bottom;"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
        <el-button type="primary" @click="handleCurrentChange(0)">搜索</el-button>
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
          show-overflow-tooltip
          prop="goodsCode"
          label="商品编码"/>

        <el-table-column
          prop="goodsCategoryName"
          label="大类名称"
        />
        <el-table-column
          prop="goodsName"
          label="商品名称"
        />
        <el-table-column
          prop="unitName"
          label="计量单位"
        />
        <el-table-column
          prop="initialNum"
          label="期初数量"
        />
        <el-table-column
          prop="initialPrice"
          label="期初金额"
        />
        <el-table-column
          prop="inNum"
          label="入库数量"
        />
        <el-table-column
          prop="inPrice"
          label="入库金额"
        />
        <el-table-column
          prop="outNum"
          label="出库数量"
        />
        <el-table-column
          prop="outPrice"
          label="出库金额"
        />
        <el-table-column
          prop="changeNum"
          label="调整数量"
        />
        <el-table-column
          prop="changePrice"
          label="调整单价"
        />
        <el-table-column
          prop="changeAmount"
          label="调整金额"
        />
        <el-table-column
          prop="endNum"
          label="期末数量"
        />
        <el-table-column
          prop="endPrice"
          label="期末单价"
        />
        <el-table-column
          prop="endAmount"
          label="期末金额"
        />
      </el-table>
      <div class="p-contianer">
        <el-pagination
          :current-page="currentPage"
          :total="total"
          :page-size="pageSize"
          :pager-count="5"
          class="p-bar"
          background
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
  </div>
</template>

<script>
import {
  TotalInventory,
  DownloadTotalInventoryExcel
} from '@/api/Inventory/kc'
import { downloadFileWithBuffer } from '@/utils'
import XrHeader from '@/components/XrHeader'
import CreateSections from '@/components/CreateSections'
export default {
  /** 系统管理 的 项目管理 */
  name: 'SystemProject',
  components: {
    XrHeader,
    CreateSections

  },
  mixins: [],
  data() {
    return {
      categoryName: '',
      goodsName: '',
      showing: false,
      planing: true,
      warningshow: true,
      jurisdictionCreateShow: false,
      inputs: '',
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 250, // 表的高度
      list: [],
      createAction: {
        type: 'save'
      },
      currentPage: 0,
      pageSize: 15,
      total: 0,
      obj: {},
      info: {},
      time: []
    }
  },
  computed: {},
  mounted() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    this.time = [year + '-' + month + '-' + '01', date]
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

      const data = { 'maxResultCount': this.currentPage + 15, 'skipCount': this.currentPage, goodsName: this.goodsName, categoryName: this.categoryName, beginTime: this.gettiem(this.time[0], 1), endTime: this.gettiem(this.time[1]) }
      console.log(data, 666)
      TotalInventory(data)
        .then(res => {
          this.list = res.items
          this.total = res.totalCount
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    gettiem(time, flag) {
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
      const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
      if (flag) {
        return year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        return year + '-' + month + '-' + day + ' 23:59:59'
      }
    },
    /**
     * 更改当前页数
     * @param {*} val
     */
    handleCurrentChange(val) {
      const x = val > 0 ? val - 1 : 0
      this.currentPage = x ? x * 15 : x
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
    },

    /**
     * 导出
     */
    downs() {
      const data = { 'maxResultCount': 1000, 'skipCount': 0, goodsName: this.goodsName, categoryName: this.categoryName, beginTime: this.gettiem(this.time[0], 1), endTime: this.gettiem(this.time[1]) }

      DownloadTotalInventoryExcel(data).then(res => {
        const blob = new Blob([res], {
          type: ''
        })
        downloadFileWithBuffer(blob, '', 'application/vnd.ms-excel;charset=UTF-8')
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
  color:#4f81fc
}
</style>
