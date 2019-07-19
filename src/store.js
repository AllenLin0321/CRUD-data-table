import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    headers: [{
        text: "No.",
        align: "left",
        value: "name",
      },
      {
        text: "Name",
        align: "right",
        value: "name"
      },
      {
        text: "Phone",
        align: "right",
        value: "phone"
      },
      {
        text: "Email",
        align: "right",
        value: "email"
      },
      {
        text: "Actions",
        align: "center",
        value: "name",
        sortable: false
      }
    ],
    initialData: [{
        no: "1",
        name: "User 1",
        phone: "0212345678",
        email: "aaa@gmail.com"
      },
      {
        no: "2",
        name: "User 2",
        phone: "0212345678",
        email: "bbb@gmail.com"
      },
      {
        no: "3",
        name: "User 3",
        phone: "0212345678",
        email: "ccc@gmail.com"
      }
    ]
  },
  getters: {
    getHeaders: state => {
      return state.headers;
    },
    getInitialData: state => {
      return state.initialData;
    }
  },
  mutations: {

  },
  actions: {

  }
})
