<script setup>
useHead({
  title: 'MIRTE web IDE',
  meta: [
    {
      name: 'description',
      content: 'Programming environment for the MIRTE robot. Using Blocky, Python and ROS.'
    }
  ]
})

import { useLocalePath } from '#i18n'
const localePath = useLocalePath()

import * as ROSLIB from 'roslib'
const { $ros } = useNuxtApp()


const listener = new ROSLIB.Topic({
  ros: $ros,
  name: '/chatter',
  messageType: 'std_msgs/String'
})

listener.subscribe((message) => {
  console.log('Received:', message.data)
})

</script>


<template>

   Hello world

</template>
