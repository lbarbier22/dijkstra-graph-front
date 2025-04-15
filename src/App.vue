<script setup>
import GraphArea from './components/GraphArea.vue'

const startAlgo = () => {
  window.dispatchEvent(new Event('run-dijkstra'))
}

const resetGraph = () => {
  window.dispatchEvent(new Event('reset-graph'))
}
</script>

<template>
  <div class="min-h-screen bg-gray-300 flex flex-col items-center justify-center p-4">
    <h1 class="text-4xl font-bold mb-6">Dijkstra</h1>
    <div class="bg-white p-4 rounded-xl shadow-md">
      <GraphArea />
    </div>
    <div class="buttons">
      <button @click="startAlgo">START</button>
      <button @click="resetGraph">RESET</button>
    </div>
  </div>
</template>


