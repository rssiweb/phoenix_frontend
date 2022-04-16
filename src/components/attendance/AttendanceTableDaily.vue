<template>
  <v-list>
    <attendance-card
      class="mb-1"
      :states="attendanceStates"
      :headers="headers"
      :attendances="record.attendance"
      v-for="record in records"
      :key="clazz.id + '-' + record.id"
      :date="date"
      :clazz="clazz"
      :occurrence="occurrence"
      :student-id="record.id"
      :student-name="record.name"
    ></attendance-card>
  </v-list>
</template>

<script>
import moment from "moment";

import AttendanceCard from "./AttendanceCard.vue";
import { ATTENDANCE_REQUEST } from "@/store/actions";
import { mapGetters } from "vuex";
export default {
  props: {
    date: String,
    clazz: Object,
    occurrence: Object,
    attendanceStates: Array,
  },
  components: { AttendanceCard },
  name: "attendance-table-daily",
  data() {
    return {};
  },
  computed: {
    ...mapGetters("attendance", {
      records: "attendances",
      loading: "loading",
    }),
    sub_header_colspan() {
      //  name and id of students are 2 fixed columns
      var first_fixed_cols = 2;

      return first_fixed_cols;
    },
    headers() {
      var currDate = moment(this.date);
      var headers = [
        {
          date: currDate.date(),
          day: this.constants.DAYS[currDate.day()],
          colspan: this.attendanceStates.length,
        },
      ];
      return headers;
    },
    today() {
      var currDate = moment(this.date);
      return currDate.date() + this.constants.DAYS[currDate.day()];
    },
  },
  created() {
    this.fetch_attendance_records();
  },
  watch: {
    clazz() {
      this.fetch_attendance_records();
    },
  },
  methods: {
    fetch_attendance_records() {
      if (!this.clazz.id) return;
      this.$store.dispatch(ATTENDANCE_REQUEST, this.clazz.id);
    },
  },
};
</script>

<style>
</style>