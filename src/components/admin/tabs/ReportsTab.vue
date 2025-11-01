<template>
  <div class="reports-admin">
    <h2>Generate Reports</h2>

    <div class="reports-form">
      <div class="form-row">
        <div class="form-group">
          <label>Report Type</label>
          <select v-model="form.type">
            <option value="summary">Summary</option>
            <option value="detailed">Detailed</option>
            <option value="financial">Financial</option>
          </select>
        </div>
        <div class="form-group">
          <label>Format</label>
          <select v-model="form.format">
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Date</label>
          <input v-model="form.startDate" type="date" />
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input v-model="form.endDate" type="date" />
        </div>
      </div>
      <button @click="handleGenerate" class="btn-primary" :disabled="generating">
        {{ generating ? 'Generating...' : 'Generate Report' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const form = ref({
  type: 'summary',
  format: 'pdf',
  startDate: '',
  endDate: '',
})

const generating = ref(false)

async function handleGenerate() {
  try {
    generating.value = true
    await api.generateReport(
      form.value.type,
      form.value.format,
      form.value.startDate || null,
      form.value.endDate || null
    )
  } catch (error) {
    alert(error.message)
  } finally {
    generating.value = false
  }
}
</script>

<style scoped>
h2 {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #333;
}

.reports-form {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.btn-primary {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
