export function load(Blockly, pythonGenerator, instances) {

  if (!instances || instances.length === 0) {
    instances = [["NO PERIPHERAL CONFIGURED", "NO PERIPHERAL CONFIGURED"]]
  }

  Blockly.Extensions.register('dynamic_instances_extension_oled',
    function () {
      this.getInput('INSTANCE')
        .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');
    });

  Blockly.Blocks['set_oled_oled'] = {
    init: function () {
      this.jsonInit({
        "type": "block_type",
        "message0": "%{BKY_SET_OLED}",
        "args0": [
          {
            "type": "input_dummy",
            "name": "INSTANCE",
          },
          /*		    {
                    "type": "field_dropdown",
                    "name": "TYPE",
                    "options": [
                      [
                        "text",
                        "TEXT"
                      ],
                      [
                        "image",
                        "IMAGE"
                      ],
                      [
                        "animation",
                        "ANIMATION"
                      ]
                    ]
                  },*/
          {
            "type": "input_value",
            "name": "VALUE",
            "check": "String"
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": "%{BKY_ACTIONS_RGB}",
        "extensions": ["dynamic_instances_extension_oled"]
      });
    }
  };


  pythonGenerator.forBlock['set_oled_oled'] = function (block) {
    pythonGenerator.definitions_['import_mirte'] = 'from mirte_robot import robot\nmirte=robot.createRobot()';
    let value = pythonGenerator.valueToCode(block, 'VALUE', pythonGenerator.ORDER_ATOMIC);
    let type = block.getFieldValue('TYPE');
    let instance = block.getFieldValue('INSTANCE');
    let code = '';
    code = `mirte.setOLEDText('${instance}', ${value})\n`;
    /*        if (type == "TEXT"){
               code = `mirte.setOLEDText('${instance}', ${value})\n`;
            }
            if (type == "IMAGE"){
               code = `mirte.setOLEDImage('${instance}', ${value})\n`;
            }
            if (type == "ANIMATION"){
               code = `mirte.setOLEDAnimation('${instance}', ${value})\n`;
            }*/
    return code;
  };

  return {
    type: "actuators",
    contents: {
      kind: "category",
      name: "%{BKY_OLED_TB}",
      colour: "%{BKY_ACTIONS_RGB}",
      contents: [
        { kind: "block", type: "set_oled_oled", inputs: { VALUE: { block: { type: "text", fields: { TEXT: "" } } } } },
      ]
    }
  }

}

export function getType() {
  return {
    category: "actuators",
    type: "oled"
  }
}
