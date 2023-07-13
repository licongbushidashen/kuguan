<template>
  <div class="main">
    <xr-header
      icon-class="iconfont icon-baobiao"
      icon-color="#2362fb"
      label="货品库存表" >
      <template v-slot:ft>
        <el-button
          class="main-table-header-button "
          type="primary"
          icon="iconfont icon-daochu1"
          @click="downs">导出</el-button>
      </template>
    </xr-header>
    <div class="main-body">
      <div class="main-table-header" >

        <el-select
          v-model="categoryName" clearable style="width:200px;padding: 10px 0px 0px 10px;"
          placeholder="请选择类目名称">
          <el-option
            v-for="(item,index) in showDepData"
            :key="index"
            :label="item.name" :value="item.id"
            class="wy-select"/>
        </el-select>

        <div
          style="
            width: 20px;
            display: inline-block;
            line-height: 32px;
            margin: 0px 20px 0px 10px;
          "
        >
          <i class="wk wk-moretj" @click="morecondition = !morecondition" />
        </div>
        <div v-show="morecondition" class="morecondition1">
          <div class="morecondition">
            <div>
              <label for="">类目名称</label>
              <el-select
                v-model="categoryName" clearable style="width:200px;"
                placeholder="请选择类目名称">
                <el-option
                  v-for="(item,index) in showDepData"
                  :key="index"
                  :label="item.name" :value="item.id"
                  class="wy-select"/>
              </el-select>
            </div>
            <div>
              <label for="" style="margin-left:10px">货品名称</label>
              <el-input v-model="goodsName" style="width:200px;" placeholder="请输入货品名称"/>
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
        <!-- <el-table-column
          show-overflow-tooltip
          type="index"
          width="70"
          align="center"
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
        </el-table-column> -->
        <el-table-column
          show-overflow-tooltip
          prop="goodsCode"
          label="商品编码"/>

        <el-table-column
          prop="goodsCategoryName"
          label="类目名称"
        />
        <el-table-column
          prop="goodsName"
          label="商品名称"
        />

        <el-table-column
          prop="quantity"
          label="数量"
        >
          <template slot-scope="{ row, column, $index}">
            <span> {{ row.quantity }} {{ row.quantity>0?row.unitName:'' }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="unitPrice"
          label="单价"
        /> -->
        <el-table-column
          prop="amountMoney"
          label="金额(元)"
        />
        <el-table-column
          prop="size"
          label="商品规格"
        />
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
import {
  GetGoodsCategoryTreeHasRole
} from '@/api/kchk/goods'
import {
  GoodsInventory,
  DownloadGoodsInventoryExcel
} from '@/api/Inventory/kc'
import { downloadFileWithBuffer } from '@/utils'
import XrHeader from '@/components/XrHeader'
import CreateSections from '@/components/CreateSections'
import pagest from '@/mixins/pagest'
export default {
  /** 系统管理 的 项目管理 */
  name: 'SystemProject',
  components: {
    XrHeader,
    CreateSections

  },
  mixins: [pagest],
  data() {
    return {
      morecondition: false,
      showDepData: [],
      categoryName: '',
      goodsName: '',
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
    this.GetGoodsCategoryTreeHasRole()
    this.getList()
  },
  methods: {
    Reset() {
      this.categoryName = ''
      this.goodsName = ''
    },
    GetGoodsCategoryTreeHasRole() {
      GetGoodsCategoryTreeHasRole()
        .then(response => {
          this.showDepData = response || []
          this.depLoading = false
        })
        .catch(() => {
          this.depLoading = false
        })
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
    getList(x) {
      this.loading = true

      const data = { 'maxResultCount': this.pageSize , 'skipCount': x || this.currentPage, goodsName: this.goodsName, beginTime: this.gettiem(this.time[0], 1), endTime: this.gettiem(this.time[1]) }
      if (this.categoryName) {
        data.goodsCategoryId = this.categoryName
      }
      GoodsInventory(data)
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
      this.morecondition = false
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
    },

    /**
     * 导出
     */
    downs() {
      const data = { 'maxResultCount': 1000, 'skipCount': 0, goodsName: this.goodsName, beginTime: this.gettiem(this.time[0], 1), endTime: this.gettiem(this.time[1]) }
      if (this.categoryName) {
        data.goodsCategoryId = this.categoryName
      }


      DownloadGoodsInventoryExcel(data).then(res => {
        // const blob = new Blob([res], {
        //   type: ''
        // })
        downloadFileWithBuffer(res, '', 'application/vnd.ms-excel;charset=UTF-8')
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
.morecondition1{
  align-items: baseline;
      position: absolute;
    z-index: 9;
    background: #fff;
    width: 100%;
    border: 1px solid #e6e6e6;
    top:0px
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
        // width: 80px;
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
</style>
