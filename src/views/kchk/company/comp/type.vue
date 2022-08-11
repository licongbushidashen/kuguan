<template>
  <el-dialog :visible.sync="showDialog" title="单位类型管理" >
    <div>
      <el-input v-model="inputs" style="width:200px;padding: 10px 0px 10px 10px;" placeholder="请输入单位类别">
        <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(1)"/>
      </el-input>
      <div style="float:right"><el-button
        class="main-table-header-button "
        type="primary"
        icon="el-icon-plus"
        @click="addtype(1)">新建</el-button>
        <el-button
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
    <el-dialog :visible.sync="addshow" title="新建单位类型" append-to-body width="400px" style="margin-top: 18vh;">
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
                    message: `删除成功${res.data.successCount}条`
                  })
                } else {
                  this.$message({
                    type: 'error',
                    dangerouslyUseHTMLString: true,
                    message: `删除成功${res.data.successCount}条，删除失败${res.data.failCount}条，失败原因<br/>${arr.length > 0 ? arr.toString() : ''}`
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
      this.addshow = true
      if (val) {
        this.name = ''
        this.info1 = false
      } else {
        this.info1 = item
        this.name = item.name
      }
    },
    /** 列表操作 */
    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      if (column.label == '序号') {
        return
      } else {
        this.addtype(0, row)
      }
    },
    /**
     * 更改当前页数
     * @param {*} val
     */
    handleCurrentChange(val) {
      val == 1 ? this.currentPage = 0 : this.currentPage = this.currentPage + 15
      this.getList()
    },
    /*
   * 当checkbox选择change时事件
   */
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
      const data = { 'maxResultCount': this.pageSize, 'skipCount': this.currentPage, searchKey: this.inputs }
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
