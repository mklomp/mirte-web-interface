/**
 * A Sphere element in a URDF.
 */
export default class UrdfSphere {
    /**
     * @param {Object} options
     * @param {Element} options.xml - The XML element to parse.
     */
    constructor(options: {
        xml: Element;
    });
    type: number;
    radius: number;
}
