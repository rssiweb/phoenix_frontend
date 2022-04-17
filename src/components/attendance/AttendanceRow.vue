<template>
  <tr>
    <td>{{ studentId }}</td>
    <td>
      {{ studentName }}
    </td>

    <template v-for="header in headers">
      <template v-if="header.date != current_date">
        <td class="text-center pa-0" :key="header.date">
          <span>{{ concat(data[header.date]) }}</span>
        </td>
      </template>
      <template v-else>
        <td
          class="text-center"
          v-for="state in states"
          :key="header.date + '-' + state.value"
        >
          <div class="ma-1">
            <v-icon
              :disabled="updating"
              :color="colored_state[state.value]"
              @click="trigger_attendance(state.value)"
            >
              {{ state.icon }}
              fa-check-circle
            </v-icon>
          </div>
        </td>
      </template>
    </template>
  </tr>
</template>

<script>
import moment from "moment";
// import { attendance_service } from "@/services";
// import Vue from "vue";
import { ATTENDANCE_REGISTER, CLASSOCCURRENCE_CREATE } from "@/store/actions";
import { mapGetters } from "vuex";
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
      // attendances: this.initAttendances || [],
      attendance: "",
      attendance_id: null,
      updating: false,
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
        this.updating = true;
        var vm = this;
        this.$store
          .dispatch(CLASSOCCURRENCE_CREATE, {
            classroom: this.clazz.id,
            faculty: this.me.username,
            start_time: moment(this.date).format(),
          })
          .then(() => {
            this.updating = false;
            vm.register_attendance(attendance);
          })
          .catch(() => {
            this.updating = false;
          });
      } else {
        this.register_attendance(attendance);
      }
    },
  },
};
</script>

<style>
.input {
  /* border: 1px solid black; */
  text-align: center;
}
</style>