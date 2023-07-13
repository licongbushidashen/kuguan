<template>
  <div class="main">
    <xr-header
      icon-class="iconfont icon-kucunchaxun1"
      icon-color="#2362fb"
      label="库存盘点"
    >
      <template v-slot:ft>
        <el-button
          v-if="allAuth['InventoryManager.CheckPlans.Create']"
          class="main-table-header-button"
          type="primary"
          icon="el-icon-plus"
          @click="addJurisdiction"
        >新建</el-button
        >
      </template>
    </xr-header>
    <div class="main-body">
      <div class="main-table-header">
        <el-input
          v-model="inputs"
          style="width: 250px; padding: 10px 0px 0px 10px"
          placeholder="请输入盘点计划/经办人"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleCurrentChange(0)"
          />
        </el-input>
      </div>
      <el-table
        v-loading="loading"
        id="examine-table"
        :data="list"
        :height="tableHeight"
        class="main-table"
        highlight-current-row
      >
        <!-- <el-table-column
          show-overflow-tooltip
          type="index"
          width="60"
          align="center"
          label="序号"
        >
          <template slot-scope="{ row, column, $index }">
            <span class="status-name">
              <span
                class="index"
                style="text-align: center; display: block"
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
        <el-table-column show-overflow-tooltip prop="flag" label="状态">
          <template slot-scope="{ row, column, $index }">
            <span>{{ row.flag | flagname }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="planName" label="盘点计划名称" />
        <el-table-column prop="checkWay" label="盘点方式">
          <template slot-scope="{ row, column, $index }">
            <span>{{ row.checkWay | checkWay }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="wareHouseName" label="盘点仓库" />
        <el-table-column prop="goodsCategoryName" label="盘点类目" />
        <el-table-column prop="operatorName" label="经办人" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column fixed="right" label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              v-if="allAuth['InventoryManager.CheckPlans.CheckPlanDetails']"
              type="text"
              size="small"
              @click="handleClick('edit', scope.row)">盘点明细</el-button>
            <el-button
              v-if="
                scope.row.flag == 2 &&
                  allAuth['InventoryManager.CheckPlans.DealWith']
              "
              type="text"
              size="small"
              @click="handleClick('copy', scope.row)"
            >盈亏处理</el-button
            >
          </template>
        </el-table-column>
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
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <Ccware :showing="jurisdictionCreateShow" :info="info" @change="getList" />
    <Inventory
      :showing="Inventoryshow"
      :id="Inventoryid"
      :flag="flag"
      @change="handleCurrentChange"
    />
    <Handle
      :showing="lossShow"
      :id="Inventoryid"
      :flag="flag"
      @change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import { CheckPlanPage } from '@/api/Inventory/kc'
import Inventory from './comp/Inventory'
import Ccware from './comp/add.vue'
import Handle from './comp/handle.vue'
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
    Inventory,
    Handle
  },
  filters: {
    checkWay: function(value) {
      if (value == 0) {
        return '明盘'
      } else if (value == 1) {
        return '暗盘'
      }
    },
    flagname: function(value) {
      if (value == 0) {
        return '未开始'
      } else if (value == 1) {
        return '盘点中'
      } else if (value == 2) {
        return '盘点完成'
      } else if (value == 3) {
        return '已完成'
      }
    }
  },
  mixins: [pagest],
  data() {
    return {
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
      this.list
        .filter((d) => d.checked)
        .map((e) => {
          const key = e.id
          const val = e.code
          this.obj[key] = val
          return { [key]: val }
        })
    },
    /**
     * 获取列表数据
     */
    getList(x) {
      this.loading = true
      const data = {
        maxResultCount: this.pageSize ,
        skipCount: x || this.currentPage,
        searchKey: this.inputs
      }
      CheckPlanPage(data)
        .then((res) => {
          for (let i = 0; i < res.items.length; i++) {
            res.items[i].hover = false
            res.items[i].checked = false
            res.items[i].startTime = parseTime(
              res.items[i].startTime,
              '{y}-{m}-{d}'
            )
            res.items[i].endTime = parseTime(
              res.items[i].endTime,
              '{y}-{m}-{d}'
            )
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
      const x = (val > 0 ? val - 1 : 0) * this.pageSize
      this.currentPage = val
      this.getList(x)
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
