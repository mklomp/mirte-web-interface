export function load(Blockly, pythonGenerator, instances) {

  if (!instances || instances.length === 0) {
    instances = [["NO PERIPHERAL CONFIGURED", "NO PERIPHERAL CONFIGURED"]]
  }

  Blockly.Extensions.register('dynamic_instances_extension_line',
    function () {
      this.getInput('INSTANCE')
        .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');
    });

  Blockly.Blocks['get_value_line'] = {
    init: function () {
      this.jsonInit({
        "type": "block_type",
        "message0": "%{BKY_LINE_SENSOR}",
        "args0": [
          {
            "type": "input_dummy",
            "name": "INSTANCE"
          }
        ],
        "inputsInline": true,
        "colour": "%{BKY_SENSORS_RGB}",
        "output": "Number",
        "extensions": ["dynamic_instances_extension_line"]
      });
    }
  };

  pythonGenerator.forBlock['get_value_line'] = function (block) {
    pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
    let instance = block.getFieldValue('INSTANCE');
    let code = `mirte.getLine('${instance}')`;
    return [code, pythonGenerator.ORDER_NONE]
  };

  return {
    type: "sensors",
    contents: {
      kind: "category",
      name: "%{BKY_LINE_SENSOR_TB}",
      colour: "%{BKY_SENSORS_RGB}",
      contents: [
        { kind: "block", type: "get_value_line" },
      ]
    }
  }

}

export function getType() {
  return {
    category: "sensors",
    type: "line"
  }
}