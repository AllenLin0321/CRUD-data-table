<template>
  <div>
    <v-toolbar flat color="white">
      <!-- Table Title -->
      <v-toolbar-title>Rakuten CRUD Data Table</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>

      <!-- Add or Edit a Item -->
      <v-dialog v-model="dialog" max-width="500px">
        <!-- New User Button -->
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New User</v-btn>
        </template>
        <v-card>
          <!-- Dialog Title -->
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <!-- Dialog Content -->
          <v-card-text>
            <v-container grid-list-md @keypress.enter="save">
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    autofocus
                    v-model="editedItem.name"
                    prepend-icon="person"
                    :success="!$v.editedItem.name.$invalid"
                    :error="submitted && $v.editedItem.name.$invalid"
                    label="User Name"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="editedItem.phone"
                    prepend-icon="phone"
                    :success="!$v.editedItem.phone.$invalid"
                    :error="submitted && $v.editedItem.phone.$invalid"
                    label="Phone"
                    placeholder="(02)-1234-5678"
                    mask="(##) #### - ####"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="editedItem.email"
                    :success="!$v.editedItem.email.$invalid"
                    :error="submitted && $v.editedItem.email.$invalid"
                    prepend-icon="email"
                    label="Email"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <!-- Dialog Action -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <!-- Data Table -->
    <v-data-table :headers="getHeaders" :items="users" class="elevation-1">
      <template v-slot:items="props">
        <td>{{ props.item.no}}</td>
        <td class="text-xs-right">{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.phone | phoneFormat}}</td>
        <td class="text-xs-right">{{ props.item.email }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" color="orange darken-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small color="purple darken-2" @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <v-btn dark flat @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { required, email, numeric, requiredIf } from "vuelidate/lib/validators";

import { mapGetters } from "vuex";
export default {
  data: () => ({
    // Open the dialog or not
    dialog: false,
    submitted: false,
    users: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      phone: null,
      email: null
    },
    defaultItem: {
      name: "",
      phone: null,
      email: null
    },
    snackbar: {
      show: false,
      color: null,
      timeout: null,
      text: null
    }
  }),
  validations: {
    editedItem: {
      name: { required },
      phone: {
        required,
        isNum(v) {
          return !isNaN(v);
        }
      },
      email: { required, email }
    }
  },
  filters: {
    phoneFormat: function(value) {
      let insertStr = (soure, start, newStr) => {
        return soure.slice(0, start) + newStr + soure.slice(start);
      };

      let newStr = value;

      newStr = insertStr(newStr, 2, ")-");
      newStr = insertStr(newStr, 8, "-");
      return `(${newStr}`;
    }
  },
  computed: {
    ...mapGetters(["getHeaders", "getInitialData"]),
    formTitle() {
      return this.editedIndex === -1 ? "New User" : "Edit User";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    // Get the Initial data from vuex
    initialize() {
      this.users = this.getInitialData;
    },

    insertStr(soure, start, newStr) {
      return soure.slice(0, start) + newStr + soure.slice(start);
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.users.indexOf(item);
      confirm("Are you sure you want to delete this user?") &&
        this.users.splice(index, 1);
    },

    close() {
      this.submitted = false;
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      let isUnique = true;
      this.submitted = true;

      this.users.forEach((element, index) => {
        if (
          // Not the same one
          index !== this.editedIndex &&
          element.name === this.editedItem.name
        ) {
          this.showSnackbar("姓名不可重覆", "error");
          isUnique = false;
        }
      });

      // Check Name is unique and form is valid
      if (isUnique && !this.$v.$invalid) {
        // Edit User Data
        if (this.editedIndex > -1) {
          Object.assign(this.users[this.editedIndex], this.editedItem);
          this.showSnackbar("資料修改成功");
        } else {
          // It's a new User and add the serial number
          this.editedItem.no = this.users.length + 1;

          //Add into the array
          this.users.push(this.editedItem);

          this.showSnackbar("資料新增成功");
        }
        this.close();
      }
    },
    showSnackbar(text, color = "success", timeout = 2000) {
      this.snackbar.show = true;
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.timeout = timeout;
    }
  }
};
</script>