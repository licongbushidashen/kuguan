<template>
  <el-dialog :visible.sync="showDialog" title="盈亏处理" style="    margin-top: 2vh;">
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
        width="150"
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
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="goodsName"
        label="货品名称"
      />
      <el-table-column prop="code" label="货品编码" />
      <el-table-column prop="brand" label="品牌" />
      <el-table-column prop="size" label="规格" />
      <el-table-column prop="unitName" label="单位" />
      <el-table-column prop="operatorName" label="库存数量" />
      <el-table-column prop="startTime" label="盘点数量" />
      <el-table-column prop="endTime" label="盘盈数量" />
      <el-table-column prop="endTime" label="盘亏数量" />
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
    <span slot="footer" class="dialog-footer" style="text-align: center !important;">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="savechange">提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  Create,
  Update
} from '@/api/Inventory/kc'

import GenerateRulesMixin from '@/components/NewCom/WkForm/GenerateRules'
export default {

  mixins: [GenerateRulesMixin],
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
      list: [],
      loading: false,
      currentPage: 0,
      pageSize: 15,
      total: 0
    }
  },
  watch: {
    showing: {
      handler(val) {
        this.showDialog = !this.showDialog
      },
      deep: true,
      immediate: true
    }
  },
  created() {

  },
  methods: {
    /**
     * 获取列表数据
     */
    getList() {
      this.loading = true
      const data = { 'maxResultCount': this.pageSize, 'skipCount': this.currentPage, searchKey: this.inputs }
      CheckPlanPage(data)
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
    },
    /**
     * 更改当前页数
     * @param {*} val
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },

    saveClick(data) {
      debugger
      if (!data) return
      if (this.aoiinfo.id) {
        Update(this.aoiinfo).then(res => {
          this.$message.success('修改成功')
          this.showDialog = false
          this.$emit('change', 'up')
        })
      } else {
        Create(this.aoiinfo).then(res => {
          this.$message.success('新增成功')
          this.showDialog = false
          this.$emit('change', 'add')
        })
      }
    }

  }
}
</script>
<style lang="scss" scoped>
/deep/.el-dialog{
    margin-top:2vh !important;
}
/deep/.el-dialog__footer{
    text-align: center !important;
}
</style>
