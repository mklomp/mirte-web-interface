import os
from machine import Pin
try:
  exec(open('./mirte.py').read(),globals())
except KeyboardInterrupt:
  for i in range(0,29):
    Pin(i, Pin.IN, Pin.PULL_DOWN)
except:
  pass
finally:
  if 'main.py' in os.listdir():
    for i in range(0,29):
      Pin(i, Pin.IN, Pin.PULL_DOWN)
    print("__STOP__")
