import { PropType, computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import * as echarts from 'echarts'
import { EChartsOption } from 'echarts'
// import { EChartsType } from 'echarts/core'
// import echarts from './config'
import { throttle } from 'pear-common-utils'
import useSystemStore from '@/store/modules/system'

export default defineComponent({
  name: 'ECharts',
  props: {
    options: {
      type: Object as PropType<EChartsOption>,
      default: () => ({})
    }
  },
  setup(props) {
    let chart: echarts.ECharts
    const chartRef = ref()
    const isCollapse = computed(() => systemStore.sideBar.isCollapse)
    const systemStore = useSystemStore()
    const { mainMaximize } = storeToRefs(systemStore)

    const updateChart = () => {
      if (!chart) return
      chart.clear()
      chart.setOption(props.options)
    }

    const resizeChart = throttle(() => {
      if (!chart) return
      chart.resize()
    }, 200)

    window.addEventListener('resize', resizeChart)

    watch(mainMaximize, resizeChart)

    watch(isCollapse, () => {
      setTimeout(resizeChart, 300)
    })

    watch(
      () => props.options,
      () => {
        updateChart()
      },
      {
        immediate: true,
        deep: true
      }
    )

    onMounted(() => {
      chart = echarts.init(chartRef.value)
      chart.setOption(props.options)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeChart)
    })

    return {
      chartRef
    }
  },
  render() {
    return h('div', { class: 'chart w-full h-full', ref: el => (this.chartRef = el) })
  }
})
