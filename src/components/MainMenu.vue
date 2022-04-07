<template>
  <div>
    <v-app-bar color="primary" dark>
      <v-btn text :to="{name: 'home'}">Home</v-btn>
      <v-btn text :to="{name: 'attendance'}">Attendance</v-btn>
      <v-btn text :to="{name: 'examination'}">Examination</v-btn>
      <v-btn text :to="{name: 'results'}">Results</v-btn>
      <v-btn text :to="{name: 'distribution'}">Distribution</v-btn>
      <v-btn text :to="{name: 'reports'}">Reports</v-btn>
      <v-spacer></v-spacer>
      <v-btn text @click.prevent="logout">Logout</v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import { AUTH_LOGOUT } from "@/store/actions";
export default {
  name: "main-menu",
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.push({ name: "login" });
      });
    }
  }
};
</script>
