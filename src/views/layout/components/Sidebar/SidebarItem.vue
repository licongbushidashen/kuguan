<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren)
      "
    >
      <el-tooltip
        :disabled="!collapse"
        :content="onlyOneChild.meta.title"
        effect="dark"
        placement="right"
      >
        <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
          <el-menu-item
            :index="resolvePath(onlyOneChild.path)"
            :class="{
              'is-select': activeMenu == resolvePath(onlyOneChild.path)
            }"
          >
            <item
              :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
              :title="onlyOneChild.meta.title"
              :num="onlyOneChild.meta.num"
              :count="onlyOneChild.count"
              :collapse="collapse"
            />
          </el-menu-item>
        </app-link>
      </el-tooltip>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      :class="{ 'is-select': activeMenu == resolvePath(item.path) }"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
          :num="item.meta.num"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        :active-menu="activeMenu"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    },
    activeMenu: String,
    collapse: Boolean
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './variables.scss';
.el-menu--collapse{
  .menu-wrapper .el-menu-item{
    padding-left: 13px !important;
  }
  .menu-wrapper /deep/.el-menu-item.is-active > div .el-badge{
        right: 13px !important;
    top: -2px !important;
      }

  .menu-wrapper /deep/.el-menu-item> div .el-badge{
        right: 13px !important;
    top: -2px !important;
      }
 .menu-wrapper .el-submenu /deep/.el-submenu__title{

      padding-left: 13px !important;

  }
  .menu-wrapper .el-menu-item.is-active{

    margin-left: 14px !important;
    margin-right: 14px !important;
    >div{
      padding-left: 9px !important;
    border-radius: 4px !important;
    }
  }
}
.menu-wrapper.nest-menu .el-menu-item.is-active>div{
  background-color :#fff !important;
      padding-left: 51px !important;
      border-radius: 0px !important;
}
.menu-wrapper {
  /deep/.el-badge{
        right: 40px !important;
    top: 5px !important;
      }

  /deep/.el-menu-item.is-active{
  color: rgba(0, 0, 0, 0.85) !important;
    margin: 0px !important;
    padding: 0px !important;
    background: rgb(0, 21, 41) !important;

    .el-submenu__title+ul>div{
      background-color :#fff !important;
      padding-left: 51px !important;
      border-radius: 0px !important;
    }
    >div{
      background-color :#fff !important;
      padding-left: 31px !important;
      border-radius: 0px !important;
      >span{
        color: #000000d9 !important;
      }
      >i{
        color: #000000d9 !important;
      }
      .el-badge{
        right: 54px !important;
    top: 5px !important;
      }
    }
}
  /deep/ .el-submenu__title {
    height: auto;
    line-height: normal;

  }

  /deep/ .el-submenu.is-active {
    .el-submenu__title {
      span,
      i:first-child {
        color: white;
      }
    }
  }
}

.el-menu-item {
  height: auto;
  line-height: normal;
  padding: 0 14px;
  background-color: #001529 !important;
  color: #bebec0;
}

.el-menu-item:not(.is-select) {
  color: $menuText !important;
}

// element自带的有问题 is-active 换成 is-select
.el-menu-item.is-select {
  .menu-item-content {
    background-color: #2362fb !important;
    color: white !important;
    /deep/ i {
      color: white !important;
    }
  }
}

.el-menu-item:hover {
  .menu-item-content {
    background-color: rgba($color: #fff, $alpha: 0.1);
    color: white;
    /deep/ i {
      color: white !important;
    }
  }
}
</style>
