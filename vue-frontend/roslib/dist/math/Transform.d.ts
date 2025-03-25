import { default as Vector3 } from './Vector3.js';
import { default as Quaternion } from './Quaternion.js';
/**
 * A Transform in 3-space. Values are copied into this object.
 */
export default class Transform {
    /**
     * @param {Object} options
     * @param {Vector3} options.translation - The ROSLIB.Vector3 describing the translation.
     * @param {Quaternion} options.rotation - The ROSLIB.Quaternion describing the rotation.
     */
    constructor(options: {
        translation: Vector3;
        rotation: Quaternion;
    });
    translation: Vector3;
    rotation: Quaternion;
    /**
     * Clone a copy of this transform.
     *
     * @returns {Transform} The cloned transform.
     */
    clone(): Transform;
}
