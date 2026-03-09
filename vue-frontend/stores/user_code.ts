export const useCodeStore = defineStore('user_code', {
  state: () => ({
    blockly: "",
    python: "",
    active: ""
  }),

  actions: {
    loadFromLocalStorage() {
      if (process.client) {
        this.blockly = localStorage.getItem('blockly') || ""
        this.python = localStorage.getItem('python') || ""
        this.active = localStorage.getItem('active') || "blockly"
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
    setActive(value) {
      this.active = value
      localStorage.setItem('active', value)
    }
  }
})