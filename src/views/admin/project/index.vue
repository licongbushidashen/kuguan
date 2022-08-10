<template>
  <div class="main">
    <xr-header
      icon-class="wk wk-project"
      icon-color="#33D08F"
      label="数据库列表" />
    <div class="main-body">
      <div class="main-table-header">
        <el-button
          class="main-table-header-button xr-btn--orange"
          type="primary"
          icon="el-icon-plus"
          @click="addJurisdiction">新建</el-button>
      </div>
      <el-table
        v-loading="loading"
        id="examine-table"
        :data="list"
        :height="tableHeight"
        class="main-table"
        highlight-current-row
        style="width: 100%"
        @row-click="handleRowClick">
        <el-table-column
          show-overflow-tooltip
          prop="dbName"
          width="150"
          label="数据库名称"/>
        <el-table-column
          show-overflow-tooltip
          prop="dbConnection"
          label="数据库地址"/>
        <el-table-column
          show-overflow-tooltip
          prop="describe"
          label="数据库描述"/>

        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleClick1('edit', scope)">数据库映射</el-button>
            <el-button

              type="text"
              size="small"
              @click="handleClick('edit', scope)">编辑</el-button>
            <el-button

              type="text"
              size="small"
              @click="handleClick('delete', scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <jurisdiction-create
      :show.sync="jurisdictionCreateShow"
      :action="createAction"
      @submite="getList"/>
    <dbys
      :show.sync="dbsyShow"
      :action="createAction"
    />
  </div>
</template>

<script>
import {
  systemRoleQueryProjectRoleListAPI,
  systemRoleDeleteWorkRoleAPI
} from '@/api/admin/project'
import dbys from './components/dbys'
import JurisdictionCreate from './components/JurisdictionCreate'
import Reminder from '@/components/Reminder'
import XrHeader from '@/components/XrHeader'

export default {
  /** 系统管理 的 项目管理 */
  name: 'SystemProject',
  components: {
    JurisdictionCreate,
    Reminder,
    XrHeader,
    dbys
  },
  mixins: [],
  data() {
    return {
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 196, // 表的高度
      list: [],
      createAction: {
        type: 'save'
      },
      dbsyShow: false,
      jurisdictionCreateShow: false
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
    /**
     * 获取列表数据
     */
    getList() {
      this.loading = true
      const data = { 'maxResultCount': 1000, 'skipCount': 0 }
      systemRoleQueryProjectRoleListAPI(data)
        .then(res => {
          this.list = res.items
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     *  添加权限
     */
    addJurisdiction() {
      this.createAction = {
        type: 'save'
      }
      this.jurisdictionCreateShow = true
    },

    /** 列表操作 */
    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {},
    handleClick1(type, scope) {
      this.createAction = {
        type: 'update',
        data: scope.row
      }
      this.dbsyShow = true
    },
    /**
     * 编辑删除
     */
    handleClick(type, scope) {
      if (type === 'edit') {
        this.createAction = {
          type: 'update',
          data: scope.row
        }
        this.jurisdictionCreateShow = true
      } else if (type === 'delete') {
        // 启用停用
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            systemRoleDeleteWorkRoleAPI({
              id: scope.row.id
            })
              .then(res => {
                this.list.splice(scope.$index, 1)
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
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
  background-color: white;
  border-top: 1px solid $xr-border-line-color;
  border-bottom: 1px solid $xr-border-line-color;
}

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
</style>
