<template>
  <el-pagination
    :background="true"
    :current-page="pageParams.pageNum"
    :page-size="pageParams.pageSize"
    :total="pageParams.total"
    layout="total, sizes, prev, pager, next, jumper"
    :page-sizes="[10, 25, 50, 100]"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  ></el-pagination>
</template>

<script setup lang="ts">
import { Table } from '../types/table'

defineOptions({ name: 'Pagination' })

defineProps<{
  pageParams: Table.PageParams
  handleSizeChange: (size: number) => void
  handleCurrentChange: (current: number) => void
}>()
</script>
