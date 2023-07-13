<template>
  <el-dialog :visible.sync="shows" :close-on-click-modal="false" :append-to-body="true" :before-close="handleClose" title="上级点位" >
    <div class="grounds">
      <div >
        <el-input v-model="keywords" style="margin-bottom:20px">
          <el-button slot="append" icon="el-icon-search" @click="changes"/>
        </el-input>
        <div class="left-grounds">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item,index) in listName" :key="index"><a href="javascript:;" @click="getDepTreeList(item.id==''?null:item,index)">{{ item.specificLocation }}</a></el-breadcrumb-item>
          </el-breadcrumb>
          <div class="wk-user-select__list">
            <flexbox
              v-for="(item, index) in showDataList"
              :key="index"
              class="wk-user-select__item">
              <div>
                <el-checkbox
                  v-model="item.checked"
                  @change="onchecked(index)"
                />
                <div class="dep-name text-one-line">{{ item.specificLocation }}</div>
              </div>
              <template>
                <el-button
                  v-if="item.hasChild"
                  type="text"
                  icon="wk wk-icon-structure"
                  @click="getDepTreeList(item)">下级</el-button>
              </template>
            </flexbox>
          </div>
        </div>
      </div>
      <div>
        <div class="right-grounds">
          <el-tag v-if="item.id" style="margin-left:20px">{{ item.specificLocation }}</el-tag>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('onshow')">取消</el-button>
      <el-button type="primary" @click="dialogSure">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  GetKeySpacePointTree,
  GetSpacePointTree

} from '@/api/account'
export default {
  props: {
    shows: {
      type: Boolean
    },
    pointobj: {
      type: Object
    }
  },
  data() {
    return {
      listName: [{ specificLocation: '全部', id: '' }],
      depLoading: false,
      keywords: '',
      showDataList: '',
      item: '',
      pointobjs: {}
    }
  },
  mounted() {
    this.pointobjs = JSON.parse(JSON.stringify(this.pointobj))
    this.getDepTreeList()
  },
  methods: {
    handleClose() {
      this.$emit('onshow')
    },
    onchecked(val) {
      debugger
      this.showDataList.forEach((e, index) => {
        if (e.checked && val != index) {
          e.checked = false
        }
        if (val == undefined) {
          e.checked = false
        }
        if (this.pointobjs && this.pointobjs.parentId == e.id) {
          e.checked = true
          this.pointobjs = null
        }
      })
      debugger
      let item = this.showDataList.filter(e => e.checked)
      if (item.length == 0 && this.pointobjs) {
        item = [{ specificLocation: this.pointobjs.parentName, id: this.pointobjs.parentId }]
        item = JSON.parse(JSON.stringify(item))
      }
      this.item = item.length > 0 ? item[0] : {}
    },
    dialogSure() {
      if (this.item.id) {
        this.$emit('changev', this.item)
      } else {
        this.$message.error('未选择上级类目')
      }
    },
    changes() {
      if (this.keywords != '') {
        GetKeySpacePointTree(this.keywords).then(response => {
          this.listName = [{ specificLocation: '全部', id: '' }]
          this.showDataList = response || []
          this.depLoading = false
        })
      } else {
        this.getDepTreeList()
      }
    },

    // 获取树形列表
    getDepTreeList(item, index) {
      if (!item) {
        this.listName = [{ specificLocation: '全部', id: '' }]
      } else if (index != 0) {
        if (this.listName.length > index) {
          this.listName.splice(index + 1, this.listName.length - index + 1)
        } else {
          this.listName.push({ specificLocation: item.specificLocation, id: item.id })
        }
      }
      this.depLoading = true
      const data = item ? { parentId: item.id } : {}
      GetSpacePointTree(data)
        .then(response => {
          this.showDataList = response || []
          this.depLoading = false
          this.onchecked()
        })
        .catch(() => {
          this.depLoading = false
        })
    }

  }
}
</script>
  <!-- <el-tree
        v-loading="depLoading"
        ref="ntree"
        :props="props"
        :load="getDepTreeList"
        lazy
        node-key="id"
        highlight-current
        show-checkbox
        check-strictly

        @check="changcheck"
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
      </el-tree> -->
<style lang="scss" scoped>
/deep/.el-breadcrumb{
  margin-bottom: 10px;
}
.grounds{
  display: flex;
  >div{
    flex: 1;
  }
  .vux-flex-row{
        min-height: 30px;
    >div{
      flex:1;
      .text-one-line{
        display: inline-block;
    vertical-align: sub;
      }
    }
  }
}
.right-grounds{
     border-left: 1px solid #e6e6e6 !important;
    margin: 0px 40px;
    height: 100%;
}
.left-grounds{
      height: 350px;
    overflow: auto;
}
</style>
