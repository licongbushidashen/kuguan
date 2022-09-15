<template>
  <el-dialog v-if="showDialog" :visible.sync="showDialog" :close-on-click-modal="false" title="盘点明细" style="    margin-top: 2vh" width="1200px">
    <div>
      <el-input
        v-model="inputs"
        style="width:250px;padding: 10px 0px 0px 10px;margin-bottom: 10px;"
        placeholder="请输入货品名称">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleCurrentChange(0)"
        />

      </el-input>
      <div style="float: right;    padding-top: 10px;">
        <el-button v-if="flag1==0 &&allAuth['InventoryManager.CheckPlanDetails.Begin']" class="xr-btn--orange " style="color:#fff" @click="updatacheck">开始盘点</el-button>
        <el-button v-if="flag1==1&& allAuth['InventoryManager.CheckPlanDetails.Finish']" class="xr-btn--orange " style="color:#fff" @click="FinishDetail(1)">盘点完成</el-button>
        <el-button v-if="(flag1==1 || flag1==0)&& allAuth['InventoryManager.CheckPlanDetails.Edit'] " @click="FinishDetail(0)">暂存</el-button>
        <el-button v-if="(flag1==1 || flag1==0)&& allAuth['InventoryManager.CheckPlanDetails.Import']" @click="bulkImportClick">导入</el-button>
        <el-button @click="downs">导出</el-button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      id="examine-table"
      :data="list"
      :height="tableHeight"
      class="main-table"
      highlight-current-row
    >
      <el-table-column
        show-overflow-tooltip
        type="index"
        width="60"
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
      <el-table-column
        show-overflow-tooltip
        prop="goodsName"
        label="货品名称"
      />
      <el-table-column prop="goodsCode" label="货品编码" />
      <el-table-column prop="brand" label="品牌" />
      <el-table-column prop="size" label="规格" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="inventoryNum" label="库存数量" />
      <el-table-column prop="checkNum" label="盘点数量" >
        <template slot-scope="{ row, column, $index }">
          <el-input v-if="flag1==1" v-model="row.checkNum" @change="listchange(row,$index)"/>
          <span v-else>
            {{ row.checkNum }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="profitNum" label="盘盈数量" />
      <el-table-column prop="lossNum" label="盘亏数量" />

      <el-table-column prop="checkUserName" label="盘点人" />
      <el-table-column prop="checkTime" label="盘点时间" width="200px">
        <template slot-scope="{ row, column, $index }">
          <el-date-picker
            v-if="flag1==1"
            v-model="row.checkTime"
            type="datetime"
            style="width:190px"
            placeholder="选择日期时间"/>
          <!-- <el-input v-if="flag1==1" v-model="row.checkNum" @change="listchange(row,$index)"/> -->
          <span v-else>
            {{ row.checkTime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="100px">
        <template slot-scope="{ row, column, $index }">
          <el-input v-if="flag1==1" v-model="row.remark"/>
          <span v-else>
            {{ row.remark }}
          </span>
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
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 批量导入 -->
    <bulk-import-user
      :show="bulkImportShow"
      :url="'/api/zjlab/CheckPlanDetail/Upload?planId='+id"
      @close="bulkImportShow = false"
      @success="handleCurrentChange(0)"
    />
    <!-- <span slot="footer" class="dialog-footer" style="text-align: center !important;">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="savechange">提 交</el-button>
    </span> -->
  </el-dialog>
</template>
<script>
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import {
  Create,
  Update,
  GetDetails,
  UpdateCheckPlanBegin, FinishDetail, StorageDetail, DownloadCheckPlanDetailExcel
} from '@/api/Inventory/kc'
import { downloadFileWithBuffer } from '@/utils'
import GenerateRulesMixin from '@/components/NewCom/WkForm/GenerateRules'
import BulkImportUser from '../../import.vue'
export default {
  components: {
    BulkImportUser
  },
  mixins: [GenerateRulesMixin],
  props: {
    showing: {
      type: Boolean
    },
    id: {
      type: String
    },
    flag: {
      type: Number

    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }},
  data() {
    return {
      bulkImportShow: false,
      inputs: '',
      tableHeight: document.documentElement.clientHeight - 250, // 表的高度
      list: [],
      loading: false,
      currentPage: 0,
      pageSize: 15,
      total: 0,
      showDialog: true,
      flag1: 0
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'allAuth'
    ])
  },
  watch: {
    showing: {
      handler(val) {
        debugger
        this.flag1 = this.flag
        this.showDialog = !this.showDialog
        this.currentPage = 0
        this.pageSize = 15
        if (this.showDialog) {
          this.getList()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {

  },
  methods: {
    /**
     * 批量导入
     */
    bulkImportClick(val) {
      this.bulkImportShow = true
    },
    downs() {
      DownloadCheckPlanDetailExcel(this.id).then(res => {
        const blob = new Blob([res], {
          type: ''
        })
        downloadFileWithBuffer(blob, '', 'application/vnd.ms-excel;charset=UTF-8')
      })
    },
    // 完成盘点
    FinishDetail(val) {
      const data = { detailList: [] }
      for (let i = 0; i < this.list.length; i++) {
        if (!this.list[i].checkTime) {
          this.$message.error('请输入盘点时间')
          return
        }
        this.list[i].checkTime = parseTime(this.list[i].checkTime)
        data.detailList.push({ id: this.list[i].id, checkPlanDetail: this.list[i] })
      }
      if (val) {
        FinishDetail(data, this.id).then(res => {
          if (res == true) {
            this.$message.success('盘点已完成')
            this.flag1 = 2
            this.$emit('change', 0)
          }
        })
      } else {
        StorageDetail(data, this.id).then(res => {
          if (res == true) {
            this.$message.success('暂存成功')
            this.flag1 = 1
            this.$emit('change', 0)
          }
        })
      }
    },
    // 暂存盘点
    // 开始盘点
    updatacheck() {
      UpdateCheckPlanBegin(this.id).then(res => {
        if (res == true) {
          this.flag1 = 1
        }
      })
    },
    /**
     * 获取列表数据
     */
    getList() {
      this.loading = true
      const data = { 'maxResultCount': this.pageSize, 'skipCount': this.currentPage, 'searchKey': this.inputs }
      GetDetails(data, this.id)
        .then(res => {
          for (let i = 0; i < res.items.length; i++) {
            res.items[i].hover = false
            res.items[i].checked = false
            if (this.flag1 == 1) {
              res.items[i].checkUserName = this.userInfo.name
              res.items[i].checkUserId = this.userInfo.id
            }
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
      const x = val > 0 ? val - 1 : 0
      this.currentPage = x ? x * this.pageSize : x
      this.getList()
    },

    listchange(row, index) {
      const num = row.checkNum - row.inventoryNum
      if (num > 0) {
        this.list[index].profitNum = num
      } else if (num < 0) {
        this.list[index].lossNum = Math.abs(num)
      }
    },
    saveClick(data) {
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
// /deep/.el-dialog{
    // margin-top:2vh !important;
// }
/deep/.el-dialog__footer{
    text-align: center !important;
}
</style>
