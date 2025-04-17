import { describe, test, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { getGraphInit, postDijkstraCalculation, getRandomGraph, generateGraph } from '../../utils/callApiBack.js'

vi.mock('axios')

beforeEach(() => {
    vi.clearAllMocks()
})

describe('getGraphInit', () => {
    test('doit retourner les données si le statut est 200', async () => {
        axios.get.mockResolvedValue({ status: 200, data: { graph: [] } })

        const result = await getGraphInit()
        expect(result.success).toBe(true)
        expect(result.data).toEqual({ graph: [] })
    })

    test('doit retourner une erreur si le statut est pas 200', async () => {
        axios.get.mockResolvedValue({ status: 500 })

        const result = await getGraphInit()
        expect(result.success).toBe(false)
        expect(result.message).toBe('Unexpected response status: 500')
    })

    test('doit gérer les erreurs réseau', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'))

        const result = await getGraphInit()
        expect(result.success).toBe(false)
        expect(result.message).toBe('We cannot init the graph. : Network Error')
    })
})

describe('postDijkstraCalculation', () => {
    test('doit retourner une erreur si startNode est invalide', async () => {
        const result = await postDijkstraCalculation('', 'end', ['step1'])
        expect(result.success).toBe(false)
        expect(result.message).toBe('Invalid startNode: must be a non-empty string.')
    })

    test('doit retourner une erreur si endNode est invalide', async () => {
        const result = await postDijkstraCalculation('start', '', ['step1'])
        expect(result.success).toBe(false)
        expect(result.message).toBe('Invalid endNode: must be a non-empty string.')
    })

    test('doit retourner une erreur si stepNode est invalide', async () => {
        const result = await postDijkstraCalculation('start', 'end', 'not-an-array')
        expect(result.success).toBe(false)
        expect(result.message).toBe('Invalid stepNode: must be an array of strings.')
    })

    test('doit retourner les données si le statut est 200', async () => {
        axios.post.mockResolvedValue({ status: 200, data: { path: ['A', 'B'], weight: 5 } })

        const result = await postDijkstraCalculation('start', 'end', ['s1'])
        expect(result.success).toBe(true)
        expect(result.data).toEqual({ path: ['A', 'B'], weight: 5 })
    })

    test('doit retourner une erreur si le statut est pas 200', async () => {
        axios.post.mockResolvedValue({ status: 500 })

        const result = await postDijkstraCalculation('start', 'end', ['s1'])
        expect(result.success).toBe(false)
        expect(result.message).toBe('Unexpected response status: 500')
    })

    test('doit gérer les erreurs réseau', async () => {
        axios.post.mockRejectedValue(new Error('Network Error'))

        const result = await postDijkstraCalculation('start', 'end', ['s1'])
        expect(result.success).toBe(false)
        expect(result.message).toBe('Error processing Dijkstra algorithm: Network Error')
    })
})

describe('getRandomGraph', () => {
    test('doit retourner les données si le statut est 200', async () => {
        axios.get.mockResolvedValue({ status: 200, data: { nodes: [] } })

        const result = await getRandomGraph(5)
        expect(result.success).toBe(true)
        expect(result.data).toEqual({ nodes: [] })
    })

    test('doit retourner une erreur si le statut est pas 200', async () => {
        axios.get.mockResolvedValue({ status: 500 })

        const result = await getRandomGraph(5)
        expect(result.success).toBe(false)
        expect(result.message).toBe('Unexpected response status: 500')
    })

    test('doit gérer les erreurs réseau', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'))

        const result = await getRandomGraph(5)
        expect(result.success).toBe(false)
        expect(result.message).toBe('Error generating a new graph : Network Error')
    })
})

describe('generateGraph', () => {
    test('doit retourner les données si le statut est 200', async () => {
        const mockGeoJson = { type: 'FeatureCollection', features: [] }
        axios.post.mockResolvedValue({ status: 200, data: { nodes: ['A'], edges: [] } })

        const result = await generateGraph(mockGeoJson)
        expect(result.success).toBe(true)
        expect(result.data).toEqual({ nodes: ['A'], edges: [] })
    })

    test('doit retourner une erreur si le statut est pas 200', async () => {
        const mockGeoJson = { type: 'FeatureCollection', features: [] }
        axios.post.mockResolvedValue({ status: 500, data: 'Internal Server Error' })

        const result = await generateGraph(mockGeoJson)
        expect(result.success).toBe(false)
        expect(result.message).toBe('Unexpected response status: Internal Server Error')
    })

    test('doit gérer les erreurs réseau', async () => {
        const mockGeoJson = { type: 'FeatureCollection', features: [] }
        axios.post.mockRejectedValue(new Error('Network Error'))

        const result = await generateGraph(mockGeoJson)
        expect(result.success).toBe(false)
        expect(result.message).toBe('Error generating a new graph : Network Error')
    })
})
