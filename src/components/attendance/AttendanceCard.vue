<template>
  <v-list-item class="pa-1">
    <v-list-item-content>
      <v-list-item-title class="text-start">{{
        studentName || "Unknown"
      }}</v-list-item-title>
      <v-list-item-subtitle class="text-start">{{
        studentId
      }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-row>
        <v-col v-for="state in states" :key="state.value">
          <v-btn icon>
            <v-icon
              :disabled="updating"
              :color="colored_state[state.value]"
              @click="trigger_attendance(state.value)"
            >
              {{ state.icon }}
              fa-check-circle
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import moment from "moment";
import { ATTENDANCE_REGISTER, CLASSOCCURRENCE_CREATE } from "@/store/actions";
export default {
  name: "attendance-row",
  props: {
    studentId: String,
    studentName: String,
    states: Array,
    attendances: Array,
    headers: Array,
    date: String,
    clazz: Object,
    occurrence: Object,
  },
  data() {
    return {
      updating: false,
      attendance: "",
      attendance_id: null,
    };
  },
  created() {
    this.set_current_attendance();
  },
  watch: {
    occurrence() {
      this.set_current_attendance();
    },
  },
  computed: {
    data() {
      var tmp = {};
      this.attendances.forEach((record) => {
        var date = moment(record.date);
        var dateIndex = date.date();
        var attendance = tmp[dateIndex] || [];
        attendance.push(record.attendance);
        this.$set(tmp, dateIndex, attendance);
      });
      return tmp;
    },
    occurrence_order() {
      var order = 0;
      this.attendances.forEach((record, index) => {
        var record_date = moment(record.date);
        if (
          this.occurrence &&
          moment(this.occurrence.start_time).isSame(record_date)
        ) {
          order = index;
        }
      });
      return order;
    },
    colored_state() {
      var colored_state = {};
      this.states.forEach((state) => {
        var color = state.color;
        color += this.attendance == state.value ? " lighten-1" : " lighten-4";
        colored_state[state.value] = color;
      });
      return colored_state;
    },

    current_date() {
      return moment(this.date).date();
    },
  },
  methods: {
    set_current_attendance() {
      this.attendance = null;
      this.attendance_id = null;
      this.attendances.forEach((record) => {
        var record_date = moment(record.date);
        if (
          this.occurrence &&
          moment(this.occurrence.start_time).isSame(record_date)
        ) {
          this.attendance = record.attendance;
          this.attendance_id = record.id;
        }
      });
    },
    concat(values) {
      if (!values) return "";
      return values.join("");
    },
    get_color(state) {
      var color = state.color;
      if (this.attendance == state.value) color = color + "lighten-1";
      else color = color + "lighten-4";
      return color;
    },
    register_attendance(attendance) {
      this.updating = true;
      this.$store
        .dispatch(ATTENDANCE_REGISTER, {
          faculty: this.me.username,
          student: this.studentId,
          attendance: attendance,
          class_occurrance: this.occurrence.id,
          attendance_id: this.attendance_id,
        })
        .then((res) => {
          this.updating = false;
          this.attendance_id = res.id;
          this.attendance = res.attendance;
        })
        .catch(() => {
          this.updating = false;
        });
    },
    trigger_attendance(attendance) {
      if (!this.occurrence) {
        var vm = this;
        this.$store
          .dispatch(CLASSOCCURRENCE_CREATE, {
            classroom: this.clazz.id,
            faculty: this.me.username,
            start_time: moment(this.date).format(),
          })
          .then(() => {
            vm.register_attendance(attendance);
          });
      } else {
        this.register_attendance(attendance);
      }
    },
  },
};
</script>