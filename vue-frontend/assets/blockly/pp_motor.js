export function load(Blockly, pythonGenerator, instances) {

  if (!instances || instances.length === 0) {
    instances = [["NO PERIPHERAL CONFIGURED", "NO PERIPHERAL CONFIGURED"]]
  }

  Blockly.Extensions.register('dynamic_instances_extension_pp_motor',
    function () {
      if (this.getInput('INSTANCE')) {
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

  pythonGenerator.forBlock['set_speed_pp_motor'] = function (block) {
    pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
    let instance = block.getFieldValue('INSTANCE');
    let speed = pythonGenerator.valueToCode(block, 'SPEED', pythonGenerator.ORDER_ATOMIC)
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

  pythonGenerator.forBlock['set_control_pp_motor'] = function (block) {
    pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
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

  pythonGenerator.forBlock['stop_pp_motor'] = function (block) {
    pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
    let instance = block.getFieldValue('INSTANCE');
    return `mirte.setMotorSpeed('${instance}', 0)\n`;
  };

  return {
    type: "actuators",
    contents: {
      kind: "category",
      name: "%{BKY_PP_MOTOR_TB}",
      colour: "%{BKY_ACTIONS_RGB}",
      contents: [
        { kind: "block", type: "set_speed_pp_motor" },
        { kind: "block", type: "stop_pp_motor" },
        { kind: "block", type: "set_control_pp_motor" },
      ]
    }
  }
}

export function getType() {
  return {
    category: "actuators",
    type: "pp_motor"
  }
}
