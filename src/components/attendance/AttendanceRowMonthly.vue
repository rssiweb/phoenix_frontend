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
              :color="colors[state.value][attendance == state.value]"
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
import { attendance_service } from "@/services";
import Vue from "vue";
import { CLASSOCCURRENCE_CREATE } from "@/store/actions";
export default {
  name: "attendance-row-monthly",
  props: {
    studentId: String,
    studentName: String,
    states: Array,
    initAttendances: Array,
    headers: Array,
    date: String,
    clazz: Object,
    occurrence: Object,
  },
  data() {
    return {
      // record: Vue.util.extend({}, this.initRecord),
      attendances: this.initAttendances || [],
      updating: false,
      attendance: "",
      attendance_id: null,
    };
  },
  created() {
    this.identify_attendance_today();
  },
  watch: {
    date() {
      this.identify_attendance_today();
    },
    occurrence() {
      this.identify_attendance_today();
    },
  },
  methods: {
    identify_attendance_today() {
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
      this.attendance = attendance;
      var payload = {
        faculty: this.me.username,
        student: this.studentId,
        attendance: attendance,
        class_occurrance: this.occurrence.id,
      };
      var args = [payload];
      var method = "post";
      if (this.attendance_id) {
        method = "patch";
        args.push(this.attendance_id);
      }

      attendance_service[method](...args)
        .then((res) => {
          this.attendance_id = res.id;
          this.attendance = res.attendance;
          this.updating = false;
          if (method == "post") this.attendances.push(res);
          // we probably have to sort this after insert
          //  or maybe this will always be empty
          else Vue.util.extend(this.attendances[this.occurrence_order], res);
        })
        .catch((error) => {
          this.updating = false;
          console.log(error);
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
            console.log(this.occurrence, "afterwords");
            vm.register_attendance(attendance);
          });
      } else {
        this.register_attendance(attendance);
      }
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
    colors() {
      var obj = {};
      this.states.forEach((state) => {
        obj[state.value] = {
          true: state.color + " lighten-1",
          false: state.color + " lighten-4",
        };
      });

      return obj;
    },
    current_date() {
      return moment(this.date).date();
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