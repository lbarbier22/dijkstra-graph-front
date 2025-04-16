<script setup>
import { ref } from 'vue'
import GraphArea from './components/GraphArea.vue'

const nodeCount = ref(50)

const generateGraph = () => {
  window.dispatchEvent(new CustomEvent('generate-graph', { detail: nodeCount.value }))
}

const startAlgo = () => {
  window.dispatchEvent(new Event('run-dijkstra'))
}

const resetGraph = () => {
  window.dispatchEvent(new Event('reset-graph'))
}
</script>

<template>
  <div class="min-h-screen bg-gray-300 flex flex-col items-center justify-center p-4">
    <h1 class="rainbow-hover text-4xl font-bold mb-6">Dijkstra</h1>
    <div class="graph-card bg-white p-4 rounded-xl shadow-md">
      <GraphArea />
    </div>
    <div class="buttons flex flex-col items-center mb-4">
      <div class="flex gap-4 mb-2">
        <button @click="generateGraph" class="btn-generate">GENERATE</button>
        <button @click="startAlgo" class="btn-start">START</button>
        <button @click="resetGraph" class="btn-reset">RESET</button>
      </div>
    </div>
    <div class="divForm">
      <input
          type="number"
          min="10"
          max="999"
          v-model="nodeCount"
          class="formNumberOfNodes"
      />
    </div>
  </div>
</template>
