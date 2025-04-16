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
        const response = await fetch('http://localhost:3000/api/dijkstra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                start: startNode,
                end: endNode,
                step: stepNode
            })
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return await response.json()

    } catch (error) {
        console.error('Error fetching GeoJSON data:', error)
    }
}
