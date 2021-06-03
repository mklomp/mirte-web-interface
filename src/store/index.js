export default {

    state: {
        code: "",
        tutorial: null,
        blockly: "",
        linenumber: 0,
        execution: "stopped",   // TODO: enum?
        user: "none",           // TODO: at the moment it can not be empty on start
        PConfig: localStorage.getItem("PConfig")
    },

    getters: {
        getCode(state) {
            return state.code
        },
        getTutorial(state) {
            return state.tutorial
        },
        getBlockly(state) {
            return state.blockly
        },
        getLinenumber(state) {
            return state.linenumber
        },
        getExecution(state) {
            return state.execution
        },
        getUser(state) {
            return state.user
        },
        getPConfig(state) {
            let PC = JSON.parse(state.PConfig)
            if (PC !== null) return PC
            state.commit('updatePConfig', JSON.stringify([]))
            return []
        }
    },

    actions: {
        setCode({commit, getters}, code) {
            commit('code', code)
        }
    },

    mutations: {
        code(state, code) {
            return state.code = code
        },
        tutorial(state, tutorial) {
            return state.tutorial = tutorial
        },
        blockly(state, blockly) {
            return state.blockly = blockly
        },
        linenumber(state, linenumber) {
            return state.linenumber = linenumber
        },
        execution(state, execution) {
            return state.execution = execution
        },
        user(state, user) {
            return state.user = user
        },
        updatePConfig(state, PConfig) {
            state.PConfig = JSON.stringify(PConfig)
            localStorage.setItem("PConfig", JSON.stringify(PConfig))
        }
    }
}
