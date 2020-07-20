<template>
  <base-layout>
    <v-container fluid class="pt-0">
      <v-row>
        <v-container fluid class="primary pa-16 text-center grey--text text--lighten-4">
          <h1>Phoenix</h1>
          <p>School Management System</p>
        </v-container>
      </v-row>
      <v-row>
        <v-col></v-col>
        <v-col>
          <v-card>
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
                    :disabled="sending"
                    required
                  ></v-text-field>
                  <v-text-field
                    type="password"
                    label="Password"
                    v-model="form.password"
                    :rules="form.rules.password"
                    :error-messages="form.error.password"
                    :disabled="sending"
                    required
                  ></v-text-field>
                </v-container>
                <v-container class="text-center">
                  <div
                    class="error--text"
                    v-for="(error, index) in form.error.non_field_errors"
                    :key="index"
                  >{{error}}</div>
                </v-container>
                <v-container class="text-center">
                  <v-btn type="submit" color="primary" :disabled="sending">Login</v-btn>
                  <p class="mt-2">
                    Forgot your password ?
                    <a
                      @click.prevent="show_reset_dialog = true"
                    >Reset Password</a>
                  </p>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col></v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="show_reset_dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Reset Password</v-card-title>

        <v-card-text>Please contact admin to reset your password</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="show_reset_dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </base-layout>
</template>

<script>
import BaseLayout from "@/layouts/Base";
import { AUTH_REQUEST } from "../store/actions/auth";

export default {
  name: "login-page",
  components: {
    BaseLayout
  },
  data() {
    return {
      show_reset_dialog: false,
      sending: false,
      form: {
        is_valid: true,
        email: "",
        password: "",
        rules: {
          password: [v => !!v || "Password is required"],
          email: [
            v => !!v || "Email is required",
            v => v.length >= 3 || "Email must be more than 3 characters"
          ]
        },
        error: {
          email: [],
          password: [],
          non_field_errors: []
        }
      }
    };
  },
  methods: {
    clean_errors() {
      this.form.error = {
        email: [],
        password: [],
        non_field_errors: []
      };
    },
    login() {
      this.clean_errors();
      if (this.$refs.login_form.validate()) {
        this.sending = true;
        this.$store
          .dispatch(AUTH_REQUEST, {
            email: this.form.email,
            password: this.form.password
          })
          .then(() => {
            this.$router.push({ name: "home" });
            this.sending = false;
          })
          .catch(error => {
            if (error.response && error.response.data)
              this.form.error = error.response.data;
            else
              this.form.error.non_field_errors = [
                "Network error occured, please try again!"
              ];
            this.sending = false;
          });
      }
    }
  }
};
</script>
