import axios from "axios";

export async function getGraphInit() {
    try {
        const response = await axios.get('http://localhost:3000/api/graph')
        return response.data
    } catch (error) {
        console.error('Error fetching GeoJSON data:', error)
    }
}

export async function postDijkstraCalculation(startNode, endNode, stepNode) {
    try {
        const response = await axios.post('http://localhost:3000/api/dijkstra', {
            start: startNode,
            end: endNode,
            step: stepNode
        });
        return response.data;
    } catch (error) {
        console.error('Error posting Dijkstra calculation:', error);
    }
}

export async function getRandomGraph(numberOfNodes) {
    try {
        const response = await axios.get(`http://localhost:3000/api/graph/random?numberOfNodes=${numberOfNodes}`)
        return response.data
    } catch (error) {
        console.error('Error fetching GeoJSON data:', error)
    }
}
