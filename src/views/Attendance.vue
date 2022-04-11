<template>
  <auth-base-layout>
    <v-container :fluid="true">
      <v-container>
        <attendance-class-selector
          v-on:select-class="selected_class = $event"
          v-on:select-date="selected_date = $event"
        />

        <v-row v-if="class_occurrences.length > 1">
          <v-spacer> </v-spacer>
          <!-- actions -->
          <div class="text-right">
            <span class="text-caption"
              >Multiple classes occurred on this date - current selection
              <span v-if="selected_occurrence">{{
                format_time(selected_occurrence.start_time)
              }}</span>
              <span v-else>None</span>
            </span>
            <br />
            <v-btn
              small
              dense
              color="primary"
              @click="selected_occurrence = null"
              >select class</v-btn
            >
          </div>
        </v-row>

        <v-row class="mt-2">
          <v-spacer></v-spacer>
          <p class="error--text">
            <v-icon small>mdi-error</v-icon>
            {{ message.error }}
          </p>
          <br />
          <p class="info--text">
            <v-icon small>mdi-info</v-icon>
            {{ message.info }}
          </p>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
      <v-row>
        <v-col class="text-center">
          <template v-if="!selected_class">
            <div class="text-h5">Select a class</div>
          </template>
          <template v-else>
            <attendance-table-monthly
              :date="selected_date"
              :clazz="selected_class"
              :occurrence="selected_occurrence"
            />
          </template>
        </v-col>
      </v-row>
      <v-dialog v-model="select_occurrence_dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="text-subtitle-1 text-center">
            Select class time
          </v-card-title>
          <v-card-text class="text-center">
            <v-btn
              small
              dense
              color="primary"
              v-for="occurrence in class_occurrences"
              :key="occurrence.id"
              class="mr-2"
              @click="selected_occurrence = occurrence"
            >
              {{ format_time(occurrence.start_time) }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </auth-base-layout>
</template>

<script>
import AuthBaseLayout from "@/layouts/AuthBase";
import { classoccurrence_service } from "@/services";
import moment from "moment";
import AttendanceClassSelector from "../components/attendance/AttendanceClassSelector.vue";
import AttendanceTableMonthly from "../components/attendance/AttendanceTableMonthly.vue";

export default {
  name: "attendance-page",
  components: {
    AuthBaseLayout,
    AttendanceClassSelector,
    AttendanceTableMonthly,
  },
  data() {
    return {
      message: {
        info: "",
        error: "",
      },

      selected_occurrence: null,
      class_occurrences: [],

      loading: false,
      selected_date: "",
      selected_class: null,

      show_all_classes: false,
    };
  },
  watch: {
    selected_class() {
      if (this.selected_date && this.selected_class) {
        this.selected_occurrence = null;
        this.fetch_class_occurrence();
      }
    },
    selected_date() {
      if (this.selected_date && this.selected_class) {
        this.selected_occurrence = null;
        this.fetch_class_occurrence();
      }
    },
  },
  computed: {
    select_occurrence_dialog() {
      return this.class_occurrences.length > 1 && !this.selected_occurrence;
    },
  },
  methods: {
    format_time(datetime) {
      return moment(datetime).format("hh:mm A");
    },
    select_occurrence(occurrence) {
      this.selected_occurrence = occurrence;
    },
    fetch_class_occurrence() {
      if (!this.selected_class || !this.selected_date) return;
      this.loading = true;
      classoccurrence_service
        .get({
          classroom: this.selected_class.id,
          faculty: this.me.id,
          start_time_after: moment(this.selected_date).startOf("day").format(),
          start_time_before: moment(this.selected_date).endOf("day").format(),
        })
        .then((res) => {
          this.loading = false;
          this.class_occurrences.splice(0, this.class_occurrences.length);
          res.results.forEach((item) => {
            this.class_occurrences.push(item);
          });
          if (this.class_occurrences.length == 1)
            this.select_occurrence(this.class_occurrences[0]);
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
  },
};
</script>