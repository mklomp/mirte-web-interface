import os
from machine import Pin

def stop():
  # TODO: keep list of used pins?
  Pin("LED", Pin.OUT).off()
  for i in range(0,22):
    Pin(i, Pin.IN, Pin.PULL_DOWN)

def run():
  try:  
    print("__START__")
    exec(open('./mirte.py').read(),globals())
  except KeyboardInterrupt:
    pass
    stop()
  finally:
    if 'main.py' in os.listdir():
      stop()
      print("__STOP__")

# Note that web interface is killing this script
# when connecting
if __name__ == "__main__":
    run()