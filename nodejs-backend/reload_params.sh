#!/bin/bash

# Killing telelmetrix node, which ROS will restart automtically (with the new params)
pkill -f /opt/ros/humble/lib/mirte_telemetrix_cpp/mirte_telemetrix_cpp_node
