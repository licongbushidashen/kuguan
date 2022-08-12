<template>
  <el-dialog
    v-loading="loading"
    :visible="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    title="关联用户"
    width="600px"
    @close="handleCancel">
    <div class="handle-box">
      <flexbox
        class="handle-item"
        align="stretch">
        <div
          class="handle-item-name"
          style="margin-top: 8px;">选择用户：</div>
          <!-- <wk-user-select
          :radio="false"
          v-model="selectUsers"
          :show-dep-data="showDepData"
          class="handle-item-content"
          @change="depchange"/> -->

      </flexbox>
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click.native="handleCancel">取消</el-button>
      <el-button
        type="primary"
        @click.native="handleConfirm">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { adminRoleRelatedUserAPI } from '@/api/admin/role'
// import WkUserSelect from '../../amt/components/WkUserSelect.vue'
import WkUserSelect from '@/components/NewCom/WkUserSelect'

export default {
  /** 关联员工*/
  name: 'RelateEmpoyee',
  components: {
    WkUserSelect
  },
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    roleId: [Number, String],
    showDepData: Array
  },
  data() {
    return {
      loading: true,
      selectUsers: []
    }
  },
  computed: {},
  watch: {
    visible(val) {
      if (val) {
        this.selectUsers = []
      }
    }
  },
  mounted() {},
  methods: {
    /**
     * 取消选择
     */
    handleCancel() {
      this.$emit('update:visible', false)
    },

    /**
     * 点击确定
     */
    handleConfirm() {
      if (this.selectUsers.length == 0) {
        this.$message.error('请选择用户')
      } else {
        adminRoleRelatedUserAPI({
          userIds: this.selectUsers,
          roleIds: [this.roleId]
        })
          .then(res => {
            this.$message.success('操作成功')
            this.$emit('save')
          })
          .catch(() => {})
      }
    },
    depchange(data) {
      console.log(data)
      this.selectUsers = JSON.parse(JSON.stringify(data))
    }
  }
}
</script>

<style lang="scss" scoped>
.handle-box {
  color: #333;
  font-size: 12px;
}
.handle-item {
  padding-bottom: 15px;
  .handle-item-name {
    flex-shrink: 0;
    width: 90px;
  }
  .handle-item-content {
    flex: 1;
  }
}
.handle-bar {
  position: relative;
  margin-top: 10px;
  height: 30px;
  button {
    float: right;
    margin-right: 10px;
  }
}
</style>
