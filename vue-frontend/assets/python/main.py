import os
from machine import Pin

# Note that web interface is killing this script
# when connecting

def stop():
  for i in range(0,29):
    Pin(i, Pin.IN, Pin.PULL_DOWN)

def run():
  try:  
    print("__START__")
    exec(open('./mirte.py').read(),globals())
  except KeyboardInterrupt:
    pass
    #stop()
  finally:
    #if 'main.py' in os.listdir():
    #  stop()
    print("__STOP__")

if __name__ == "__main__":
    run()

#import os
#from machine import Pin
#try:
#  print("__START__")
#  exec(open('./mirte.py').read(),globals())
#except KeyboardInterrupt:
#  for i in range(0,29):
#    Pin(i, Pin.IN, Pin.PULL_DOWN)
#except Exception as e:
#  print(e)
#finally:
#  if 'main.py' in os.listdir():
#    for i in range(0,29):
#      Pin(i, Pin.IN, Pin.PULL_DOWN)
#    print("__STOP__")
