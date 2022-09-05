<template>
  <div class="main">
    <xr-header
      icon-class="iconfont  icon-navicon-zdcs"
      icon-color="#2362fb "
      label="通知管理" >
      <template v-slot:ft>
        <el-button type="primary" style="float:right;    position: relative;   " @click="showopen"> 编辑</el-button>
      </template>

    </xr-header>

    <div class="main-body" style="padding: 26px;">
      <div class="main-table-header" style="    height: 90px !important;">
        <label style="margin-left:12px">消息接口地址</label>
        <el-input v-model="url" disabled style="padding: 10px 0px 0px 10px;" placeholder="请输入接口地址"/>
      </div>
      <div style="margin-bottom:5px;padding-bottom:15px;    padding-left: 12px;">
        <span>消息通知配置</span>

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
          prop="messageTypeName"
          label="消息类型"/>

        <el-table-column
          prop="templateId"
          label="中台消息模板ID"
        />
        <el-table-column
          prop="isOpen"
          label="是否开启"
        >
          <template slot-scope="{ row, column }">
            {{ row.isOpen?'开启':'未开启' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
        />
        <el-table-column label="发送方式" width="250px">
          <template slot-scope="{ row, column }">
            {{ row.sendType }}
            <!-- <el-checkbox v-model="checked">钉钉</el-checkbox>
            <el-checkbox v-model="checked">短信</el-checkbox>
            <el-checkbox v-model="checked">邮箱</el-checkbox> -->
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

    </div>

    <el-dialog :visible.sync="passwording" title="编辑通知配置">
      <div class="main-body" style="padding:0px 26px;    border: 0px;">
        <div class="main-table-header" style="    height: 90px !important;">
          <label style="margin-left:0px">中台消息接口地址</label>
          <el-input v-model="url1" style="padding: 10px 0px 0px 0px;" placeholder="请输入中台消息接口地址"/>
        </div>
        <div style="border-bottom:1px solid #e6e6e6;margin-bottom:10px;padding-bottom:15px">
          <span>消息通知配置</span>
        </div>
        <div style="margin-bottom:10px">
          <el-button type="primary" @click="add">新增</el-button>
          <el-button :disabled="!obj1" @click="del">删除</el-button>
        </div>
        <el-table
          v-loading="loading"
          id="examine-table"
          :data="list1"
          :height="tableHeight1"
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
            show-overflow-tooltip
            prop="messageTypeName"
            label="消息类型">
            <template slot-scope="{ row, column }">
              <el-select v-model="row.messageType">
                <el-option v-for="(item,index) in options" :key="index" :value="index" :label="item"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="templateId"
            label="中台消息模板ID"
          >
            <template slot-scope="{ row, column }">
              <el-input v-model="row.templateId"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="isOpen"
            label="是否开启"
          >
            <template slot-scope="{ row, column }">
              <el-select v-model="row.isOpen">
                <el-option :value="true" label="开启"/>
                <el-option :value="false" label="不开启"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
          >
            <template slot-scope="{ row, column }">
              <el-input
                :rows="2"
                v-model="row.remark"
                type="textarea"
                placeholder="请输入内容"/>
            </template>
          </el-table-column>
          <el-table-column label="发送方式" width="250px">
            <template slot-scope="{ row, column }">
              <el-checkbox v-model="row.sendType1">钉钉</el-checkbox>
              <el-checkbox v-model="row.sendType2">短信</el-checkbox>
              <el-checkbox v-model="row.sendType3">邮箱</el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: center !important;">
        <el-button @click="passwording = false">取 消</el-button>
        <el-button type="primary" @click="saves">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  OrderPage,
  usersInfo, ParameterDeleteMany,
  GetMessageType,
  CreateParameter
} from '@/api/kcjl/user'

import XrHeader from '@/components/XrHeader'
import CreateSections from '@/components/CreateSections'

export default {
  /** 系统管理 的 项目管理 */
  name: 'SystemProject',
  components: {
    XrHeader,
    CreateSections
  },
  mixins: [],
  data() {
    return {
      delList: [],
      url: '',
      url1: '',
      passwording: false,
      inputs: '',
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 350, // 表的高度
      tableHeight1: document.documentElement.clientHeight - 550,
      list: [],
      list1: [],
      obj1: false,
      obj: [],
      options: [
      ]
    }
  },
  computed: {},
  mounted() {
    this.GetMessageType()
    var self = this
    /** 控制table的高度 */
    window.onresize = function() {
      self.tableHeight = document.documentElement.clientHeight - 196
    }
  },
  methods: {
    showopen() {
      this.passwording = true
      this.delList = []
      this.obj = []
      this.list1 = JSON.parse(JSON.stringify(this.list))
    },
    GetMessageType() {
      GetMessageType().then(res => {
        this.options = res
        this.getList()
      })
    },
    del() {
      debugger
      const arr = []
      this.list1.forEach((e) => {
        if (!e.checked) {
          arr.push(e)
        } else {
          if (e.id) {
            this.obj.push(e.id)
          }
        }
      })
      this.list1 = arr
    },
    add() {
      this.list1.push({ checked: false, hover: false })
    },
    /*
   * 当checkbox选择change时事件
   */
    onItemCheckboxChange() {
      debugger
      this.obj1 = false
      this.list1.filter((d) => d.checked).map(e => {
        // const key = e.id
        this.obj1 = true
      })
      console.log(this.obj)
    },
    /**
     * 获取列表数据
     */
    changeParam(param) {
      return JSON.stringify(param).replace(/:/g, '=').replace(/,/g, '&').replace(/{/g, '?').replace(/}/g, '').replace(/"/g, '')
    },
    getList() {
      this.loading = true
      OrderPage()
        .then(res => {
          for (let i = 0; i < res.length; i++) {
            res[i].hover = false
            res[i].checked = false
            res[i].messageTypeName = this.options[res[i].messageType]
            res[i].messageType = res[i].messageType + ''
            if (res[i].sendType && res[i].sendType.indexOf('钉钉') != -1) {
              res[i].sendType1 = true
            } else {
              res[i].sendType1 = false
            }
            if (res[i].sendType && res[i].sendType.indexOf('短信') != -1) {
              res[i].sendType2 = true
            } else {
              res[i].sendType2 = false
            }
            if (res[i].sendType && res[i].sendType.indexOf('邮箱') != -1) {
              res[i].sendType3 = true
            } else {
              res[i].sendType3 = false
            }
            this.url = res[i].url
            this.url1 = res[i].url
          }
          this.list = res
          this.list1 = res
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
      let x = '?'
      debugger
      for (let i = 0; i < this.obj.length; i++) {
        if (i != this.obj.length - 1) {
          x += 'idList=' + this.obj[i] + '&'
        } else {
          x += 'idList=' + this.obj[i]
        }
      }
      const data = { parameterList: [] }
      for (let i = 0; i < this.list1.length; i++) {
        const d = this.list1[i]
        const sendType = []
        if (d.sendType1) {
          sendType.push('钉钉')
        }
        if (d.sendType2) {
          sendType.push('短信')
        }
        if (d.sendType3) {
          sendType.push('邮箱')
        }
        if (d.id) {
          data.parameterList.push({ id: d.id, parameterDto: { url: this.url1, messageType: d.messageType, templateId: d.templateId, isOpen: d.isOpen, remark: d.remark, sendType: sendType }})
        } else {
          data.parameterList.push({ parameterDto: { url: this.url1, messageType: d.messageType, templateId: d.templateId, isOpen: d.isOpen, remark: d.remark, sendType: sendType }})
        }
      }
      if (this.obj.length) {
        Promise.all([ParameterDeleteMany(x), CreateParameter(data)]).then(res => {
          if (x.toString().indexOf('false') == -1) {
            this.$message.success('保存成功')
            this.getList()
            this.passwording = false
          }
        })
      } else {
        CreateParameter(data).then(res => {
          this.$message.success('保存成功')
          this.getList()
          this.passwording = false
        })
      }
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
