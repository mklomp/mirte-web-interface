from machine import Pin, ADC, PWM
import ujson 
mirte = {}
max_pwm = 65535

class Robot():
  def __init__(self):
    with open(".settings.json", "r") as f:
      data = f.read()
    self.config = ujson.loads(data)
    
  # HELPER FUNTIONS
  def stripGP(self, s):
    return s[2:] if s.startswith("GP") else s

  def map_value(self, x, in_min, in_max, out_min, out_max):
    return int((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

  # MIRTE API (same as blockly and ROS)
  def setDigitalPinValue(self, pin, value):
    Pin(int(self.stripGP(pin)), Pin.OUT).value(value)

  # TODO: check with ROS version on value range
  def setAnalogPinValue(self, pin, value):
    pwm = PWM(Pin(int(self.stripGP(pin))))
    pwm.freq(50) # standard PWM servo
    pwm.duty_u16(value)

  def getDigitalPinValue(self, pin):
    return Pin(int(self.stripGP(pin)), Pin.IN).value()

  # TODO: check with ROS version on value range
  def getAnalogPinValue(self, pin):
    return ADC(int(self.stripGP(pin))).read_u16()

  def setMotorSpeed(self, instance, speed):
    # currently supporting pp motors (as on PCB)
    #print(self.config['motor'])
    pinA = self.config['motor'][instance]['pins']['p1']
    pinB = self.config['motor'][instance]['pins']['p2']
    speed_ = int(max_pwm/100.0*speed)
    speedA = speed_ if speed_ > 0 else 0
    speedB = -speed_ if speed_ < 0 else 0
    self.setAnalogPinValue(pinA, speedA)
    self.setAnalogPinValue(pinB, speedB)

  def setServoAngle(self, instance, angle):
    pin = self.config['servo'][instance]['pins']['pin']
    duty = self.map_value(angle, 0, 180, 1800, 7800) # https://randomnerdtutorials.com/raspberry-pi-pico-servo-motor-micropython/
    self.setAnalogPinValue(pin, duty)

def createRobot():
  global mirte
  mirte = Robot()
  return mirte


