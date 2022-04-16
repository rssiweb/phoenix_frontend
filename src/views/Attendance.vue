<template>
  <v-container :fluid="true">
    <v-container>
      <attendance-class-selector
        v-on:select-class="selected_class = $event"
        v-on:select-date="selected_date = $event"
      />

      <v-row v-if="class_occurrences.length > 1">
        <v-spacer> </v-spacer>
        <!-- actions -->
        <!-- TODO: copy from another day attendance, case where extra class is just after the current class -->
        <div class="text-right">
          <span class="text-caption"
            >Multiple classes occurred on this date - current selection
            <span v-if="selected_occurrence">{{
              format_time(selected_occurrence.start_time)
            }}</span>
            <span v-else>None</span>
          </span>
          <br />
          <v-btn small dense color="primary" @click="selected_occurrence = null"
            >select class</v-btn
          >
        </div>
      </v-row>

      <v-row class="mx-2" v-if="message.error || message.info">
        <p class="error--text">
          <v-icon small>mdi-error</v-icon>
          {{ message.error }}
        </p>
        <br />
        <p class="info--text">
          <v-icon small>mdi-info</v-icon>
          {{ message.info }}
        </p>
      </v-row>
    </v-container>
    <v-row>
      <v-col class="text-center">
        <template v-if="!selected_class">
          <div class="text-body1">Select a class</div>
        </template>
        <template v-else>
          <div class="d-none d-md-block">
            <attendance-table-monthly
              :date="selected_date"
              :clazz="selected_class"
              :occurrence="selected_occurrence"
              :attendance-states="attendance_states"
            />
          </div>
          <div class="d-md-none">
            <attendance-table-daily
              :date="selected_date"
              :clazz="selected_class"
              :occurrence="selected_occurrence"
              :attendance-states="attendance_states"
            />
          </div>
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
</template>

<script>
import moment from "moment";
import AttendanceClassSelector from "../components/attendance/AttendanceClassSelector.vue";
import AttendanceTableMonthly from "../components/attendance/AttendanceTableMonthly.vue";
import AttendanceTableDaily from "../components/attendance/AttendanceTableDaily.vue";
import { CLASSOCCURRENCE_REQUEST } from "@/store/actions";
import { mapGetters } from "vuex";
export default {
  name: "attendance-page",
  components: {
    AttendanceClassSelector,
    AttendanceTableMonthly,
    AttendanceTableDaily,
  },
  data() {
    return {
      attendance_states: [
        {
          icon: "fa-check-circle",
          value: "P",
          desc: "Present",
          color: "green",
        },
        { icon: "fa-times-circle", value: "A", desc: "Absent", color: "red" },
        { icon: "fa-minus-circle", value: "L", desc: "Leave", color: "orange" },
      ],
      message: {
        info: "",
        error: "",
      },
      selected_occurrence: null,
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
    class_occurrences() {
      if (this.class_occurrences.length == 1)
        this.select_occurrence(this.class_occurrences[0]);
    },
  },
  computed: {
    ...mapGetters("classoccurrence", [
      "class_occurrences",
      "occurrence_loading",
    ]),
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
      this.$store.dispatch(CLASSOCCURRENCE_REQUEST, {
        classroom: this.selected_class.id,
        faculty: this.me.username,
        start_time_after: moment(this.selected_date).startOf("day").format(),
        start_time_before: moment(this.selected_date).endOf("day").format(),
      });
    },
  },
};
</script>