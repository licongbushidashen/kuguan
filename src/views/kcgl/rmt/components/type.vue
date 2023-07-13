<template>
  <el-dialog :visible.sync="shows" :close-on-click-modal="false" :destroy-on-close="true" append-to-body title="关联用户">
    <div style="margin-bottom :20px;display: flex;    align-items: baseline;">
      <el-input
        v-model="inputContent"
        placeholder="请输入姓名/账号"
        class="search-input"
        style="width:200px"
        @keyup.enter.native="Pagelist">
        <el-button slot="append" type="primary" style="float:right" icon="el-icon-search" @click="handleCurrentChange(0)" />
      </el-input>

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
                v-show="row.hover || row.checked"
                v-model="row.checked"
                @change="onItemCheckboxChange(row)"
              />
              <span v-show="!row.hover && !row.checked" class="text">{{
                $index+1
              }}</span>
            </span>

          </span>
        </template>
      </el-table-column>

      <el-table-column v-for="(item,index) in label" :prop="item.prop" :label="item.name" :key="index">
        <template slot-scope="{ row, column, $index}">
          <span v-if="item.prop=='orderCategory'">{{ row[item.prop]|ordername }}</span>
          <span v-else-if="item.prop=='flag'">已出库</span>
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

    <span slot="footer" class="dialog-footer">
      <el-button @click="shows = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>

    </span>
  </el-dialog>

</template>
<script>
import { usersIdroles } from '@/api/admin/rmt'
import request from '@/utils/request'
import { filterTimestampToFormatTime } from '@/filters/index'
import { GetOrder } from '@/api/kchk/order'
import {
  GetInfo
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
    roleId: [Number, String],
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
    name: {
      type: String
    }
  },
  data() {
    return {
      startTime: null,
      company: '',
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
          { name: '单位编码', prop: 'code' },
          { name: '联系人', prop: 'linkman' },
          { name: '联系方式', prop: 'phone' }
        ],
        ck: [
          { name: '仓库名称', prop: 'name' },
          { name: '仓库编码', prop: 'code' }
        ],
        jfkh: [
          { name: '经费卡号', prop: 'number' },
          { name: '经费名称', prop: 'name' },
          { name: '所属部门 ', prop: 'deptName' },
          { name: '负责人 ', prop: 'dutyUser' }
        ],
        dutyUser: [
          { name: '姓名', prop: 'name' },
          { name: '账号', prop: 'userName' },
          { name: '联系方式', prop: 'phoneNumber' },
          { name: '邮箱', prop: 'email' }
        ],
        goods: [
          { name: '货品名称', prop: 'name' },
          { name: '货品编码', prop: 'code' },
          { name: '品牌', prop: 'brand' },
          { name: '所属类目', prop: 'categoryName' },
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
      flag: 0
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
      this.label = this.labelList[this.name]
      this.flag = 0
      this.inputContent = ''
      this.Pagelist()
    }
  },
  methods: {
    /**
     * 点击确定
     */
    handleConfirm() {
      debugger

      const isCheckedItems = this.list.filter(d => d.checked)
      if (isCheckedItems.length > 0) {
        usersIdroles({ roleNames: [this.roleId] }, isCheckedItems[0].id)
          .then(res => {
            this.$message.success('操作成功')
            this.$emit('change', '')
            this.shows = false
          })
          .catch(() => {})
      } else {
        this.$message.error('请选择一条数据')
      }
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
      const isCheckedItems = this.list.filter(d => d.checked)
      if (isCheckedItems.length > 0) {
        if (this.name == 'gldj1') {
          GetOrder(this.row.id).then(res => {
            const arr = res.detailList
            for (let i = 0; i < arr.length; i++) {
              GetInfo(arr[i].goodsId).then(res1 => {
                arr[i].ean13List = res1.unitList
                arr[i].checked = false
                this.$emit('change', arr[i], this.name)
              })
            }
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
      const x = (val > 0 ? val - 1 : 0) * this.pageSize
      this.currentPage = val
      this.Pagelist(x)
    },
    changeParam(param) {
      return JSON.stringify(param).replace(/:/g, '=').replace(/,/g, '&').replace(/{/g, '?').replace(/}/g, '').replace(/"/g, '')
    },
    Pagelist(x) {
      const data = { 'maxResultCount': this.pageSize , 'skipCount': x || this.currentPage, Filter: this.inputContent }
      if (this.name == 'gldj1') {
        data.isOutbound = true

        if (this.orderCategory) {
          data.stockCategory = this.orderCategory
        }
        if (this.startTime) {
          data.startTime = filterTimestampToFormatTime(new Date(this.startTime).getTime(), 'YYYY-MM-DD HH:mm:ss')
        }
      }
      if (this.name == 'dutyUser') {
        return request({
          url: `${this.url}${this.changeParam(data)}`,
          method: 'get',
          data: data,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          res.items.forEach(element => {
            element.hover = false
            element.checked = false
          })
          this.list = res.items
          this.total = res.totalCount
          this.flag = 1
        })
      } else {
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
          this.list = res.items
          this.total = res.totalCount
          this.flag = 1
        })
      }
    }
  }
}
</script>
