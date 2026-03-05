export const useCodeStore = defineStore('user_code', {
  state: () => ({
    blockly:  "",
    python:  "",
    blockly_dom: ""
  }),

  actions: {
    setBlockly(value) {
      this.blockly = value
      console.log("Setting blockly")
      //localStorage.setItem('blockly', value)
    },
    setPython(value) {
      this.python = value
      //localStorage.setItem('python', value)
    },
    setBlocklyDOM(value) {
      this.blockly_dom = value
      //localStorage.setItem('python', value)
    }
  }
})