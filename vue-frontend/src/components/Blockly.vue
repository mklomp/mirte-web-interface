<template>
  <div class="h-100">
    <div id="blocklyArea" ref="blocklyArea" class="blocklyArea h-100">
      <div id="blocklyDiv" ref="blocklyDiv" style="height: 480px; width: 600px"></div>
    </div>

    <xml id="toolbox" ref="toolbox" style="display: none">


      <category name="%{BKY_SENSORS}" colour="%{BKY_SENSORS_RGB}" expanded=true>

         <category name="%{BKY_ROBOT}" colour="%{BKY_SENSORS_RGB}">
            <block type="get_analog_pin_value"></block>
            <block type="get_digital_pin_value"></block>
         </category>


        <category v-for="sensor in getPByKind('Sensors')" :name="$t('peripherals.' + peripherals[sensor].text)"
                  colour="%{BKY_SENSORS_RGB}">
          <block v-for="func in peripherals[sensor].functions"
                 :type="func.concat('_').concat(sensor)">
          </block>
        </category>
      </category>



      <category name="%{BKY_FLOW}" colour="%{BKY_FLOW_RGB}" expanded="true">

        <category name="%{BKY_LOOPS}" colour="%{BKY_FLOW_RGB}">
          <block type="controls_repeat_ext">
            <value name="TIMES">
              <block type="math_number">
                <field name="NUM">10</field>
              </block>
            </value>
          </block>
          <block type="controls_whileUntil"></block>
          <block type="controls_for">
            <field name="VAR">i</field>
            <value name="FROM">
              <block type="math_number">
                <field name="NUM">1</field>
              </block>
            </value>
            <value name="TO">
              <block type="math_number">
                <field name="NUM">10</field>
              </block>
            </value>
            <value name="BY">
              <block type="math_number">
                <field name="NUM">1</field>
              </block>
            </value>
          </block>
          <block type="controls_forEach"></block>
          <block type="controls_flow_statements"></block>
        </category>

        <category name="%{BKY_TIME}" colour="%{BKY_FLOW_RGB}">
          <block type="wait">
            <value name="wait">
              <block type="math_number">
                <field name="NUM">1</field>
              </block>
            </value>
          </block>
          <block type="wait_until"></block>
          <block type="get_timestamp"></block>
        </category>

        <category name="%{BKY_CONDITIONS}" colour="%{BKY_FLOW_RGB}">
          <block type="controls_if"></block>
          <block type="controls_if">
            <mutation else="1"></mutation>
          </block>
          <block type="controls_if">
            <mutation elseif="1" else="1"></mutation>
          </block>
        </category>

        <category name="%{BKY_FUNCTIONS}" custom="PROCEDURE" colour="%{BKY_FLOW_RGB}">
        </category>

      </category>

      <category name="%{BKY_DATA}" colour="%{BKY_DATA_RGB}" expanded="true">

        <category name="%{BKY_LOGIC}" colour="%{BKY_DATA_RGB}">
          <block type="logic_compare"></block>
          <block type="logic_operation"></block>
          <block type="logic_negate"></block>
          <block type="logic_boolean"></block>
          <block type="logic_null"></block>
          <block type="logic_ternary"></block>
        </category>

        <category name="%{BKY_MATH}" colour="%{BKY_DATA_RGB}">
          <block type="math_number">
            <field name="NUM">123</field>
          </block>
          <block type="math_arithmetic"></block>
          <block type="math_single"></block>
          <block type="math_trig"></block>
          <block type="math_constant"></block>
          <block type="math_number_property"></block>
          <block type="math_round"></block>
          <block type="math_on_list"></block>
          <block type="math_modulo"></block>
          <block type="math_constrain">
            <value name="LOW">
              <block type="math_number">
                <field name="NUM">1</field>
              </block>
            </value>
            <value name="HIGH">
              <block type="math_number">
                <field name="NUM">100</field>
              </block>
            </value>
          </block>
          <block type="math_random_int">
            <value name="FROM">
              <block type="math_number">
                <field name="NUM">1</field>
              </block>
            </value>
            <value name="TO">
              <block type="math_number">
                <field name="NUM">100</field>
              </block>
            </value>
          </block>
          <block type="math_random_float"></block>
          <block type="math_atan2"></block>
        </category>

        <category name="%{BKY_LISTS}" colour="%{BKY_DATA_RGB}">
          <block type="lists_create_empty"></block>
          <block type="lists_create_with"></block>
          <block type="lists_repeat">
            <value name="NUM">
              <block type="math_number">
                <field name="NUM">5</field>
              </block>
            </value>
          </block>
          <block type="lists_length"></block>
          <block type="lists_isEmpty"></block>
          <block type="lists_indexOf"></block>
          <block type="lists_getIndex"></block>
          <block type="lists_setIndex"></block>
        </category>

        <category name="%{BKY_VARIABLES}" custom="VARIABLE" colour="%{BKY_DATA_RGB}">
        </category>

      </category>

      <category name="%{BKY_ACTIONS}" colour="%{BKY_ACTIONS_RGB}" expanded=true>

         <category name="%{BKY_ROBOT}" colour="%{BKY_ACTIONS_RGB}">

            <block type="text_print">
              <value name="TEXT">
                <block type="text"></block>
              </value>
            </block> 

            <block type="set_analog_pin_value"></block>

            <block type="set_digital_pin_value"></block>

         </category>

        <category v-for="actuator in getPByKind('Actuators')" :name="$t('peripherals.' + peripherals[actuator].text)"
                  colour="%{BKY_ACTIONS_RGB}">
          <block v-for="func in peripherals[actuator].functions"
                 :type="func.concat('_').concat(actuator)">
          </block>
        </category>
     </category>

    </xml>
</div>
</template>

<script>
import ROSLIB from 'roslib'
import ros from '../ws-connection/ROS-connection.js'
import Blockly from 'blockly'
import 'blockly/python'
import EventBus from '../event-bus'
import * as NL from 'blockly/msg/nl'
import CustomNL from "../../locales/nl.json"
import * as EN from 'blockly/msg/en'
import CustomEN from "../../locales/en.json"

var CombinedNL = { ...(JSON.parse(JSON.stringify(CustomNL.blockly))),  ...NL} ;
var CombinedEN = { ...(JSON.parse(JSON.stringify(CustomEN.blockly))),  ...EN} ;

var locales = { "nl": CombinedNL, "en": CombinedEN};

import properties_ph from "../assets/json/properties_ph.json"

//Peripheral Blockly Modules imports
const PBM = {}
PBM.default = require(`../assets/blockly/default_blocks.js`)
for (let type of Object.keys(properties_ph)) {
  PBM[type] = require(`../assets/blockly/${type}.js`)
}

const predefined_blocks = {
  controls_repeat_ext: "%{BKY_FLOW_RGB}",
  controls_whileUntil: "%{BKY_FLOW_RGB}",
  controls_for: "%{BKY_FLOW_RGB}",
  controls_forEach: "%{BKY_FLOW_RGB}",
  controls_flow_statements: "%{BKY_FLOW_RGB}",
  controls_if: "%{BKY_FLOW_RGB}",
  procedures_defnoreturn: "%{BKY_FLOW_RGB}",
  procedures_defreturn: "%{BKY_FLOW_RGB}",
  procedures_ifreturn: "%{BKY_FLOW_RGB}",
  variables_set: "%{BKY_DATA_RGB}",
  variables_get: "%{BKY_DATA_RGB}",
  math_change: "%{BKY_DATA_RGB}",
  logic_compare: "%{BKY_DATA_RGB}",
  logic_operation: "%{BKY_DATA_RGB}",
  logic_negate: "%{BKY_DATA_RGB}",
  logic_boolean: "%{BKY_DATA_RGB}",
  logic_null: "%{BKY_DATA_RGB}",
  logic_ternary: "%{BKY_DATA_RGB}",
  math_number: "%{BKY_DATA_RGB}",
  math_arithmetic: "%{BKY_DATA_RGB}",
  math_single: "%{BKY_DATA_RGB}",
  math_trig: "%{BKY_DATA_RGB}",
  math_constant: "%{BKY_DATA_RGB}",
  math_number_property: "%{BKY_DATA_RGB}",
  math_round: "%{BKY_DATA_RGB}",
  math_on_list: "%{BKY_DATA_RGB}",
  math_modulo: "%{BKY_DATA_RGB}",
  math_constrain: "%{BKY_DATA_RGB}",
  math_random_int: "%{BKY_DATA_RGB}",
  math_random_float: "%{BKY_DATA_RGB}",
  math_atan2: "%{BKY_DATA_RGB}",
  lists_create_empty: "%{BKY_DATA_RGB}",
  lists_create_with: "%{BKY_DATA_RGB}",
  lists_repeat: "%{BKY_DATA_RGB}",
  lists_length: "%{BKY_DATA_RGB}",
  lists_isEmpty: "%{BKY_DATA_RGB}",
  lists_indexOf: "%{BKY_DATA_RGB}",
  lists_getIndex: "%{BKY_DATA_RGB}",
  lists_setIndex: "%{BKY_DATA_RGB}",
  text_print: "%{BKY_ACTIONS_RGB}",
}

export default {
  data: () => ({
    peripherals: properties_ph,
    workspace: Object,
    prefix: "",
    params: {},
  }),

  methods: {
    // highlightBlockLine and getBlockToLineMap are methods which are used in marking
    // the blocks where the execution is currently at (the line number of it).
    getBlockToLineMap: function () {
      const blockMap = {}
      const offset = (this.prefix.match(/\n/g) || []).length + 1
      Blockly.Python.STATEMENT_PREFIX = "blockID: %1"
      const code = Blockly.Python.workspaceToCode(this.workspace)
      let codeLines = code.split("\n")
      for (let i = 0; i < codeLines.length; i++) {
        let line = codeLines[i].trim()
        let blockIdStr = line.lastIndexOf("blockID: ")
        if (blockIdStr >= 0) {
          line = line.substr(blockIdStr)
          blockMap[i + offset] = line.substr(10, 20)
        }
      }
      Blockly.Python.STATEMENT_PREFIX = ""
      return blockMap
    },
    highlightBlockLine: function (blockId, isParent) {
      if (isParent) {
        this.workspace.highlightBlock(blockId)
      } else {
        this.workspace.highlightBlock(blockId, true)
      }
      let curBlock = this.workspace.getBlockById(blockId)
      if (curBlock) {
        let children = curBlock.getChildren()
        let blockMap = this.getBlockToLineMap() // TODO: this should only be generated when the block change. Not while running.
        for (let child = 0; child < children.length; child++) {
          if (Object.values(blockMap).indexOf(children[child].id) === -1) {
            this.highlightBlockLine(children[child].id, false)
          }
        }
      }
    },
    refresh: function(){
    // Load the interpreter now, and upon future changes.
    //generateCodeAndLoadIntoInterpreter();
       this.workspace.addChangeListener((event) => {
         //console.log(event);
         if (event instanceof Blockly.Events.Move || event instanceof Blockly.Events.Delete || event instanceof Blockly.Events.Change) {
           // Something changed. Parser needs to be reloaded.

           var code = Blockly.Python.workspaceToCode(this.workspace);

           code = this.prefix + code;
           // cmEditor.setValue(code);

           var xml = Blockly.Xml.workspaceToDom(this.workspace);
           var xml_text = Blockly.Xml.domToText(xml);
           localStorage.setItem("blockly", xml_text);

           // update the store
           this.$store.dispatch('setCode', code)
           // this.$store.dispatch('setBlockly', xml_text)
         }
       });
    },
    //separates peripheral items into sensors and actuators
    getPByKind(kind) {
      const AP = new Set()

      for (let type in this.params){
         for (let instance in this.params[type]){
             if(type == "motor"){
                type = "motor_" + this.params["motor"][Object.keys(this.params["motor"])[0]].type;
             }
             if (this.peripherals.hasOwnProperty(type) && this.peripherals[type].rel_path.split("\\")[0] == kind ){
                 AP.add(type)
             }
         }
      }
      return AP
    },
    // Loads in imported blockly modules block definitions
    load_blockly_modules() {
      let PConfig = this.$store.getters.getPConfig;

      // Load default blocks
      PBM["default"].load(Blockly, []);

      for (let pbm of Object.keys(PBM)) {
        let pbm2 = pbm;
        if(pbm.substr(0,6) == "motor_"){
           pbm2 = "motor";
        }

        if (this.params.hasOwnProperty(pbm2)){
           let items = []
           for (const [key, value] of Object.entries(this.params[pbm2])) {
             if (pbm2 != "motor" || value.type == pbm.substr(6)){
               // We use [T.name, T.name] here because the dropdown menu generator
               // of blockly requires an array as [showSelectOption, resultValue].
               items.push([value.name, value.name]);
             }
           }
           PBM[pbm].load(Blockly, items )
        }


      }
    },
    refresh_blockly(){

        // Get current values
        var xml = Blockly.Xml.workspaceToDom(this.workspace);
        var toolbox_item = this.workspace.toolbox_.getSelectedItem();
        this.workspace.dispose();

       // Reint workspace
       this.workspace.dispose();
       this.workspace = Blockly.inject(blocklyDiv,
         {toolbox: this.$refs.toolbox,
          media: 'blockly-media/',
         zoom: {
         controls: true,
         wheel: true,
         startScale: 0.8,
         maxScale: 3,
         minScale: 0.3,
         scaleSpeed: 1.2
         },
         renderer: 'zelos'
        });

        // Reinit saved values
        Blockly.Xml.domToWorkspace(xml, this.workspace);
        this.workspace.toolbox_.setSelectedItem(toolbox_item);
        this.refresh();
    },
    load_blockly(){

      // Blockly configuration
      Blockly.setLocale(locales[this.$i18n.locale])
      // Palette generated by: https://coolors.co/5a7574-cfd186-e3655b-52414c-5b8c5a-57467b
      Blockly.Msg.FLOW_RGB = "#e3655b"
      Blockly.Msg.DATA_RGB = "#52414c"
      Blockly.Msg.MODULES_RGB = "#cfd186"
      Blockly.Msg.SENSORS_RGB = "#5b8c5a"
      Blockly.Msg.ACTIONS_RGB = "#57467b"
  
      // workspace initialization
      const blocklyArea = this.$refs.blocklyArea
      const blocklyDiv = this.$refs.blocklyDiv
      this.workspace = Blockly.inject(blocklyDiv, {
        toolbox: this.$refs.toolbox,
        media: 'blockly-media/',
        zoom: {
          controls: true,
          wheel: true,
          startScale: 0.8,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        renderer: 'zelos'
      })

      // workspace configuration
      this.workspace.toolbox_.flyout_.autoClose = false
  
      // Window resize listener
      const onresize = (e) => {
        // Compute the absolute coordinates and dimensions of blocklyArea.
        let element = blocklyArea
        let x = 0
        let y = 0
        // Sums over all the elements' parents offsets
        do {
          x += element.offsetLeft
          y += element.offsetTop
          element = element.offsetParent
        } while (element)
        // Position blocklyDiv over blocklyArea.
        blocklyDiv.style.left = x + 'px'
        blocklyDiv.style.top = y + 'px'
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px'
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px'
        Blockly.svgResize(this.workspace)
      }
      window.addEventListener('resize', onresize, false)
      onresize()
  
      this.refresh();


      // Undo/Redo
      EventBus.$on('control', (payload) => {
        switch (payload) {
          case "undo":
            this.workspace.undo(false)
            break
          case "redo":
            this.workspace.undo(true)
            break
        }
      })
  
      // Recolor predefined Blocks
      for (const [key, value] of Object.entries(predefined_blocks)) {
        //https://groups.google.com/forum/#!topic/blockly/yUBEymLKBbk
        const blk = Blockly.Blocks[key]
        const oldInit = blk.init
        blk.init = function () {
          oldInit.call(this)
          this.setColour(value)
        }
      }

      this.load_blockly_modules();

      const storage = localStorage.getItem("blockly")
      if (storage !== null) {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(storage), this.workspace)
      }

    }
   
  },

  watch: {
     '$i18n.locale': function(newVal, oldVal){
        Blockly.setLocale(locales[newVal]);
        this.refresh_blockly();
     },
    '$store.getters.getLinenumber':
        function (newVal, oldVal) {
          let blockMap = this.getBlockToLineMap() // TODO: this should only be generated when the block change. Not while running.
          this.highlightBlockLine(blockMap[newVal], true)
        },
    '$store.getters.getPConfig':
        function (newVal, oldVal) {
          window.location.reload()
        },
    '$store.getters.getBlockly':
        function (newVal, oldVal) {
          if (newVal != ""){
            Blockly.mainWorkspace.clear()
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(newVal), this.workspace)
            Blockly.mainWorkspace.zoomToFit()
            this.$store.dispatch('setBlockly', "")
          }
        },
  },
  mounted() {

     let params = new ROSLIB.Param({
       ros: ros,
       name: '/mirte'
     })

     params.get((res) => {
       this.params = res;
       setTimeout(this.load_blockly, 500);
     })
  }
}


</script>
