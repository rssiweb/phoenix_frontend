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
          v-for="state in attendance_states"
          :key="state.value"
        >
          {{ state.value }}
        </th>
        <th colspan="100%"></th>
      </tr>
    </thead>
    <tbody v-if="records.length">
      <attendance-row
        :states="attendance_states"
        :headers="headers"
        :init-attendances="record.attendance"
        v-for="record in records"
        :key="record.id"
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
import { classroom_service } from "@/services";
export default {
  props: {
    date: String,
    clazz: Object,
    occurrence: Object,
  },
  components: { AttendanceRow },
  name: "attendance-table-daily",
  data() {
    return {
      loading: false,
      attendance_states: [
        { icon: "fa-check-circle", value: "P", color: "green" },
        { icon: "fa-times-circle", value: "A", color: "red" },
        { icon: "fa-minus-circle", value: "L", color: "orange" },
      ],
      records: [],
    };
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
      this.loading = true;
      return classroom_service
        .get({}, `${this.clazz.id}/attendance_by_student`)
        .then((res) => {
          this.records.splice(0, this.records.length);
          res.forEach((record) => {
            this.records.push(record);
          });
          this.loading = false;
          return Promise.resolve();
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          return Promise.reject();
        });
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
              ? this.attendance_states.length
              : 1,
        });
        date.setDate(date.getDate() + 1);
      }
      return result.reverse();
    },
  },
  computed: {
    sub_header_colspan() {
      //  name and id of students are 2 fixed columns
      var first_fixed_cols = 2;
      if (!this.date) return first_fixed_cols;
      var today = moment();
      var first_of_this_month = moment(today.format("YYYY-MM-01"));
      var attendance_day = moment(this.date);
      var same_month = attendance_day.isSameOrAfter(first_of_this_month);
      var end_date = today;
      if (!same_month) {
        var first_of_next_month = moment(
          new Date(attendance_day.year(), attendance_day.month() + 1, 1)
        );
        end_date = first_of_next_month.subtract(1, "days");
      }
      return first_fixed_cols + end_date.diff(attendance_day, "days");
    },
    headers() {
      var headers = this.getDaysArray();
      return headers;
    },
    today() {
      var today = moment(this.date);
      return today.date() + this.constants.DAYS[today.day()];
    },
  },
};
</script>

<style>
</style>