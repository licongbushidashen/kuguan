<template>
  <div class="main">
    <xr-header
      icon-class="iconfont icon-yonghuguanli"
      icon-color="#2362fb"
      label="用户管理" >
      <template v-slot:ft>
        <el-button
          class="main-table-header-button "
          type="primary"
          icon="el-icon-plus"
          @click="addJurisdiction">新建</el-button>
      </template>
    </xr-header>
    <div class="main-body">
      <div class="main-table-header">
        <el-input v-model="inputs" style="width:200px;padding: 10px 0px 0px 10px;" placeholder="请输入姓名/账号">
          <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(0)"/>
        </el-input>
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
          width="50"
          label="序号">

          <template slot-scope="{ row, column, $index}">
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
                  $index+1
                }}</span>
              </span>

            </span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="姓名"/>

        <el-table-column
          prop="userName"
          label="用户账号"
        />
        <el-table-column
          prop="phoneNumber"
          label="手机号"
        />
        <el-table-column
          prop="email"
          label="邮箱"
        />
        <el-table-column label="操作" width="240">
          <template slot-scope="{ row, column }">
            <el-button type="text" icon="el-icon-user" @click="handleRowpassword(row,column)"/>
            <el-button type="text" icon="el-icon-edit" @click="handleRowClick(row,column)" />
            <!-- <el-button type="text" icon="el-icon-help"></el-button> -->
            <el-button type="text" icon="el-icon-delete" @click="deleteclick(row,column)" />
          </template>
        </el-table-column>
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
    <Ccware :showing="jurisdictionCreateShow" :info="info" @change="getList(0)"/>
    <el-dialog :close-on-click-modal="false" :visible.sync="passwording" class="ttser" style="    width: 800px;left: 30%;   " title="重置密码">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="新密码：" prop="password">
          <el-input v-model="ruleForm.password" show-password style="width:200px"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: center !important;">
        <el-button @click="passwording = false">取 消</el-button>
        <el-button type="primary" @click="saves">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Pageusers,
  usersInfo, Updateusers
} from '@/api/kcjl/user'
import {
  deleteusers
} from '@/api/admin/rmt'
import Ccware from './comp/add.vue'
import XrHeader from '@/components/XrHeader'
import CreateSections from '@/components/CreateSections'
import pagest from '@/mixins/pagest'
export default {
  /** 系统管理 的 项目管理 */
  name: 'SystemProject',
  components: {
    XrHeader,
    CreateSections,
    Ccware
  },
  mixins: [pagest],
  data() {
    const validateCRM = (rule, value, callback) => {
      var regex = /^(?![0-9A-Za-z]+$)(?![-`=\[\];',.~!@#$%^&*()_+|{}:"?]+$)(?![0-9-`=\[\];',.~!@#$%^&*()_+|{}:"?]+$)(?![A-Za-z-`=\[\];',.~!@#$%^&*()_+|{}:"?]+$)[0-9a-zA-Z-`=\[\];',.~!@#$%^&*()_+|{}:"?]{7,16}$/
      var test = regex.test(value)
      console.log(test, 'test')
      if (test) {
        callback()
      } else {
        callback(new Error('至少有1位大写字母、小写字母、数字、特殊符号 '))
      }
    }
    return {
      passwording: false,
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
      ruleForm: {
        password: ''
      },
      rules: {
        password: [
          { validator: validateCRM, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    var self = this
    /** 控制table的高度 */
    window.onresize = function() {
      self.tableHeight = document.documentElement.clientHeight - 196
    }

    this.getList()
  },
  methods: {
    openplan(row) {
      this.planing = !this.planing
    },
    openwarn(row) {
      this.warningshow = !this.warningshow
    },
    /*
   * 当checkbox选择change时事件
   */
    // onItemCheckboxChange() {
    //   this.obj = {}
    //   this.list.filter((d) => d.checked).map(e => {
    //     const key = e.id; const val = e.code
    //     this.obj[key] = val
    //     return { [key]: val }
    //   })
    // },
    /**
     * 获取列表数据
     */
    changeParam(param) {
      return JSON.stringify(param).replace(/:/g, '=').replace(/,/g, '&').replace(/{/g, '?').replace(/}/g, '').replace(/"/g, '')
    },
    getList(x) {
      this.loading = true
      const data = { 'maxResultCount': this.pageSize, 'skipCount': x || this.currentPage, Filter: this.inputs }
      Pageusers(this.changeParam(data))
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
      const x = (val > 0 ? val - 1 : 0) * this.pageSize
      if (x == 0) {
        this.currentPage = 0
      } else {
        this.currentPage = val
      }

      this.getList(x)
    },

    /**
     *  添加权限
     */
    addJurisdiction() {
      this.info = {}
      this.jurisdictionCreateShow = !this.jurisdictionCreateShow
    },

    /** 列表操作 */
    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowpassword(row, column, event) {
      if (column.label == '序号') {
        return
      }
      this.passwording = true
      usersInfo(row.id).then(res => {
        this.info = res
      })
    },
    saves() {
      this.info.password = this.ruleForm.password
      Updateusers(this.info).then(res => {
        this.$message.success('修改成功')
        this.passwording = false
      })
    },
    deleteclick(val) {
      this.$confirm('此操作将永久删除是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.userLoading = true
          deleteusers(
            val.id,
          ).then(res => {
            this.userLoading = false
            this.handleCurrentChange(0)
            this.$message.success('删除成功')
          }).catch(() => {
            this.userLoading = false
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleRowClick(row, column, event) {
      if (column.label == '序号') {
        return
      }
      usersInfo(row.id).then(res => {
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
  }
}
</script>
<style>
  .ttser .el-dialog__body{
min-height: auto !important;
}
</style>
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

</style>
