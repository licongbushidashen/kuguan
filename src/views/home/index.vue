<template>
  <div class="home-main" style="padding:15px">
    <div class="tops">
      <div>
        <h1 class="color1" @click="routerpush(1)">{{ d.waringNum }}</h1>
        <span @click="routerpush(1)">库存预警</span>
      </div>
      <div>
        <h1 class="color2" @click="routerpush(2)">{{ d.inOrderNum }}</h1>
        <span @click="routerpush(2)">今日入库单据数</span>
      </div>
      <div>
        <h1 class="color3" @click="routerpush(2)">{{ d.inOrderAmount }}</h1>
        <span @click="routerpush(2)">今日入库总金额</span>
      </div>
      <div>
        <h1 class="color4" @click="routerpush(3)">{{ d.outOrderNum }}</h1>
        <span @click="routerpush(3)">今日出库单据数</span>
      </div>
      <div>
        <h1 class="color5" @click="routerpush(3)">{{ d.outOrderAmount }}</h1>
        <span @click="routerpush(3)">今日出库总金额</span>
      </div>
      <div>
        <h1 class="color6">{{ d.inventoryAmount }}</h1>
        <span>今日库存总金额</span>
      </div>
    </div>
    <div class="home-content">
      <div class="seacrh">
        <el-select v-model="os" style="margin-right:20px" @change="GetDataBoradChart">
          <el-option v-for="(item ,i ) in o" :key="i" :label="item.name" :value="item.id" />
        </el-select>
        <el-date-picker
          v-model="time"
          :picker-options="pickerOptions"
          type="monthrange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="GetDataBoradChart"/>
      </div>

      <div class="echart1">
        <div v-show="!echartHasData1" id="axismain1" />
        <el-empty v-show="echartHasData1" image-size="10%"/>
      </div>
      <div class="echart2" >
        <div>
          <div v-show="!echartHasData2" id="axismain2"/>
          <el-empty v-show="echartHasData1" image-size="10%"/>
        </div>
        <div>
          <div v-show="!echartHasData3" id="axismain3"/>
          <el-empty v-show="echartHasData1" image-size="10%"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const option = {

  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  grid: {
    left: '20px',
    right: '20px',
    bottom: '0%',
    top: '50px',
    containLabel: true
  },
  legend: {
    data: ['出库', '入库', '库存'],
    right: '20px',
    top: '0px',
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
    axisLine: {
      lineStyle: {
        color: '#fff'
      }
    },
    splitLine: {
      show: false,
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
    barWidth: '15px',
    itemStyle: {
      normal: {
        color: '#063AC0'

      }
    },
    data: []
  },
  {
    name: '入库',
    type: 'bar',
    barWidth: '15px',
    itemStyle: {
      normal: {
        color: '#2FA86B'

      }

    },
    data: []
  },

  {
    name: '库存',
    type: 'line',
    barWidth: '15%',
    smooth: true,
    itemStyle: {
      normal: {
        color: '#2FA86B'

      }
    },
    data: []
  }
  ]
}

import echarts from 'echarts'
import {
  GetGoodsCategoryTreeHasRole
} from '@/api/kchk/goods'
import request from '@/utils/request'
export default {
  data() {
    return {
      os: '全部',
      time: [],
      pickerOptions: {
        shortcuts: [{
          text: '当前月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 4)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 5)
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
      chartObj3: {},
      echartHasData1: false,
      echartHasData2: false,
      echartHasData3: false
    }
  },

  created() {
    const start = new Date()
    start.setMonth(start.getMonth() - 5)
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
    routerpush(val) {
      if (val == 1) {
        this.$router.push('/handle/warn')
      } else if (val == 2) {
        this.$router.push({
          name: 'kcgj-put',
          params: {
            time: 1
          }
        })
      } else if (val == 3) {
        this.$router.push({
          name: 'kcgj-out',
          params: {
            time: 1
          }
        })
      }
    },
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
      GetGoodsCategoryTreeHasRole()
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
    gett(date, data) {
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
      return Y + M
    },
    GetDataBoradChart() {
      const data = { 'catetoryId': this.os == '全部' ? null : this.os, 'beginMonth': this.getTime(this.time[0]), 'endMonth': this.getTime(this.time[1]) }
      request({
        url: '/api/zjlab/DataBoard/GetDataBoradChart',
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        debugger
        if (res.inventoryNumDto.length) {
          const arr1 = []; const arr2 = []; const arr3 = []; const time = []
          let time1 = this.gett(this.time[0])
          const time2 = this.gett(this.time[1])

          while (time1 != time2) {
            arr1.push(0)
            arr2.push(0)
            arr3.push(0)
            time.push(time1)
            const char = time1.split('-')
            let m = Number(char[1]) + 1
            let y = Number(char[0])
            if (m > 12) {
              y = Number(y) + 1
            }
            m = m > 12 ? m - 12 : m
            time1 = y + '-' + (Number(m) < 10 ? '0' + Number(m) : Number(m))
          }
          arr1.push(0)
          arr2.push(0)
          arr3.push(0)
          time.push(time2)
          // res.inventoryNumDto= res.inventoryNumDto.
          for (let i = 0; i < res.inventoryNumDto.length; i++) {
            const data = res.inventoryNumDto[i]
            time.forEach((e, index) => {
              if (e == data.month) {
                arr1[index] = data.outNum
                arr2[index] = data.inNum
                arr3[index] = data.inventory
              }
            })
          }
          const option1 = JSON.parse(JSON.stringify(option))
          option1.xAxis.data = time
          option1.title = {
            text: '易耗品库存量',
            textStyle: {
              align: 'center',
              color: '#333',
              fontSize: 15,
              fontWeight: '500'
            },
            top: '0px',
            left: 'left'
          }
          option1.series[0].data = arr1
          option1.series[1].data = arr2
          option1.series[2].data = arr3

          this.chartObj1.setOption(option1, true)
        }
        this.echartHasData1 = !(res.inventoryNumDto.length > 0)
        this.echartHasData2 = !(res.expendNumDto.length > 0)
        this.echartHasData3 = !(res.expendCostDto.length > 0)
        if (res.expendNumDto.length) {
          const arr1 = []; const arr2 = []; const time = []
          let time1 = this.gett(this.time[0])
          const time2 = this.gett(this.time[1])

          while (time1 != time2) {
            arr1.push(0)
            arr2.push(0)
            time.push(time1)
            const char = time1.split('-')
            let m = Number(char[1]) + 1
            let y = Number(char[0])
            if (m > 12) {
              y = Number(y) + 1
            }
            m = m > 12 ? m - 12 : m
            time1 = y + '-' + (Number(m) < 10 ? '0' + Number(m) : Number(m))
          }
          arr1.push(0)
          arr2.push(0)
          time.push(time2)
          for (let i = 0; i < res.expendNumDto.length; i++) {
            const data = res.expendNumDto[i]
            time.forEach((e, index) => {
              if (e == data.month) {
                arr1[index] = data.totalExpend
                arr2[index] = data.perExpend
              }
            })
          }
          const option1 = JSON.parse(JSON.stringify(option))
          option1.legend.data = ['总消耗', '人均消耗']
          option1.series = [
            {
              name: '总消耗',
              type: 'bar',
              barWidth: '15px',
              itemStyle: {
                normal: {
                  color: '#063AC0'

                }
              },
              data: []
            }, {
              name: '人均消耗',
              type: 'line',
              barWidth: '15px',
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#2FA86B'

                }
              },
              data: []
            }
          ]
          option1.title = {
            text: '易耗品消耗量',
            textStyle: {
              align: 'center',
              color: '#333',
              fontSize: 15,
              fontWeight: '500'
            },
            top: '0px',
            left: 'left'
          }
          debugger
          option1.xAxis.data = time
          option1.series[0].data = arr1
          option1.series[1].data = arr2
          this.chartObj2.setOption(option1, true)
        }
        if (res.expendCostDto.length) {
          const arr1 = []; const arr2 = []; const time = []
          let time1 = this.gett(this.time[0])
          const time2 = this.gett(this.time[1])

          while (time1 != time2) {
            arr1.push(0)
            arr2.push(0)
            time.push(time1)
            const char = time1.split('-')
            let m = Number(char[1]) + 1
            let y = Number(char[0])
            if (m > 12) {
              y = Number(y) + 1
            }
            m = m > 12 ? m - 12 : m
            time1 = y + '-' + (Number(m) < 10 ? '0' + Number(m) : Number(m))
          }
          arr1.push(0)
          arr2.push(0)
          time.push(time2)
          for (let i = 0; i < res.expendCostDto.length; i++) {
            const data = res.expendCostDto[i]
            time.forEach((e, index) => {
              if (e == data.month) {
                arr1[index] = data.totalCost
                arr2[index] = data.perCost
              }
            })
          }
          const option1 = JSON.parse(JSON.stringify(option))
          option1.legend.data = ['总费用', '人均费用']
          option1.series = [
            {
              name: '总费用',
              type: 'bar',
              barWidth: '15px',
              itemStyle: {
                normal: {
                  color: '#063AC0'

                }
              },
              data: []
            }, {
              name: '人均费用',
              type: 'line',
              barWidth: '15px',
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#2FA86B'

                }
              },
              data: []
            }
          ]

          option1.title = {
            text: '易耗品消耗费用',
            textStyle: {
              align: 'center',
              color: '#333',
              fontSize: 15,
              fontWeight: '500'
            },
            top: '0px',
            left: 'left'
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
/deep/.el-empty__image{
  width: 10% !important;
}
#axismain1,#axismain2,#axismain3{
    width: 100%;
    height: 100%;
}
.echart2,.echart1{
    height: 44%;

}
.echart1{
    margin: 16px 0px;
    background-color: #fff;
    border-radius: 4px;
    padding: 20px 12px 20px 16px;
    border: 1px solid #e6e6e6;
}
.echart2{
    display: flex;
    >div:first-child{
      margin-right: 10px;
    }
    >div:last-child{
      margin-left: 10px;
    }
    >div{
       flex:1;
    background-color: #fff;
    border-radius: 4px;
    padding: 20px 12px 10px 16px;
    border: 1px solid #e6e6e6;
    }
}
.home-content{
height: 100%;
.seacrh{
margin-top: 15px;
    display: flex;
    justify-content: flex-start;
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
    // padding: 20px;
     height: calc(100% - 119px);
    padding-top: 15px;
}

.tops {
    width: 100%;
    height: 120px;
    display: flex;
    background: #fff;
    border: 1px solid #efefef;
    border-radius: 4px;
      padding: 10px 0px;
span{
  font-size: 15px;
}
    >div {
        flex: 1;
        text-align: center;
        padding: 0px 0px;
    border-left: 1px solid #efefef;
        h1 {
            margin: 10px 0px;
            margin-top: 17px;
        }
    }
}
</style>
