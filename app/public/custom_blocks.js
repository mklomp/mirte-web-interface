

// Blockly block definition
Blockly.Blocks['move'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move ")
        .appendField(new Blockly.FieldDropdown([
          ['forward', 'forward'],
          ['backward', 'backward']
        ]), 'direction')
        .appendField("with speed")
        .appendField(new Blockly.FieldNumber(1), "speed");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(130);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

// Blockly generator
Blockly.Python['move'] = function(block) {
  let direction = block.getFieldValue('direction');
  let speed = block.getFieldValue('speed');
  let code = `robot.move('${direction}', ${speed})\n`;
  return code;
};

// Blockly block definition
Blockly.Blocks['turn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn ")
        .appendField(new Blockly.FieldDropdown([
          ['left', 'left'],
          ['right', 'right']
        ]), 'direction')
        .appendField("speed")
        .appendField(new Blockly.FieldNumber(1), "speed");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(130);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

// Blockly generator
Blockly.Python['turn'] = function(block) {
  let direction = block.getFieldValue('direction');
  let speed = block.getFieldValue('speed');
  let code = 'robot.turn(\'' + direction + '\', ' + speed + ')\n';
  return code;
};


// Blockly block definition
Blockly.Blocks['display_text'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Display text")
        .appendField(new Blockly.FieldTextInput("Hello, World!"), "text");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(130);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

// Blockly generator
Blockly.Python['display_text'] = function(block) {
  let text = block.getFieldValue('text');
  let code = `robot.display_text("${text}")\n`;
  return code;
};


// Blockly block definition
Blockly.Blocks['turnAngle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn with angle ")
        .appendField(new Blockly.FieldAngle(90), "angle");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(130);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

// Blockly generator
Blockly.Python['turnAngle'] = function(block) {
  let angle_angle = block.getFieldValue('angle');
  let code = 'robot.turnAngle(' + angle_angle + ')\n';
  return code;
};


// Blockly block definition
Blockly.Blocks['wait'] = {
  init: function() {
    this.appendValueInput("wait")
        .setCheck("Number")
        .appendField("Wait ");
    this.appendDummyInput()
        .appendField("second(s)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(130);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

// Blockly generator
Blockly.Python['wait'] = function(block) {
  let value_wait = Blockly.Python.valueToCode(block, 'wait', Blockly.Python.ORDER_ATOMIC);
  let code = 'time.sleep(' + value_wait + ')\n';
  return code;
};

// Blockly generator
Blockly.Blocks['get_distance'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("get distance");
    this.setOutput(true, null);
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['get_distance'] = function(block) {
  // TODO: Assemble JavaScript into code letiable.
  let code = 'robot.getDistance()';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['wait_until'] = {
  init: function() {
    this.appendValueInput("condition")
        .setCheck("Boolean")
        .appendField("Wait until");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(130);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


// Blockly generator
Blockly.Python['wait_until'] = function(block) {
  let value_condition = Blockly.Python.valueToCode(block, 'condition', Blockly.Python.ORDER_ATOMIC);
  let code = "wait_cond = " + value_condition + "\nwhile not(wait_cond):\n\ttime.sleep(.1)\n\twait_cond = " + value_condition + "\n";
  // TODO: make sleep depend on frequency of topic
  return code;
};
