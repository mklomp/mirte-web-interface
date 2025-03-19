import * as ROSLIB from 'roslib'

const ros_protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
const ros_socketUrl = `${ros_protocol}${location.hostname}/ws/ros`;

const ros = new ROSLIB.Ros();

ros.connect(ros_socketUrl);
console.log("Connected to ROS on: "+ ros_socketUrl.toString());

export default ros;
