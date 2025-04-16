import axios from "axios";

export async function getGraphInit() {
    try {
        const response = await axios.get('http://localhost:3000/api/graph');
        if (response.status !== 200) {
            return { success: false, message: 'Unexpected response status: ' + response.status };
        }
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: 'We cannot init the graph. : ' + error.message };
    }
}

export async function postDijkstraCalculation(startNode, endNode, stepNode) {
    if (typeof startNode !== 'string' || !startNode.trim()) {
        return { success: false, message: 'Invalid startNode: must be a non-empty string.' };
    }

    if (typeof endNode !== 'string' || !endNode.trim()) {
        return { success: false, message: 'Invalid endNode: must be a non-empty string.' };
    }

    if (!Array.isArray(stepNode) || !stepNode.every(s => typeof s === 'string')) {
        return { success: false, message: 'Invalid stepNode: must be an array of strings.' };
    }

    try {
        const response = await axios.post('http://localhost:3000/api/dijkstra', {
            start: startNode,
            end: endNode,
            step: stepNode
        });

        if (response.status !== 200) {
            return { success: false, message: 'Unexpected response status: ' + response.status };
        }

        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: 'Error processing Dijkstra algorithm: ' + error.message };
    }
}

export async function getRandomGraph(numberOfNodes) {
    try {
        const response = await axios.get('http://localhost:3000/api/graph/random?numberOfNodes=' + numberOfNodes);
        if (response.status !== 200) {
            return { success: false, message: 'Unexpected response status: ' + response.status };
        }
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: 'Error generating a new graph : ' + error.message };
    }
}
