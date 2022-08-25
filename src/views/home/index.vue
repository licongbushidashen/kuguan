<template>
  <div class="home-main">
    <div class="tops">
      <div>
        <h1 class="color1">{{ d.waringNum }}</h1>
        <span>库存预警</span>
      </div>
      <div>
        <h1 class="color2">{{ d.inOrderNum }}</h1>
        <span>今日入库单据数</span>
      </div>
      <div>
        <h1 class="color3">{{ d.inOrderAmount }}</h1>
        <span>今日入库总金额</span>
      </div>
      <div>
        <h1 class="color4">{{ d.outOrderNum }}</h1>
        <span>进入出库单据数</span>
      </div>
      <div>
        <h1 class="color5">{{ d.outOrderAmount }}</h1>
        <span>进入出库总金额</span>
      </div>
      <div>
        <h1 class="color6">{{ d.inventoryAmount }}</h1>
        <span>今日库存总金额</span>
      </div>
    </div>
    <div class="home-content">
      <div class="seacrh">
        <el-select v-model="os" style="margin-right:20px" @change="GetDataBoradChart">
          <el-option v-for="(item ,i ) in o" :key="i" :label="item.name" :value="item.name" />
        </el-select>
        <el-date-picker
          v-model="time"
          :picker-options="pickerOptions"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="GetDataBoradChart"/>
      </div>

      <div class="echart1">
        <div id="axismain1"/>
        <!-- <span v-if="!echartHasData" class="empty-text">暂无数据</span> -->
      </div>
      <div class="echart2">
        <div>
          <div id="axismain2"/>
          <!-- <span v-if="!echartHasData" class="empty-text">暂无数据</span> -->
        </div>
        <div>
          <div id="axismain3"/>
          <!-- <span v-if="!echartHasData" class="empty-text">暂无数据</span> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const option = {
  backgroundColor: '#fff',
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  grid: {
    left: '2%',
    right: '4%',
    bottom: '5%',
    top: '16%',
    containLabel: true
  },
  legend: {
    data: ['出库', '入库', '库存'],
    left: '20px',
    top: 0,
    icon: 'path://M0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z',
    textStyle: {
      color: '#333'
    },
    itemWidth: 10,
    itemHeight: 10
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0,0,0,0.5)'
      }
    },
    axisTick: {
      show: true,
      alignWithLabel: true
    }
  },
  yAxis: {
    type: 'value',
    max: '1200',
    axisLine: {
      lineStyle: {
        color: '#fff'
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#f1f1f1'
      }
    },
    axisLabel: {
      color: '#999',
      textStyle: {
        fontSize: 12
      }
    },
    axisTick: {
      show: true,
      alignWithLabel: true
    }
  },
  series: [{
    name: '出库',
    type: 'bar',
    barWidth: '15%',
    itemStyle: {
      normal: {
        color: '#9C9AFF',
        barBorderRadius: [12, 12, 0, 0]
      }
    },
    data: [400, 400, 300, 300, 300, 400, 400, 400, 300]
  },
  {
    name: '入库',
    type: 'bar',
    barWidth: '15%',
    itemStyle: {
      normal: {
        color: '#FC8B62',
        barBorderRadius: [12, 12, 0, 0]
      }

    },
    data: [400, 500, 500, 500, 500, 400, 400, 500, 500]
  },

  {
    name: '库存',
    type: 'line',
    barWidth: '15%',
    smooth: true,
    itemStyle: {
      normal: {
        color: '#FFCA71',
        barBorderRadius: [12, 12, 0, 0]
      }
    },
    data: [400, 600, 700, 700, 1000, 400, 400, 600, 700]
  }
  ]
}

import echarts from 'echarts'
import {
  GetGoodsCategoryTree
} from '@/api/kchk/category'
import request from '@/utils/request'
export default {
  data() {
    return {
      os: '全部',
      time: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      o: [],
      d: {
        'waringNum': 0,
        'inOrderNum': 0,
        'inOrderAmount': 0,
        'outOrderNum': 0,
        'outOrderAmount': 0,
        'inventoryAmount': 0
      },
      chartObj1: {},
      chartObj2: {},
      chartObj3: {}
    }
  },
  created() {
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
    this.time = [start, new Date()]
    this.GetGoodsCategoryTree()
    this.GetTadayData()
    this.GetDataBoradChart()
  },
  mounted() {
    this.chartObj1 = echarts.init(document.getElementById('axismain1'))
    this.chartObj2 = echarts.init(document.getElementById('axismain2'))
    this.chartObj3 = echarts.init(document.getElementById('axismain3'))

    this.chartObj2.setOption(option, true)
    this.chartObj3.setOption(option, true)
  },
  methods: {
    GetTadayData() {
      request({
        url: '/api/zjlab/DataBoard/GetTadayData',
        method: 'get',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        this.d = res
      })
    },
    GetGoodsCategoryTree() {
      GetGoodsCategoryTree({})
        .then(response => {
          this.o = response
          this.o.unshift({ name: '全部', value: '全部' })
        })
    },
    getTime(t) {
      const date = new Date(t)
      const d = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      const H = date.getHours() <= 9 ? '0' + date.getHours() : date.getHours()
      const m1 = date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()
      const S = date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds()
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const D = d + ' '
      const h = H + ':'
      const m = m1 + ':'
      const s = S
      return Y + M + D + h + m + s
    },
    GetDataBoradChart() {
      console.log(this.getTime(this.time[0]))
      const data = { 'catetoryName': this.os == '全部' ? '' : this.os, 'beginMonth': this.getTime(this.time[0]), 'endMonth': this.getTime(this.time[1]) }
      request({
        url: '/api/zjlab/DataBoard/GetDataBoradChart',
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        if (res.inventoryNumDto.length) {
          const arr1 = []; const arr2 = []; const arr3 = []; const time = []
          for (let i = 0; i < res.inventoryNumDto.length; i++) {
            const data = res.inventoryNumDto[i]
            arr1.push(data.inNum)
            arr2.push(data.outNum)
            arr3.push(data.inventory)
            time.push(data.month)
          }
          const option1 = JSON.parse(JSON.stringify(option))
          option1.xAxis.data = time
          option1.title = {
            text: '易耗品库存量',
            textStyle: {
              align: 'center',
              color: '#666',
              fontSize: 16
            },
            top: '0',
            left: 'center'
          }
          option1.series[0].data = arr1
          option1.series[1].data = arr2
          option1.series[2].data = arr3

          this.chartObj1.setOption(option1, true)
        }
        if (res.expendNumDto.length) {
          const arr1 = []; const arr2 = []; const time = []
          for (let i = 0; i < res.expendNumDto.length; i++) {
            const data = res.expendNumDto[i]
            arr1.push(data.totalExpend)
            arr2.push(data.perExpend)
            time.push(data.month)
          }
          const option1 = JSON.parse(JSON.stringify(option))
          option1.legend.data = ['总消耗', '人均消耗']
          option1.series = [
            {
              name: '总消耗',
              type: 'bar',
              barWidth: '15%',
              itemStyle: {
                normal: {
                  color: '#9C9AFF',
                  barBorderRadius: [12, 12, 0, 0]
                }
              },
              data: []
            }, {
              name: '人均消耗',
              type: 'line',
              barWidth: '15%',
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#FFCA71',
                  barBorderRadius: [12, 12, 0, 0]
                }
              },
              data: []
            }
          ]
          option1.title = {
            text: '易耗品消耗量',
            textStyle: {
              align: 'center',
              color: '#666',
              fontSize: 16
            },
            top: '0',
            left: 'center'
          }
          option1.xAxis.data = time
          option1.series[0].data = arr1
          option1.series[1].data = arr2
          this.chartObj2.setOption(option1, true)
        }
        if (res.expendCostDto.length) {
          const arr1 = []; const arr2 = []; const time = []
          for (let i = 0; i < res.expendCostDto.length; i++) {
            const data = res.expendCostDto[i]
            arr1.push(data.totalCost)
            arr2.push(data.perCost)
            time.push(data.month)
          }
          const option1 = JSON.parse(JSON.stringify(option))
          option1.legend.data = ['总费用', '人均费用']
          option1.series = [
            {
              name: '总费用',
              type: 'bar',
              barWidth: '15%',
              itemStyle: {
                normal: {
                  color: '#9C9AFF',
                  barBorderRadius: [12, 12, 0, 0]
                }
              },
              data: []
            }, {
              name: '人均费用',
              type: 'line',
              barWidth: '15%',
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#FFCA71',
                  barBorderRadius: [12, 12, 0, 0]
                }
              },
              data: []
            }
          ]

          option1.title = {
            text: '易耗品消耗费用',
            textStyle: {
              align: 'center',
              color: '#666',
              fontSize: 16
            },
            top: '0',
            left: 'center'
          }
          option1.xAxis.data = time
          option1.series[0].data = arr1
          option1.series[1].data = arr2
          this.chartObj3.setOption(option1, true)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#axismain1,#axismain2,#axismain3{
    width: 100%;
    height: 100%;
}
.echart2,.echart1{
    height: 45%;
}
.echart2{
    display: flex;
    >div{
       flex:1
    }
}
.home-content{
height: 100%;
.seacrh{
    padding: 20px;
    background: #fff;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
    }
}
.color1{
    color: red;
}
.color2,.color3{
    color: #2362FB;
}
.color4,.color5{
    color: #67c23a;
}
.color6{
    color:#999
}
.home-main {
    padding: 20px;
        height: calc(100% - 91px);
}

.tops {
    width: 100%;
    height: 100px;
    display: flex;
    background: #fff;
    border: 1px solid #efefef;
    border-radius: 4px;
      padding: 10px 0px;

    >div {
        flex: 1;
        text-align: center;
        padding: 0px 0px;
    border-left: 1px solid #efefef;
        h1 {
            margin: 10px 0px;

        }
    }
}
</style>
