export function load (Blockly, instances) {

    if (instances.length === 0) {
        instances = [["NO PERIPHERAL CONFIGURED","NO PERIPHERAL CONFIGURED"]]
    }

    Blockly.Extensions.register('dynamic_instances_extension_color',
    function() {
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

    Blockly.Python['get_color'] = function (block) {
      Blockly.Python.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
      let instance = block.getFieldValue('INSTANCE');
      let type = block.getFieldValue('TYPE');
      let code = `mirte.getColor('${instance}')['${type}']`;
      return [code, Blockly.Python.ORDER_NONE]
    };
}
