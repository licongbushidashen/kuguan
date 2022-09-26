<template>
  <div class="role-authorization">
    <xr-header
      ref="xrHeader"
      label="权限管理"
      icon-class="iconfont icon-quanxianguanli1"
      icon-color="#2362fb"
      font-color="#fff"
    />
    <div :class="{ 'is-tabs': roleTabShow }" class="role-box">
      <!-- 左边导航 -->
      <div v-loading="roleMenuLoading" class="nav">
        <div class="nav__hd">
          <!-- {{ title }} -->系统管理角色
          <el-button
            type="text"
            icon="el-icon-circle-plus"
            class="add-btn"
            @click="newRoleBtn"
          >创建角色</el-button
          >
        </div>
        <div class="role-nav-box">
          <div
            v-for="(item, index) in roleList"
            :key="index"
            :class="{ 'is-select': item.id == roleActive.id }"
            class="menu-item"
            @click="roleMenuSelect(item)"
          >
            {{ item.name }}
            <div class="icon-close">
              <el-dropdown trigger="click" @command="roleHandleClick">
                <i class="el-icon-setting" @click="roleDropdownClick(item)" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
      <!-- 角色编辑 -->
      <el-dialog
        :title="roleTitle"
        :visible.sync="newRoleVisible"
        :before-close="newRoleClose"
        :close-on-click-modal="false"
        width="30%"
      >
        <label class="label-title">角色名称</label>
        <el-input v-model="role.name" :maxlength="256" class="input-role" />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="newRoleSubmit">确 定</el-button>
          <el-button @click="newRoleClose">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 右边内容 -->
      <div class="content-box">
        <el-tabs v-model="mainMenuIndex">
          <el-tab-pane label="角色用户" name="user">
            <div v-loading="userLoading" class="content-table">
              <flexbox class="content-table-header">
                <div class="content-table-header-reminder">
                  <reminder
                    v-if="showReminder"
                    :content="getReminderContent()"
                  />
                </div>
                <!-- <el-input v-model="inputs" style="width:200px;padding: 10px 0px 0px 10px;" placeholder="请输入姓名/账号">
                  <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(0)"/>
                </el-input> -->
                <el-button
                  :disabled="roleList.length === 0"
                  size="medium"
                  class="xr-btn--orange"
                  type="primary"
                  @click="addEmployees"
                >
                  关联用户
                </el-button>
              </flexbox>
              <el-table
                :data="tableData"
                :height="tableHeight"
                style="width: 100%"
              >
                <el-table-column label="序号" width="50">
                  <template slot-scope="{ row, column, $index }">
                    <span style="text-align: center"> {{ $index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="(item, index) in tableList"
                  :prop="item.field"
                  :label="item.label"
                  :key="index"
                  show-overflow-tooltip
                />
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <!-- <i class="wk wk-edit content-table-span" title="编辑角色" @click="editUserRole(scope.row)" /> -->
                    <i
                      class="wk wk-delete content-table-span"
                      title="删除"
                      @click="employeeHandleClick('delete', scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <div class="p-contianer">
                <el-pagination
                  :current-page="currentPage"
                  :page-sizes="pageSizes"
                  :page-size.sync="pageSize"
                  :total="total"
                  class="p-bar"
                  background
                  layout="prev, pager, next, sizes, total, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </el-tab-pane>
          <!-- v-if="roleActive && showRuleSet" -->
          <!-- 权限管理 -->
          <!-- <el-tab-pane v-if="roleActive.name!='admin'" label="角色权限" name="rule">


            <div v-loading="ruleLoading" :style="{ height: treeHeight + 'px'}" class="jurisdiction-box" style="padding-left:17px;overflow-y: scroll;">

              <div style="    margin-bottom: 20px;    background: #fff;    z-index: 999;    width: 100%;    position: sticky;    top: 0px;">
                <span :class="quanxian==1?'active':''" class="quanxian" @click="quanxian=1">功能权限</span>
                <span :class="quanxian==2?'active':''" class="quanxian" @click="quanxian=2">数据权限</span>
                <el-button v-if="roleActive" :disabled="roleList.length === 0" size="medium" type="primary" class="jurisdiction-edit" @click="ruleSubmit"> 保存 </el-button>
              </div>
              <div v-if="quanxian==1" style="margin-left:20px">
                <div v-for="(item,index) in allrole" :key="index" style="">
                  <el-checkbox :indeterminate="item.indeterminate" v-model="item.isGranted" @change="handleCheckAllChange(item,index)">{{ item.displayName }}</el-checkbox>
                  <br style="">
                  <div v-for="(item1, index1) in item.permissions" :key="index1" style="    margin-bottom: 5px;">
                    <el-checkbox :indeterminate="item1.indeterminate" v-model="item1.isGranted" @change="handleCheckAllChange1(item1,index,index1)">{{ item1.displayName }}</el-checkbox>

                    <div style="">
                      <el-checkbox v-for="(item2 ,index2) in item1.permissions" :key="index2" v-model="item2.isGranted" @change="handleCheckAllChange2(item2,index,index1,index2)" >{{ item2.displayName }}</el-checkbox>
                    </div>

                  </div>
                </div>
              </div>
              <div v-show="quanxian==2">
                <el-tree
                  ref="tree"
                  :data="data"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  highlight-current/>
              </div>
            </div>

          </el-tab-pane> -->
          <el-tab-pane v-if="roleActive.name != 'admin'" label="功能权限" name="rule1">
            <!-- v-if="roleActive && showRuleSet" -->
            <!-- 权限管理 -->

            <div
              v-loading="ruleLoading"
              :style="{ height: treeHeight + 'px' }"
              class="jurisdiction-box"
              style="padding-left: 17px; overflow-y: scroll"
            >
              <div
                style="
                  margin-bottom: 20px;
                  background: #fff;
                  z-index: 999;
                  width: 100%;
                  position: sticky;
                  top: 0px;
                "
              >
                <el-button
                  v-if="roleActive"
                  :disabled="roleList.length === 0"
                  size="medium"
                  type="primary"
                  class="jurisdiction-edit"
                  @click="ruleSubmit(1)"
                >
                  保存
                </el-button>
              </div>
              <div>
                <!-- <div v-for="(item,index) in allrole" :key="index" style="">
                  <el-checkbox :indeterminate="item.indeterminate" v-model="item.isGranted" @change="handleCheckAllChange(item,index)">{{ item.displayName }}</el-checkbox>
                  <br style="">
                  <div v-for="(item1, index1) in item.permissions" :key="index1" style="    margin-bottom: 5px;">
                    <el-checkbox :indeterminate="item1.indeterminate" v-model="item1.isGranted" @change="handleCheckAllChange1(item1,index,index1)">{{ item1.displayName }}</el-checkbox>

                    <div style="">
                      <el-checkbox v-for="(item2 ,index2) in item1.permissions" :key="index2" v-model="item2.isGranted" @change="handleCheckAllChange2(item2,index,index1,index2)" >{{ item2.displayName }}</el-checkbox>
                    </div>

                  </div>
                </div> -->
                <el-tree
                  ref="tree1"
                  :data="allrole"
                  :props="defaultProps1"
                  show-checkbox
                  node-key="id"
                  highlight-current
                />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-if="roleActive.name != 'admin'"
            label="数据权限"
            name="rule2"
          >
            <!-- v-if="roleActive && showRuleSet" -->
            <!-- 权限管理 -->

            <div
              v-loading="ruleLoading"
              :style="{ height: treeHeight + 'px' }"
              class="jurisdiction-box"
              style="padding-left: 17px; overflow-y: scroll"
            >
              <div
                style="
                  margin-bottom: 20px;
                  background: #fff;
                  z-index: 999;
                  width: 100%;
                  position: sticky;
                  top: 0px;
                "
              >
                <el-button
                  v-if="roleActive"
                  :disabled="roleList.length === 0"
                  size="medium"
                  type="primary"
                  class="jurisdiction-edit"
                  @click="ruleSubmit"
                >
                  保存
                </el-button>
              </div>

              <div>
                <el-tree
                  ref="tree"
                  :data="data"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  highlight-current
                />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 关联员工 -->
    <!-- <relate-empoyee :visible.sync="relateEmpoyeeShow" :role-id="roleId" :show-dep-data="showDepData" @save="employeesSave" /> -->
    <Type
      :role-id="roleActive.name"
      :typeling="typeling"
      :url="url"
      :name="name"
      @change="typevalu"
    />
    <!-- 字段授权 -->
    <field-set-dialog
      :visible.sync="setFieldShow"
      :role-id="roleId"
      :label="setFieldLabel"
    />
    <!-- 角色编辑 -->
    <!-- <edit-role-dialog v-if="editRoleDialogShow" :user-show="editRoleType === 'copyRole'" :selection-list="selectionList" :visible.sync="editRoleDialogShow" @change="getUserList" /> -->
    <role-range-set-dialog
      v-if="setRoleRangeShow"
      :visible.sync="setRoleRangeShow"
      :role-id="roleId"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  roleCopyAPI,

  // unbindingUserAPI,
  permissions,
  updatapermissions
} from '@/api/admin/role'
import { usersIdroles } from '@/api/admin/rmt'
import {
  GetTree,
  GetGoodsCategoryIds,
  EditDataPerMission
} from '@/api/kchk/goods'
import RelateEmpoyee from './components/RelateEmpoyee'
import FieldSetDialog from './components/FieldSetDialog'
import RoleRangeSetDialog from './components/RoleRangeSetDialog'
import Reminder from '@/components/Reminder'
import XrHeader from '@/components/XrHeader'
// import EditRoleDialog from '../amt/components/EditRoleDialog'
import Type from './components/type.vue'
import crmTypeModel from '@/views/crm/model/crmTypeModel'
import { objDeepCopy } from '@/utils'
import {
  identityRolesAll,
  identityRoles,
  postIdentityRoles,
  putIdentityRoles,
  deteleIdentityRoles,
  getRoleUsers,
  getRoleOrganization
} from '@/api/admin/rmt'
import {
  rolesOrganization,
  organizationUnitsRootNode,
  organizationUnitsFindChildren
} from '@/api/admin/amt.js'

export default {
  components: {
    RelateEmpoyee,
    FieldSetDialog,
    RoleRangeSetDialog,
    Reminder,
    XrHeader,
    Type
    // EditRoleDialog
  },

  data() {
    return {
      placeholder: '',
      typeling: false,
      url: '',
      name: '',
      data: [],
      defaultProps: {
        label: 'name',
        children: 'childen'
      },
      defaultProps1: {
        id: 'name',
        label: 'displayName',
        children: 'permissions'
      },
      data1: [],
      quanxian: 1,
      pid: '',
      title: '',
      searchInput: '',
      tableData: [], // 与角色关联的员工
      tableHeight: document.documentElement.clientHeight - 305, // 表的高度
      treeHeight: document.documentElement.clientHeight - 240, // 表的3度
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 45, 60],
      total: 0,
      tableList: [
        {
          label: '姓名',
          field: 'name'
        },
        {
          label: '账号',
          field: 'userName'
        }
        // { label: '角色', field: 'post' }
      ],
      // 新建角色
      newRoleVisible: false,
      role: {}, // 操作角色的框 关联的信息
      roleList: [], // 角色列表 list属性 是信息
      allRoleList: [], // 全部 用于区分管理员和上级
      mainMenuIndex: 'user', // 角色员工  角色权限 切换 默认左边
      // 权限管理
      ruleMenuIndex: 'data', // 默认模块 工作台
      ruleMenuList: [],
      // defaultProps: {
      //   children: 'childMenu',
      //   label: 'menuName'
      // },
      relateEmpoyeeShow: false,
      // 选中的角色
      roleActive: null,
      dropdownHandleRole: null, // 下拉操作编辑角色
      // 新建编辑角色title
      roleTitle: '',
      //   加载
      roleMenuLoading: false,
      // 权限加载中
      ruleLoading: false,
      // 员工列表加载中
      userLoading: false,

      // 字段授权
      setFieldLabel: '',
      setFieldShow: false,

      // 角色操作
      selectionList: [],
      editRoleType: '',
      editRoleDialogShow: false,

      // 人资角色类型
      tabType: '91',
      superTree: [],

      // 角色范围设置
      setRoleRangeShow: false,
      showDepData: [],
      showDepDataTemp: [],
      treeMenuIndex: 'organization', // 角色权限切换
      treeRadio: [false, false],
      crumbsList: [],
      currentCrumbs: {},
      checkList: [], // 自定义选择
      allrole: [], // 按钮权限
      nowrole: [],
      allroleActive: []
    }
  },

  computed: {
    ...mapGetters(['allAuth']),
    roleId() {
      if (this.roleActive) {
        return this.roleActive.roleId
      }
      return ''
    },

    // 展示角色权限
    showRuleSet() {
      if (this.roleActive) {
        return (
          this.roleActive.remark != 'admin' &&
          this.roleActive.remark != 'project'
        )
      }

      return false
    },

    // 展示提示问题
    showReminder() {
      if (this.roleActive) {
        return this.roleActive.remark == 'project'
      }

      return false
    },

    // 人资角色tab
    roleTabShow() {
      return this.pid == 9
    }
  },

  watch: {},

  mounted() {
    /** 控制table的高度 */
    this.nowrole = []
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 305
      this.treeHeight = document.documentElement.clientHeight - 210
    }
    this.GetTree()
    this.getRoleList()
    this.identityRoles()
    this.organizationUnitsRootNode()
  },

  methods: {
    typevalu() {
      this.getUserList()
    },
    GetTree() {
      GetTree().then(res => {
        this.data = res
      })
    },
    setCheckedKeys() {
      this.$refs.tree.getNode(3).indeterminate = true
      // this.$refs.tree.setChecked(3, true, false)
    },
    checkedarr(val) {
      if (this.nowrole.length == 0) {
        this.nowrole = val
      } else {
        const arr = [...val, ...this.nowrole]
        const res = new Map()
        arr.filter(
          item => !res.has(item.name) && res.set(item.name, item.isGranted)
        )
        const obj = []
        for (const [k, v] of res) {
          obj.push({
            name: k,
            isGranted: v
          })
        }
        this.nowrole = obj
      }
    },
    handleCheckAllChange(val, index) {
      const flag = val.isGranted
      this.allrole[index].indeterminate = false
      const arr = []
      for (let i = 0; i < this.allrole[index].permissions.length; i++) {
        // 第一层全选反选
        this.allrole[index].permissions[i].isGranted = flag
        arr.push({
          name: this.allrole[index].permissions[i].name,
          isGranted: this.allrole[index].permissions[i].isGranted
        })
        for (
          let j = 0;
          j < this.allrole[index].permissions[i].permissions.length;
          j++
        ) {
          // 第二层全选反选
          this.allrole[index].permissions[i].permissions[j].isGranted = flag
          arr.push({
            name: this.allrole[index].permissions[i].permissions[j].name,
            isGranted: this.allrole[index].permissions[i].permissions[j]
              .isGranted
          })
        }
      }
      this.checkedarr(arr)
    },
    handleCheckAllChange1(val, index, index1) {
      const flag = val.isGranted
      const arr = []
      let num = 0
      this.allrole[index].permissions[index1].indeterminate = false
      for (let i = 0; i < this.allrole[index].permissions.length; i++) {
        // 第一层全选反选
        if (this.allrole[index].permissions[i].isGranted == false) {
          num++
          this.allrole[index].indeterminate = true
        }
        for (
          let j = 0;
          j < this.allrole[index].permissions[index1].permissions.length;
          j++
        ) {
          // 第二层全选反选
          arr.push({
            name: this.allrole[index].permissions[index1].permissions[j].name,
            isGranted: flag
          })
          this.allrole[index].permissions[index1].permissions[
            j
          ].isGranted = flag
        }
      }
      if (num == this.allrole[index].permissions.length) {
        this.allrole[index].indeterminate = false
        this.allrole[index].isGranted = false
      } else if (num == 0) {
        this.allrole[index].indeterminate = false
        this.allrole[index].isGranted = true
      }
      this.checkedarr(arr)
    },
    handleCheckAllChange4() {
      this.allroleActive = []
      for (let i = 0; i < this.allrole.length; i++) {
        let flag = 0
        for (let j = 0; j < this.allrole[i].permissions.length; j++) {
          // 第二层全选反选
          if (this.allrole[i].permissions[j].permissions.length > 0) {
            const obj = this.GrantedArray(
              this.allrole[i].permissions[j].permissions
            )
            if (obj.isGranted) {
              flag = 1
            }
            this.allrole[i].permissions[j] = {
              ...this.allrole[i].permissions[j],
              ...obj
            }
          } else {
            if (this.allrole[i].permissions[j].isGranted) {
              flag = 1
            }
          }
        }

        const obj = this.GrantedArray(this.allrole[i].permissions, 1, flag)
        this.allrole[i] = {
          ...this.allrole[i],
          ...obj
        }
      }
    },
    GrantedArray(arr, index, flag) {
      let tickCount = 0
      let unTickCount = 0
      const len = arr.length

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].isGranted) {
          this.allroleActive.push(arr[i])
        }
      }
      if (index == 1) {
        for (var i = 0; i < arr.length; i++) {
          if (!arr[i].indeterminate) unTickCount++
          else if (arr[i].isGranted) tickCount++
        }
        if (len == tickCount) {
          return {
            indeterminate: true,
            isGranted: true
          }
        } else if (len == unTickCount) {
          if (flag == 0) {
            return {
              indeterminate: false,
              isGranted: false
            }
          } else {
            return {
              indeterminate: false,
              isGranted: true
            }
          }
        } else {
          return {
            indeterminate: true,
            isGranted: false
          }
        }
      } else {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].isGranted) tickCount++
          if (!arr[i].isGranted) unTickCount++
        }
        if (len == tickCount) {
          return {
            indeterminate: false,
            isGranted: true
          }
        } else if (len == unTickCount) {
          return {
            indeterminate: false,
            isGranted: false
          }
        } else {
          if (index == 1) {
            return {
              indeterminate: true,
              isGranted: true
            }
          } else {
            return {
              indeterminate: true,
              isGranted: true
            }
          }
        }
      }
    },
    handleCheckedCitiesChange(value) {},
    // 获取角色管理左边栏列表
    identityRoles() {
      this.roleMenuLoading = true
      identityRoles()
        .then(res => {
          this.roleList = res.items
          this.roleActive = res.items[0]
          this.roleMenuLoading = false
          this.getUserList()
          this.permissionsRole()
          this.getRoleOrganization()
          this.getgoodsCategoryIds()
        })
        .catch(() => {
          this.roleMenuLoading = false
        })
    },
    /**
     * 获取所有角色列表
     */
    getRoleList() {
      identityRolesAll()
        .then(res => {
          this.allRoleList = res.items
        })
        .catch(() => {})
    },
    // 关闭
    newRoleClose() {
      this.newRoleVisible = false
    },
    /**
     * 新建角色
     */
    newRoleBtn() {
      this.roleTitle = '新建角色'
      this.newRoleVisible = true
      this.role = {}
    },
    // 新增编辑角色
    newRoleSubmit() {
      if (!this.role.name) {
        this.$message.error('角色名称不能为空')
      } else {
        if (this.roleTitle == '新建角色') {
          const params = {
            name: this.role.name,
            isDefault: true,
            isPublic: true
          }
          postIdentityRoles(params).then(res => {
            this.identityRoles()
            this.getRoleList()
            this.$message.success('添加成功')
            this.newRoleClose()
          })
        } else {
          putIdentityRoles(this.role).then(res => {
            this.identityRoles()
            this.getRoleList()
            this.$message.success('编辑成功')
            this.newRoleClose()
          })
        }
      }
    },
    /**
     * 角色编辑
     */
    roleEditBtn(val) {
      this.roleTitle = '编辑角色'
      this.role = JSON.parse(JSON.stringify(val))
      this.newRoleVisible = true
    },
    /**
     * 角色操作
     */
    roleDropdownClick(value) {
      this.dropdownHandleRole = value
    },
    roleHandleClick(command) {
      if (command == 'edit') {
        this.roleEditBtn(this.dropdownHandleRole)
      } else if (command == 'copy') {
        this.ticketsBtn(this.dropdownHandleRole)
      } else if (command == 'delete') {
        this.roleDelect(this.dropdownHandleRole)
      }
    },
    /**
     * 删除
     */
    roleDelect(val) {
      this.$confirm('此操作将永久删除是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deteleIdentityRoles({
            id: val.id
          }).then(res => {
            if (this.roleList.length) {
              this.roleActive = this.roleList[0]
            }
            this.identityRoles()
            this.getRoleList()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * 角色列表点击
     */
    roleMenuSelect(val) {
      console.log(val, 'command')
      if (val.name == 'admin') {
        this.mainMenuIndex = 'user'
      }
      this.nowrole = []
      this.roleActive = val
      this.getgoodsCategoryIds()
      this.getUserList()
      this.getRoleOrganization()
      this.permissionsRole()
    },
    getgoodsCategoryIds() {
      GetGoodsCategoryIds(this.roleActive.name).then(res => {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(res)
        })
      })
    },
    permissionsRole() {
      permissions(`?providerName=R&providerKey=${this.roleActive.name}`).then(
        res => {
          for (let i = 0; i < res.groups.length; i++) {
            const data = res.groups[i]
            const arr = []
            for (let j = 0; j < data.permissions.length; j++) {
              const add = data.permissions[j]
              if (!add.parentName) {
                add.permissions = []
                arr.push(add)
              } else {
                arr[arr.length - 1].permissions.push(add)
              }
            }
            res.groups[i].permissions = arr
          }
          this.allrole = JSON.parse(
            JSON.stringify(res.groups).replace(/name/g, 'id')
          )
          this.allroleActive = []
          this.pushids(this.allrole)
          this.$nextTick(() => {
            this.$refs.tree1.setCheckedKeys(this.allroleActive)
          })
        }
      )
    },
    // pushs(){
    //   for
    // },
    pushids(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].permissions && arr[i].permissions.length) {
          this.pushids(arr[i].permissions)
        } else {
          if (arr[i].isGranted) {
            this.allroleActive.push(arr[i].id)
          }
        }
      }
    },
    /**
     * 员工列表
     */
    getUserList() {
      if (!this.roleActive) {
        this.tableData = []
        this.total = 0
        return
      }

      this.userLoading = true
      /**
           * page: this.currentPage,
              limit: this.pageSize,
              roleId: this.roleActive.roleId,
              realname: this.searchInput
           * **/
      getRoleUsers({
        id: this.roleActive.id
      })
        .then(res => {
          this.tableData = res.items
          this.total = res.totalCount
          this.userLoading = false
        })
        .catch(() => {
          this.userLoading = false
        })
    },
    // 编辑人员角色
    editUserRole(item) {
      this.selectionList = {
        id: item.id,
        list: []
      }
      rolesOrganization({
        id: item.id
      }).then(res => {
        res.items.forEach((ite, ind) => {
          this.selectionList.list.push(ite.name)
        })
        this.editRoleDialogShow = true
      })
    },
    /**
     * 关联员工
     */
    addEmployees() {
      this.typeling = !this.typeling
      this.url = '/api/identity/users'
      this.name = 'dutyUser'
    },

    /**
     * 关联员工确定
     */
    employeesSave(val) {
      this.relateEmpoyeeShow = false
      this.getUserList()
    },
    // 根目录部门
    organizationUnitsRootNode(node, resolve) {
      organizationUnitsRootNode()
        .then(res => {
          this.showDepDataTemp = res.items || []
          this.showDepDataTemp.forEach((item, index) => {
            this.organizationUnitsFindChildren(
              item,
              index,
              this.showDepDataTemp.length
            )
          })
        })
        .catch(() => {})
    },
    // 子部门
    organizationUnitsFindChildren(item, index, len) {
      organizationUnitsFindChildren({
        id: item.id
      })
        .then(res => {
          this.showDepDataTemp[index].children = res.items
          if (len - 1 == index) {
            this.showDepData = objDeepCopy(this.showDepDataTemp)
            this.crumbsList.push({
              label: '全部',
              list: this.showDepData
            })
            this.currentCrumbs = this.crumbsList[this.crumbsList.length - 1]
          }
        })
        .catch(() => {})
    },
    // 下级
    subordinate(item, index) {
      this.crumbsList.push({
        label: item.displayName,
        list: item.children
      })
      this.currentCrumbs = this.crumbsList[this.crumbsList.length - 1]
    },
    // 面包屑切换
    breadcrumbBtn(item, index) {
      if (index + 1 <= this.crumbsList.length - 1) {
        this.crumbsList.splice(index + 1, this.crumbsList.length - 1)
        this.currentCrumbs = this.crumbsList[this.crumbsList.length - 1]
      }
    },
    // 复选框选择
    checkBoxChange(val) {
      console.log(val)
    },
    // 查询角色下的部门
    getRoleOrganization() {
      this.ruleLoading = true
      getRoleOrganization({
        id: this.roleActive.id
      })
        .then(res => {
          this.checkList = []
          res.items.forEach((item, index) => {
            this.checkList.push(item.id)
          })
          this.ruleLoading = false
        })
        .catch(() => {
          this.ruleLoading = false
        })
    },
    // 权限提交
    ruleSubmit(val) {
      debugger
      this.ruleLoading = true
      // const arr = []

      if (val == 1) {
        this.newArr = []
        // this.toOneArray(this.allrole)
        // this.nowrole
        const arr = this.$refs.tree1.getCheckedNodes()
        const obj = []
        const active = new Set(this.allroleActive)
        for (const item of arr) {
          if (item.isGranted != undefined) {
            obj.push({
              name: item.id,
              isGranted: true
            })
            active.delete(item.id)
          }
        }
        [...active].forEach(e => {
          obj.push({
            name: e,
            isGranted: false
          })
        })
        updatapermissions(
          `?providerName=R&providerKey=${this.roleActive.name}`,
          {
            permissions: obj
          }
        )
          .then(res => {
            this.$message.success('保存成功！')
            this.ruleLoading = false
          })
          .catch(() => {
            this.ruleLoading = false
          })
      } else {
        EditDataPerMission({
          roleName: this.roleActive.name,
          goodsCategoryIds: this.$refs.tree.getCheckedKeys()
        }).then(res => {
          if (res) {
            this.$message.success('保存成功！')
            this.ruleLoading = false
          }
        })
      }
    },
    toOneArray(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i].permissions)) {
          const x = JSON.parse(JSON.stringify(arr[i]))
          delete x.permissions
          // this.newArr.push(x)
          this.toOneArray(arr[i].permissions)
        } else {
          this.newArr.push(arr[i])
        }
      }
    },

    /**
     * 复制
     */
    ticketsBtn(val) {
      this.$confirm('确定此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          roleCopyAPI({
            roleId: val.roleId
          }).then(res => {
            this.$message.success('复制成功')
            this.getRoleList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    /**
     * tree 增加disabled
     */
    addDisabledToTree(tree) {
      tree.forEach(item => {
        item.disabled = item.remarks !== 'label-92'
        if (item.childMenu) {
          this.addDisabledToTree(item.childMenu)
        }
      })
    },

    /**
     * 删除
     */
    employeeHandleClick(type, val) {
      if (type === 'delete') {
        this.$confirm('此操作将永久删除是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.userLoading = true
            usersIdroles(
              {
                roleNames: []
              },
              val.id
            )
              .then(res => {
                this.userLoading = false
                this.getUserList()
                this.$message.success('删除成功')
              })
              .catch(() => {
                this.userLoading = false
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else if (type === 'editRole' || type === 'copyRole') {
        this.selectionList = [val]
        this.editRoleType = type
        this.editRoleDialogShow = true
      }
    },

    /**
     * 角色切换
     */
    roleTabChange() {
      this.roleList = this.allRoleList.filter(
        item => item.label == this.tabType
      )
      if (this.roleList.length) {
        this.roleActive = this.roleList[0]
        this.getRoleRulesInfo()
      } else {
        this.roleActive = null
      }
      this.refreshUserList()
    },

    /**
     * 角色说明文字
     */
    getReminderContent() {
      if (this.roleActive && this.roleActive.remark == 'project') {
        return '项目管理员拥有“项目管理”模块所有权限，能看到并维护所有项目信息'
      }
      return ''
    },

    /**
     * 获取权限信息 需在roleActive获取之后
     */
    getRoleRulesInfo() {
      if (this.roleActive && this.ruleMenuList.length) {
        if (
          this.pid == 2 ||
          this.pid == 10 ||
          (this.pid == 9 && this.tabType == '92')
        ) {
          const lastItem = this.ruleMenuList[this.ruleMenuList.length - 1]
          if (lastItem.type != 'data') {
            this.ruleMenuList.push({
              label: '数据权限',
              index: 'info',
              type: 'data',
              value: this.roleActive.dataType
            })
          }
        } else if (this.pid == 9 && this.tabType == '91') {
          // 管理员
          const lastItem = this.ruleMenuList[this.ruleMenuList.length - 1]
          if (lastItem.type != 'tree') {
            this.ruleMenuList = [this.ruleMenuList[0]]
          }
          this.ruleMenuIndex = 'data'
        }

        for (let index = 0; index < this.ruleMenuList.length; index++) {
          const element = this.ruleMenuList[index]
          if (element.type == 'tree') {
            element.rules = this.getRoleRules(
              this.roleActive.rules[element.index],
              element.data[0]
            )
            this.$nextTick(() => {
              const treeRefs = this.$refs['tree' + element.index]
              if (treeRefs) {
                if (
                  Object.prototype.toString.call(treeRefs) == '[object Array]'
                ) {
                  treeRefs.length && treeRefs[0].setCheckedKeys(element.rules)
                } else {
                  treeRefs.setCheckedKeys(element.rules)
                }
              }
            })
          } else {
            element.value = this.roleActive.dataType
          }
        }
      }
    },

    /**
     * 获得check的实际数据
     */
    getRoleRules(array, tree) {
      if (!array) {
        array = []
      }

      var hasRemove = false
      var copyArray = this.copyItem(array)
      for (
        let firstIndex = 0;
        firstIndex < tree.childMenu.length;
        firstIndex++
      ) {
        const firstItem = tree.childMenu[firstIndex]

        if (!firstItem.hasOwnProperty('children')) {
          if (firstItem.length + 1 != copyArray.length) {
            this.removeItem(copyArray, tree.id)
          }
          return copyArray
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
            if (secondItem.id == element) {
              temps.push(secondItem)
            }
          }
          if (temps.length != firstItem.childMenu.length) {
            hasRemove = true
            this.removeItem(copyArray, firstItem.id)
          }
        }
      }

      if (hasRemove) {
        this.removeItem(copyArray, tree.id)
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
    },

    /**
     * 头部搜索
     */
    headerSearch(search) {
      this.searchInput = search
      this.refreshUserList()
    },

    /**
     * 刷新员工列表
     */
    refreshUserList() {
      this.currentPage = 0
      this.getUserList()
    },

    /**
     * 更改每页展示数量
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.refreshUserList()
    },

    /**
     * 更改当前页数
     */
    handleCurrentChange(val) {
      const x = val > 0 ? val - 1 : 0
      this.currentPage = x ? x * this.pageSize : x
      this.getUserList()
    },

    /**
     * 是否能字段设置
     */
    canSetField(type) {
      if (this.pid == 10) return false
      return (
        [
          'leads',
          'customer',
          'contacts',
          'business',
          'contract',
          'receivables',
          'receivablesPlan',
          'product',
          'visit',
          'invoice'
        ].includes(type) && this.ruleMenuIndex === 'data'
      )
    },

    /**
     * 权限设置
     */
    fieldSetClick(node) {
      this.setFieldLabel = crmTypeModel[node.data.realm]
      this.setFieldShow = true
    },

    /**
     * 权限设置
     */
    checkRangeSetClick(node) {
      this.setRoleRangeShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
.role-authorization {
  // padding: 0 15px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.title {
  font-size: 18px;
  height: 40px;
  padding: 0 20px;
  line-height: 40px;
  margin: 10px 0;
  color: #333;
}

.role-box {
  height: calc(100% - 60px);
  overflow: hidden;
  position: relative;

  &.is-tabs {
    .role-nav-box {
      padding-top: 0;
      height: calc(100% - 100px);
    }
  }
}

.nav {
  width: 280px;
  background: #fff;
  border: 1px solid $xr-border-line-color;
  border-radius: $xr-border-radius-base;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.nav__hd {
  position: relative;
  padding: 20px 15px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid $xr-border-line-color;

  .el-button {
    position: absolute;
    top: 13px;
    right: 15px;
  }
}

.content-box {
  background: #fff;
  border: 1px solid $xr-border-line-color;
  border-radius: $xr-border-radius-base;
  margin-left: 295px;
  height: 100%;
  overflow: hidden;
  padding-top: 10px;
  position: relative;
}

.content-table {
  overflow: hidden;
}

.content-table > .el-button {
  float: right;
  margin-bottom: 15px;
  margin-right: 30px;
}

.content-box .content-table-span {
  color: #2362fb;
  margin-left: 5px;
  cursor: pointer;
}

.content-table-header {
  padding: 0 15px 5px;

  .content-table-header-reminder {
    flex: 1;
    margin-right: 5px;
  }
}

/* 权限管理 */
.jurisdiction-content {
  height: calc(100% - 61px);
  position: relative;
  overflow: hidden;
}

.content-left {
  height: 100%;
  margin-right: 250px;
  overflow: hidden;
}

.content-right {
  width: 250px;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
}

.jurisdiction-box {
  // padding-bottom: 15px;
  height: calc(100% - 61px);
  overflow: hidden;
  position: relative;

  .tree-top {
    padding: 0 0 20px 20px;
    border-bottom: solid 1px $xr-border-line-color;
  }

  .tree-content {
    display: flex;
    height: calc(100% - 40px);

    & > div {
      flex: 1 1 50%;
      overflow-y: auto;
    }

    .qx {
      padding: 20px;
      border-right: solid 1px $xr-border-line-color;

      /deep/ .el-checkbox {
        display: flex;
        align-items: center;
        width: 100%;
      }

      /deep/ .el-checkbox__label {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    /deep/ .custom-tree-node {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.jurisdiction-content-checkbox {
  border-right: 1px dashed $xr-border-line-color;
  height: calc(100% - 47px);
  overflow-y: scroll;
  padding: 20px;

  /deep/ .el-tree-node__content:hover {
    background-color: white;
    color: $xr-color-primary;
  }
}

/deep/ .el-tree-node__content {
  margin-bottom: 10px;
}

.jurisdiction-content-checkbox
  .el-tree
  /deep/
  .el-tree-node
  > .el-tree-node__content {
  margin-bottom: 20px;
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

.role-authorization /deep/ .el-tree-node__expand-icon {
  // display: none;
}

.data-radio {
  padding: 5px 30px;
}

.data-radio .el-radio {
  display: block;
  margin: 20px 0;
}

/* 新建角色 */
.input-role {
  padding: 10px 0 20px;
  width: 100%;
}

.quanxian {
  background: #f5f5f7;
  line-height: 10px;
  padding: 12px;
  height: 33px;
  display: inline-block;
  margin-right: 20px;
}

.quanxian.active {
  background: #334763;
  color: #fff;
}

.role-nav-box {
  line-height: 30px;
  overflow-y: auto;
  padding: 20px 0;
  height: calc(100% - 50px);
}

// 菜单
.menu-item {
  color: #333;
  font-size: 13px;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  position: relative;

  .icon-close {
    position: absolute;
    top: 0;
    right: 8px;
    z-index: 1;
    display: none;
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

.role-nav-box .menu-item:hover .icon-close {
  display: block;
  float: right;
}

.jurisdiction-edit {
  text-align: right;
  padding: 10px 30px;
  position: absolute;
  top: 0;
  right: 20px;
  z-index: 3;
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

// .el-tabs /deep/ .el-tabs__nav-wrap::after {
//   display: none !important;
// }

.el-tabs /deep/ .el-tabs__header {
  padding: 0 17px;
  margin: 0 0 15px !important;
}

.el-tabs /deep/ .el-tabs__item {
  font-size: 13px !important;
  height: 50px !important;
  line-height: 50px !important;
}

.node-label {
  font-weight: bold;
  font-size: 15px;
  position: relative;

  .el-button {
    position: absolute;
    top: -8px;
    right: -80px;

    /deep/ span {
      margin-left: 3px;
    }
  }
}

.common-node-label {
  position: relative;

  .el-button {
    position: absolute;
    top: -8px;
    right: -105px;

    /deep/ span {
      margin-left: 3px;
    }
  }
}

.el-checkbox {
  margin-bottom: 20px !important;
  min-width: 150px !important;
}

@import '../styles/table.scss';
</style>
