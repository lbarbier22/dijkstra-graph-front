import axios from "axios";

export async function getGraphInit() {
    try {
        const response = await axios.get('http://localhost:3000/api/graph')
        return response.data
    } catch (error) {
        console.error('Error fetching GeoJSON data:', error)
    }
}
