<template>
  <el-dialog v-if="showDialog" :visible.sync="showDialog" :close-on-click-modal="false" :destroy-on-close="true" style="    margin-top: 2vh;" width="1200px" class="bill" title="入库单">
    <div class="wy-body">
      <div class="wy-body-info">
        <div class="wy-body-info-one">
          <div class="wy-body-info-one-left">
            <div class="field__label">
              入库类型
            </div>
            <div v-if="!butoom1" class="wy-body-info-one-left-val ">
              {{ orderCategory|ordername }}
            </div>

            <div v-else :class="erroring?orderCategory?'':'errorshow':''" class=" wy-body-info-one-left-val wy-body-info-one-left-puts">
              <el-select v-model="orderCategory">
                <el-option
                  v-for="(item,index) in Category"
                  :key="index" :label="item.name"
                  :value="item.orderCategory"
                  class="wy-select"/>
              </el-select>
            </div>
          </div>
          <div class="wy-body-info-one-right">
            <div class="field__label">
              单据号
            </div>
            <div class="wy-body-info-one-left-val ">
              系统自动填充

            </div>
          </div>
        </div>
        <div class="wy-body-info-one">
          <div class="wy-body-info-one-left">
            <div class="field__label">
              货品类目
            </div>
            <div v-if="!butoom1" class="wy-body-info-one-left-val ">
              {{ objs.typeName }}
            </div>
            <div v-else :class="erroring?objs.typeName?'':'errorshow':''" class=" wy-body-info-one-left-val  wk changers" >
              <el-select v-model="objs.typeName">
                <el-option :value="objs.typeName" class="wy-select1">
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


                    </flexbox>
                  </el-tree>
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="wy-body-info-one-right">
            <div class="field__label">
              类目负责人
            </div>
            <div v-if="!butoom1" class="wy-body-info-one-left-val ">
              {{ objs.dutyUserName }}
            </div>
            <div v-else :class="erroring?objs.dutyUserName?'':'errorshow':''" class="wy-body-info-one-left-val  wk changers" @click="opende('dutyUser')">
              <div :style="objs.dutyUserName?'color: #666;':'color: #cccfd6;'" style="    font-size: 13px;    "> {{ objs.dutyUserName ||'请选择' }}</div>
            </div>
          </div>
        </div>
        <div class="wy-body-info-one">
          <div class="wy-body-info-one-left">
            <div class="field__label">
              仓库
            </div>
            <div v-if="!butoom1" class="wy-body-info-one-left-val ">
              {{ objs.ckName }}
            </div>
            <div v-else :class="erroring?objs.ckName?'':'errorshow':''" class=" wy-body-info-one-left-val  wk changers" @click="opende('ck')">
              <div :style="objs.ckName?'color: #666;':'color: #cccfd6;'" style="    font-size: 13px;    "> {{ objs.ckName ||'请选择' }}</div>
            </div>
          </div>
          <div class="wy-body-info-one-right">
            <div class="field__label">
              来往单位
            </div>
            <div v-if="!butoom1" class="wy-body-info-one-left-val ">
              {{ objs.wldwName }}
            </div>
            <div v-else :class="erroring?objs.wldwName?'':'errorshow':''" class="wy-body-info-one-left-val  wk changers" @click="opende('wldw')">
              <div :style="objs.wldwName?'color: #666;':'color: #cccfd6;'" style="    font-size: 13px;">
                {{ objs.wldwName ||'请选择' }}
              </div>
            </div>
          </div>
        </div>
        <div class="wy-body-info-one">
          <div class="wy-body-info-one-left">
            <div class="field__label">
              经费卡号
            </div>
            <div v-if="!butoom1" class="wy-body-info-one-left-val ">
              {{ objs.jfkhName }}
            </div>
            <div v-else :class="erroring?objs.jfkhName?'':'errorshow':''" class=" wy-body-info-one-left-val  wk changers" @click="opende('jfkh')">
              <div style="    font-size: 13px;    color: #cccfd6;">{{ objs.jfkhNumber ||'请选择' }}</div>
            </div>
          </div>
          <div class="wy-body-info-one-right">
            <div class="field__label">
              经费名称
            </div>
            <div class="wy-body-info-one-left-val ">
              <div :style="objs.jfkhName?'color: #666;':'color: #cccfd6;'" style="    font-size: 13px;  ">{{ objs.jfkhName ||'' }}</div>

            </div>
          </div>
        </div>
      </div>
      <div class="wy-body-detailed">
        <p>入库明细</p>
        <div v-if="butoom1" class="wy-body-detailed-ed">
          <el-button
            type="primary"
            icon="el-icon-plus" @click="addpush">新建</el-button>
          <el-button
            :disabled="!isCheckedItems"
            icon="wk wk-delete" style="margin-bottom:20px" @click="dellist">删除</el-button>
          <el-button
            type="primary"
            icon="el-icon-plus" @click="opende('gldj1')">关联单据</el-button>
        </div>
        <el-table
          id="examine-table"
          :data="list"
          :summary-method="getSummaries"
          border
          class="main-table"
          highlight-current-row
          show-summary

        >
          <el-table-column
            show-overflow-tooltip
            type="index"
            width="60"
            label="序号">
            <template slot="header" slot-scope="scope" >
              <el-checkbox
                v-model="checkedAll"
                :disabled="!list || !list.length"
                @change="selectAll"
              />
            </template>
            <template slot-scope="{ row, column, $index}">
              <span class="status-name">
                <span
                  class="index"
                  style=" display: block;"
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
            prop="name"
            label="货品名称"
          >
            <template slot-scope="scope">
              <div v-if="!butoom1">
                <div style="    font-size: 13px;    color: #cccfd6;" >{{ scope.row.name || scope.row.goodsName || '请选择' }}</div>
              </div>
              <div v-else style="    border: 1px solid #d9d9d9;    min-height: 30px;    line-height: 30px;    padding-left: 12px;    border-radius: 5px;" @click="opende('goods',scope.$index)">
                <div style="    font-size: 13px;    color: #cccfd6;">{{ scope.row.name || scope.row.goodsName || '请选择' }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="brand"
            label="品牌"
          />

          <el-table-column
            prop="size"
            label="规格"
          />
          <el-table-column
            prop="unitId"
            label="单位"
          >
            <template slot-scope="scope">
              <div v-if="!butoom1">
                {{ scope.row.unitName }}
              </div>
              <el-select v-else v-model="scope.row.unitId" placeholder="请选择">
                <el-option
                  v-for="item in scope.row.ean13List"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </template>
          </el-table-column>>
          <el-table-column
            prop="unitPrice"
            label="单价(元)"
          >
            <template slot-scope="scope">
              <div v-if="!butoom1">
                {{ scope.row.unitPrice }}
              </div>
              <el-input v-else v-model="scope.row.unitPrice" oninput="value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @change="totalNum(scope.$index)"/>
            </template>
          </el-table-column>

          <el-table-column
            prop="quantity"
            label="数量"
          >
            <template slot-scope="scope">
              <div v-if="!butoom1">
                {{ scope.row.quantity }}
              </div>
              <el-input v-else v-model="scope.row.quantity" oninput="value=value.replace(/[^\d]/g,'')" @change="totalNum(scope.$index)"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="amountMoney"
            label="金额"
          />
        </el-table>
      </div>
      <div style="padding:10px;    border-left: 1px solid #d9d9d9;    border-right: 1px solid #d9d9d9;" />
      <div class="wy-body-info">
        <div class="wy-body-info-one">
          <div class="wy-body-info-one-right">
            <div class="field__label">
              备注
            </div>
            <div class=" wy-body-info-one-left-val ">
              <el-input
                v-if="butoom1"
                :rows="2"
                v-model="objs.remark"
                class="orderput"
                style="    border: 0px;"
                type="textarea"
                placeholder="请输入内容"/>
              <div v-else>{{ objs.remark }}</div>
            </div>
          </div>

        </div>
      </div>
      <div class="wy-body-info">
        <div class="wy-body-info-one">
          <div class="wy-body-info-one-right">
            <div class="field__label">
              附件
            </div>
            <div class=" wy-body-info-one-left-val ">
              <el-upload
                v-if="butoom1"
                :on-success="handleAvatarSuccess"
                :on-remove="handleRemove"
                :show-file-list="false"
                drag
                style="    line-height: 11px;min-height: 75px;"
                action="/api/zjlab/Attachment/UploadProviderFile"
              >
                <el-button size="small" ><i
                  class="wk wk-icon-relation" style="font-size: 12px;    margin-right: 5px;"/>点击或拖拽上传</el-button>
                <div slot="tip" >单文件不要超过5MB</div>
              </el-upload>
              <div>
                <ul>
                  <li v-for="(item,index) in fileList" :key="index" class="fileList-order">

                    <div class="fileList-order-content">     <i class="el-icon-document"/> {{ item.fileName }}</div>
                    <div>
                      <span><i aria-label="图标: eye" class="anticon anticon-eye"><svg viewBox="64 64 896 896" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"/></svg></i>
                        预览
                      </span><span @click="download(item)"><i aria-label="图标: download" class="anticon anticon-download"><svg viewBox="64 64 896 896" data-icon="download" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M505.7 661a8 8 0 0 0 12.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"/></svg></i>
                        下载
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="wy-body-info">
        <div class="wy-body-info-one">
          <div class="wy-body-info-one-left">
            <div class="field__label">
              申请人
            </div>
            <div class=" wy-body-info-one-left-val ">
              <div>{{ createUser.createUserName||userInfo.name }}</div>
            </div>
          </div>
          <div class="wy-body-info-one-right">
            <div class="field__label">
              申请时间
            </div>
            <div class="wy-body-info-one-left-val ">
              {{ time|filterTimestampToFormatTime('YYYY-MM-DD HH:mm') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-checkbox
        v-if="butoom1"
        v-model="save"
      />
      <span v-if="butoom1">继续创建时，保存本次提交内容</span>
      <el-button v-if="butoom1" @click="dialogVisible = false">提交并继续创建</el-button>
      <el-button v-if="butoom1" type="primary" @click="dialogSure(1)">提 交</el-button>
      <el-button v-if="butoom1" @click="dialogSure(0)">暂 存</el-button>
    </span>

    <Type :placeholder="placeholder" :typeling="typeling" :url="url" :name="name" @change="typevalu"/>
  </el-dialog>

</template>
<script>
import { filterTimestampToFormatTime } from '@/filters/index'
import { mapGetters } from 'vuex'
import {
  GetInfo,
  CreateOrder

} from '@/api/kchk/goods'
import { downloadFileWithBuffer } from '@/utils'
import {
  UpdateOrder,
  DownLoadFile
} from '@/api/kchk/order'
import Type from './type.vue'
import {
  GetGoodsCategoryTree
} from '@/api/kchk/category'
export default{
  components: { Type },
  filters: {
    ordername: function(value) {
      if (value == 11) {
        return '采购入库'
      } else if (value == 12) {
        return '退货入库'
      } else if (value == 13) {
        return '借用还库'
      }
    },
    flagname: function(value) {
      if (value == 0) {
        return '草稿'
      } else if (value == 1) {
        return '审批中'
      } else if (value == 2) {
        return '审批通过'
      } else if (value == 3) {
        return '驳回'
      } else if (value == 4) {
        return '已入库'
      } else if (value == 5) {
        return '已作废'
      }
    }
  },
  props: {
    showing: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      erroring: false,
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'hasChild'
      },
      time: Date.now(),
      butoom1: true,
      fileList: [],
      createUser: {
        createUserName: '',
        createUserId: ''
      },
      objs: {
        wldwName: '',
        wldwId: '',
        ckName: '',
        ckId: '',
        typeName: '',
        typeId: '',
        jfkhName: '',
        jfkhNumber: '',

        dutyUserName: '',
        dutyUserId: '',
        remark: ''
      },
      placeholder: '',
      typeling: false,
      url: '',
      name: '',
      save: false,
      isCheckedItems: 0,
      checkedAll: [],
      showDialog: false,
      orderCategory: '',
      Category: [
        {
          orderCategory: '11',
          name: '采购入库'
        }, {
          orderCategory: '12',
          name: '退货入库'
        }, {
          orderCategory: '13',
          name: '借用还库'
        }
      ],
      list: [
      ]
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    showing: {
      handler(val) {
        this.butoom1 = true
        this.time = Date.now()
        this.orderCategory = ''
        this.createUser = {
          createUserName: '',
          createUserId: ''
        }
        this.list = []
        this.fileList = []
        this.objs = {
          wldwName: '',
          wldwId: '',
          ckName: '',
          ckId: '',
          typeName: '',
          typeId: '',
          jfkhName: '',
          jfkhNumber: '',
          jfkhId: '',
          dutyUserName: '',
          dutyUserId: '',
          remark: ''
        }
        this.showDialog = !this.showDialog
        if (this.info.order) {
          this.info.order.flag ? this.butoom1 = false : this.butoom1 = true
          this.orderCategory = this.info.order ? this.info.order.orderCategory + '' : ''
          this.objs = {
            wldwName: this.info.order.companyName,
            wldwId: this.info.order.companyId,
            ckName: this.info.order.wareHouseName,
            ckId: this.info.order.wareHouseId,
            typeName: this.info.order.goodsCategoryName,
            typeId: this.info.order.goodsCategoryId,
            jfkhName: this.info.order.memoryCardName,
            jfkhNumber: this.info.order.memoryCardNumber,
            jfkhId: this.info.order.memoryCardId,
            dutyUserName: this.info.order.goodsCategoryDutyUserName,
            dutyUserId: this.info.order.goodsCategoryDutyUserId,
            remark: this.info.order.remark
          }
          this.createUser = {
            createUserName: this.info.order.createUserName,
            createUserId: this.info.order.creatorId
          }
          this.time = new Date(this.info.order.receiptDate).getTime()
          const list = this.info.detailList
          for (let i = 0; i < list.length; i++) {
            const row = list[i]

            GetInfo(row.goodsId).then(res => {
              row.ean13List = res.unitList
              row.checked = false
              this.list.push(row)
            })
          }

          this.fileList = this.info.attachmentList
        }
      }
    }
  },
  methods: {
    download(row) {
      DownLoadFile(row.id).then(res => {
        const blob = new Blob([res], {
          type: ''
        })
        downloadFileWithBuffer(blob, row.fileName, 'application/vnd.ms-excel;charset=UTF-8')
      })
    },
    handleAvatarSuccess(res) {
      this.fileList.push(res)
    },
    handleRemove(res, val) {
      console.log(res, val)
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        } else if (index === 1 || index === 2 || index === 3 || index === 4) {
          return
        }
        const values = data.map(item => Number(item[column.property]))

        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return Math.round((prev + curr) * 100) / 100
            } else {
              return prev
            }
          }, 0)
          if (index == 6 || index == 5) {
            sums[index] += ''
          } else {
            sums[index] += ' 元'
          }
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    totalNum(index) {
      const amountMoney = Math.round(this.list[index].unitPrice * this.list[index].quantity * 100) / 100
      this.$set(this.list[index], 'amountMoney', isNaN(amountMoney) ? 0 : amountMoney)
    },
    /**
     * 选择部门
     */
    changeDepClick(data) {
      this.objs.typeId = data.id || {}
      this.objs.dutyUserName = data.dutyUserName
      this.objs.dutyUserId = data.dutyUserId
      this.objs.typeName = data.name
      // this.structureValue = data.id
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
    },
    typevalu(row, name) {
      if (name == 'gldj1') {
        this.list.push(row)
      } else
      if (name == 'goods') {
        GetInfo(row.id).then(res => {
          row.ean13List = res.unitList
          row.checked = false
          this.list[this.goodsIndex] = row
          this.$set(this.list, this.goodsIndex, row)
        })
      } else if (!row.number) {
        this.objs[name + 'Name'] = row.name
        this.objs[name + 'Id'] = row.id
      } else {
        this.objs[name + 'Number'] = row.number
        this.objs[name + 'Name'] = row.name
        this.objs[name + 'Id'] = row.id
      }
    },
    dialogSure(val) {
      let flag = false

      for (const i in this.objs) {
        if (i != 'remark' && !this.objs[i]) {
          flag = true
        }
      }
      if (!this.orderCategory || flag) {
        this.erroring = true
        this.$message.error('请填写红框的相应内容')
        return
      } else if (this.list.length == 0) {
        this.$message.error('请添加入库明细')
        return
      }
      const arr = []
      for (let i = 0; i < this.list.length; i++) {
        const d = this.list[i]
        if (!d.quantity || !d.unitPrice) {
          this.$message.error('数量，单价未填写')
          return
        }
        debugger
        arr.push({ goodsId: d.goodsId || d.id, goodsCode: d.code || d.goodsCode, unitId: d.unitId, unitPrice: d.unitPrice, quantity: d.quantity, amountMoney: d.amountMoney, DefaultUnitId: d.DefaultUnitId })
      }
      const obj = {
        order: {
          wareHouseId: this.objs.ckId,
          orderCategory: this.orderCategory,
          goodsCategoryId: this.objs.typeId,
          memoryCardId: this.objs.jfkhId,
          receiptDate: filterTimestampToFormatTime(new Date(this.time).getTime(), 'YYYY-MM-DD HH:mm:ss'),
          remark: this.objs.remark,
          identification: 0,
          companyId: this.objs.wldwId,
          flag: val,
          goodsCategoryDutyUserId: this.objs.dutyUserId
        },
        detaiList: arr,
        attachmentList: this.fileList.map(e => e.id)
      }
      if (this.info.order) {
        obj.order.orderNo = this.info.order.orderNo
        UpdateOrder(obj, this.info.order.id).then(res => {
          this.$message.success('修改成功')
          this.showDialog = false
          this.$emit('change', 0)
        })
      } else {
        CreateOrder(obj).then(res => {
          this.$message.success('新增成功')
          this.showDialog = false
          this.$emit('change', 0)
        })
      }
    },

    opende(val, item) {
      if (val == 'wldw') {
        this.placeholder = '请输入往来单位名称'
        this.typeling = !this.typeling
        this.url = '/api/zjlab/Company/CompanyPage'
        this.name = val
      } else if (val == 'ck') {
        this.placeholder = '请输入仓库名称'
        this.typeling = !this.typeling
        this.url = '/api/zjlab/Warehouse/WarehousePage'
        this.name = val
      } else if (val == 'type') {
        this.placeholder = '请输入货品类目名称'
        this.typeling = !this.typeling
        this.url = '/api/zjlab/GoodsInfo/GoodsInfoPage'
        this.name = val
      } else if (val == 'jfkh') {
        this.placeholder = '请输入经费卡号或经费名称'
        this.typeling = !this.typeling
        this.url = '/api/zjlab/MoneyCard/MoneyCardPage'
        this.name = val
      } else if (val == 'dutyUser') {
        this.placeholder = '请输入负责人名称'
        this.typeling = !this.typeling
        this.url = '/api/identity/users'
        this.name = val
      } else if (val == 'goods') {
        this.placeholder = '请输入货品名称'
        this.typeling = !this.typeling
        this.url = '/api/zjlab/GoodsInfo/GoodsInfoPage'
        this.name = val
        this.goodsIndex = item
      } else if (val == 'gldj1') {
        this.placeholder = '请输入单据号'
        this.typeling = !this.typeling
        this.url = '/api/zjlab/Order/OrderPage'
        this.name = val
        this.goodsIndex = item
      }
    },
    addpush() {
      this.list.push({ hover: false, checked: false })
      const isCheckedItems = this.list.filter(d => d.checked)
      if (isCheckedItems.length < this.list.length) {
        this.checkedAll = false
      } else {
        this.checkedAll = true
      }
    },
    dellist() {
      const arr = []
      this.list.forEach((e) => {
        if (!e.checked) {
          arr.push(e)
        }
      })
      this.list = arr
      console.log(arr)
    },
    /*
   * 当checkbox选择change时事件
   */
    /**
   * 全选
   */
    selectAll(e) {
      const isChecked = e
      if (isChecked) {
        this.list.forEach((item) => {
          item.checked = true
          this.isCheckedItems = 1
        })
      } else {
        this.list.forEach((item) => {
          item.checked = false
          this.isCheckedItems = 0
        })
      }
    },
    /** 列表操作 */
    /**
     * 当某一行被点击时会触发该事件
     */
    /*
   * 当checkbox选择change时事件
   */
    onItemCheckboxChange() {
      this.obj = {}
      const isCheckedItems = this.list.filter(d => d.checked)
      this.isCheckedItems = isCheckedItems.length
      if (isCheckedItems.length < this.list.length) {
        this.checkedAll = false
      } else {
        this.checkedAll = true
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.fileList-order{
  display: flex;
      padding: 0px 20px;
  .fileList-order-content{
    flex:1

  }
}
.wy-body{
     border-bottom: 1px solid #d9d9d9;
     .changers{
      position: relative;
     }

.wy-body-detailed{
   border: 1px solid #d9d9d9;
   .wy-body-detailed-ed{
    padding: 16px 16px;
    padding-bottom: 0px;
    margin: 0px;
   }
   p{
    padding: 16px 16px;
       border-bottom: 1px solid #d9d9d9;
   }
}
.wy-body-info{
 .wy-body-info-one{
  display: flex;
     border: 1px solid #d9d9d9;
        min-height: 37px;
        line-height: 37px;
        border-bottom:0px ;
  >div{
    flex: 1;
    border-right: 1px solid #d9d9d9;
    display: flex;
    .field__label{
          background: rgb(240, 240, 240);
          min-width: 120px;
          padding-left: 16px;
          border-right: 1px solid #d9d9d9;
    }
    .wy-body-info-one-left-val{
      flex:1;
      padding-left: 10px;
      .el-select{
        width: 100%;

        /deep/ input{
          border: 0px;
          padding-left: 0px;
        }
      }
    }
  }
  >div.wy-body-info-one-right{
    border: 0px;
  }
 }
}
}
</style>
<style>
.errorshow{
  border: 1px solid red !important;
}
.bill .el-dialog__header{
        text-align: center;

}
.bill .el-dialog__body{
  padding-bottom: 10px;
}
.bill .el-dialog__footer{
 text-align: center
}
.wy-select.el-select-dropdown__item{
      padding: 0 20px;
}
.wy-select1.el-select-dropdown__item{
      height: 100%;
    padding: 0px
}
.orderput .el-textarea__inner{
  border: 0px;
}
.wy-body-info-one-left-val .el-upload-dragger{
height: 42px;
    border: 0px;
    text-align: left;
        margin-top: 7px;
}
</style>
