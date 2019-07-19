<template>
  <v-app class="home">
    <v-content>
      <DataTable class="pa-5" />
    </v-content>
  </v-app>
</template>

<script>
import DataTable from "./components/DataTable";

export default {
  name: "App",
  components: {
    DataTable
  }
};
</script>

<style lang="scss" scoped>
.home {
  background-color: rgba(70, 130, 180, 0.6);
}
</style>
