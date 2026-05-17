try:
    from ble import ble_uart_repl
    ble_uart_repl.start()
except Exception as e:
    # Probably no BLE on the MCU
    pass

