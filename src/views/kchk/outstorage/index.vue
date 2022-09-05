<template>
  <div class="main">
    <xr-header
      icon-class="iconfont icon-chukuguanli"
      icon-color="#2362FB" label="出库管理">
      <template v-slot:ft>
        <el-button
          v-if="allAuth['OrderSetting.Orders.Create']"
          class="main-table-header-button "
          type="primary"
          icon="el-icon-plus"
          @click="addJurisdiction"
        >新建</el-button
        >
        <el-button
          v-if="allAuth['OrderSetting.Orders.Create']"
          type="primary"
          icon="iconfont icon-piliangtianjia"
          class="xr-btn--orange"
          @click="addJurisdiction1"
        >整批出库</el-button
        >
      </template>
    </xr-header>
    <div class="main-body">
      <div class="main-table-header">
        <div>
          <el-input
            v-model="inputs"
            style="width:200px;padding: 10px 0px 0px 10px;"
            placeholder="请输入申请人"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleCurrentChange(0)"
            />
          </el-input>
          <div style="width:20px;display:inline-block">
            <i class="wk wk-moretj" @click="morecondition=!morecondition"/>
          </div>
          <div v-show="morecondition" class="morecondition1">
            <div class="morecondition">
              <div>
                <label for="">申请人</label>
                <el-input
                  v-model="inputs"
                  placeholder="请输入申请人"
                />
              </div>
              <div>
                <label for="">入库日期</label>
                <el-date-picker
                  v-model="startTime"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"/>
              </div>
              <div>
                <label for="">入库类型</label>
                <el-select v-model="orderCategory">
                  <el-option
                    v-for="(item,index) in Category"
                    :key="index" :label="item.name"
                    :value="item.orderCategory"
                    class="wy-select"/>
                </el-select>
              </div>
              <div>
                <label for="">关键字</label>
                <el-input
                  v-model="company"
                  placeholder="往来单位/仓库名称"
                />
              </div>
              <div>
                <label for="">状态</label>
                <el-select v-model="flag" >
                  <el-option
                    v-for="(item,index) in flagName"
                    :key="index" :label="item.name"
                    :value="item.value"
                    class="wy-select"/>
                </el-select>
              </div>
            </div>
            <div
              class="morecondition2">
              <el-button
                class="main-table-header-button "
                @click="Reset">重置</el-button>
              <el-button
                class="main-table-header-button "
                type="primary" @click="handleCurrentChange(0)">搜索</el-button>
            </div>
          </div>
        </div>
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
          <template slot-scope="{ row, column, $index }">
            <span class="status-name">
              <span
                class="index"
                style="text-align: center; display: block;"
                @mouseenter="row.hover = true"
                @mouseleave="row.hover = false"
              >
                <!-- <el-checkbox
                  v-show="row.hover || row.checked"
                  v-model="row.checked"
                  @change="onItemCheckboxChange"
                /> -->
                <span class="text">{{
                  $index + 1
                }}</span>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="单据状态">
          <template slot-scope="{ row, column, $index }">
            <span>{{ row.flag | flagname }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="orderNo" label="单据号" />
        <el-table-column prop="address" label="出库类型">
          <template slot-scope="{ row, column, $index }">
            <span>{{ row.orderCategory | ordername }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsCategoryName" label="所属类目" />
        <el-table-column prop="wareHouseName" label="仓库" />
        <el-table-column prop="memoryCardName" label="经费卡号" />
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
          :page-sizes="pageSizes"
          :page-size.sync="pageSize"
          :total="total"
          class="p-bar"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
    <Bill :showing="jurisdictionCreateShow" :info="info" :ffts="ffts" @change="getList"/>

    <Type :placeholder="placeholder" :typeling="typeling" :p="p" :url="url" :name="name" @change="typevalu"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { filterTimestampToFormatTime } from '@/filters/index'
import { OrderPage, GetOrder } from '@/api/kchk/order'
// import Ccware from './comp/add.vue'
import XrHeader from '@/components/XrHeader'
import CreateSections from '@/components/CreateSections'
import Bill from './comp/bill'
import Type from './comp/type'
import pagest from '@/mixins/pagest'
export default {
  /** 系统管理 的 项目管理 */
  name: 'SystemProject',
  components: {
    XrHeader,
    CreateSections,
    Bill,
    Type
    // Ccware
  },
  filters: {
    ordername: function(value) {
      if (value == 21) {
        return '领用出库'
      } else if (value == 22) {
        return '退货出库'
      } else if (value == 23) {
        return '借用出库'
      } else if (value == 24) {
        return '销毁出库'
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
        return '已出库'
      } else if (value == 5) {
        return '已作废'
      }
    }
  },
  mixins: [pagest],
  data() {
    return {
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
      orderCategory: '',
      Category: [
        {
          orderCategory: '21',
          name: '领用出库'
        }, {
          orderCategory: '22',
          name: '退货出库'
        }, {
          orderCategory: '23',
          name: '借用出库'
        }, {
          orderCategory: '24',
          name: '销毁出库'
        }
      ],
      startTime: [],
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
      p: '',
      placeholder: '',
      typeling: false,
      url: '',
      name: '',
      ffts: false
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
    if (this.$route.params.time) {
      this.startTime = [new Date(), new Date()]
    }
    this.getList()
  },
  methods: {
    Reset() {
      this.company = ''
      this.flag = null
      this.orderCategory = null
      this.startTime = []
      this.inputs = ''
    },
    typevalu(row) {
      this.info = row
      this.info.pl = true
      this.jurisdictionCreateShow = !this.jurisdictionCreateShow
    },
    addJurisdiction1() {
      debugger
      this.p = '关联单据'
      this.placeholder = '请输入单据号'
      this.typeling = !this.typeling
      this.url = '/api/zjlab/Order/OrderPage'
      this.ffts = true
      this.name = 'gldj1'
    },
    openplan(row) {
      this.planing = !this.planing
    },
    openwarn(row) {
      this.warningshow = !this.warningshow
    },
    /*
     * 当checkbox选择change时事件
     */
    onItemCheckboxChange() {
      this.obj = {}
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
        maxResultCount: this.pageSize + this.currentPage,
        skipCount: this.currentPage,
        isOutbound: true,
        createName: this.inputs,
        searchKey: this.company
      }
      if (this.flag !== '') {
        data.flag = this.flag
      }
      if (this.orderCategory) {
        data.stockCategory = this.orderCategory
      }
      if (this.startTime && this.startTime.length > 0) {
        data.startTime = filterTimestampToFormatTime(new Date(this.startTime[0]).getTime(), 'YYYY-MM-DD') + ' 00:00:00'
        data.endTime = filterTimestampToFormatTime(new Date(this.startTime[1]).getTime(), 'YYYY-MM-DD') + ' 23:59:59'
      }
      OrderPage(data)
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
    addJurisdiction() {
      this.info = {}
      this.ffts = false
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
      if (!this.allAuth['OrderSetting.Orders.Edit']) {
        this.$message.error('无详情权限')
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
  .morecondition1{
    padding-left:4px !important;
  top: -5px;
  margin-top: 4px;
  align-items: baseline;
      position: absolute;
    z-index: 9;
    background: #fff;
    width: 100%;
    border: 1px solid #e6e6e6;
  }
  .morecondition2{
    width: 100%;
    padding: 0px 0 8px 8px;
    text-align: center;
    .main-table-header-button{
      float: none !important;
    }
  }
.morecondition{

    display: flex;
    padding: 20px 20px 0px 20px;
    flex-wrap: wrap;
    -webkit-box-pack: start;
    justify-content: flex-start;
    >div{
      margin-bottom: 10px;
    margin-right: 1.5%;
    width: 31.33%;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    >div{
      width: 100%;
    }
      label{
        width: 80px;
    display: inline-block;
    text-align: right;
      }
      label:after {
    content: " ";
    position: relative;
    top: -0.5px;
    margin: 0 8px 0 2px;
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
