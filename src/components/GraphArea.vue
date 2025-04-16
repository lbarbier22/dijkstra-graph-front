<script setup>
import cytoscape from 'cytoscape'
import { onMounted, ref } from 'vue'
import { parseGeoJSONToCytoscapeElements } from '../utils/parseGeojson.js'
import { getGraphInit, getRandomGraph, postDijkstraCalculation } from '../utils/callApiBack.js'
import styleCytoScape from '../assets/style/styleCytoScape.json'

let cy
let startNode = null
let stepNodes = []
let endNode = null

const defaultColor = '#D1D5DB'
const startColor = '#10B981'
const endColor = '#EF4444'
const stepColor = '#DF6704'
const dijkstraResult = ref(null)

function resetNodeStyle(node) {
  node.style('background-color', defaultColor);
  node.data('state', null);
}

function setNodeState(node, state, color) {
  node.style('background-color', color);
  node.data('state', state);
}

function handleNodeClick(eventType, node) {
  const state = node.data('state');
  const id = node.data('id');

  // Clic gauche
  if (eventType === 'tap') {
    if (state === 'start') {
      resetNodeStyle(node);
      startNode = null;
    } else if (state === 'end') {
      resetNodeStyle(node);
      endNode = null;
    } else if (!startNode) {
      setNodeState(node, 'start', startColor);
      startNode = id;
    } else if (!endNode) {
      setNodeState(node, 'end', endColor);
      endNode = id;
    } else {
      alert('You have already select a start and an end.\nYou have to cancel one of them first.');
    }
  }

  // Clic droit
  if (eventType === 'cxttap') {
    if (state === 'step') {
      resetNodeStyle(node);
      stepNodes = stepNodes.filter(stepId => stepId !== id);
    } else {
      if (state === 'start') {
        resetNodeStyle(node);
        startNode = null;
      } else if (state === 'end') {
        resetNodeStyle(node);
        endNode = null;
      } else {
        setNodeState(node, 'step', stepColor);
        if (!stepNodes.includes(id)) {
          stepNodes.push(id);
        }
      }
    }
  }
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
      edge.style('width', 5);
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

function importGraphStyle(styleJson) {
  if (cy && styleJson) {
    cy.style(styleJson);
  }
}

const cytoScapeGraph = (initGraphParsed) => {
  cy = cytoscape({
    container: document.getElementById('cy'),
    style: styleCytoScape,
    elements: initGraphParsed,
    layout: {
      name: 'cose'
    }
  })

  //handle left click on node
  cy.on('tap', 'node', (e) => {
    handleNodeClick('tap', e.target);
  });

  //handle right click on node
  cy.on('cxttap', 'node', (e) => {
    handleNodeClick('cxttap', e.target);
  });

  //handle mouseover and mouseout on node
  cy.on('mouseover', 'node', (e) => {
    const node = e.target;
    node.style({
      width: 50,
      height: 50
    });
  });

  cy.on('mouseout', 'node', (e) => {
    const node = e.target;
    node.style({
      width: 40,
      height: 40
    });
  });

  //handle mouseover and mouseout on edge
  cy.on('mouseover', 'edge', (e) => {
    const node = e.target;
    node.style({
      width: 4,
      fontSize: 22,
      textMarginY: -20
    });
  });

  cy.on('mouseout', 'edge', (e) => {
    const node = e.target;
    node.style({
      width: 2,
      fontSize: 16,
      textMarginY: -15
    });
  });

  window.addEventListener('reset-graph', () => {
    cy.nodes().forEach(n => {
      resetNodeStyle(n);
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

onMounted(async () => {
  const resultGraphGeoJson = await getGraphInit();
  const graphParsed = parseGeoJSONToCytoscapeElements(resultGraphGeoJson)
  cytoScapeGraph(graphParsed)
})
</script>

<template>
  <div id="cy"/>
  <div class="graph-result" v-if="dijkstraResult">
    {{ dijkstraResult }}
  </div>
</template>
