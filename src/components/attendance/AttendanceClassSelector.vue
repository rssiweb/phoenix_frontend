<template>
  <v-row>
    <v-col cols="12" lg="2" md="3">
      <v-select
        :items="sessions"
        label="Session"
        :disabled="loading"
        v-model="selected_session"
        item-text="name"
        return-object
        dense
      ></v-select>
    </v-col>
    <v-col cols="12" lg="2" md="3">
      <v-select
        :items="branches"
        label="Branch"
        :disabled="loading"
        v-model="selected_branch"
        item-text="name"
        return-object
        dense
      ></v-select>
    </v-col>
    <v-col cols="12" lg="2" md="3">
      <v-select
        :items="classes"
        label="Class"
        :disabled="loading || !selected_session || !selected_branch"
        v-model="selected_class"
        item-text="name"
        return-object
        dense
      ></v-select>
    </v-col>

    <v-col cols="12" offset-lg="4" lg="2" md="3">
      <v-dialog
        ref="dialog"
        v-model="show_date_modal"
        :return-value.sync="date"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            class="mr-2"
            dense
            v-model="modal_date"
            label="Attendance date"
            prepend-icon="fa-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker :max="max_date" v-model="modal_date" scrollable reactive>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="reset_modal_date(date)">
            Cancel
          </v-btn>
          <v-btn text color="primary" @click="$refs.dialog.save(modal_date)">
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { branch_service, session_service, classroom_service } from "@/services";
import moment from "moment";

export default {
  name: "attendance-class-selector",

  data() {
    return {
      loading: false,
      date: null,
      modal_date: null,
      max_date: null,
      show_date_modal: false,
      branches: [],
      selected_branch: null,
      sessions: [],
      selected_session: null,
      classes: [],
      selected_class: null,
    };
  },
  watch: {
    selected_session() {
      this.fetch_classes();
    },
    selected_branch() {
      this.fetch_classes();
    },
    selected_class() {
      this.$emit("select-class", this.selected_class);
    },
    date() {
      this.$emit("select-date", this.date);
    },
  },
  created() {
    this.load_init_data();
    this.modal_date = moment().format("YYYY-MM-DD");
    this.date = this.modal_date;
    this.max_date = this.modal_date;
  },
  methods: {
    reset_modal_date() {
      this.modal_date = this.date;
      this.show_date_modal = false;
    },
    load_init_data() {
      this.loading = true;
      Promise.all([branch_service.get(), session_service.get()])
        .then((values) => {
          this.branches = values[0].results;
          this.sessions = values[1].results;

          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    fetch_classes() {
      if (!this.selected_branch || !this.selected_session) return;

      this.loading = true;
      var query_params = {
        bsa__branch: this.selected_branch.id,
        bsa__session: this.selected_session.id,
        faculty__user_id: this.me.id,
      };
      classroom_service
        .get(query_params)
        .then((data) => {
          this.classes = data.results;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
  },
};
</script>

<style>
</style>