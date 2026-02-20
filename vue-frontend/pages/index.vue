<script setup>
useHead({
  title: 'webIDE - MIRTE',
  meta: [
    {
      name: 'description',
      content: 'Programming environment for the MIRTE robot. Using Blocky, Python and ROS.'
    }
  ]
})

import { useLocalePath } from '#i18n'
const localePath = useLocalePath()

//import * as ROSLIB from 'roslib'
//const { $ros } = useNuxtApp()

/*
const listener = new ROSLIB.Topic({
  ros: $ros,
  name: '/io/power/power_watcher',
  messageType: 'sensor_msgs/msg/BatteryState'
})

listener.subscribe((message) => {
  console.log('Received:', message)
})
*/

</script>


<template>

   Hello world

</template>

