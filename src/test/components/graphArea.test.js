import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import GraphArea from '../../components/GraphArea.vue'
import * as api from '../../utils/callApiBack.js'
import * as geoUtils from '../../utils/parseGeojson.js'

vi.mock('cytoscape', () => {
    return {
        default: vi.fn(() => ({
            on: vi.fn(),
            nodes: vi.fn(() => []),
            edges: vi.fn(() => []),
            remove: vi.fn(),
            add: vi.fn(),
            layout: vi.fn(() => ({ run: vi.fn() })),
            style: vi.fn()
        }))
    }
})

describe('GraphArea.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('affiche une erreur si le graphe initial échoue', async () => {
        vi.spyOn(api, 'getGraphInit').mockResolvedValue({ success: false, message: 'Init failed' })
        const wrapper = mount(GraphArea)

        await flushPromises()

        expect(wrapper.text()).toContain('Error: Init failed')
    })

    it('parse et initialise le graphe si la récupération réussit', async () => {
        const mockParsed = [{ data: { id: 'a' }, position: { x: 0, y: 0 } }]
        vi.spyOn(api, 'getGraphInit').mockResolvedValue({ success: true, data: { features: [] } })
        vi.spyOn(geoUtils, 'parseGeoJSONToCytoscapeElements').mockReturnValue(mockParsed)

        const wrapper = mount(GraphArea)
        await flushPromises()

        expect(wrapper.find('#cy').exists()).toBe(true)
        expect(geoUtils.parseGeoJSONToCytoscapeElements).toHaveBeenCalled()
    })

    it('réagit à run-dijkstra avec erreur si start/end manquant', async () => {
        vi.spyOn(api, 'getGraphInit').mockResolvedValue({ success: true, data: { features: [] } })
        vi.spyOn(geoUtils, 'parseGeoJSONToCytoscapeElements').mockReturnValue([])

        const wrapper = mount(GraphArea)
        await flushPromises()

        window.dispatchEvent(new Event('run-dijkstra'))
        await flushPromises()

        expect(wrapper.text()).toContain('select a start and end node')
    })

    it('exécute le dijkstra si tout est bon', async () => {
        vi.spyOn(api, 'getGraphInit').mockResolvedValue({ success: true, data: { features: [] } })
        vi.spyOn(geoUtils, 'parseGeoJSONToCytoscapeElements').mockReturnValue([])
        vi.spyOn(api, 'postDijkstraCalculation').mockResolvedValue({
            success: true,
            data: { path: ['A', 'B', 'C'], weight: 42 }
        })

        const wrapper = mount(GraphArea)
        await flushPromises()

        wrapper.vm.startNode = 'A'
        wrapper.vm.endNode = 'C'

        window.dispatchEvent(new Event('run-dijkstra'))
        await flushPromises()

        expect(wrapper.text()).toContain('The shortest route is : A → B → C\n' +
            'With a weight of : 42')
    })

    it('affiche une erreur si Dijkstra échoue', async () => {
        vi.spyOn(api, 'getGraphInit').mockResolvedValue({ success: true, data: { features: [] } })
        vi.spyOn(geoUtils, 'parseGeoJSONToCytoscapeElements').mockReturnValue([])
        vi.spyOn(api, 'postDijkstraCalculation').mockResolvedValue({
            success: false,
            message: 'Dijkstra error'
        })

        const wrapper = mount(GraphArea)
        await flushPromises()

        wrapper.vm.startNode = 'A'
        wrapper.vm.endNode = 'C'

        window.dispatchEvent(new Event('run-dijkstra'))
        await flushPromises()

        expect(wrapper.text()).toContain('Dijkstra error')
    })

    it('génère un nouveau graphe avec generate-graph', async () => {
        const addSpy = vi.fn()
        const removeSpy = vi.fn()
        const layoutRunSpy = vi.fn()

        vi.spyOn(api, 'getGraphInit').mockResolvedValue({ success: true, data: { features: [] } })
        vi.spyOn(geoUtils, 'parseGeoJSONToCytoscapeElements').mockReturnValue([{ data: { id: '1' } }])
        vi.spyOn(api, 'generateGraph').mockResolvedValue({ success: true, data: { features: [{ type: 'Feature' }] } })

        const wrapper = mount(GraphArea)
        await flushPromises()

        wrapper.vm.cy.add = addSpy
        wrapper.vm.cy.remove = removeSpy
        wrapper.vm.cy.layout = () => ({ run: layoutRunSpy })

        const mockGeoJson = { type: 'FeatureCollection', features: [] }
        window.dispatchEvent(new CustomEvent('generate-graph', { detail: mockGeoJson }))
        await flushPromises()

        expect(api.generateGraph).toHaveBeenCalledWith(mockGeoJson)
        expect(removeSpy).toHaveBeenCalled()
        expect(addSpy).toHaveBeenCalled()
        expect(layoutRunSpy).toHaveBeenCalled()
    })

    it('affiche une erreur si generateGraph échoue', async () => {
        vi.spyOn(api, 'getGraphInit').mockResolvedValue({ success: true, data: { features: [] } })
        vi.spyOn(api, 'generateGraph').mockResolvedValue({ success: false, message: 'Bad geoJson' })
        const wrapper = mount(GraphArea)
        await flushPromises()

        window.dispatchEvent(new CustomEvent('generate-graph', { detail: {} }))
        await flushPromises()

        expect(wrapper.text()).toContain('Bad geoJson')
    })
})
