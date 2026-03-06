export const useCodeStore = defineStore('user_code', {
  state: () => ({
    blockly: "",
    python: ""
  }),

  actions: {
    loadFromLocalStorage() {
      if (process.client) {
        this.blockly = localStorage.getItem('blockly') || ""
        this.python = localStorage.getItem('python') || ""
      }
    },
    setBlockly(value) {
      this.blockly = value
      console.log("Setting blockly")
      localStorage.setItem('blockly', value)
    },
    setPython(value) {
      this.python = value
      localStorage.setItem('python', value)
    }
  }
})