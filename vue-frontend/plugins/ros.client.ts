import * as ROSLIB from 'roslib'

export default defineNuxtPlugin(() => {

  //const ros_protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
  //const ros_socketUrl = `${ros_protocol}${location.hostname}/ws/ros`;

  const ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090'
  })

  ros.on('connection', () => {
    console.log('Connected to ROS2')
  })

  ros.on('error', (error) => {
    console.error('ROS error:', error)
  })

  ros.on('close', () => {
    console.log('ROS connection closed')
  })

  return {
    provide: {
      ros
    }
  }
})