export function parseGeoJSONToCytoscapeElements(geojson) {
    const elements = [];

    geojson.features.forEach(feature => {
        if (feature.geometry.type === "Point") {
            const { id } = feature.properties;
            const [x, y] = feature.geometry.coordinates;

            elements.push({
                data: { id },
                position: { x, y }
            });
        }

        if (feature.geometry.type === "LineString") {
            const { source, target, weight } = feature.properties;

            elements.push({
                data: {
                    id: `${source}${target}`,
                    source,
                    target,
                    weight
                }
            });
        }
    });

    return elements;
}
