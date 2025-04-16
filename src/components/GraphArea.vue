<script setup>
import cytoscape from 'cytoscape'
import { onMounted, ref} from 'vue'
import { parseGeoJSONToCytoscapeElements } from '../utils/parseGeojson.js'
import {getGraphInit, getRandomGraph, postDijkstraCalculation} from '../utils/callApiBack.js'

let cy
let startNode = null
let stepNodes = []
let endNode = null

const defaultColor = '#D1D5DB'
const startColor = '#10B981'
const endColor = '#EF4444'
const dijkstraResult = ref(null)

const cytoScapeGraph = (initGraphParsed) => {
  cy = cytoscape({
    container: document.getElementById('cy'),
    elements: initGraphParsed,
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
      name: 'cose'
    }
  })

  //handle left click on node
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
      startNode = node.data('id')
    } else if (!endNode) {
      node.style('background-color', endColor)
      node.data('state', 'end')
      endNode = node.data('id')
    } else {
      alert('You have already select a start and an end.\nYou have to cancel one of them first.')
    }
  })

  //handle right click on node
  cy.on('cxttap', 'node', (e) => {
    const node = e.target
    if (node.data('state') === 'step') {
      node.style('background-color', defaultColor)
      node.data('state', null)
      stepNodes = stepNodes.filter(id => id !== node.data('id'));
    } else if (node.data('state') === 'start') {
      node.style('background-color', defaultColor)
      node.data('state', null)
      startNode = null
    } else if (node.data('state') === 'end') {
      node.style('background-color', defaultColor)
      node.data('state', null)
      endNode = null
    } else {
      node.style('background-color', '#df6704')
      node.data('state', 'step')
      if (!stepNodes.includes(node.data('id'))) {
        stepNodes.push(node.data('id'));
      }
    }

  })

  window.addEventListener('reset-graph', () => {
    cy.nodes().forEach(n => {
      n.style('background-color', defaultColor)
      n.data('state', null)
    })
    cy.edges().forEach(edge => {
      edge.style('line-color', '#000')
      edge.style('width', 2)
    })
    startNode = null
    endNode = null
    stepNodes = []
  })

  window.addEventListener('run-dijkstra', async () => {
    if (!startNode || !endNode) {
      alert('You need to select a start and end node before running the algorithm.')
      return
    }
    let result = await postDijkstraCalculation(startNode, endNode, stepNodes)
    if (result) {
      dijkstraResult.value = `The shortest route is: ${result.path.join(' → ')}\nWith a weight of: ${result.weight}`;
      highlightEdgesInPath(result.path);
      highlightNodesInPath(result.path);
    } else {
      alert('Error: No result from the server.')
    }
  })

  window.addEventListener('generate-graph', async (e) => {
    const nodeCount = e.detail
    let result = await getRandomGraph(nodeCount)
    cy.remove('node')
    cy.add(parseGeoJSONToCytoscapeElements(result))
    startNode = null
    endNode = null
    stepNodes = []
    cy.layout({ name: 'cose' }).run()
  })
}

function highlightEdgesInPath(path) {
  cy.edges().forEach(edge => {
    const source = edge.data('source');
    const target = edge.data('target');

    let isInPath = false;
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (path[i] === source && path[i + 1] === target) ||
        (path[i] === target && path[i + 1] === source)
      ) {
        isInPath = true;
        break;
      }
    }

    if (isInPath) {
      edge.style('line-color', '#df6704');
      edge.style('width', 3);
    } else {
      edge.style('line-color', '#000');
      edge.style('width', 2);
    }
  });
}

function highlightNodesInPath(path) {
  cy.nodes().forEach(node => {
    node.style('background-color', defaultColor);
    if (path.includes(node.id()) && node.data('state') !== 'start'
        && node.data('state') !== 'end'
        && node.data('state') !== 'step') {
      node.style('background-color', '#facc15');
    } else if (node.data('state') === 'start') {
      node.style('background-color', startColor);
    } else if (node.data('state') === 'end') {
      node.style('background-color', endColor);
    } else if (node.data('state') === 'step') {
      node.style('background-color', '#df6704');
    }
    else {
      node.style('background-color', defaultColor);
    }
  });
}


onMounted(async () => {
  const resultGraphGeoJson = await getGraphInit();
  const graphParsed = parseGeoJSONToCytoscapeElements(resultGraphGeoJson)
  cytoScapeGraph(graphParsed)
})
</script>

<template>
  <div id="cy"/>
  <div
      v-if="dijkstraResult"
      style="white-space: pre-line; margin-bottom: 10px; font-weight: bold; max-width: 600px; word-wrap: break-word;"
  >
    {{ dijkstraResult }}
  </div>
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
