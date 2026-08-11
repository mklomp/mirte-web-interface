export const useCodeStore = defineStore('user_code', {
  state: () => ({
    blockly: "",
    python: "",
    split: 100
  }),

  actions: {
    loadFromLocalStorage() {
      if (process.client) {
        this.blockly = localStorage.getItem('blockly') || ""
        this.python = localStorage.getItem('python') || ""
        this.split = localStorage.getItem('split') || 100 // defaults to blockly
      }
    },
    setBlockly(value) {
      this.blockly = value
      localStorage.setItem('blockly', value)
    },
    setPython(value) {
      this.python = value
      localStorage.setItem('python', value)
    },
    setSplit(value) {
      this.split = value
      localStorage.setItem('split', value)
    },
    clear(){
      this.setPython("")
      this.setBlockly("")
    }
  }
})