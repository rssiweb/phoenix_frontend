<template>
  <base-layout>
    <div>
      <md-card class="md-primary">
        <md-card-header>
          <md-card-header-text class="text-center my-5 py-5">
            <div class="md-display-1 text-light">School Management System</div>
            <div class="md-subhead mt-1">Manage your school from one place</div>
          </md-card-header-text>
        </md-card-header>
      </md-card>
      <div class="md-layout md-gutter md-alignment-center-center">
        <div class="md-layout-item md-size-30 md-medium-size-50">
          <form class="mt-5" @submit.prevent="login" novalidate>
            <md-card class="md-layout-item">
              <md-card-header class="text-dark">
                <md-card-media>
                  <img src="../assets/logo.png" height="40px" />
                </md-card-media>

                <div class="md-title text-center">Sign in</div>
                <div class="md-subheading text-center mt-1">to continue to Phoenix</div>
              </md-card-header>
              <md-card-content>
                <md-field :class="getValidationClass('email')">
                  <label for="email">Email Address</label>
                  <md-input
                    type="email"
                    name="email"
                    id="email"
                    v-model="form.email"
                    autocomplete="email"
                    :disabled="sending"
                  />
                  <div class="md-error" v-if="!$v.form.email.required">The Email is required</div>
                </md-field>
                <md-field :class="getValidationClass('password')">
                  <label for="password">Password</label>
                  <md-input
                    type="password"
                    name="password"
                    id="password"
                    v-model="form.password"
                    autocomplete="password"
                    :disabled="sending"
                  />
                  <div class="md-error" v-if="!$v.form.password.required">The Password is required</div>
                </md-field>
              </md-card-content>

              <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="sending" />

              <md-card-actions>
                <md-button type="submit" class="md-primary" :disabled="sending">Log in</md-button>
              </md-card-actions>
            </md-card>
          </form>
        </div>
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from "@/layouts/Base";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  name: "login-page",
  mixins: [validationMixin],
  components: {
    BaseLayout
  },
  data() {
    return {
      sending: false,
      form: {
        email: "",
        password: ""
      }
    };
  },
  validations: {
    form: {
      email: { required },
      password: { required }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    login() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.sending = true;
      }
    }
  }
};
</script>
