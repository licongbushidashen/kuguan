<template>

  <div class="main">
    <xr-header
      icon-class="wk wk-bell"
      icon-color="#2362FB"
      label="预警管理" >
      <template v-slot:ft>
        <div style="    display: flex;    justify-content: end;">
          <div>
            <el-button
              v-if="activeName==0&&allAuth['TaskCenterSetting.TaskCenterDealWithWarningRule']"
              :disabled="!disable"
              style="margin:0px 0px 10px 0px"
              type="primary" @click="addJurisdiction(1)">批量处理</el-button>
          </div>
        </div>
      </template>
    </xr-header>
    <div class="main-body">

      <div class="main-table-header" style="height:85px !important">
        <div class="secharts">
          <div>
            <el-select v-model="warningCategory" placeholder="请选择预警类型">
              <el-option
                v-for="(item,index) in warningCategorys"
                :key="index"
                :label="item.name"
                :value="item.id"
                class="wy-select"/>
            </el-select>
          </div>

          <el-button type="primary" @click="handleCurrentChange(0)">搜索</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleCurrentChange(0)">
          <el-tab-pane label="待处理" name="0">
            <span slot="label">待处理<el-badge v-if="quantity['7']>0" :value="quantity['7']" :max="99" class="item" style="    margin: 0px;"/></span>
          </el-tab-pane>
          <el-tab-pane label="已处理" name="1">
            <span slot="label">已处理</span>
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

                  v-model="row.checked"
                  @change="onItemCheckboxChange"
                />
                <!-- <span v-show="!row.hover && !row.checked" class="text">{{
                  $index + 1
                }}</span> -->
              </span>
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="类型">
          <template slot-scope="{ row, column, $index }">
            <span>{{ row.orderCategory | ordername }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="goodsCode" label="商品编号" />
        <!-- <el-table-column show-overflow-tooltip prop="name" label="单据状态">
            <template slot-scope="{ row, column, $index }">
              <span>{{ row.flag | flagname }}</span>
            </template>
          </el-table-column> -->


        <el-table-column prop="goodName" label="商品名称" />
        <el-table-column prop="size" label="规格" />
        <el-table-column prop="lowerLimit" label="最低库存" />
        <el-table-column prop="upperLimit" label="最高库存" />
        <el-table-column prop="stockQuantity" label="结存数量" />
        <el-table-column prop="warningValue" label="超限数量" />
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

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { filterTimestampToFormatTime } from '@/filters/index'
import { GetLogTaskCenter, GetOrder, DealWithWarningRule } from '@/api/kchk/order'
// import Ccware from './comp/add.vue'
import XrHeader from '@/components/XrHeader'
import CreateSections from '@/components/CreateSections'
import pagest from '@/mixins/pagest'
export default {
  /** 系统管理 的 项目管理 */
  name: 'SystemProject',
  components: {
    XrHeader,
    CreateSections
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
        return '库存总量预警'
      } else if (value == 22) {
        return '每单出库预警'
      } else if (value == 23) {
        return '月度出库预警'
      } else if (value == 24) {
        return '季度出库预警'
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

  mixins: [pagest],
  data() {
    return {
      warningCategory: '',
      warningCategorys: [
        { name: '每单预警', id: 23 },
        { name: '月度预警', id: 21 },
        { name: '季度预警', id: 22 },
        { name: '库存总量', id: 11 }
      ],
      checkedAll: [],
      activeName: '0',
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
      tableHeight: document.documentElement.clientHeight - 290, // 表的高度
      list: [],
      createAction: {
        type: 'save'
      },
      currentPage: 0,
      pageSize: 15,
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
      data.isProcessed = !!Number(this.activeName)
      if (this.warningCategory) {
        data.warningCategory = this.warningCategory
      }
      if (this.startTime) {
        data.startTime = filterTimestampToFormatTime(new Date(this.startTime).getTime(), 'YYYY-MM-DD HH:mm:ss')
      }
      GetLogTaskCenter(data)
        .then(res => {
          for (let i = 0; i < res.length; i++) {
            res[i].hover = false
            res[i].checked = false
          }
          this.list = res
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
          DealWithWarningRule(ids).then(res => {
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
  padding:10px 20px 0px 20px
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
.secharts{
  display: flex;
  border-bottom: 1px solid #1111;
    padding-bottom: 8px;
  >div{
 margin-right: 20px;
  }
}
</style>
