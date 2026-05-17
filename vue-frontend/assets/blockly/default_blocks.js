export function load(Blockly, pythonGenerator) {

    // set_analog_pin_value
    Blockly.Blocks['set_analog_pin_value'] = {
        init: function () {
            this.jsonInit({
                "type": "block_type",
                "message0": "%{BKY_SET_ANALOG_PIN}",
                "args0": [
                    {
                        "type": "field_input",
                        "name": "PIN",
                        "text": "GP0"
                    },
                    {
                        "type": "input_value",
                        "name": "VALUE",
                        "check": "Number"
                    }
                ],
                "inputsInline": true,
                "previousStatement": null,
                "nextStatement": null,
                "colour": "%{BKY_ACTIONS_RGB}"
            });
        }
    };

    pythonGenerator.forBlock['set_analog_pin_value'] = function (block) {
        pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
        var pin = block.getFieldValue('PIN');
        var value = pythonGenerator.valueToCode(block, 'VALUE', pythonGenerator.ORDER_ATOMIC);
        return `mirte.setAnalogPinValue('${pin}', ${value})\n`;
    };

    // set_digital_pin_value
    Blockly.Blocks['set_digital_pin_value'] = {
        init: function () {
            this.jsonInit({
                "type": "block_type",
                "message0": "%{BKY_SET_DIGITAL_PIN}",
                "args0": [
                    {
                        "type": "field_input",
                        "name": "PIN",
                        "text": "LED"
                    },
                    {
                        "type": "input_value",
                        "name": "VALUE",
                        "check": "Boolean"
                    },
                ],
                "inputsInline": true,
                "previousStatement": null,
                "nextStatement": null,
                "colour": "%{BKY_ACTIONS_RGB}"
            });
        }
    };

    pythonGenerator.forBlock['set_digital_pin_value'] = function (block) {
        pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
        var pin = block.getFieldValue('PIN');
        var value = pythonGenerator.valueToCode(block, 'VALUE', pythonGenerator.ORDER_ATOMIC);
        return `mirte.setDigitalPinValue('${pin}', ${value})\n`;
    };


    Blockly.Blocks['get_analog_pin_value'] = {
        init: function () {
            this.jsonInit({
                "type": "block_type",
                "message0": "%{BKY_GET_ANALOG_PIN_VALUE}",
                "args0": [
                    {
                        "type": "field_input",
                        "name": "PIN",
                        "text": "GP26"
                    }
                ],
                "inputsInline": true,
                "output": "Number",
                "colour": "%{BKY_SENSORS_RGB}"
            });
        }
    };

    pythonGenerator.forBlock['get_analog_pin_value'] = function (block) {
        // TODO: Assemble JavaScript into code letiable.
        pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
        let pin = block.getFieldValue('PIN');
        let code = `mirte.getAnalogPinValue('${pin}')`;
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, pythonGenerator.ORDER_NONE];
    };



    Blockly.Blocks['get_digital_pin_value'] = {
        init: function () {
            this.jsonInit({
                "type": "block_type",
                "message0": "%{BKY_GET_DIGITAL_PIN_VALUE}",
                "args0": [
                    {
                        "type": "field_input",
                        "name": "PIN",
                        "text": "GP1"
                    }
                ],
                "inputsInline": true,
                "output": "Boolean",
                "colour": "%{BKY_SENSORS_RGB}"
            });
        }
    };

    pythonGenerator.forBlock['get_digital_pin_value'] = function (block) {
        // TODO: Assemble JavaScript into code letiable.
        pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
        let pin = block.getFieldValue('PIN');
        let code = `mirte.getDigitalPinValue('${pin}')`;
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, pythonGenerator.ORDER_NONE];
    };


    Blockly.Blocks['wait'] = {
        init: function () {
            this.jsonInit({
                "type": "block_type",
                "message0": "%{BKY_WAIT}",
                "args0": [
                    {
                        "type": "input_value",
                        "name": "VALUE",
                        "check": "Number"
                    },
                ],
                "inputsInline": true,
                "previousStatement": null,
                "nextStatement": null,
                "colour": "%{BKY_FLOW_RGB}"
            });
        }
    };

    pythonGenerator.forBlock['wait'] = function (block) {
        pythonGenerator.definitions_['import_time'] = 'import time';
        let value_wait = pythonGenerator.valueToCode(block, 'VALUE', pythonGenerator.ORDER_ATOMIC);
        return 'time.sleep(' + value_wait + ')\n';
    };

    Blockly.Blocks['wait_until'] = {
        init: function () {
            this.jsonInit({
                "type": "block_type",
                "message0": "%{BKY_WAIT_UNTIL}",
                "args0": [
                    {
                        "type": "input_value",
                        "name": "VALUE",
                        "check": "Boolean"
                    },
                ],
                "inputsInline": true,
                "previousStatement": null,
                "nextStatement": null,
                "colour": "%{BKY_FLOW_RGB}"
            });
        }
    };

    pythonGenerator.forBlock['wait_until'] = function (block) {
        pythonGenerator.definitions_['import_time'] = 'import time';
        let value_condition = pythonGenerator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
        // TODO: make sleep depend on frequency of topic
        return "wait_cond = " + value_condition + "\nwhile not(wait_cond):\n\ttime.sleep(.1)\n\twait_cond = " + value_condition + "\n";
    };

    Blockly.Blocks['get_timestamp'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("tijd sinds")
                .appendField(new Blockly.FieldDropdown([['begin', 'start'], ['laatste aanroep', 'call']]), 'version');
            this.setOutput(true, null);
            this.setColour("%{BKY_FLOW_RGB}");
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };

    pythonGenerator.forBlock['get_timestamp'] = function (block) {
        pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
        let version = block.getFieldValue('version');
        let code = `mirte.getTimestamp()`;
        if (version.localeCompare("start") !== 0) {
            code = `mirte.getTimeSinceLastCall()`;
        }
        return [code, pythonGenerator.ORDER_NONE];
    };
}

export function getType(){
  return 
}