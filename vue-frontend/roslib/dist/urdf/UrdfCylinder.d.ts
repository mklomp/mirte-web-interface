/**
 * A Cylinder element in a URDF.
 */
export default class UrdfCylinder {
    /**
     * @param {Object} options
     * @param {Element} options.xml - The XML element to parse.
     */
    constructor(options: {
        xml: Element;
    });
    type: number;
    length: number;
    radius: number;
}
