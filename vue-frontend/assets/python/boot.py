from ble import ble_uart_repl

try:
    ble_uart_repl.start()
except KeyboardInterrupt:
    print("boot")
    
print("done boot")

