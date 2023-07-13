<template>
  <el-dialog :visible.sync="showDialog" title="大类管理" >
    <div>
      <el-input v-model="CategoryName" placeholder="请输入类目名称" style="width:200px;padding: 10px 0px 10px 0px;"/>
      <el-input v-model="inputs" style="width:200px;padding: 10px 0px 10px 0px;" placeholder="请输入大类名称"/>
      <el-button icon="el-icon-search" type="primary" style="height: 30px !important;" @click="handleCurrentChange(1)">
        搜索      </el-button>
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
        width="70"
        label="序号">
        <template slot="header" slot-scope="scope">
          <div style="text-align: center; display: block;">
            <!-- <el-checkbox
              v-model="checkedAll"
              :disabled="!list || !list.length"
              @change="selectAll"
            /> -->
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
                @change="onItemCheckboxChange(row)"
              />
              <span v-show="!row.hover && !row.checked" class="text">{{
                $index+1
              }}</span>
            </span>

          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="categoryName"
        label="类目名称"
      />
      <el-table-column
        prop="goodsCategoryDetailName"
        label="大类名称"
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
        <label for="" style="margin-right:20px" >货品类型</label>
        <el-select v-model="type" style="    width: 200px;margin-bottom:30px">
          <el-option
            v-for="(item,index ) in types" :key="index" :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <div>
        <label for="" style="margin-right:20px" >大类名称</label>
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
  GoodsCategoryDetailGetList,
  GoodsCategoryDetailCreate,
  GoodsCategoryDetailUpdate,
  GoodsCategoryDetailDelete
} from '@/api/kchk/company'
import {
  GetGoodsCategoryTreeHasRole
} from '@/api/kchk/goods'
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
      CategoryName: '',
      type: '',
      types: [],
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
    this.GetGoodsCategoryTree()
    this.getList()
  },
  methods: {
    GetGoodsCategoryTree() {
      GetGoodsCategoryTreeHasRole({}).then(res => {
        this.types = res
      })
    },
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
            debugger
            GoodsCategoryDetailDelete(this.obj)
              .then(res => {
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
        this.$message.error('请输入大类名称')
        return
      }
      if (!this.type) {
        this.$message.error('请选择类目')
        return
      }
      if (this.info1) {
        GoodsCategoryDetailUpdate({ goodsCategoryDetailName: this.name, id: this.info1.id, categoryId: this.type }).then(res => {
          this.getList()
          this.$message.success('修改成功')
          this.addshow = false
        })
      } else {
        GoodsCategoryDetailCreate({ goodsCategoryDetailName: this.name, categoryId: this.type }).then(res => {
          this.getList()
          this.$message.success('新增成功')
          this.addshow = false
        })
      }
    },
    addtype(val, item) {
      if (val) {
        this.titles = '新增大类名称'
        this.name = ''
        this.type = ''
        this.info1 = false
        this.addshow = true
      } else {
        this.info1 = item
        this.type = item.categoryId
        this.name = item.goodsCategoryDetailName
        this.addshow = true
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
        this.titles = '编辑单位类型'
        this.addtype(0, row)
      }
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
    onItemCheckboxChange(row) {
      this.obj = row.id
      this.list.forEach(e => {
        if (e.id != row.id) {
          e.checked = false
        }
      })
      console.log(this.obj)
    },
    changeParam(param) {
      return JSON.stringify(param).replace(/:/g, '=').replace(/,/g, '&').replace(/{/g, '?').replace(/}/g, '').replace(/"/g, '')
    },
    getList(x) {
      this.loading = true
      const data = { 'maxResultCount': this.pageSize , 'skipCount': x || this.currentPage, GoodsCategoryDetailName: this.inputs, CategoryName: this.CategoryName }
      GoodsCategoryDetailGetList(this.changeParam(data))
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

