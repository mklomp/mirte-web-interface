export function load(Blockly, pythonGenerator, instances) {

  if (!instances || instances.length === 0) {
    instances = [["NO PERIPHERAL CONFIGURED", "NO PERIPHERAL CONFIGURED"]]
  }

  Blockly.Extensions.register('dynamic_instances_extension_keypad',
    function () {
      this.getInput('INSTANCE')
        .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');
    });

  Blockly.Blocks['get_button_keypad'] = {
    init: function () {
      this.jsonInit({
        "type": "block_type",
        "message0": "%{BKY_KEYPAD}",
        "args0": [
          {
            "type": "input_dummy",
            "name": "INSTANCE"
          }
        ],
        "inputsInline": true,
        "colour": "%{BKY_SENSORS_RGB}",
        "output": "String",
        "extensions": ["dynamic_instances_extension_keypad"]
      });
    }
  };

  pythonGenerator.forBlock['get_button_keypad'] = function (block) {
    pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
    let instance = block.getFieldValue('INSTANCE');
    let code = `mirte.getKeypad('${instance}')`;
    return [code, pythonGenerator.ORDER_NONE]
  };

  return {
    type: "sensors",
    contents: {
      kind: "category",
      name: "%{BKY_KEYPAD_SENSOR_TB}",
      colour: "%{BKY_SENSORS_RGB}",
      contents: [
        { kind: "block", type: "get_button_keypad" },
      ]
    }
  }

}

export function getType() {
  return {
    category: "sensors",
    type: "keypad"
  }
}