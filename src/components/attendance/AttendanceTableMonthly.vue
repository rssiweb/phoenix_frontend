<template>
  <v-simple-table dense fixed-header class="text-xs">
    <thead>
      <tr rowspan="2">
        <th class="text-center">Student ID</th>
        <th class="text-center">Student Name</th>
        <!-- <th class="text-center" colspan="3">{{ today }}</th> -->
        <th
          class="text-center"
          v-for="header in headers"
          :key="header.date"
          :colspan="header.colspan"
        >
          {{ header.date }}
          <br />
          {{ header.day }}
        </th>
      </tr>
      <tr>
        <th :colspan="sub_header_colspan"></th>
        <th
          class="text-center"
          v-for="state in attendanceStates"
          :key="state.value"
        >
          {{ state.value }}
        </th>
        <th colspan="100%"></th>
      </tr>
    </thead>
    <tbody v-if="records.length">
      <attendance-row
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
      />
    </tbody>
  </v-simple-table>
</template>

<script>
import moment from "moment";
import AttendanceRow from "./AttendanceRow.vue";
import { ATTENDANCE_REQUEST } from "@/store/actions";
import { mapGetters } from "vuex";
export default {
  props: {
    date: String,
    clazz: Object,
    occurrence: Object,
    attendanceStates: Array,
  },
  components: { AttendanceRow },
  name: "attendance-table-monthly",
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
      if (!this.date) return first_fixed_cols;
      var today = moment();
      var first_of_this_month = moment(today.format("YYYY-MM-01"));
      var currDate = moment(this.date);
      var same_month = currDate.isSameOrAfter(first_of_this_month);
      var end_date = today;
      if (!same_month) {
        var first_of_next_month = moment(
          new Date(currDate.year(), currDate.month() + 1, 1)
        );
        end_date = first_of_next_month.subtract(1, "days");
      }
      return first_fixed_cols + end_date.diff(currDate, "days");
    },
    headers() {
      var headers = this.getDaysArray();
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
    occurrence() {
      this.fetch_attendance_records();
    },
  },
  methods: {
    fetch_attendance_records() {
      if (!this.clazz.id) return;
      this.$store.dispatch(ATTENDANCE_REQUEST, this.clazz.id);
    },
    getDaysArray() {
      var today = moment();
      var firstOfMonth = moment(today.format("YYYY-MM-01"));
      var currDate = moment(this.date);
      var monthIndex = currDate.month(); // 0..11 instead of 1..12
      // today for current month, 1st for any other month
      var endDateIndex = currDate.isSameOrAfter(firstOfMonth)
        ? today.date()
        : 32;
      var date = new Date(currDate.year(), monthIndex, 1);
      var result = [];
      while (date.getMonth() == monthIndex && date.getDate() <= endDateIndex) {
        result.push({
          date: date.getDate(),
          day: this.constants.DAYS[date.getDay()],
          colspan:
            moment(date).format("YYYY-MM-DD") == this.date
              ? this.attendanceStates.length
              : 1,
        });
        date.setDate(date.getDate() + 1);
      }
      return result.reverse();
    },
  },
};
</script>

<style>
</style>