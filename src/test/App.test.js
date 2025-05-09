import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App.vue', () => {
    let spyDispatchEvent

    beforeEach(() => {
        spyDispatchEvent = vi.spyOn(window, 'dispatchEvent')
    })

    it('affiche le titre et les boutons', () => {
        const wrapper = mount(App)

        expect(wrapper.text()).toContain('Dijkstra')
        expect(wrapper.find('button.btn-generate').exists()).toBe(true)
        expect(wrapper.find('button.btn-start').exists()).toBe(true)
        expect(wrapper.find('button.btn-reset').exists()).toBe(true)
    })

    it('envoie generate-graph avec nodeCount', async () => {
        const wrapper = mount(App)
        const input = wrapper.find('input[type="number"]')

        await input.setValue(123)
        await wrapper.find('button.btn-generate').trigger('click')

        expect(spyDispatchEvent).toHaveBeenCalledWith(
            new CustomEvent('generate-graph', { detail: 123 })
        )
    })

    it('envoie run-dijkstra', async () => {
        const wrapper = mount(App)
        await wrapper.find('button.btn-start').trigger('click')

        expect(spyDispatchEvent).toHaveBeenCalledWith(
            new Event('run-dijkstra')
        )
    })

    it('envoie reset-graph', async () => {
        const wrapper = mount(App)
        await wrapper.find('button.btn-reset').trigger('click')

        expect(spyDispatchEvent).toHaveBeenCalledWith(
            new Event('reset-graph')
        )
    })

    it('met à jour nodeCount lorsque input change', async () => {
        const wrapper = mount(App)
        const input = wrapper.find('input[type="number"]')

        await input.setValue(222)
        expect(wrapper.vm.nodeCount).toBe(222)
    })

    it('met à jour geojsonText et déclenche generate-graph avec le contenu du textarea', async () => {
        const wrapper = mount(App)

        const mockGeoJson = {
            type: 'FeatureCollection',
            features: []
        }

        const textarea = wrapper.find('#geojson-text')
        await textarea.setValue(JSON.stringify(mockGeoJson))

        await wrapper.find('button.geojson-button').trigger('click')

        expect(spyDispatchEvent).toHaveBeenCalledWith(
            new CustomEvent('generate-graph', { detail: mockGeoJson })
        )
    })

    it('affiche une erreur si le JSON est invalide', async () => {
        window.alert = vi.fn()
        const wrapper = mount(App)

        await wrapper.find('#geojson-text').setValue('{ invalid json')
        await wrapper.find('button.geojson-button').trigger('click')

        expect(window.alert).toHaveBeenCalledWith('Invalid GeoJSON format.')
    })
})
