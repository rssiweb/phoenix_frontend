<template>
  <v-app>
    <v-app-bar app elevation="4" color="primary" dark v-if="isAuthenticated">
      <v-app-bar-nav-icon
        title="Open Menu"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Phoenix</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon title="logout" @click="logout">
        <v-icon small>fa-arrow-right-from-bracket</v-icon>
        <!-- SIGN oUT -->
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      :touchless="!isAuthenticated"
    >
      <v-list nav>
        <template v-for="item in menu_items">
          <template v-if="item.route">
            <v-list-item
              :key="item.name"
              :to="{ name: item.route }"
              :disabled="item.disable"
            >
              <v-list-item-icon>
                <v-icon small>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </template>
          <template v-else-if="item.menu.length > 0">
            <v-list-group :key="item.name" :disabled="item.disable" no-action>
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon small>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </template>
              <v-list-item
                v-for="subitem in item.menu"
                :key="item.name + subitem.name"
                :to="{ name: subitem.route }"
              >
                <v-list-item-icon>
                  <v-icon small>{{ subitem.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ subitem.name }}</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <slot></slot>
    </v-main>

    <footer-component></footer-component>
  </v-app>
</template>

<script>
import FooterComponent from "@/components/FooterComponent";
import { AUTH_LOGOUT } from "@/store/actions";
import { mapGetters } from "vuex";
export default {
  name: "base-layout",
  components: {
    FooterComponent,
  },
  data() {
    return {
      menu_items: [
        { route: "home", name: "Home", icon: "fa-home" },
        {
          route: "attendance",
          name: "Student Attendance",
          icon: "fa-user-graduate",
        },
        {
          route: "examination",
          name: "Examination",
          icon: "fa-pen",
          disable: true,
        },
        {
          route: "results",
          name: "Results",
          icon: "fa-list-check",
          disable: true,
        },
        {
          route: "distribution",
          name: "Distributions",
          icon: "fa-hand-holding-hand",
          disable: true,
        },
        {
          name: "Reports",
          icon: "fa-chart-column",
          disable: false,
          menu: [
            {
              route: "time-sheet",
              name: "Time Sheet",
              icon: "fa-chart-column",
              disable: false,
            },
          ],
        },
      ],
      drawer: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
  },
  methods: {
    logout() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.push({ name: "login" });
      });
    },
  },
};
</script>
