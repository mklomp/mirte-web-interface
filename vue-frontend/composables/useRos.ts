import * as ROSLIB from 'roslib'

const ros = new ROSLIB.Ros({})

export function useRos() {
  return ros
}
