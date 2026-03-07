export function load(Blockly, pythonGenerator, instances) {

  if (!instances || instances.length === 0) {
    instances = [["NO PERIPHERAL CONFIGURED", "NO PERIPHERAL CONFIGURED"]]
  }

  Blockly.Extensions.register('dynamic_instances_extension_servo',
    function () {
      this.getInput('INSTANCE')
        .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');
    });

  Blockly.Blocks['set_angle_servo'] = {
    init: function () {
      this.jsonInit({
        "type": "block_type",
        "message0": "%{BKY_SET_SERVO_ANGLE}",
        "args0": [
          {
            "type": "input_dummy",
            "name": "INSTANCE"
          },
          {
            "type": "input_value",
            "name": "ANGLE",
            "check": "Number"
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": "%{BKY_ACTIONS_RGB}",
        "extensions": ["dynamic_instances_extension_servo"]
      });
    }
  };

  pythonGenerator.forBlock['set_angle_servo'] = function (block) {
    pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
    let instance = block.getFieldValue('INSTANCE');
    let angle = pythonGenerator.valueToCode(block, 'ANGLE', pythonGenerator.ORDER_ATOMIC);
    return `mirte.setServoAngle('${instance}', ${angle})\n`;
  };

    return {
    type: "actuators",
    contents: {
      kind: "category",
      name: "%{BKY_SERVO_TB}",
      colour: "%{BKY_ACTIONS_RGB}",
      contents: [
        { kind: "block", type: "set_angle_servo", inputs: { ANGLE: { block: { type: "math_number", fields: { NUM: 0 } } } } },
      ]
    }
  }

}

export function getType() {
  return {
    category: "actuators",
    type: "servo"
  }
}
