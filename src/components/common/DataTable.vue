<template>
  <div class="data-table-wrapper">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-else class="admin-table">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="getRowKey(row, index)">
            <td v-for="column in columns" :key="column.key">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ formatCell(row[column.key], column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
})

function getRowKey(row, index) {
  return row[props.rowKey] || index
}

function formatCell(value, column) {
  if (column.formatter) {
    return column.formatter(value)
  }
  return value
}
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.admin-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

td {
  color: #666;
  font-size: 14px;
}
</style>
