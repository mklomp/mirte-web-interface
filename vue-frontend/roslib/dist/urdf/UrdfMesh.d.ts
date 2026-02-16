import { default as Vector3 } from '../math/Vector3.js';
/**
 * A Mesh element in a URDF.
 */
export default class UrdfMesh {
    /**
     * @param {Object} options
     * @param {Element} options.xml - The XML element to parse.
     */
    constructor(options: {
        xml: Element;
    });
    /** @type {Vector3 | null} */
    scale: Vector3 | null;
    type: number;
    filename: string | null;
}
