<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-container
        fluid
        class="primary pa-16 text-center grey--text text--lighten-4"
      >
        <h1>Phoenix</h1>
        <p>School Management System</p>
      </v-container>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title class="justify-center">
            <div class="text-center">
              <img src="../assets/icon.svg" />
              <h4>Sign in</h4>
              <small>to continue to Phoenix</small>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form
              novalidate
              ref="login_form"
              v-model="form.is_valid"
              lazy-validation
              @submit.prevent="login"
            >
              <v-container>
                <v-text-field
                  type="email"
                  label="Email Address"
                  v-model="form.email"
                  :rules="form.rules.email"
                  :error-messages="form.error.email"
                  :disabled="loading"
                  required
                ></v-text-field>
                <v-text-field
                  type="password"
                  label="Password"
                  v-model="form.password"
                  :rules="form.rules.password"
                  :error-messages="form.error.password"
                  :disabled="loading"
                  required
                ></v-text-field>
              </v-container>
              <v-container class="text-center">
                <div
                  class="error--text"
                  v-for="(error, index) in form.error.non_field_errors"
                  :key="index"
                >
                  {{ error }}
                </div>
              </v-container>
              <v-container class="text-center">
                <v-btn type="submit" color="primary" :disabled="loading"
                  >Login</v-btn
                >
                <p class="mt-2">
                  Forgot your password ?
                  <a @click.prevent="show_reset_dialog = true"
                    >Reset Password</a
                  >
                </p>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="show_reset_dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Reset Password</v-card-title>

        <v-card-text>Please contact admin to reset your password</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="show_reset_dialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { AUTH_REQUEST, USER_REQUEST } from "@/store/actions";

export default {
  name: "login-page",
  data() {
    return {
      show_reset_dialog: false,
      loading: false,
      form: {
        is_valid: true,
        email: "",
        password: "",
        rules: {
          password: [(v) => !!v || "Password is required"],
          email: [
            (v) => !!v || "Email is required",
            (v) => v.length >= 3 || "Email must be more than 3 characters",
          ],
        },
        error: {
          email: [],
          password: [],
          non_field_errors: [],
        },
      },
    };
  },
  created() {
    if (this.isAuthenticated) {
      this.after_login();
    }
  },
  methods: {
    clear_form_errors() {
      this.form.error = {
        email: [],
        password: [],
        non_field_errors: [],
      };
    },
    after_login() {
      var vm = this;
      this.$store
        .dispatch(USER_REQUEST, this.authUsername)
        .then(() => {
          vm.$router.push({ name: "home" });
        })
        .catch(() => {
          // show error loading user profile
        });
    },
    login() {
      this.clear_form_errors();
      if (this.$refs.login_form.validate()) {
        this.loading = true;
        this.$store
          .dispatch(AUTH_REQUEST, {
            email: this.form.email,
            password: this.form.password,
          })
          .then(() => {
            this.after_login();
            this.loading = false;
          })
          .catch((error) => {
            console.log(error);
            if (error.response && error.response.data)
              this.form.error = error.response.data;
            else
              this.form.error.non_field_errors = [
                "Network error occured, please try again!",
              ];
            this.loading = false;
          });
      }
    },
  },
};
</script>
