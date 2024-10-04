#!/bin/bash

source /opt/ros/humble/setup.bash
source /home/mirte/mirte_ws/install/setup.bash
# rosnode kill /mirte_telemetrix_mirte
# rosparam delete /mirte
# rosparam load /home/mirte/mirte_ws/src/mirte-ros-packages/mirte_telemetrix/config/mirte_user_config.yaml mirte
# rosrun mirte_telemetrix ROS_telemetrix_api.py  __name:=mirte_telemetrix_mirte
sudo systemctl restart mirte-ros

