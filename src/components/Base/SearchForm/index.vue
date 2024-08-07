<template>
  <div class="search-form-box">
    <el-form :model="searchParams">
      <Grid ref="gridRef" :collapsed="collapsed" :gap="[0, 30]" :cols="searchCols">
        <GridItem
          v-for="(column, index) in columns"
          :key="column.prop"
          v-bind="getResponsive(column)"
          :index="index"
        >
          <el-form-item>
            <template #label>
              <div class="gap-1 flex-c">
                <span>{{ `${column.search?.label ?? column.label}` }}</span>

                <el-tooltip
                  v-if="column.search?.tooltip"
                  effect="dark"
                  :content="column.search?.tooltip"
                  placement="top"
                >
                  <el-icon class="cursor-pointer" :size="14">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>

              <span>&nbsp;:</span>
            </template>

            <SearchFormItem :column="column" :searchParams="searchParams" />
          </el-form-item>
        </GridItem>

        <GridItem suffix>
          <div class="flex-end mb-[18px]">
            <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
            <el-button :icon="Delete" @click="reset">重置</el-button>
            <el-button type="primary" link @click="collapsed = !collapsed" v-if="showCollapse">
              {{ collapsed ? '展开' : '收起' }}
              <el-icon class="ml-[5px]">
                <component :is="collapsed ? ArrowDown : ArrowUp"></component>
              </el-icon>
            </el-button>
          </div>
        </GridItem>
      </Grid>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue'
import { Delete, Search, ArrowDown, ArrowUp, QuestionFilled } from '@element-plus/icons-vue'
import Grid from '../Grid/index.vue'
import GridItem from '../Grid/GridItem.vue'
import SearchFormItem from './SearchFormItem.vue'
import { BreakPoint } from '../Grid/type'

defineOptions({
  name: 'SearchParam'
})

interface SearchFormProps {
  searchParams?: Recordable // v-model的搜索参数
  columns?: any[] // 搜索配置列
  search: (params: Recordable | null) => void
  reset: (params: Recordable | null) => void
  searchCols: number | Record<BreakPoint, number>
}

const props = withDefaults(defineProps<SearchFormProps>(), {
  searchParams: () => ({}),
  columns: () => []
})

// 是否默认折叠搜索项
const collapsed = ref(true)

// 获取响应式断点
const gridRef = ref()
const breakPoint = computed<BreakPoint>(() => unref(gridRef)?.breakPoint)

// 获取响应式设置
const getResponsive = (item: any) => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl
  }
}

// 判断是否显示 展开/收起 按钮
const showCollapse = computed(() => {
  let show = false

  props.columns.reduce((prev, current) => {
    prev +=
      (current.search![breakPoint.value]?.span ?? current.search?.span ?? 1) +
      (current.search![breakPoint.value]?.offset ?? current.search?.offset ?? 0)

    if (typeof props.searchCols !== 'number') {
      if (prev >= props.searchCols[breakPoint.value]) show = true
    } else {
      if (prev >= props.searchCols) show = true
    }

    return prev
  }, 0)

  return show
})
</script>

<style lang="scss" scoped>
.search-form-box {
  :deep(.el-form) {
    .el-form-item__content > * {
      width: 100%;
    }
  }
}
</style>
