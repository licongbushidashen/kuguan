<template>
  <el-dialog :visible.sync="shows" :close-on-click-modal="false" title="上级目录" append-to-body>
    <div>
      <el-input v-model="keywords" style="margin-bottom:20px">
        <el-button slot="append" icon="el-icon-search" @click="changes"/>
      </el-input>
      <el-tree
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
            {{ data.specificLocation }}
          </div>

        </flexbox>
      </el-tree>
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
    }
  },
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
      keywords: '',
      checkedNodes: {}
    }
  },
  methods: {
    dialogSure() {
      if (this.checkedKeys) {
        this.$emit('changev', this.checkedKeys)
      } else {
        this.$message.error('未选择上级目录')
      }
    },
    changes() {
      if (this.keywords != '') {
        GetKeySpacePointTree(this.keywords).then(response => {
          response.forEach(e => {
            e.hasChild = !e.hasChild
          })
          this.node_had.childNodes = []
          this.resolve_had(response || [])
          this.showDepData = response || []
          this.depLoading = false
        })
      } else {
        this.node_had.level = 0
        this.node_had.childNodes = []
        this.getDepTreeList(this.node_had, this.resolve_had)
      }
    },
    changcheck(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
      this.$refs.ntree.setCheckedKeys([])
      this.$nextTick(() => {
        this.$refs.ntree.setCheckedKeys([checkedNodes.id])
      })
      this.checkedKeys = checkedNodes
      console.log(this.checkedKeys)
    },
    // 获取树形列表
    getDepTreeList(node, resolve) {
      this.depLoading = true
      const data = node.level === 0 ? {} : { parentId: node.data.id }
      GetSpacePointTree(data)
        .then(response => {
          this.node_had = node
          this.resolve_had = resolve
          response.forEach(e => {
            e.hasChild = !e.hasChild
          })
          console.log(this.aoiinfo)
          if (node.level === 0) {
            this.aoiinfo == response ? response[0] : { flag: 1 }
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
