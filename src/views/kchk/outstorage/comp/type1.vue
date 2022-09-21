<template>
  <el-dialog :visible.sync="shows" :title="p" append-to-body>
    <div v-loading="loading">
      <div style="display: flex;     align-items: baseline; flex-wrap:wrap ;">
        <!-- <label for="" style="margin-left:0px;margin-right: 18px;">{{ placeholder.slice(3) }}</label> -->
        <div style="margin-bottom: 20px;">
          <label for="">入库类型</label>
          <el-select v-model="orderCategory" style="width:140px">
            <el-option
              v-for="(item,index) in Category"
              :key="index" :label="item.name"
              :value="item.orderCategory"
              class="wy-select"/>
          </el-select>
          <div style="width:20px;display:inline-block">
            <i class="wk wk-moretj" @click="morecondition=!morecondition"/>
          </div>
        </div>
        <div v-show="morecondition" class="morecondition1">
          <div class="morecondition">
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
              <label for="">单据号</label>
              <el-input
                v-model="orderNo"
                placeholder="请输入单据号"
              />
            </div>
            <div>
              <label for="">货品类目</label>
              <el-select v-model="goodsCategoryId">
                <el-option
                  v-for="(item,index) in showDepData"
                  :key="index" :label="item.name"
                  :value="item.id"
                  class="wy-select"/>
              </el-select>
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
              <label for="">关键字</label>
              <el-input
                v-model="inputContent"
                placeholder="往来单位/仓库名称"
              />
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
        <!-- <el-input
          :placeholder="placeholder"
          v-model="inputContent"
          class="search-input"
          style="width:140px;margin-bottom: 20px;"
          @keyup.enter.native="Pagelist"/>

        <div v-if="name=='gldj1'" style="margin: 0px 10px">
          <label for="">出库日期</label>
          <el-date-picker
            v-model="startTime"
            style="width:240px"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </div>

        <div v-if="name=='gldj1'" style="margin: 0px 10px">
          <label for="">关键字</label>
          <el-input
            v-model="company"
            style="width:130px;"
            placeholder="往来单位/仓库名称"
          />
        </div> -->

        <el-button type="primary" style="margin-left:20px;    margin-bottom: 20px;" @click="handleCurrentChange(0)"> 查询</el-button>
        <!-- <span v-if="shows1" style="background: #85C7AF;    padding: 10px 15px;    border-radius: 5px;    color: #fff;    position: absolute;    right: 30px;" @click="openurl">新 增</span> -->
      </div>
      <el-table

        v-if="flag"
        id="examine-table"
        :data="list"
        class="main-table"
        highlight-current-row
      >
        <el-table-column
          show-overflow-tooltip
          type="index"
          width="80"
          label="序号">

          <template slot-scope="{ row, column, $index}">
            <span class="status-name">
              <span
                class="index"
                style=" display: block;"
                @mouseenter="row.hover = true"
                @mouseleave="row.hover = false"
              >
                <el-checkbox

                  v-model="row.checked"
                  @change="onItemCheckboxChange(row)"
                />
                <span class="text">{{
                  $index+1
                }}</span>
              </span>

            </span>
          </template>
        </el-table-column>

        <el-table-column v-for="(item,index) in label" :prop="item.prop" :label="item.name" :key="index">
          <template slot-scope="{ row, column, $index}">
            <span v-if="item.prop=='orderCategory'">{{ row[item.prop]|ordername }}</span>
            <span v-else-if="item.prop=='flag'">已入库</span>
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
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

    <span slot="footer" class="dialog-footer">
      <el-button @click="shows = false">取消</el-button>
      <el-button type="primary" @click="dialogSure">确 定</el-button>

    </span>
  </el-dialog>

</template>
<script>
import {
  GetGoodsCategoryTreeHasRole
} from '@/api/kchk/goods'
import request from '@/utils/request'
import { filterTimestampToFormatTime } from '@/filters/index'
import { GetOrder } from '@/api/kchk/order'
import {
// GetInfo
} from '@/api/kchk/goods'
export default {
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
      } else if (value == 11) {
        return '采购入库'
      } else if (value == 12) {
        return '退货入库'
      } else if (value == 13) {
        return '借用还库'
      }
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '请输入'
    },
    typeling: {
      type: Boolean,
      default: false
    },
    url: {
      type: String

    },
    p: {
      type: String
    },
    name: {
      type: String
    },
    objs: {
      type: Object
    }
  },
  data() {
    return {
      orderNo: '',
      goodsCategoryId: '',
      showDepData: [],
      morecondition: false,
      loading: false,
      startTime: [new Date() - 1000 * 24 * 3600 * 7, new Date()],
      company: '',
      orderCategory: '',
      Category: [
        {
          orderCategory: '11',
          name: '采购入库'
        }, {
          orderCategory: '12',
          name: '退货入库'
        }, {
          orderCategory: '13',
          name: '借用还库'
        }
      ],
      list: [],
      row: {},
      shows: false,
      inputContent: '',
      currentPage: 0,
      pageSize: 15,
      total: 0,
      labelList: {
        wldw: [
          { name: '单位名称', prop: 'name' },
          { name: '联系人', prop: 'linkman' },
          { name: '联系方式', prop: 'phone' }
        ],
        ck: [
          { name: '仓库名称', prop: 'name' },
          { name: '仓库地址', prop: 'address' },
          { name: '仓库说明', prop: 'remark' }
        ],
        jfkh: [
          { name: '经费卡号', prop: 'number' },
          { name: '经费名称', prop: 'name' },
          { name: '负责人 ', prop: 'dutyUser' }
        ],
        dutyUser: [
          { name: '姓名', prop: 'name' },
          { name: '联系方式', prop: 'phoneNumber' },
          { name: '邮箱', prop: 'email' }
        ],
        goods: [
          { name: '货品名称', prop: 'goodsName' },
          { name: '所属类目', prop: 'goodsCategoryName' },
          { name: '货品编码', prop: 'goodsCode' },
          { name: '品牌', prop: 'brand' },
          { name: '货品条码', prop: 'ean13' },
          { name: '规格', prop: 'size' }
        ],
        gldj1: [
          { name: '单据状态', prop: 'flag' },
          { name: '单据号', prop: 'orderNo' },
          { name: '出库类型', prop: 'orderCategory' },
          { name: '类目名称', prop: 'goodsCategoryName' },
          { name: '往来单位', prop: 'memoryCardName' },
          { name: '仓库', prop: 'wareHouseName' }
        ]

      },
      label: {},
      flag: 0,
      warehouseName: '',
      catetoryName: ''
    }
  },
  computed: {
    shows1: function() {
      if (this.name == 'jfkh' || this.name == 'gldj1') {
        return false
      } else if (this.name == 'dutyUser') {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    typeling() {
      this.shows = true
      this.pageSize = 15
      this.currentPage = 0
      this.flag = 0
      this.getDepTreeList()
      this.Pagelist()
    }
  },
  methods: {
    getDepTreeList() {
      this.depLoading = true
      GetGoodsCategoryTreeHasRole()
        .then(response => {
          this.showDepData = response || []
          this.depLoading = false
        })
        .catch(() => {
          this.depLoading = false
        })
    },
    openurl() {
      if (this.name == 'wldw') {
        this.$router.push('/kchk/kcgj-company?add=1')
      } else if (this.name == 'dutyUser') {
        this.$router.push('/kchk/kcgj-project?add=1')
      } else if (this.name == 'ck') {
        this.$router.push('/kchk/kcgj-ck?add=1')
      } else if (this.name == 'goods') {
        this.$router.push('/kchk/kcgj-kc?add=1')
      }
    },
    dialogSure() {
      debugger
      const isCheckedItems = this.list.filter(d => d.checked)
      if (isCheckedItems.length > 0) {
        if (this.name == 'gldj1') {
          GetOrder(this.row.id).then(res => {
            res.order.ffs = true
            this.$emit('change', res, this.name)
            // const arr = res.detailList
            // for (let i = 0; i < arr.length; i++) {
            //   // GetInfo(arr[i].goodsId).then(res1 => {
            //   //   arr[i].ean13List = res1.unitList
            //   //   arr[i].checked = false
            //   //   this.$emit('change', arr[i], this.name)
            //   // })
            // }
          })
        } else {
          this.$emit('change', this.row, this.name)
        }

        this.shows = false
      } else {
        this.$message.error('请选择一条数据')
      }
    },
    onItemCheckboxChange(row) {
      this.row = row
      this.list.forEach(e => {
        if (e.id != row.id) {
          e.checked = false
        }
      })
      const isCheckedItems = this.list.filter(d => d.checked)
      console.log(isCheckedItems)
    },
    /**
       * 更改当前页数
       * @param {*} val
       */
    handleCurrentChange(val) {
      const x = val > 0 ? val - 1 : 0
      this.currentPage = x ? x * this.pageSize : x
      this.morecondition = false
      this.Pagelist()
    },
    changeParam(param) {
      return JSON.stringify(param).replace(/:/g, '=').replace(/,/g, '&').replace(/{/g, '?').replace(/}/g, '').replace(/"/g, '')
    },
    Reset() {
      this.inputContent = ''
      this.orderNo = ''
      this.goodsCategoryId = null
      this.orderCategory = null
      this.startTime = []
    },
    Pagelist() {
      debugger

      this.loading = true
      const data = { 'maxResultCount': this.pageSize + this.currentPage, 'skipCount': this.currentPage, searchKey: this.inputContent }
      if (this.name == 'gldj1') {
        data.orderNo = this.orderNo
        if (this.goodsCategoryId) {
          data.goodsCategoryId = this.goodsCategoryId
        }

        data.isOutbound = false
        if (this.orderCategory) {
          data.stockCategory = this.orderCategory
        }
        if (this.startTime && this.startTime.length > 0) {
          data.startTime = filterTimestampToFormatTime(new Date(this.startTime[0]).getTime(), 'YYYY-MM-DD HH:mm:ss')
          data.endTime = filterTimestampToFormatTime(new Date(this.startTime[1]).getTime(), 'YYYY-MM-DD HH:mm:ss')
        } else {
          data.startTime = null
          data.endTime = null
        }
      }

      if (this.p == '货品') {
        data.warehouseId = this.objs.ckId
        data.catetoryId = this.objs.typeId
        data.isBigThenZero = true
        // data.warehouseName = this.warehouseName
        // data.catetoryName = this.catetoryName
      }
      data.isBigThenZero = true
      return request({
        url: this.url,
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        res.items.forEach(element => {
          element.hover = false
          element.checked = false
        })
        this.loading = false
        this.$nextTick(() => {
          this.label = this.labelList[this.name]
          this.list = res.items
          console.log(this.label)
          this.flag = 1
        })

        this.total = res.totalCount
      })
    }
  }
}
</script>
  <style lang="scss" scoped>


.morecondition1{
 left: 0px;
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
/deep/.el-dialog{
    min-width: 960px;
  }
  </style>

