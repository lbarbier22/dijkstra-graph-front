<script setup>
import cytoscape from 'cytoscape'
import { onMounted } from 'vue'

let cy
let startNode = null
let endNode = null

const defaultColor = '#D1D5DB'
const startColor = '#10B981'
const endColor = '#EF4444'

const initGraph = () => {
  cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [
      //Nodes
      { data: { id: 'A' }, position: { x: 150, y: 100 } },
      { data: { id: 'B' }, position: { x: 250, y: 200 } },
      { data: { id: 'C' }, position: { x: 50, y: 200 } },
      { data: { id: 'D' }, position: { x: 300, y: 350 } },
      { data: { id: 'E' }, position: { x: 150, y: 300 } },
      { data: { id: 'F' }, position: { x: 0, y: 300 } },
      { data: { id: 'A' }, position: { x: 200, y: 100 } },
      { data: { id: 'B' }, position: { x: 300, y: 200 } },
      { data: { id: 'C' }, position: { x: 100, y: 200 } },
      { data: { id: 'D' }, position: { x: 350, y: 350 } },
      { data: { id: 'E' }, position: { x: 200, y: 300 } },
      { data: { id: 'F' }, position: { x: 50, y: 300 } },
      { data: { id: 'G' }, position: { x: 100, y: 400 } },

      //Lines
      { data: { id: 'AC', source: 'A', target: 'C', weight: 3 } },
      { data: { id: 'AB', source: 'A', target: 'B', weight: 3 } },
      { data: { id: 'CE', source: 'C', target: 'E', weight: 2.8 } },
      { data: { id: 'BE', source: 'B', target: 'E', weight: 2.8 } },
      { data: { id: 'BD', source: 'B', target: 'D', weight: 3.5 } },
      { data: { id: 'ED', source: 'E', target: 'D', weight: 3.1 } },
      { data: { id: 'EG', source: 'E', target: 'G', weight: 7 } },
      { data: { id: 'GD', source: 'G', target: 'D', weight: 10 } },
      { data: { id: 'CF', source: 'C', target: 'F', weight: 3.5 } },
      { data: { id: 'FG', source: 'F', target: 'G', weight: 2.5 } }
    ],
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

onMounted(() => {
  initGraph()
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
