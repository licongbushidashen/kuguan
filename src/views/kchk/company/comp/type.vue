<template>
  <el-dialog :visible.sync="showDialog" title="单位类型管理" >
    <div>
      <el-input v-model="inputs" style="width:200px;padding: 10px 0px 10px 0px;" placeholder="请输入单位类型">
        <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(1)"/>
      </el-input>
      <div style="float:right"><el-button
        v-if="allAuth['SystemSetting.CompanyCategorys.Create']"
        class="main-table-header-button "
        type="primary"
        icon="el-icon-plus"
        @click="addtype(1)">新建</el-button>
        <el-button
          v-if="allAuth['SystemSetting.CompanyCategorys.Delete']"
          :disabled="JSON.stringify(obj)=='{}'"
          class="main-table-header-button "
          type=""
          icon="wk wk-delete"
          @click="handleClick('delete')">删除</el-button></div>
    </div>
    <el-table
      v-loading="loading"
      id="examine-table"
      :data="list"
      :height="300"
      class="main-table"
      highlight-current-row

      @row-click="handleRowClick">
      <el-table-column
        show-overflow-tooltip
        type="index"
        width="70"
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
        prop="name"
        label="单位类型"
      />

      <el-table-column
        prop="creationTime"
        label="创建时间"
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
    <el-dialog :visible.sync="addshow" :title="titles" append-to-body width="400px" style="margin-top: 18vh;">
      <div>
        <label for="" style="margin-right:20px" >单位类型</label>
        <el-input v-model="name" style="width:200px" placeholder="请输入"/>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: center !important;">
        <el-button @click="addshow = false">取 消</el-button>
        <el-button type="primary" @click="savechange">保 存</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<script>

import {
  CompanyCategoryPage,
  CompanyCreate,
  CompanyUpdate,
  CompanyDeleteMany
} from '@/api/kchk/company'
import { mapGetters } from 'vuex'
export default {
  props: {
    showing: {
      type: Boolean
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }},
  data() {
    return {
      checkedAll: [],
      titles: '新建单位类型',
      addshow: false,
      showDialog: false,
      list: [],
      inputs: '',
      currentPage: 0,
      pageSize: 15,
      total: 0,
      obj: {},
      loading: false,
      name: '',
      info1: ''
    }
  },
  computed: {
    ...mapGetters(['allAuth'])
  },
  watch: {
    showing: {
      handler(val) {
        this.showDialog = !this.showDialog
      },
      deep: true
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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
            CompanyDeleteMany(this.obj)
              .then(res => {
                const arr = res.data.failMsg.map(e => {
                  return e + '<br/>'
                })
                if (!res.data.failCount) {
                  this.$message({
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: `成功删除${res.data.successCount}条`
                  })
                } else {
                  this.$message({
                    type: 'error',
                    dangerouslyUseHTMLString: true,
                    message: `成功删除${res.data.successCount}条，失败${res.data.failCount}条，失败原因<br/>${arr.length > 0 ? arr.toString() : ''}`
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
    savechange() {
      if (!this.name) {
        this.$message.error('请输入单位类型')
        return
      }
      if (this.info1) {
        CompanyUpdate({ name: this.name, id: this.info1.id }).then(res => {
          this.getList()
          this.addshow = false
        })
      } else {
        CompanyCreate({ name: this.name }).then(res => {
          this.getList()
          this.addshow = false
        })
      }
    },
    addtype(val, item) {
      if (val) {
        this.titles = '新增单位类型'
        this.name = ''
        this.info1 = false
      } else {
        this.info1 = item
        this.name = item.name
        if (!this.allAuth['SystemSetting.CompanyCategorys.Edit']) {
          this.$message.error('暂无当前权限')
        }
      }
      this.addshow = true
    },
    /** 列表操作 */
    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      if (column.label == '序号') {
        return
      } else {
        this.titles = '编辑单位类型'
        this.addtype(0, row)
      }
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
    /*
   * 当checkbox选择change时事件
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
    onItemCheckboxChange() {
      this.obj = {}
      this.list.filter((d) => d.checked).map(e => {
        const key = e.id; const val = e.id
        this.obj[key] = val
      })
      console.log(this.obj)
    },
    getList() {
      this.loading = true
      const data = { 'maxResultCount': this.pageSize + this.currentPage, 'skipCount': this.currentPage, searchKey: this.inputs }
      CompanyCategoryPage(data)
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
    }
  }
}
</script>
