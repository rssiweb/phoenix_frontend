<template>
  <tr>
    <td>{{ record.id }}</td>
    <td>
      {{ record.name }}
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
              @click="update_attendance(state.value)"
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
import { attendance_service, classoccurrence_service } from "@/services";
export default {
  name: "attendance-row-monthly",
  props: {
    states: Array,
    record: Object,
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
      data: {},
    };
  },
  created() {
    this.record.attendance.forEach((record) => {
      var date = moment(record.date);
      var dateIndex = date.date();
      var attendance = this.data[dateIndex] || [];
      attendance.push(record.attendance);
      this.$set(this.data, dateIndex, attendance);
    });
  },
  watch: {
    date() {
      this.recalculate_attendance_today();
    },
    occurrence() {
      this.recalculate_attendance_today();
    },
    clazz() {
      if (this.class) this.get_class_occurrence();
    },
  },
  methods: {
    recalculate_attendance_today() {
      this.record.attendance.forEach((record) => {
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
    get_class_occurrence() {
      classoccurrence_service
        .get({
          classroom: this.clazz.id,
          start_time_after: moment(this.date).toDate(),
          start_time_after_before: moment(this.date).add(1, "days").toDate(),
        })
        .then()
        .catch();
    },
    update_attendance(attendance) {
      this.updating = true;
      this.attendance = attendance;
      var args = [
        {
          faculty: this.authUsername,
          student: this.record.id,
          attendance: attendance,
          class_occurrance: this.occurrence.id,
        },
      ];
      var method = "post";
      if (this.attendance_id) {
        method = "patch";
        args.push(this.attendance_id);
      }

      attendance_service[method](...args)
        .then((resp) => {
          this.attendance_id = resp.id;
          this.attendance = resp.attendance;
          this.updating = false;
        })
        .catch((error) => {
          this.updating = false;
          console.log(error);
        });
    },
  },
  computed: {
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