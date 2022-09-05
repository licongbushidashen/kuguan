export default {
  data() {
    return {
      pageSizes: [15, 30, 60, 100]
    }
  },
  methods: {
    /**
     * 更改每页展示数量
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentChange(0)
    },
    handleCurrentChange(val) {
      this.morecondition = false
      const x = val > 0 ? val - 1 : 0
      this.currentPage = x ? x * this.pageSize : x
      this.getList()
    }
  }
}
