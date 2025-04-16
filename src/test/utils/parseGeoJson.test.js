import { describe, test, expect } from 'vitest';
import { parseGeoJSONToCytoscapeElements } from '../../utils/parseGeoJson.js';

describe('parseGeoJSONToCytoscapeElements', () => {
    test('doit correctement parser un point ', () => {
        const geojson = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [10, 20]
                    },
                    properties: { id: 'A' }
                }
            ]
        };

        const result = parseGeoJSONToCytoscapeElements(geojson);
        expect(result).toEqual([
            {
                data: { id: 'A' },
                position: { x: 10, y: 20 }
            }
        ]);
    });

    test('doit correctement parser une LineString', () => {
        const geojson = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [[10, 20], [30, 40]]
                    },
                    properties: {
                        source: 'A',
                        target: 'B',
                        weight: 5
                    }
                }
            ]
        };

        const result = parseGeoJSONToCytoscapeElements(geojson);
        expect(result).toEqual([
            {
                data: {
                    id: 'AB',
                    source: 'A',
                    target: 'B',
                    weight: 5
                }
            }
        ]);
    });

    test('doit parser correctement des points et des LineStrings mélangés', () => {
        const geojson = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [1, 2] },
                    properties: { id: 'X' }
                },
                {
                    type: 'Feature',
                    geometry: { type: 'LineString', coordinates: [[1, 2], [3, 4]] },
                    properties: { source: 'X', target: 'Y', weight: 10 }
                }
            ]
        };

        const result = parseGeoJSONToCytoscapeElements(geojson);
        expect(result).toEqual([
            {
                data: { id: 'X' },
                position: { x: 1, y: 2 }
            },
            {
                data: {
                    id: 'XY',
                    source: 'X',
                    target: 'Y',
                    weight: 10
                }
            }
        ]);
    });

    test('doit retourner un tableau vide si aucune feature', () => {
        const geojson = {
            type: 'FeatureCollection',
            features: []
        };

        const result = parseGeoJSONToCytoscapeElements(geojson);
        expect(result).toEqual([]);
    });

    test('doit ignorer les features avec des types de géométrie inconnus', () => {
        const geojson = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: { type: 'Polygon', coordinates: [] },
                    properties: {}
                }
            ]
        };

        const result = parseGeoJSONToCytoscapeElements(geojson);
        expect(result).toEqual([]);
    });

    test('doit gérer les propriétés manquantes', () => {
        const geojson = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [5, 5] },
                    properties: {}
                },
                {
                    type: 'Feature',
                    geometry: { type: 'LineString', coordinates: [[1, 1], [2, 2]] },
                    properties: {}
                }
            ]
        };

        const result = parseGeoJSONToCytoscapeElements(geojson);
        expect(result).toEqual([
            {
                data: { id: undefined },
                position: { x: 5, y: 5 }
            },
            {
                data: {
                    id: 'undefinedundefined',
                    source: undefined,
                    target: undefined,
                    weight: undefined
                }
            }
        ]);
    });
});
