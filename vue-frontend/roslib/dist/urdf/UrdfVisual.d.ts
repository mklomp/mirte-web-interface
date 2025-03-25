import { default as Pose } from '../math/Pose.js';
import { default as UrdfMesh } from './UrdfMesh.js';
import { default as UrdfSphere } from './UrdfSphere.js';
import { default as UrdfBox } from './UrdfBox.js';
import { default as UrdfCylinder } from './UrdfCylinder.js';
import { default as UrdfMaterial } from './UrdfMaterial.js';
/**
 * A Visual element in a URDF.
 */
export default class UrdfVisual {
    /**
     * @param {Object} options
     * @param {Element} options.xml - The XML element to parse.
     */
    constructor(options: {
        xml: Element;
    });
    /** @type {Pose | null} */
    origin: Pose | null;
    /** @type {UrdfMesh | UrdfSphere | UrdfBox | UrdfCylinder | null} */
    geometry: UrdfMesh | UrdfSphere | UrdfBox | UrdfCylinder | null;
    /** @type {UrdfMaterial | null} */
    material: UrdfMaterial | null;
    name: string | null;
}
