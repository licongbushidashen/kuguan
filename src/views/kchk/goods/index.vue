<template>
  <div class="employee-dep-management">
    <xr-header
      icon-class="iconfont icon-31leimu"
      icon-color="#2362FB"
      label="类目管理" />
    <div class="system-content">
      <!-- 左边导航栏 -->
      <div v-loading="depLoading" class="system-nav">
        <div class="system-nav__title">
          类目管理
          <el-button
            type="text"
            icon="el-icon-circle-plus"
            style="margin: 0px;    padding: 0px;    float: right;"
            @click="changeDepClick()"
          >创建类目</el-button
          >

        </div>
        <div class="system-nav__content">
          <div class="section">

            <div class="section__content">
              <el-tree
                ref="tree"
                :props="props"
                :load="getDepTreeList"
                lazy
                node-key="id"
                highlight-current
                @node-click="changeDepClick"
              >
                <flexbox
                  slot-scope="{ node, data }"
                  :class="{ 'is-current': node.isCurrent }"
                  class="node-data"
                >


                  <div class="node-data__label text-one-line ">
                    {{ data.name }}
                  </div>
                  <div class="node-label-set">
                    <i class="el-icon-plus" @click.stop="appendStruc(data)" />
                    <i
                      class="el-icon-delete"
                      @click.stop="deleteStruc(node,data)"
                    />
                  </div>

                </flexbox>
              </el-tree>
            </div>

          </div>
        </div>
      </div>
      <!-- 右边内容 -->
      <div class="system-view-table flex-index">
        <flexbox
          justify="space-between"
          class="table-top"
        >
          <div class="table-top__title" />
          <div>
            <template>
              <el-button
                type="primary"
                @click="savechange"
              >保存</el-button
              >
            </template>

          </div>
        </flexbox>
        <div class="flex-box">
          <create-sections >
            <mtForm :rules="fieldsRules" :field-from="aoiinfo" :field-list="fields" :is-save="isSave" @change="formChange" @save="saveClick"/>
          </create-sections>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { objDeepCopy } from '@/utils'
import {
  GetGoodsCategoryTree,
  CreateGoodsCategory,
  UpdateGoodsCategory,
  Delete
} from '@/api/kchk/category'
import CreateSections from '@/components/CreateSections'
import XrHeader from '@/components/XrHeader'
import mtForm from '@/components/mtForm/index'
import GenerateRulesMixin from '@/components/NewCom/WkForm/GenerateRules'
export default {
  /** 系统管理 的 员工部门管理 */
  name: 'EmployeeDep',
  components: {
    XrHeader,
    CreateSections,
    mtForm
  },
  mixins: [GenerateRulesMixin],
  data() {
    return {
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'hasChild'
      },
      node_had: [],
      resolve_had: '',
      depLoading: false,
      showDepData: [],
      fieldsRules: {}, // 字段列表需要验证
      fields: [],
      aoiinfo: {},
      isSave: false,
      infos: {
        code: ''
      },
      apiInfo: {},
      fzrId: ''
    }
  },
  computed: {},
  mounted() {
    var self = this
    /** 控制table的高度 */
    window.onresize = function() {
      self.tableHeight = document.documentElement.clientHeight - 240
    }
    this.getBaseField()
    // 部门树形列表
    // this.getDepTreeList()
  },
  methods: {
    formChange(item, index, value) {
      if (index == 'dutyUserName') {
        this.aoiinfo.dutyUserId = item.id
        this.aoiinfo.dutyUserName = item.name
      }
      // this.aoiinfo[item.field] = value
    },
    savechange() {
      this.isSave = !this.isSave
    },
    saveClick(data) {
      if (!data) return
      if (this.aoiinfo.id) {
        UpdateGoodsCategory(this.aoiinfo).then(res => {
          this.$message.success('修改成功')
        })
      } else {
        CreateGoodsCategory(this.aoiinfo).then(res => {
          this.$message.success('新增成功')
          this.node_had.childNodes = []
          this.getDepTreeList(this.node_had, this.resolve_had)
        })
      }
    },
    getBaseField() {
      const field = []
      field.push({
        field: 'code',
        formType: 'text',
        isNull: 1,
        name: '类目编码',
        placeholder: '请输入',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.code : ''
      })
      field.push({
        field: 'parentName',
        formType: 'text',
        isNull: 0,
        name: '上级类目',
        placeholder: '',
        disabled: true,
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.parentName : ''
      })
      field.push({
        field: 'name',
        formType: 'text',
        isNull: 1,
        name: '类目名称',
        placeholder: '请输入',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.name : ''
      })
      field.push({
        field: 'dutyUserName',
        formType: 'open',
        isNull: 0,
        name: '负责人',
        placeholder: '',
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.dutyUserName : ''
      })
      field.push({
        field: 'flag',
        formType: 'radio',
        isNull: 1,
        name: '状态',
        setting: [
          { name: '启用', id: 1 },
          { name: '禁用', id: 0 }
        ],
        optionL: 'name',
        optionV: 'id',
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.flag : 1
      })
      field.push({
        field: 'remark',
        formType: 'textarea',
        isNull: 0,
        name: '说明',
        placeholder: '请输入',
        row: 3,
        maxLength: 200,
        setting: [],
        inputTips: '',
        value: this.aoiinfo ? this.aoiinfo.remark : '',
        width: 1
      })
      this.fields = this.handleFields(field).list
      this.fieldsRules = this.handleFields(field).fieldRules
    },
    /**
     * 调整字段
     */
    handleFields(list) {
      const fieldRules = {}
      const fieldForm = {}
      list.forEach(item => {
        fieldRules[item.field] = this.getRules(item)
        fieldForm[item.field] = item.value
      })
      return {
        list: objDeepCopy(list),
        fieldRules: fieldRules
      }
    },
    /**
     * 选择部门
     */
    changeDepClick(data) {
      this.aoiinfo = data || {}
      // this.structureValue = data.id
    },
    /**
     * 新增部门
     */
    appendStruc(data) {
      if (data.id) {
        this.aoiinfo = { parentName: data.name, parentId: data.id, dutyUserName: null, dutyUserId: '' }
      }
    },
    deleteStruc(node, data) {
      this.$confirm(`此操作将删除${data.name}类目，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          Delete({ id: data.id })
            .then(res => {
              this.$message.success('删除成功')
              const parent = node.parent
              console.log(parent, 'parent')
              const children = parent.childNodes || parent.data
              const index = children.findIndex(d => d.data.id === data.id)
              this.aoiinfo = children[index + 1].data || {}
              children.splice(index, 1)
              this.loading = false
              this.getDepTreeList(this.node_had, this.resolve_had)
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 获取树形列表
    getDepTreeList(node, resolve) {
      this.depLoading = true
      const data = node.level === 0 ? {} : { parentId: node.data.id }
      GetGoodsCategoryTree(data)
        .then(response => {
          this.node_had = node
          this.resolve_had = resolve
          response.forEach(e => {
            e.hasChild = !e.hasChild
          })
          if (node.level === 0) {
            this.aoiinfo = response ? response[0] : {}
          }
          if (node.level > 0) {
            resolve(response || [])
          } else {
            resolve(response || [])
          }

          this.showDepData = response || []
          this.depLoading = false
        })
        .catch(() => {
          this.depLoading = false
        })
    }



  }
}
</script>

<style lang="scss" scoped>
@import '@/views/login/index.scss';
/deep/.el-tree-node__content:hover{
  background: #F6F8FA !important;
}
/deep/.is-current>.el-tree-node__content{
  background: #F6F8FA !important;
}
.verify-picture {
  margin-top: 20px;
}

.sms-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  .el-input {
    width: 210px;
  }
  .el-button {
    flex: 1;
    font-size: 12px;
    color: white;
    background-color: #3e6bea;
    border-radius: $xr-border-radius-base;
    border: 0 none;
    padding: 0;
    margin-left: 20px;

    .btn-content {
      width: 100%;
      height: 42px;
      @include center;
      .icon {
        font-size: 16px;
        margin-right: 5px;
      }
    }
    &:hover,
    &.is-disabled,
    &.is-disabled:hover {
      color: white;
      border-color: #517aec;
      background-color: #517aec;
    }
  }
}

.employee-dep-management {
  padding: 0 15px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.system-content {
  position: relative;
  height: 100%;
  flex: 1;
  display: flex;
  overflow: hidden;
}
.system-nav {
  width: 280px;
  height: 100%;
  overflow: auto;
  margin-right: 10px;
  background: #fff;
  border: 1px solid $xr-border-line-color;
  border-radius: $xr-border-radius-base;

  &__title {
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid $xr-border-line-color;
  }

  &__content {
    overflow: auto;
    height: calc(100% - 50px);
    overflow-y: overlay;
    overflow-x: overlay;
  }
}
// 菜单
.section {
  position: relative;
  &__title {
    position: relative;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    padding: 15px;
    .add-btn {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
}

.menu-item {
  position: relative;
  cursor: pointer;
  padding: 12px 15px;
  color: #333;

  &__icon {
    font-size: 14px;
    margin-right: 8px;
    color: #8a94a6;
  }

  &__content {
    font-size: 14px;
  }
}

.menu-item:hover,
.menu-item.is-select {
  background-color: $xr--background-color-base;
}

.menu-item:hover::before,
.menu-item.is-select::before {
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 2px;
  background-color: #5383ed;
}

.system-view-table {
  background: #fff;
  border: 1px solid $xr-border-line-color;
  border-radius: $xr-border-radius-base;
  position: absolute;
  top: 0;
  left: 295px;
  bottom: 0;
  right: 0;
}

.table-top {
  padding: 0 30px;
  height: 50px;

  &__title {
    font-size: 16px;
    color: #333;
  }

  .el-dropdown {
    margin-left: 7px;
  }
}

.all-user-reminder {
  width: auto;
  margin-left: 5px;
  display: inline-block;
}

.el-table /deep/ .el-table-column--selection .cell {
  padding-left: 14px;
}

// .status {
//   display: inline-block;
//   margin-left: 50px;
// }
// .status > span {
//   margin-right: 10px;
// }

.status-name {
  .status-mark {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
  }
  color: $xr-color-primary;
  cursor: pointer;
  .main-mark {
    background-color: #ff6a00;
    color: white;
    border-radius: 2px;
    font-size: 12px;
    padding: 0px 4px;
    margin: 0 3px;
  }
}
/* 详情 */
.employee-dep-management /deep/ .el-dialog__wrapper {
  margin-top: 60px !important;
}

.el-form {
  padding: 0;
}

/* 新建和编辑 */
.new-dialog-form {
  height: 48vh;
  overflow-y: auto;
  padding: 20px;
}
.new-dialog-form /deep/ .el-form-item {
  width: 50%;
  margin: 0;
  padding-bottom: 10px;
}
.new-dialog-form /deep/ .el-form-item .el-form-item__label {
  padding: 0;
}
.new-dialog-form {
  /deep/ .el-form-item:nth-child(even) {
    padding-left: 15px;
  }

  /deep/ .el-form-item:nth-child(odd) {
    padding-right: 15px;
  }
}
.new-dialog-form {
  .el-select {
    display: block;
  }
  .wk-dep-select,
  .wk-user-select {
    width: 100%;
  }
}
.new-dialog-form
  /deep/
  .el-form-item
  .el-form-item__content
  .el-select-group__wrap:not(:last-of-type)::after {
  display: none;
}
.new-dialog-form /deep/ .el-form-item .el-form-item__content .el-select-group {
  padding-left: 10px;
}
.new-dialog-form
  /deep/
  .el-form-item
  .el-form-item__content
  .el-select-group__title {
  border-bottom: 1px solid #e4e7ed;
  padding: 0 0 7px;
  margin: 0 20px 5px;
}

.nav-dialog-div {
  margin-bottom: 20px;
  label {
    width: 90px;
    display: block;
  }
}
.nav-dialog-div {
  .el-input,
  .el-select,
  .wk-user-select {
    flex: 1;
  }
}
/** 树形结构 */
// .el-tree /deep/ .el-tree-node__expand-icon {
//   display: none;
// }
.el-tree /deep/ .el-tree-node__content {
  height: 40px;
  .node-data:hover .node-label-set {
    display: block;
  }
  .node-data {
    // .node-img {
    //   width: 15px;
    //   height: 15px;
    //   display: block;
    //   margin-right: 8px;
    //   margin-left: 24px;
    // }
    height: 40px;
    padding: 0 15px;
    position: relative;
    border-radius: $xr-border-radius-base;

    .wk {
      font-size: 14px;
      color: #8a94a6;
      flex-shrink: 0;
    }

    .wk-department {
      margin-right: 8px;
    }

    &__mark {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #e6e6e6;
      margin-right: 8px;
      flex-shrink: 0;
    }

    &__label {
      flex: 1;
      color: #333;
      font-size: 14px;
      margin-right: 8px;
    }

    .wk-up-unfold {
      margin-left: 8px;
      transition: transform 0.3s;
    }

    .wk-up-unfold.is-close {
      transform: rotateZ(180deg);
    }
    .node-label-set {
      display: none;
    }
  }

  .node-data.is-current,
  .node-data:hover {
    background-color: $xr--background-color-base;
  }

  // .node-data:hover .node-label-set {
  //   display: block;
  // }
}
// .el-tree /deep/ .el-tree-node.is-current > .el-tree-node__content {
//   background-color: #ebf3ff;
//   border-right: 2px solid #46cdcf;
//   .node-label-set {
//     display: block;
//   }
// }
.system-nav /deep/ .el-tree-node > .el-tree-node__children {
  overflow: visible;
}
.system-nav /deep/ .el-tree > .el-tree-node {
  min-width: 100%;
  display: inline-block !important;
}

.system-nav
  /deep/
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: white;
}

.system-nav /deep/ .el-tree-node__content:hover {
  background-color: white;
}

/* 搜索框图标按钮 */
.icon-search .el-icon-search {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  font-size: 20px;
  color: #ccc;
}
/* 设置flex布局 */
.flex-index {
  display: flex;
  flex-direction: column;
}
/* 设置占位 */
.flex-box {
  flex: 1;
  // border-bottom: 1px solid $xr-border-line-color;
}
/* 搜索框 */
.icon-search {
  width: 280px;
  position: relative;
}

/** 分页布局 */
.p-contianer {
  position: relative;
  background-color: white;
  height: 44px;
  .p-bar {
    float: right;
    margin: 5px 100px 0 0;
    font-size: 14px !important;
  }
}

/** 勾选操作 */
.selection-bar {
  font-size: 12px;
  height: 50px;
  padding: 0 20px;
  color: #777;

  .selected—title {
    flex-shrink: 0;
    padding-right: 20px;
    color: #333;
    .selected—count {
      color: $xr-color-primary;
    }
  }
}

.selection-items-box {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 15px;
  .el-button {
    color: #666;
    background-color: $xr--background-color-base;
    border-color: $xr--background-color-base;
    font-size: 12px;
    height: 28px;
    border-radius: 14px;
    /deep/ i {
      font-size: 12px;
      margin-right: 5px;
    }
  }

  .el-button--primary:hover {
    background: $xr-color-primary;
    border-color: $xr-color-primary;
    color: #ffffff;
  }

  .el-button + .el-button {
    margin-left: 15px;
  }
}

.status-des {
  font-size: 12px;
  color: #777777;
  margin: 0 5px;
  position: absolute;
  left: 0;
  top: 7px;
  .status-des-item {
    margin: 8px;
    display: inline-block;
    div {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      margin-right: 5px;
    }
  }
}

// 提示
// 提示标志
.wukong-help_tips {
  color: #999;
  font-size: 14px;
  margin-left: 3px;
  cursor: pointer;
}

.wukong-help_tips:hover {
  color: $xr-color-primary;
}

// 修改密码和修改登录名的样式
.el-password {
  .el-form-item {
    margin-bottom: 5px;
  }
}

.el-dialog__wrapper /deep/.el-dialog__body {
  padding: 20px;
}

.tips {
  font-size: 13px;
  color: #999;
}
.system-nav__title {
  position: relative;
}
@import '../styles/table.scss';
</style>
