export function load(Blockly, pythonGenerator, instances) {

  if (!instances || instances.length === 0) {
    instances = [["NO PERIPHERAL CONFIGURED", "NO PERIPHERAL CONFIGURED"]]
  }

  Blockly.Extensions.register('dynamic_instances_extension_color',
    function () {
      this.getInput('INSTANCE')
        .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');
    });

  Blockly.Blocks['get_color'] = {
    init: function () {
      this.jsonInit({
        "type": "block_type",
        "message0": "%{BKY_COLOR}",
        "args0": [
          {
            "type": "input_dummy",
            "name": "INSTANCE",
          },
          {
            "type": "field_dropdown",
            "name": "TYPE",
            "options": [
              [
                "h",
                "h"
              ],
              [
                "s",
                "s"
              ],
              [
                "l",
                "l"
              ],
            ]
          }
        ],
        "inputsInline": true,
        "colour": "%{BKY_SENSORS_RGB}",
        "output": "Number",
        "extensions": ["dynamic_instances_extension_color"]
      });
    }
  };

  pythonGenerator.forBlock['get_color'] = function (block) {
    pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
    let instance = block.getFieldValue('INSTANCE');
    let type = block.getFieldValue('TYPE');
    let code = `mirte.getColor('${instance}')['${type}']`;
    return [code, pythonGenerator.ORDER_NONE]
  };

  return {
    type: "sensors",
    contents: {
      kind: "category",
      name: "%{BKY_COLOR_SENSOR_TB}",
      colour: "%{BKY_SENSORS_RGB}",
      contents: [
        { kind: "block", type: "get_color" },
      ]
    }
  }
}

export function getType(){
  return {
    category: "sensors",
    type: "color"
  }
}