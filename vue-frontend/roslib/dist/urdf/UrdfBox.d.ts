import { default as Vector3 } from '../math/Vector3.js';
/**
 * A Box element in a URDF.
 */
export default class UrdfBox {
    /**
     * @param {Object} options
     * @param {Element} options.xml - The XML element to parse.
     */
    constructor(options: {
        xml: Element;
    });
    /** @type {Vector3 | null} */
    dimension: Vector3 | null;
    type: number;
}
