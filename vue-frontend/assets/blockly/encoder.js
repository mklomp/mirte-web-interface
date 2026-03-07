export function load(Blockly, pythonGenerator, instances) {

  if (!instances || instances.length === 0) {
    instances = [["NO PERIPHERAL CONFIGURED", "NO PERIPHERAL CONFIGURED"]]
  }

  Blockly.Extensions.register('dynamic_instances_extension_encoder',
    function () {
      this.getInput('INSTANCE')
        .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');
    });

  Blockly.Blocks['get_ticks_encoder'] = {
    init: function () {
      this.jsonInit({
        "type": "block_type",
        "message0": "%{BKY_WHEEL_ENCODER}",
        "args0": [
          {
            "type": "input_dummy",
            "name": "INSTANCE"
          }
        ],
        "inputsInline": true,
        "colour": "%{BKY_SENSORS_RGB}",
        "output": "Number",
        "extensions": ["dynamic_instances_extension_encoder"]
      });
    }
  };

  pythonGenerator.forBlock['get_ticks_encoder'] = function (block) {
    pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
    let instance = block.getFieldValue('INSTANCE');
    let code = `mirte.getEncoder('${instance}')`;
    return [code, pythonGenerator.ORDER_NONE];
  };

  return {
    type: "sensors",
    contents: {
      kind: "category",
      name: "%{BKY_WHEEL_ENCODER_TB}",
      colour: "%{BKY_SENSORS_RGB}",
      contents: [
        { kind: "block", type: "get_ticks_encoder" },
      ]
    }
  }

}

export function getType() {
  return {
    category: "sensors",
    type: "encoder"
  }
}