<template>
  <el-dialog
    v-loading="loading"
    :title="diaTitle"
    :visible="show"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    class="create-dialog"
    width="1000px"
    @close="closeView">
    <div>
      <div class="label-input" style="display:flex">
        <div style="flex:2;margin-right:20%;">
          <label class="label-title">数据库名称</label>
          <el-input
            v-model="roleName"
            :maxlength="100"
            placeholder="请输入数据库名称"/>
        </div>
        <div style="width:150px">
          <label class="label-title">数据库类型</label>
          <el-select
            v-model="listvalue"
            class="condition-value">
            <el-option
              v-for="(option, index) in list"
              :key="index"
              :label="option.enumName"
              :value="option.enumValue"/>
          </el-select>
        </div>
      </div>

      <div class="label-input">
        <label class="label-title">数据库权限描述</label>
        <el-input
          v-model="remark"
          :rows="2"
          :maxlength="300"
          type="textarea"
          placeholder="请输入权限描述"/>
      </div>
      <label class="label-title">数据库地址</label>
      <el-input
        v-model="dbConnection"
        placeholder="请输入数据库地址"/>
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button
        type="primary"
        @click="sureClick">链接测试</el-button>
      <el-button @click="closeView">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { systemMenuGetWorkMenuListAPI, getdbtypeAPI, conntestAPI, dbconfigAPI, dbconfigupdateAPI } from '@/api/admin/project'

export default {
  name: 'JurisdictionCreate', // 文件导入
  components: {},

  props: {
    show: {
      type: Boolean,
      default: false
    },

    action: {
      type: Object,
      default: () => {
        return {
          type: 'save'
        }
      }
    }
  },
  data() {
    return {
      list: [],
      listvalue: null,
      dbConnection: '',
      loading: false,
      roleName: '',
      remark: '',
      showTreeData: [],
      defaultProps: {
        children: 'childMenu',
        label: 'menuName'
      }
    }
  },

  computed: {
    diaTitle() {
      if (this.action.type == 'save') {
        return '新建'
      }

      return '编辑'
    }
  },

  watch: {
    show(value) {
      if (value) {
        this.initInfo()
      }
    }
  },

  mounted() {
    this.getdbtype()
  },

  methods: {
    /**
     * 初始化数据
     */
    initInfo() {
      if (this.action.type == 'update') {
        this.roleName = this.action.data.dbName
        this.dbConnection = this.action.data.dbConnection
        this.remark = this.action.data.describe
        this.listvalue = this.action.data.dbType
      } else {
        this.roleName = ''
        this.remark = ''
        this.listvalue = ''
        this.dbConnection = ''
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys([])
        }
      }

      if (this.showTreeData.length == 0) {
        this.getRulesList()
      } else {
        this.checkTreeByUpdateInfo()
      }
    },

    /**
     * 获取规则
     */
    getRulesList() {
      this.loading = true
      systemMenuGetWorkMenuListAPI()
        .then(res => {
          this.showTreeData = res.data.data ? [res.data.data] : []
          this.checkTreeByUpdateInfo()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 标记数据
     */
    checkTreeByUpdateInfo() {
      this.$nextTick(() => {
        if (this.$refs.tree) {
          if (this.action.type == 'update') {
            this.$refs.tree.setCheckedKeys(
              this.getUserModuleRules(this.action.data.menuIds)
            )
          }

          let children = this.$refs.tree.$children && this.$refs.tree.$children.length ? this.$refs.tree.$children[0].$el : null
          if (children) {
            children = children.children && children.children.length ? children.children[0] : null
            if (children) {
              children.style.display = 'none'
            }
          }
        }
      })
    },

    /**
     * 数据库类型
     */
    getdbtype() {
      getdbtypeAPI().then(res => {
        this.list = res
      })
    },
    /**
     * 确定
     */
    sureClick() {
      if (this.listvalue == null) {
        this.$message.error('请选择数据库类型')
        return
      }
      if (!this.dbConnection) {
        this.$message.error('请填写数据库地址')
        return
      }
      if (!this.roleName) {
        this.$message.error('请填写数据库名称')
        return
      } else {
        // this.loading = true
        const params = {
          dbName: this.roleName,
          dbType: this.listvalue,
          describe: this.remark,
          dbConnection: this.dbConnection
        }

        if (this.action.type == 'update') {
          params.roleId = this.action.data.roleId
        }
        conntestAPI(params)
          .then(res => {
            if (res) {
              // this.$message.success('')
              this.$confirm('链接成功是否保存', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(() => {
                if (this.action.type == 'update') {
                  dbconfigupdateAPI(params, this.action.data.id).then(res => {
                    this.$message.success('操作成功')
                    this.$emit('submite')
                    this.closeView()
                  })
                } else {
                  dbconfigAPI(params).then(res => {
                    this.$message.success('操作成功')
                    this.$emit('submite')
                    this.closeView()
                  })
                }
              }).catch(() => {
                this.closeView()
              })
            } else {
              this.$message.error('链接失败')
            }
            // this.loading = false
            // this.$message.success('操作成功')
            // this.$emit('submite')
            // this.closeView()
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    save() {

    },
    closeView() {
      this.$emit('update:show', false)
    },

    /**
     * 获得check的实际数据
     */
    getUserModuleRules(array) {
      if (!array) {
        array = []
      }
      var firstTree = this.showTreeData[0]
      var hasRemove = false
      var copyArray = this.copyItem(array)
      for (
        let firstIndex = 0;
        firstIndex < firstTree.childMenu.length;
        firstIndex++
      ) {
        const firstItem = firstTree.childMenu[firstIndex]
        if (!firstItem.childMenu) {
          firstItem.childMenu = []
        }
        for (let index = 0; index < array.length; index++) {
          const element = array[index]
          var temps = []
          for (
            let secondIndex = 0;
            secondIndex < firstItem.childMenu.length;
            secondIndex++
          ) {
            const secondItem = firstItem.childMenu[secondIndex]
            if (secondItem.menuId == element) {
              temps.push(secondItem)
            }
          }
          if (temps.length != firstItem.childMenu.length) {
            hasRemove = true
            this.removeItem(copyArray, firstItem.menuId)
          }
        }
      }

      if (hasRemove) {
        this.removeItem(copyArray, firstTree.menuId)
      }

      var checkedKey = []
      for (let index = 0; index < copyArray.length; index++) {
        const element = copyArray[index]
        if (element) {
          checkedKey.push(parseInt(element))
        }
      }

      return checkedKey
    },
    copyItem(array) {
      var temps = []
      for (let index = 0; index < array.length; index++) {
        temps.push(array[index])
      }
      return temps
    },
    removeItem(array, item) {
      var removeIndex = -1
      for (let index = 0; index < array.length; index++) {
        if (item == array[index]) {
          removeIndex = index
          break
        }
      }
      if (removeIndex > 0) {
        array.splice(removeIndex, 1)
      }
    },
    containItem(array, item) {
      for (let index = 0; index < array.length; index++) {
        if (item == array[index]) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style scoped lang="scss">
.create-dialog /deep/ .el-dialog__body {
  padding-top: 0 !important;
}

.label-title {
  display: block;
  margin: 20px 0 10px 0;
  color: #666;
}

.label-input {
  position: relative;
}

.jurisdiction-content-checkbox {
  border: 1px solid #e6e6e6;
  border-radius: 2px;
  height: 200px;
  overflow-y: auto;
  padding: 10px 0;
}

.jurisdiction-content-checkbox
  .el-tree
  /deep/
  .el-tree-node
  > .el-tree-node__content {
  margin-bottom: 5px;
  width: 150px;
}
.jurisdiction-content-checkbox /deep/ .el-tree .el-tree-node {
  white-space: inherit;
  margin-bottom: 5px;
}
.jurisdiction-content-checkbox
  /deep/
  .el-tree
  > .el-tree-node
  > .el-tree-node__children
  > .is-expanded
  > .el-tree-node__children
  > .is-expanded {
  display: inline-block;
}
</style>
