<template>
  <div class="drive-container">
    <div ref="base" class="joystick-base" @mousedown="startDrag" @touchstart.prevent="startDrag">
      <div class="joystick-stick" :style="{
        transform: `translate(${stickX}px, ${stickY}px)`
      }" />
    </div>
  </div>
</template>

<script>
import * as ROSLIB from "roslib";

export default {
  name: "DriveJoystick",

  data() {
    return {
      stickX: 0,
      stickY: 0,

      dragging: false,

      outerRadius: 90,
      stickRadius: 20,

      cmdVel: null,

      pressedKeys: new Set(),

      publishTimer: null
    };
  },

  mounted() {
    const ros = useRos();

    this.cmdVel = new ROSLIB.Topic({
      ros,
      name: "/mirte_base_controller/cmd_vel",
      messageType: "geometry_msgs/Twist"
    });

    window.addEventListener("mousemove", this.drag);
    window.addEventListener("mouseup", this.stopDrag);

    window.addEventListener("touchmove", this.drag, {
      passive: false
    });

    window.addEventListener("touchend", this.stopDrag);

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    // Republish current command at 10 Hz while not centered
    this.publishTimer = setInterval(() => {
      if (this.stickX !== 0 || this.stickY !== 0) {
        this.publishTwist();
      }
    }, 100);
  },

  beforeUnmount() {
    window.removeEventListener("mousemove", this.drag);
    window.removeEventListener("mouseup", this.stopDrag);

    window.removeEventListener("touchmove", this.drag);
    window.removeEventListener("touchend", this.stopDrag);

    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);

    if (this.publishTimer) {
      clearInterval(this.publishTimer);
    }
  },

  methods: {
    getPoint(event) {
      if (event.touches?.length) {
        return {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }

      return {
        x: event.clientX,
        y: event.clientY
      };
    },

    publishTwist() {
      const maxTravel = this.outerRadius - this.stickRadius;

      const angular = -this.stickX / maxTravel;
      const linear = -(this.stickY / maxTravel);

      this.cmdVel.publish({
        linear: {
          x: linear,
          y: 0,
          z: 0
        },
        angular: {
          x: 0,
          y: 0,
          z: angular
        }
      });
    },

    startDrag(event) {
      this.dragging = true;
      this.drag(event);
    },

    drag(event) {
      if (!this.dragging) {
        return;
      }

      const rect = this.$refs.base.getBoundingClientRect();

      const point = this.getPoint(event);

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = point.x - centerX;
      let dy = point.y - centerY;

      const maxTravel = this.outerRadius - this.stickRadius;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > maxTravel) {
        const scale = maxTravel / distance;

        dx *= scale;
        dy *= scale;
      }

      this.stickX = dx;
      this.stickY = dy;

      this.publishTwist();
    },

    stopDrag() {
      if (!this.dragging) {
        return;
      }

      this.dragging = false;

      this.stickX = 0;
      this.stickY = 0;

      this.publishTwist();
    },

    onKeyDown(event) {

      if (this.isTyping()) { return; }

      const key = event.key.toLowerCase();

      if (!["i", "j", "l", ","].includes(key)) {
        return;
      }

      if (event.repeat) {
        return;
      }

      this.pressedKeys.add(key);
      this.updateFromKeys();
    },


    isTyping() {
      const el = document.activeElement;

      if (!el) {
        return false;
      }

      return (
        el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.tagName === "SELECT" ||
        el.isContentEditable
      );
    },

    onKeyUp(event) {
      const key = event.key.toLowerCase();

      if (!["i", "j", "l", ","].includes(key)) {
        return;
      }

      this.pressedKeys.delete(key);
      this.updateFromKeys();
    },

    updateFromKeys() {
      const maxTravel = this.outerRadius - this.stickRadius;

      let x = 0;
      let y = 0;

      // Left / Right
      if (this.pressedKeys.has("j")) {
        x -= maxTravel;
      }

      if (this.pressedKeys.has("l")) {
        x += maxTravel;
      }

      // Forward / Backward
      if (this.pressedKeys.has("i")) {
        y -= maxTravel;
      }

      if (this.pressedKeys.has(",")) {
        y += maxTravel;
      }

      // Clamp to circular boundary
      const distance = Math.sqrt(x * x + y * y);

      if (distance > maxTravel) {
        const scale = maxTravel / distance;

        x *= scale;
        y *= scale;
      }

      this.stickX = x;
      this.stickY = y;

      this.publishTwist();
    }
  }
};
</script>

<style scoped>
.drive-container {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.joystick-base {
  position: relative;

  width: 180px;
  height: 180px;

  border-radius: 50%;

  background: #a6a6a6;
  border: 2px solid #a6a6a6;

  touch-action: none;
}

.joystick-stick {
  position: absolute;

  left: 50%;
  top: 50%;

  width: 40px;
  height: 40px;

  margin-left: -20px;
  margin-top: -20px;

  border-radius: 50%;

  background: #fbb927;

  box-shadow: 0 0 10px #fbb927;

  transition: transform 0.03s linear;
}
</style>
