import { defineStore } from 'pinia'

export const useCodeStore = defineStore('user_code', {
  state: () => ({
    blockly: {},
    python: ""
  }),

  actions: {
    setBlockly(value) {
      this.blockly = value
    },
    setPython(value) {
      this.python = value
    }
  }
})