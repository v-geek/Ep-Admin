<template>
  <div>
    <el-cascader :props="casProps" v-model="checkData" @change="onChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, CascaderProps, CascaderOption } from 'element-plus'
import { getOrganization } from '@/api/modules/common'

defineOptions({
  name: 'areaCascader'
})

interface IParams {
  level: number
  pcode?: string
}

const emit = defineEmits(['change'])

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  provinceKey: {
    type: String,
    default: 'provinceCode'
  },
  cityKey: {
    type: String,
    default: 'cityCode'
  },
  countyKey: {
    type: String,
    default: 'countyCode'
  }
})

const checkData = ref([])

/**
 * 编辑时数据回填
 */
watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    const { provinceKey, cityKey, countyKey } = props

    if (
      newVal &&
      Object.keys(newVal).length &&
      !oldVal &&
      newVal[provinceKey] &&
      newVal[cityKey] &&
      newVal[countyKey]
    ) {
      checkData.value = [newVal[provinceKey], newVal[cityKey], newVal[countyKey]]
    }
  },
  {
    immediate: true
  }
)

const casProps: CascaderProps = {
  lazy: true,
  async lazyLoad(node, resolve) {
    const { level } = node
    const params = { level } as IParams

    console.log('node', node)

    if (level >= 1) {
      params.pcode = node.value as string
    }

    const provinceNodes = await getNodes(params)

    resolve(provinceNodes)
  }
}

function getNodes(params: IParams): Promise<CascaderOption[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { code, data, msg } = await getOrganization(params)

      if (!String(code).startsWith('2')) {
        ElMessage.error(msg || `查询${['省', '市', '区'][params.level]}级区域失败`)
        reject([])
      }

      const nodes = data.map((item: Recordable) => ({
        label: item.name,
        value: item.code,
        leaf: params.level >= 2
      }))

      resolve(nodes)
    } finally {
      reject([])
    }
  })
}

const onChange = (data: string[]) => {
  if (!data?.length) return
  const { provinceKey, cityKey, countyKey } = props
  props.modelValue[provinceKey] = data[0]
  props.modelValue[cityKey] = data[1]
  props.modelValue[countyKey] = data[2]
  emit('change', props.modelValue)
}
</script>

<style lang="scss" scoped></style>
