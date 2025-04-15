<script setup>
import cytoscape from 'cytoscape'
import { onMounted } from 'vue'
import { parseGeoJSONToCytoscapeElements } from '../utils/parseGeojson.js'
import { getGraphInit } from '../utils/callApiBack.js'

let cy
let startNode = null
let endNode = null

const defaultColor = '#D1D5DB'
const startColor = '#10B981'
const endColor = '#EF4444'

const initGraph = (graphParsed) => {
  cy = cytoscape({
    container: document.getElementById('cy'),
    elements: graphParsed,
    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(id)',
          'text-valign': 'center',
          'text-halign': 'center',
          'background-color': defaultColor,
          'color': '#000',
          'font-size': '16px',
          'width': 40,
          'height': 40,
          'border-width': 2,
          'border-color': '#000'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#000',
          'target-arrow-shape': 'none',
          'label': 'data(weight)',
          'font-size': '12px',
          'text-rotation': 'autorotate',
          'text-margin-y': -10
        }
      }
    ],
    layout: {
      name: 'preset'
    }
  })

  cy.on('tap', 'node', (e) => {
    const node = e.target
    if (node.data('state') === 'start') {
      node.style('background-color', defaultColor)
      node.data('state', null)
      startNode = null
    } else if (node.data('state') === 'end') {
      node.style('background-color', defaultColor)
      node.data('state', null)
      endNode = null
    } else if (!startNode) {
      node.style('background-color', startColor)
      node.data('state', 'start')
      startNode = node
    } else if (!endNode) {
      node.style('background-color', endColor)
      node.data('state', 'end')
      endNode = node
    } else {
      alert('You have already select a start and an end.\nYou have to cancel one of them first.')
    }
  })

  window.addEventListener('reset-graph', () => {
    cy.nodes().forEach(n => {
      n.style('background-color', defaultColor)
      n.data('state', null)
    })
    startNode = null
    endNode = null
  })

  window.addEventListener('run-dijkstra', () => {
    if (!startNode || !endNode) {
      alert('You need to select a start and end node before running the algorithm.')
      return
    }
    alert('Dijkstra not implemented yet.')
  })
}

onMounted(async () => {
  const resultGraphGeoJson = await getGraphInit();
  const graphParsed = parseGeoJSONToCytoscapeElements(resultGraphGeoJson)
  initGraph(graphParsed)
})
</script>

<template>
  <div id="cy"/>
</template>

<style>
#cy {
  background-color: #fff;
  border: 4px solid black;
  border-radius: 1rem;
  width: 700px;
  height: 400px;
}
</style>
