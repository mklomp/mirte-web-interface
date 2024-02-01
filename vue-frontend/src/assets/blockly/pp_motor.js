export function load (Blockly, instances) {

    if (instances.length === 0) {
        instances = [["NO PERIPHERAL CONFIGURED","NO PERIPHERAL CONFIGURED"]]
    }

    Blockly.Extensions.register('dynamic_instances_extension_pp_motor',
    function() {
      if (this.getInput('INSTANCE')){
        this.getInput('INSTANCE')
        .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');
      }
    });


    Blockly.Blocks['set_speed_pp_motor'] = {
	init: function () {
            this.jsonInit({
		  "type": "block_type",
		  "message0": "%{BKY_SET_MOTOR_SPEED}",
		  "args0": [
		    {
		      "type": "input_dummy",
                      "name": "INSTANCE"
		    },
		    {
		      "type": "input_value",
		      "name": "SPEED",
		      "check": "Number"
		    }
		  ],
		  "inputsInline": true,
		  "previousStatement": null,
		  "nextStatement": null,
		  "colour": "%{BKY_ACTIONS_RGB}",
                  "extensions": ["dynamic_instances_extension_pp_motor"]
            });
        }
    };

    Blockly.Python['set_speed_pp_motor'] = function (block) {
        Blockly.Python.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
        let instance = block.getFieldValue('INSTANCE');
        let speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_ATOMIC)
        return `mirte.setMotorSpeed('${instance}', ${speed})\n`;
    };

    Blockly.Blocks['set_control_pp_motor'] = {
        init: function () {
            this.jsonInit({
                  "type": "block_type",
                  "message0": "%{BKY_SET_MOTOR_CONTROL}",
                  "args0": [
                    {
                      "type": "field_dropdown",
                      "name": "TYPE",
                      "options": [
                        [
                          "stop",
                          "False"
                        ],
                        [
                          "start",
                          "True"
                        ]
                      ]
                    }
                  ],
                  "inputsInline": true,
                  "previousStatement": null,
                  "nextStatement": null,
                  "colour": "%{BKY_ACTIONS_RGB}",
                  "extensions": ["dynamic_instances_extension_pp_motor"]
            });
        }
    };

    Blockly.Python['set_control_pp_motor'] = function (block) {
        Blockly.Python.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
        let type = block.getFieldValue('TYPE');
        return `mirte.setMotorControl(${type})\n`;
    };

    Blockly.Blocks['stop_pp_motor'] = {
        init: function () {
            this.jsonInit({
                  "type": "block_type",
                  "message0": "%{BKY_STOP_MOTOR}",
                  "args0": [
                    {
                      "type": "input_dummy",
                      "name": "INSTANCE"
                    }
                  ],
                  "inputsInline": true,
                  "previousStatement": null,
                  "nextStatement": null,
                  "colour": "%{BKY_ACTIONS_RGB}",
                  "extensions": ["dynamic_instances_extension_pp_motor"]
            });
        }
    };

    Blockly.Python['stop_pp_motor'] = function (block) {
        Blockly.Python.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
        let instance = block.getFieldValue('INSTANCE');
        return `mirte.setMotorSpeed('${instance}', 0)\n`;
    };
}
