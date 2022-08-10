<template>
  <el-dialog
    v-loading="loadings"
    :visible="show"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    title="数据库映射"
    class="create-dialog"
    width="1000px"
    @close="closeView">
    <el-table
      id="examine-table"
      :data="slist"
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      height="600"
      row-key="name"
      class="main-table"
      highlight-current-row
      lazy
      style="width: 100%"
      @row-click="handleRowClick">
      <el-table-column
        show-overflow-tooltip
        prop="name"
        width="150"
        label="客户系统表名称"/>
      <el-table-column
        show-overflow-tooltip
        prop="description"
        width="150"
        label="描述"/>
      <el-table-column
        show-overflow-tooltip
        prop="ysname"
        width="150"
        label="映射系统表名称"/>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.hasChildren"
            type="text"
            size="small"
            @click="handleClick(scope,index)">关联映射表</el-button>
          <el-button
            v-show="scope.row.xytype"
            type="text"
            size="small"
            @click="handleClick1(scope)">映射</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :loading="loadings"
      :visible="show1"
      :modal-append-to-body="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      title="映射"
      class="create-dialog"
      width="600px"
      @close="closeView1">
      <div>
        <div class="label-input" style="display:flex">
          <div style="flex:2;margin-right:20%;">
            <label class="label-title">数据库表</label>
            <el-input
              v-model="info.nameE"
              :maxlength="100"
              placeholder="请输入数据库名称"/>
          </div>
          <div style="width:300px">
            <label class="label-title">映射数据库表</label>
            <el-select
              v-model="listvalue"
              style="    width: 300px;"
              class="condition-value">
              <el-option
                v-for="(option, index) in list"
                :key="index"
                :label="option.name+'('+option.description+')'"
                :value="option.name"/>
            </el-select>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="savextb">保存</el-button>
        <el-button @click="closeView1">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :loading="loadings"
      :visible="show2"
      :modal-append-to-body="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      title="映射"
      class="create-dialog"
      width="600px"
      @close="show2=false">
      <div>
        <div class="label-input" style="display:flex">
          <div style="flex:2;margin-right:20%;">
            <label class="label-title">数据库表字段</label>
            <el-input
              v-model="systablestructure"
              :maxlength="100"
              disabled
              placeholder="请输入数据库名称"/>
          </div>
          <div style="width:300px">
            <label class="label-title">映射数据库表字段</label>
            <el-select
              v-model="plattablestructure"
              style="    width: 300px;"
              class="condition-value">
              <el-option
                v-for="(option, index) in plattablestructureList "
                :key="index"
                :label="option.dbColumnName+'   ('+option.columnDescription+')   '+'('+option.dataType+')'"
                :value="option.dbColumnName"/>
            </el-select>
          </div>

        </div>
        <p style="    margin: 18px 0px;">规则</p>
        <div class="ysx">
          <div v-for="(item,index) in tjlist" :key="index" class="ysx-all">
            <el-input
              v-model="systablestructure"
              :maxlength="100"
              :disabled="true"
              placeholder="请输入数据库名称"/>
            <el-select
              v-model="item.rule"
              style="    width: 300px;"
              class="condition-value">
              <el-option
                v-for="(option, index) in rulelist"
                :key="index"
                :label="option.name"
                :value="option.val"/>
            </el-select>
            <el-input
              v-model="item.rulevalue"
              :maxlength="100"
              placeholder="请输入"/>
            <span style="    padding-top: 6px;" @click="deleterule(index)">
              <i class="delete_icon"/>
            </span>
          </div>

          <div style="    text-align: center;" @click="addrule">
            添加条件
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click=" saveobj">提交</el-button>
        <el-button @click="show2=false">取 消</el-button>
      </span>
    </el-dialog>

  </el-dialog>

</template>

<script>
import { systablesAPI, plattablesAPI, systablestructureAPI, ConfigMapAsyncAPI, plattablestructureAPI, dbfieldmapconfig, MapFieldAsyncAPI, dbfieldmapconfigupdate } from '@/api/admin/project'

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
      mapfieldid: '',
      tableId: '',
      plattables1: '',
      plattablestructure: '',
      plattablestructureList: [],
      systablestructure: '',
      systablestructype: '',
      show2: false,
      glindex: 0,
      tjlist: [],
      loadings: false,
      slist: [],
      plist: [],
      list: [],
      listvalue: '',
      show1: false,
      info: {},
      rulelist: [
        { name: '等于', val: '==' },
        { name: '不等于', val: '!=' },
        { name: '大于', val: '>' },
        { name: '小于', val: '<' },
        { name: '包括', val: 'Contains' },
        { name: '不包括', val: '!Contains' }
      ]
    }
  },

  computed: {

  },

  watch: {
    show(value) {
      if (value) {
        this.initInfo()
      }
    }
  },

  mounted() {
  },

  methods: {
    saveobj() {
      const arr = []; let jsons = ''

      for (let i = 0; i < this.tjlist.length; i++) {
        const data = this.tjlist[i]

        if (data.rule == 'Contains') {
          jsons = `${this.systablestructure}.${data.rule}( \"${data.rulevalue}\")`
        } else if (data.rule == '!Contains') {
          jsons = `!${this.systablestructure}.Contains(\"${data.rulevalue}\")`
        } else {
          const val = this.systablestructype == 'string' ? `\"${data.rulevalue}\"` : `${data.rulevalue}`
          jsons = `${this.systablestructure} ${data.rule} ${val} `
        }

        arr.push({
          Expression: jsons,
          OutPutExpression: this.systablestructure
        })
      }
      const obj = {
        dbConfigsId: this.action.data.id,
        sysTable: this.tableId,
        platTable: this.plattables1,
        sysColumn: this.systablestructure,
        platColumn: this.plattablestructure,
        lambdaConditional: JSON.stringify(arr)
      }
      if (this.mapfieldid) {
        dbfieldmapconfigupdate(obj, this.mapfieldid).then(res => {
          this.$message.success('更新成功')
          this.show2 = false
        })
      } else {
        dbfieldmapconfig(obj).then(res => {
          this.$message.success('提交成功')
          this.show2 = false
        })
      }
    },
    load(tree, treeNode, resolve) {
      if (!tree.ysname) {
        this.$message.error('请选择映射数据库表,再进行下一步')
        return
      }
      const id = this.action.data.id
      systablestructureAPI({ id: id, tableName: tree.name }).then(res => {
        const arr = []
        for (let i = 0; i < res.length; i++) {
          res[i].name = res[i].dbColumnName
          res[i].xytype = true
          res[i].plattables1 = tree.ysname
          if (!res[i].isPrimarykey) {
            arr.push(res[i])
          }
        }
        resolve(arr)
      })
    },
    savextb() {
      if (!this.listvalue) {
        this.$message.error('请选择映射数据库表')
      }
      let index = 0
      for (let i = 0; i < this.slist.length; i++) {
        if (this.slist[i].name == this.glindex) {
          index = i
        }
      }
      this.$set(this.slist[index], 'ysname', this.listvalue)

      this.closeView1()
    },
    deleterule(index) {
      this.tjlist.splice(index, 1)
    },
    addrule() {
      if (!this.plattablestructure) {
        this.$message.error('请选择映射字段')
        return
      }
      this.tjlist.push({
        rule: '',
        rulevalue: ''
      })
    },
    handleClick1(data) {
      this.systablestructure = data.row.dbColumnName
      const flag = data.row.dataType
      this.plattables1 = data.row.plattables1
      this.tableId = data.row.tableName
      this.show2 = true
      plattablestructureAPI(data.row.plattables1).then(res => {
        if (this.plattables1 == 'txldepartments') {
          const arr = new Set(['PkId', 'Name', 'ParentId', 'Flag', 'SortIndex', 'Remark'])
          this.plattablestructureList = new Set([...res].filter(x => arr.has(x.dbColumnName)))
        } else {
          const arr = new Set(['PkId', 'Name', 'Category', 'DepartmentId', 'Station', 'Gender', 'Phone', 'Email', 'IdCardType', 'IdCard', 'Flag', 'Remark', 'State'])
          this.plattablestructureList = new Set([...res].filter(x => arr.has(x.dbColumnName)))
        }
        // > < == != 无转义 数值
        const arr1 = new Set(['decimal', 'numeric', 'float', 'int', 'smallint', 'tinyint', 'money', 'smallmoney', 'bit', 'mediumint', 'big', 'double', 'number', 'real', 'integer',
          'bigint', 'unsigned', 'int2', 'int8', 'bigserial', 'float4', 'float8', 'int4'])
        // 字符串  == !=  包含不包含 转义
        const arr2 = new Set(['char', 'varchar', 'nchar', 'nvarchar', 'text', 'ntext', 'tinytext', 'varchar2', 'nvarchar2', 'character', 'varying', 'native', 'varbit'])

        if (arr1.has(flag)) {
          this.systablestructype = 'num'
          this.rulelist = [
            { name: '等于', val: '==' },
            { name: '不等于', val: '!=' },
            { name: '大于', val: '>' },
            { name: '小于', val: '<' }

          ]
        } else if (arr2.has(flag)) {
          this.systablestructype = 'string'
          this.rulelist = [
            { name: '等于', val: '==' },
            { name: '不等于', val: '!=' },
            { name: '包括', val: 'Contains' },
            { name: '不包括', val: '!Contains' }
          ]
        } else {
          this.rulelist = []
        }
      })
      const obj = {
        configId: this.action.data.id,
        sysTableName: data.row.tableName,
        sysFieldName: data.row.dbColumnName
      }
      MapFieldAsyncAPI(obj).then(res => {
        if (res.length > 0) {
          const data = res[0]
          this.tjlist = []
          this.mapfieldid = data.id
          this.plattablestructure = data.platColumn
          const val = JSON.parse(data.lambdaConditional)
          if (val.length > 0) {
            var pattern = /".+"/
            for (let i = 0; i < val.length; i++) {
              if (val[i].Expression.indexOf('==') != -1) {
                const name = val[i].Expression
                const arr = val[i].Expression.split('==')
                this.tjlist.push({
                  rule: '==',
                  rulevalue: this.systablestructype == 'string' ? name.match(pattern)[0].replace(/\"/g, '').trim() : arr[i].trim()
                })
              } else if (val[i].Expression.indexOf('!=') != -1) {
                const name = val[i].Expression
                const arr = val[i].Expression.split('!=')
                this.tjlist.push({
                  rule: '!=',
                  rulevalue: this.systablestructype == 'string' ? name.match(pattern)[0].replace(/\"/g, '').trim() : arr[i].trim()
                })
              } else if (val[i].Expression.indexOf('>') != -1) {
                const arr = val[i].Expression.split('>')
                this.tjlist.push({
                  rule: '>',
                  rulevalue: arr[1].trim()
                })
              } else if (val[i].Expression.indexOf('<') != -1) {
                const arr = val[i].Expression.split('<')
                this.tjlist.push({
                  rule: '<',
                  rulevalue: arr[1].trim()
                })
              } else if (val[i].Expression.indexOf('!') != -1) {
                var pattern = /".+"/
                const name = val[i].Expression
                this.tjlist.push({
                  rule: '!Contains',
                  rulevalue: name.match(pattern)[0].replace(/\"/g, '').trim()
                })
              } else if (val[i].Expression.indexOf('Contains') != -1) {
                var pattern = /".+"/
                const name = val[i].Expression
                this.tjlist.push({
                  rule: 'Contains',
                  rulevalue: name.match(pattern)[0].replace(/\"/g, '').trim()
                })
              }
            }
          }
        } else {
          this.mapfieldid = ''
          this.plattablestructure = ''
          this.tjlist = []
        }
      })
    },
    handleClick(data) {
      this.listvalue = data.row.ysname
      this.glindex = data.row.name
      this.plattables()
      data.row.nameE = data.row.name + '(' + data.row.description + ')'
      this.info = data.row
      this.show1 = true
    },
    handleRowClick() {},
    closeView1() {
      this.show1 = false
    },
    closeView() {
      this.$emit('update:show', false)
    },
    /**
     * 初始化数据
     */
    initInfo() {
      if (this.action.type == 'update') {
        this.systables()
      }
    },
    plattables() {
      this.list = []
      plattablesAPI().then(res => {
        res.forEach(e => {
          if (e.name == 'txlemployees' || e.name == 'txldepartments') {
            this.list.push(e)
          }
        })
      })
    },
    systables() {
      this.loadings = true
      const id = this.action.data.id
      systablesAPI({ id: id }).then(res => {
        this.loadings = false
        ConfigMapAsyncAPI({ id: id }).then(res1 => {
          for (let i = 0; i < res.length; i++) {
            res[i].hasChildren = true
            res[i].ysname = res1[res[i].name]
          }
          this.slist = res
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.ysx{
  padding: 20px;
  background: #f4f5f8;
      .ysx-all{
          display: flex;
          margin-bottom: 20px;
          >div{
            flex: 1;
            margin-right: 10px;
          }
          .el-select{
            max-width: 100px;
          }
          .delete_icon{
            background: url(./delete.png) no-repeat;
                width: 20px;
    height: 20px;
    display: inline-block;
    background-size:100% 100% ;

          }
      }
}
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
