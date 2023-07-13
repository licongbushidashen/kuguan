<template>
  <el-dialog
    :visible.sync="shows"
    :title="p == '请输入姓名' ? '负责人' : '仓库'"
    append-to-body
  >
    <div style="margin-bottom :20px;">
      <el-input
        v-model="inputContent"
        :placeholder="p"
        class="search-input"
        style="width:200px"
        @keyup.enter.native="Pagelist(0)"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click.native="Pagelist(0)"
        />
      </el-input>
      <!-- <span style="background: #85C7AF;    padding: 10px 15px;    border-radius: 5px;    color: #fff;    float: right;">新 增</span> -->
    </div>
    <el-table
      id="examine-table"
      :data="list"
      class="main-table"
      highlight-current-row
    >
      <el-table-column
        show-overflow-tooltip
        type="index"
        width="50"
        label="选择"
      >
        <template slot-scope="{ row, column, $index }">
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
              <!-- <span v-show="!row.hover && !row.checked" class="text">{{
                $index+1
              }}</span> -->
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in label"
        :prop="item.prop"
        :label="item.name"
        :key="index"
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
        @current-change="handleCurrentChange"
      />
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="shows = false">取消</el-button>
      <el-button type="primary" @click="dialogSure">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import request from '@/utils/request'
export default {
  props: {
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
    }
  },
  data() {
    return {
      list: [],
      row: {},
      shows: false,
      inputContent: '',
      currentPage: 0,
      pageSize: 15,
      total: 0,
      labelList: {},
      label: {}
    }
  },
  watch: {
    typeling() {
      debugger
      this.inputContent = ''
      this.shows = true
      this.pageSize = 15
      this.currentPage = 0
      this.label = []
      this.Pagelist()
    }
  },
  methods: {
    dialogSure() {
      const isCheckedItems = this.list.filter(d => d.checked)
      if (isCheckedItems.length > 0) {
        this.$emit('changev', this.row, this.name)
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
      return JSON.stringify(param)
        .replace(/:/g, '=')
        .replace(/,/g, '&')
        .replace(/{/g, '?')
        .replace(/}/g, '')
        .replace(/"/g, '')
    },
    Pagelist(x) {
      debugger
      if (this.url == '/api/identity/users') {
        const data = {
          maxResultCount: this.pageSize,
          skipCount: x || this.currentPage,
          Filter: this.inputContent
        }
        return request({
          url: `${this.url}${this.changeParam(data)}`,
          method: 'get',
          data: data,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          this.label = [
            { name: '姓名', prop: 'name' },
            { name: '联系方式', prop: 'phoneNumber' },
            { name: '邮箱', prop: 'email' }
          ]
          res.items.forEach(element => {
            element.hover = false
            element.checked = false
          })
          this.list = res.items
          this.total = res.totalCount
        })
      } else if (this.url == '/api/zjlab/Company/CompanyPage') {
        const data = {
          maxResultCount: this.pageSize + this.currentPage,
          skipCount: this.currentPage,
          Filter: this.inputContent
        }
        return request({
          url: `${this.url}`,
          method: 'post',
          data: data,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          this.label = [
            { name: '单位名称', prop: 'name' },
            { name: '联系人', prop: 'linkman' },
            { name: '联系方式', prop: 'phone' }
          ]
          res.items.forEach(element => {
            element.hover = false
            element.checked = false
          })
          this.list = res.items
          this.total = res.totalCount
        })
      } else {
        const data = {
          maxResultCount: this.pageSize + this.currentPage,
          skipCount: this.currentPage,
          searchKey: this.inputContent
        }
        return request({
          url: `${this.url}`,
          method: 'post',
          data: data,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          this.label = [
            { name: '仓库名称', prop: 'name' },
            { name: '仓库编码', prop: 'code' }
          ]
          res.items.forEach(element => {
            element.hover = false
            element.checked = false
          })
          this.list = res.items
          this.total = res.totalCount
        })
      }
    }
  }
}
</script>
