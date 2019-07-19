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
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.name" label="User Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.phone" label="Phone"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
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
        <td class="text-xs-right">{{ props.item.phone }}</td>
        <td class="text-xs-right">{{ props.item.email }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" color="orange darken-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small color="purple darken-2" @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    // Open the dialog or not
    dialog: false,
    users: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      phone: 0,
      email: 0
    },
    defaultItem: {
      name: "",
      phone: 0,
      email: 0
    }
  }),
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
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      // Edit User Data
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem);
      } else {
        // It's a new User
        // Add the No
        this.editedItem.no = this.users.length + 1;
        //Add into the array
        this.users.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>