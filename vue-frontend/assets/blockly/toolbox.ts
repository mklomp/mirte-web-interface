export const toolboxJson = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      id: "sensors",
      name: "%{BKY_SENSORS}",
      colour: "%{BKY_SENSORS_RGB}",
      expanded: true,
      contents: [
        {
          kind: "category",
          name: "%{BKY_ROBOT}",
          colour: "%{BKY_SENSORS_RGB}",
          contents: [
            { kind: "block", type: "get_analog_pin_value" },
            { kind: "block", type: "get_digital_pin_value" }
          ]
        }
      ]
    },
    {
      kind: "category",
      name: "%{BKY_FLOW}",
      colour: "%{BKY_FLOW_RGB}",
      expanded: true,
      contents: [
        {
          kind: "category",
          name: "%{BKY_LOOPS}",
          colour: "%{BKY_FLOW_RGB}",
          contents: [
            {
              kind: "block",
              type: "controls_repeat_ext",
              inputs: {
                TIMES: {
                  block: {
                    type: "math_number",
                    fields: { NUM: 10 }
                  }
                }
              }
            },
            {
              kind: "block",
              type: "controls_whileUntil",
              inputs: {
                BOOL: {
                  block: {
                    type: "logic_boolean",
                    fields: { BOOL: true }
                  }
                }
              }
            },
            {
              kind: "block",
              type: "controls_for",
              fields: { VAR: "i" },
              inputs: {
                FROM: { block: { type: "math_number", fields: { NUM: 1 } } },
                TO: { block: { type: "math_number", fields: { NUM: 10 } } },
                BY: { block: { type: "math_number", fields: { NUM: 1 } } }
              }
            },
            { kind: "block", type: "controls_forEach" },
            { kind: "block", type: "controls_flow_statements" }
          ]
        },
        {
          kind: "category",
          name: "%{BKY_TIME}",
          colour: "%{BKY_FLOW_RGB}",
          contents: [
            {
              kind: "block",
              type: "wait",
              inputs: {
                VALUE: { block: { type: "math_number", fields: { NUM: 1 } } }
              }
            },
            { kind: "block", type: "wait_until" }
            // { kind: "block", type: "get_timestamp" }
          ]
        },
        {
          kind: "category",
          name: "%{BKY_CONDITIONS}",
          colour: "%{BKY_FLOW_RGB}",
          contents: [
            { kind: "block", type: "controls_if" },
            { kind: "block", type: "controls_if", extraState: { elseIfCount: 0, hasElse: true } },
            { kind: "block", type: "controls_if", extraState: { elseIfCount: 1, hasElse: true } }
          ]
        },
        {
          kind: "category",
          name: "%{BKY_FUNCTIONS}",
          colour: "%{BKY_FLOW_RGB}",
          custom: "PROCEDURE"
        }
      ]
    },
    {
      kind: "category",
      name: "%{BKY_DATA}",
      colour: "%{BKY_DATA_RGB}",
      expanded: true,
      contents: [
        {
          kind: "category",
          name: "%{BKY_LOGIC}",
          colour: "%{BKY_DATA_RGB}",
          contents: [
            { kind: "block", type: "logic_compare" },
            { kind: "block", type: "logic_operation" },
            { kind: "block", type: "logic_negate" },
            { kind: "block", type: "logic_boolean" },
            { kind: "block", type: "logic_null" },
            { kind: "block", type: "logic_ternary" }
          ]
        },
        {
          kind: "category",
          name: "%{BKY_MATH}",
          colour: "%{BKY_DATA_RGB}",
          contents: [
            { kind: "block", type: "math_number", fields: { NUM: 123 } },
            { kind: "block", type: "math_arithmetic" },
            { kind: "block", type: "math_single" },
            { kind: "block", type: "math_trig" },
            { kind: "block", type: "math_constant" },
            { kind: "block", type: "math_number_property" },
            { kind: "block", type: "math_round" },
            { kind: "block", type: "math_on_list" },
            { kind: "block", type: "math_modulo" },
            {
              kind: "block",
              type: "math_constrain",
              inputs: {
                LOW: { block: { type: "math_number", fields: { NUM: 1 } } },
                HIGH: { block: { type: "math_number", fields: { NUM: 100 } } }
              }
            },
            {
              kind: "block",
              type: "math_random_int",
              inputs: {
                FROM: { block: { type: "math_number", fields: { NUM: 1 } } },
                TO: { block: { type: "math_number", fields: { NUM: 100 } } }
              }
            },
            { kind: "block", type: "math_random_float" },
            { kind: "block", type: "math_atan2" }
          ]
        },
        {
          kind: "category",
          name: "%{BKY_CATTEXT}",
          colour: "%{BKY_DATA_RGB}",
          contents: [
            { kind: "block", type: "text" },
            { kind: "block", type: "text_join" },
            { kind: "block", type: "text_append" },
            { kind: "block", type: "text_length" },
            { kind: "block", type: "text_isEmpty" },
            { kind: "block", type: "text_indexOf" },
            { kind: "block", type: "text_charAt" },
            { kind: "block", type: "text_getSubstring" },
            { kind: "block", type: "text_changeCase" },
            { kind: "block", type: "text_trim" },
            { kind: "block", type: "text_prompt_ext" }
          ]
        },
        {
          kind: "category",
          name: "%{BKY_LISTS}",
          colour: "%{BKY_DATA_RGB}",
          contents: [
            { kind: "block", type: "lists_create_empty" },
            { kind: "block", type: "lists_create_with" },
            {
              kind: "block",
              type: "lists_repeat",
              inputs: {
                NUM: { block: { type: "math_number", fields: { NUM: 5 } } }
              }
            },
            { kind: "block", type: "lists_length" },
            { kind: "block", type: "lists_isEmpty" },
            { kind: "block", type: "lists_indexOf" },
            { kind: "block", type: "lists_getIndex" },
            { kind: "block", type: "lists_setIndex" }
          ]
        },
        { kind: "category", name: "%{BKY_VARIABLES}", custom: "VARIABLE", colour: "%{BKY_DATA_RGB}" }
      ]
    },
    {
      kind: "category",
      id: "actuators",
      name: "%{BKY_ACTIONS}",
      colour: "%{BKY_ACTIONS_RGB}",
      expanded: true,
      contents: [
        {
          kind: "category",
          name: "%{BKY_ROBOT}",
          colour: "%{BKY_ACTIONS_RGB}",
          contents: [
            {
              kind: "block",
              type: "text_print",
              inputs: { TEXT: { block: { type: "text" } } }
            },
            {
              kind: "block",
              type: "set_analog_pin_value",
              inputs: { VALUE: { block: { type: "math_number", fields: { NUM: 0 } } } }
            },
            {
              kind: "block",
              type: "set_digital_pin_value",
              inputs: { VALUE: { block: { type: "logic_boolean", fields: { BOOL: "TRUE" } } } }
            }
          ]
        }
      ]
    }
  ]
}

export function getToolbox() {
  return { ...toolboxJson }
}