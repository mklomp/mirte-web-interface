import os
import sys
from machine import Pin

def stop():
  # TODO: keep list of used pins?
  Pin("LED", Pin.OUT).off()
  for i in range(0,22):
    Pin(i, Pin.IN, Pin.PULL_DOWN)

def run():
  try:  
    print("__START__") # parsed
    print("----STARTED----") # user info
    exec(open('./mirte.py').read(),globals())
  except KeyboardInterrupt:
    stop()
  except Exception as e:
    print("__START_EXCEPTION__")
    sys.print_exception(e)
    print("__STOP_EXCEPTION__")
  finally:
    if 'main.py' in os.listdir():
      stop()
      print("----STOPPED----") #user info
      print("__STOP__") # parsed

# Note that web interface is killing this script
# when connecting
if __name__ == "__main__":
    run()