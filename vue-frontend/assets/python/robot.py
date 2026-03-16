from machine import Pin, ADC, PWM
mirte = {}

class Robot():
  def __init__(self):
    i = 20
    
  def stripGP(self, s):
    return s[2:] if s.startswith("GP") else s

  def setDigitalPinValue(self, pin, value):
    Pin(int(self.stripGP(pin)), Pin.OUT).value(value)

  def setAnalogPinValue(self, pin, value):
    pwm = PWM(Pin(int(self.stripGP(pin))))
    pwm.freq(1000)
    pwm.duty_u16(value)

  def getDigitalPinValue(self, pin):
    return Pin(int(self.stripGP(pin)), Pin.IN).value()

  def getAnalogPinValue(self, pin):
    return ADC(int(self.stripGP(pin))).read_u16()

def createRobot():
  global mirte
  mirte = Robot()
  return mirte


