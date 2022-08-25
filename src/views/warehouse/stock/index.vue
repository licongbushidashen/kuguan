<template>
  <div class="main">
    <xr-header
      icon-class="iconfont icon-kucunguanli"
      icon-color="#2362fb"
      label="库存查询" >
      <template v-slot:ft>

        <el-button
          class="main-table-header-button "
          type=""
          icon="el-icon-plus"
          @click="downs">导出</el-button>
      </template>
    </xr-header>
    <div class="main-body">
      <div class="main-table-header">
        <el-input v-model="inputs" style="width:200px;padding: 10px 0px 0px 10px;" placeholder="请输入货品/仓库名称">
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
          width="150"
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
          prop="goodsName"
          label="货品名称"/>

        <el-table-column
          prop="goodsCategoryName"
          label="货品类目"
        />
        <el-table-column
          prop="wareHouseName"
          label="所属仓库"
        />
        <el-table-column
          prop="brand"
          label="品牌"
        />
        <el-table-column
          prop="size"
          label="规格"
        />
        <el-table-column
          prop="unitName"
          label="单位"
        />
        <el-table-column
          prop="residueNum"
          label="剩余库存"
        />
        <el-table-column
          prop="totalAmount"
          label="总金额"
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
  InventoryPage,
  DownloadInventoryExcel
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
      info: {}
    }
  },
  computed: {},
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
      const data = { 'maxResultCount': this.pageSize + this.currentPage, 'skipCount': this.currentPage, searchKey: this.inputs }
      InventoryPage(data)
        .then(res => {
          for (let i = 0; i < res.items.length; i++) {
            res.items[i].hover = false
            res.items[i].checked = false
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
      DownloadInventoryExcel({ maxResultCount: 1000, skipCount: 0 }).then(res => {
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
