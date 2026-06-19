export const useCodeStore = defineStore('user_code', {
  state: () => ({
    blockly: "",
    python: "",
    active: "",
    reinit_blockly: false
  }),

  actions: {
    loadFromLocalStorage() {
      if (process.client) {
        this.blockly = localStorage.getItem('blockly') || ""
        this.python = localStorage.getItem('python') || ""
        this.active = localStorage.getItem('active') || "blockly"
      }
    },
    setBlockly(value, reinit = false) {
      this.blockly = value
      this.reinit_blockly = reinit
      localStorage.setItem('blockly', value)
    },
    setPython(value) {
      this.python = value
      localStorage.setItem('python', value)
    },
    setActive(value) {
      this.active = value
      localStorage.setItem('active', value)
    },
    clear(){
      this.setPython("")
      this.setBlockly("")
    }
  }
})