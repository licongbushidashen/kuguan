<template>
  <div class="main">
    <xr-header icon-class="iconfont icon-baobiao" icon-color="#2362fb" label="小厨宝台账">
      <template v-slot:ft>
        <el-button

          class="main-table-header-button "
          type="primary"
          icon="iconfont icon-daochu1"
          @click="downs">导出</el-button>
      </template>
    </xr-header>
    <div class="main-body">
      <div class="main-table-header">
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
        <el-button type="primary" style="margin-left:20px" @click="handleCurrentChange(0)">搜索</el-button>
      </div>
      <el-table
        v-loading="loading"
        id="examine-table"
        :data="list"
        :summary-method="getSummaries"
        show-summary
        class="main-table"
        highlight-current-row
        @row-click="handleRowClick"
      >


        <el-table-column v-for="(item,index) in tableH" :prop="item.props" :label="item.name" :key="index"/>

      </el-table>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import {
  GetKitchenBooks,
  DownloadKitchenReport
} from '@/api/account'
import { downloadFileWithBuffer } from '@/utils'
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
      tableH: [{ name: '规格', props: 'size' }],
      flag: 0,
      Inventoryid: '',
      lossShow: false,
      Inventoryshow: false,
      showing: false,
      planing: true,
      warningshow: true,
      jurisdictionCreateShow: false,
      inputs: '',
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 250, // 表的高度
      list: [],
      createAction: {
        type: 'save'
      },
      currentPage: 0,
      pageSize: 15,
      total: 0,
      obj: {},
      info: {},

      time: null
    }
  },
  computed: {
    ...mapGetters(['allAuth'])
  },
  mounted() {
    var self = this
    /** 控制table的高度 */
    window.onresize = function() {
      self.tableHeight = document.documentElement.clientHeight - 196
    }
    if (this.$route.query.add == '1') {
      this.addJurisdiction()
    }
    this.getList()
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          return
        }
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    /**
       * 导出
       */
    downs() {
      DownloadKitchenReport({ 'maxResultCount': 1000, 'skipCount': 0,
        beginTime: this.time ? parseTime(this.time[0], '{y}-{m}-{d}') + ' 00:00:00' : null,
        endTime: this.time ? parseTime(this.time[1], '{y}-{m}-{d}') + ' 23:59:59' : null
      }).then(res => {
        // const blob = new Blob([res], {
        //   type: ''
        // })
        downloadFileWithBuffer(res, '', 'application/vnd.ms-excel;charset=UTF-8')
      })
    },
    handleClick(type, row) {
      if (type == 'edit') {
        this.Inventoryid = row.id
        this.flag = row.flag
        this.Inventoryshow = !this.Inventoryshow
      } else {
        this.Inventoryid = row.id
        this.flag = row.flag
        this.lossShow = !this.lossShow
      }
    },
    /**
       *  添加权限
       */
    addJurisdiction() {
      this.info = {}
      this.jurisdictionCreateShow = !this.jurisdictionCreateShow
    },
    /*
     * 当checkbox选择change时事件
     */
    onItemCheckboxChange() {
      this.obj = {}
      this.list.filter((d) => d.checked).map(e => {
        const key = e.id; const val = e.code
        this.obj[key] = val
        return { [key]: val }
      })
    },
    /**
       * 获取列表数据
       */
    getList() {
      this.loading = true
      if (this.time) {
        var data = `?beginTime=${parseTime(this.time[0], '{y}-{m}-{d}') + ' 00:00:00'}&endTime=${parseTime(this.time[1], '{y}-{m}-{d}') + ' 23:59:59'}`
      } else {
        var data = ``
      }

      GetKitchenBooks(data)
        .then(res => {
          const list = []
          const tableH = []
          this.tableH = [{ name: '品牌', props: 'brand' }, { name: '型号', props: 'model' }]
          const tableHName = new Set()
          for (let i = 0; i < res.length; i++) {
            if (!tableHName.has(res[i].spacePointName)) {
              tableH.push({ name: res[i].spacePointName, props: res[i].spacePointName })
              tableHName.add(res[i].spacePointName)
            }
          }

          tableH.push({ name: '总计', props: '总计' })
          const size = {}
          for (let i = 0; i < res.length; i++) {
            const j = res[i].model
            size[j] = size[j] ? size[j] : {}
            size[j][res[i].spacePointName ] = res[i].totalQuantiy
            size[j].brand = res[i].brand
          }
          for (const item in size) {
            const obj = { model: item, ...size[item] }
            const brand = JSON.parse(JSON.stringify(size[item].brand))
            delete size[item].brand
            let s = 0
            Object.values(size[item]).forEach(val => {
              s += isNaN(val) ? 0 : val
            }, 0)
            obj['总计'] = s
            obj.brand = brand
            list.push(obj)
          }
          this.tableH = [...this.tableH, ...tableH]
          this.list = list
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



    /** 列表操作 */
    /**
       * 当某一行被点击时会触发该事件
       */
    handleRowClick(row, column, event) {
      if (column.label == '序号') {
        return
      }
      this.info = row
      this.jurisdictionCreateShow = !this.jurisdictionCreateShow
      //   GetInfo(row.id).then(res => {
      //     console.log(res)
      //     this.info = res
      //     this.jurisdictionCreateShow = !this.jurisdictionCreateShow
      //   })
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
    /deep/.el-table__footer-wrapper tbody td.el-table__cell{
      background-color:#fff !important;
    }
  /deep/.el-range-editor.el-input__inner{
    // padding: 0px 10px !important;
  }
  .main {
    height: 100%;

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
    line-height: 50px;
    padding-left: 20px;
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
  .buttonc {
    color: #4f81fc;
     cursor: pointer;
  }
  </style>


