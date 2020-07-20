<template>
  <auth-base-layout>
    <v-container :fluid="mode==1">
      <v-row>
        <v-col lg="2" md="4" sm="6">
          <v-select
            :items="classes"
            label="Class"
            :loading="receiving"
            :disabled="receiving || !selected_session_name"
            v-model="selected_class_name"
            item-text="name"
            dense
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-col lg="2" md="3" sm="4">
          <v-select
            :items="sessions"
            label="Session"
            :loading="receiving"
            :disabled="receiving"
            v-model="selected_session_name"
            item-text="name"
            dense
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-btn x-small color="primary mr-1"></v-btn>No Value
        <v-btn x-small color="success ml-3 mr-1">P</v-btn>Present
        <v-btn x-small color="error ml-3 mr-1">A</v-btn>Absent
        <v-btn x-small color="warning ml-3 mr-1">L</v-btn>Leave
        <v-spacer></v-spacer>
        <v-btn small class="mr-2" color="primary" @click.prevent="mode=(mode+1)%2">{{mode_btn_txt}}</v-btn>
        <v-btn
          small
          :color="class_action_btn_color"
          :disabled="!selected_class_name"
          @click="start_class()"
        >{{class_action_btn_txt}}</v-btn>
      </v-row>
      <v-row class="mt-2">
        <v-spacer></v-spacer>
        <small v-if="class_started">Class started at {{class_start_time_str}}</small>
      </v-row>
      <v-row class="mt-2">
        <v-spacer></v-spacer>
        <p class="error--text">
          <v-icon small>mdi-info</v-icon>
          {{error}}
        </p>
        <v-spacer></v-spacer>
      </v-row>
      <v-row class="mt-2" v-if="show_active_class_selection">
        <v-spacer></v-spacer>

        <v-btn
          small
          class="mr-2"
          @click="select_active_class_attendance(class_attendance)"
          v-for="class_attendance in active_attendance_for_today"
          :key="class_attendance.id"
        >Started at {{class_attendance.start_time.format("hh:mm A")}}</v-btn>

        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-col>
          <v-simple-table dense fixed-header>
            <thead>
              <tr>
                <th v-for="item in table_headers" :key="item.value">{{item.text}}</th>
              </tr>
            </thead>
            <tbody v-if="students.length">
              <tr v-for="std in students" :key="std.id">
                <td v-for="header in table_headers" :key="header.value">
                  <template v-if="header.btn">
                    <v-btn
                      @click.prevent="set_attendance(std, header.value)"
                      :disabled="!header.editable || disable_attendance || !class_started"
                      :class="get_attendance_btn_color(std, header.value)"
                      depressed
                      x-small
                    >{{std[header.value].value}}</v-btn>
                  </template>
                  <template v-else>{{std[header.value]}}</template>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
  </auth-base-layout>
</template>
<style lang="scss">
.theme--light {
  &.v-btn {
    &.v-btn--disabled {
      &.success {
        background-color: pink !important;
      }
    }
  }
}
</style>
<script>
import AuthBaseLayout from "@/layouts/AuthBase";
import classroom_service from "@/services/classroom";
import session_service from "@/services/session";
import moment from "moment";
const ClassState = Object.freeze({
  NOT_STARTED: 0,
  STARTED: 1,
  ENDED: 2
});
export default {
  name: "attendance-page",
  components: {
    AuthBaseLayout
  },
  data() {
    return {
      error: "",
      disable_attendance: false,
      attendace_value_rule: v =>
        ["A", "P"].find(valid => {
          v && v.toUpperCase() != valid;
        }) || "Invalid Value",
      active_attendance_for_today: [],
      class_state: ClassState.NOT_STARTED,
      class_start_time: null,
      class_end_time: null,
      class_attendance_id: null,
      class_attendances: [],
      mode: 0,
      receiving: false,
      sessions: [],
      selected_session_name: null,
      classes: [],
      selected_class_name: null,
      students: [
        // {
        //   name: "",
        //   mon: { value: "" },
        //   tue: { value: "" },
        //   wed: { value: "" },
        //   thu: { value: "" },
        //   fri: { value: "" },
        //   sat: { value: "" },
        //   sun: { value: "" }
        // }
      ]
    };
  },
  computed: {
    show_active_class_selection() {
      return this.active_attendance_for_today.length > 1;
    },
    class_started() {
      return this.class_state == ClassState.STARTED;
    },
    class_start_time_str() {
      return this.class_start_time.format("hh:mm A");
    },
    editable_fields() {
      var monthly_fields = [];
      for (let day = 1; day < 32; day++) monthly_fields.push(String(day));
      return {
        0: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
        1: monthly_fields
      }[this.mode];
    },
    table_headers() {
      var class_start_moment = moment(this.class_start_time);
      console.log(class_start_moment.format("ddd"));
      var common_headers = [{ text: "Name", value: "name", btn: false }];
      var weekly_header = [
        ...common_headers,
        {
          text: "SUN",
          value: "sun",
          editable: class_start_moment.format("ddd") === "Sun",
          btn: true
        },
        {
          text: "MON",
          value: "mon",
          editable: class_start_moment.format("ddd") === "Mon",
          btn: true
        },
        {
          text: "TUE",
          value: "tue",
          editable: class_start_moment.format("ddd") === "Tue",
          btn: true
        },
        {
          text: "WED",
          value: "wed",
          editable: class_start_moment.format("ddd") === "Wed",
          btn: true
        },
        {
          text: "THU",
          value: "thu",
          editable: class_start_moment.format("ddd") === "Thu",
          btn: true
        },
        {
          text: "FRI",
          value: "fri",
          editable: class_start_moment.format("ddd") === "Fri",
          btn: true
        },
        {
          text: "SAT",
          value: "sat",
          editable: class_start_moment.format("ddd") === "Sat",
          btn: true
        }
      ];
      var monthly_headers = [...common_headers];
      for (let day = 1; day < 32; day++)
        monthly_headers.push({
          text: String(day),
          value: String(day),
          editable: true
        });
      return {
        0: weekly_header,
        1: monthly_headers
      }[this.mode];
    },
    mode_btn_txt() {
      return { 0: "Weekly", 1: "Monthly" }[this.mode];
    },
    class_action_btn_color() {
      if (this.class_started) return "error";
      else return "success";
    },
    class_action_btn_txt() {
      if (!this.class_started) return "Start Class";
      else return "End Class";
    },

    selected_class() {
      var res = null;
      this.classes.forEach(clazz => {
        if (clazz.name == this.selected_class_name) res = clazz;
      });
      return res;
    },
    faculty_id() {
      return this.$store.getters.getProfile.profile.profile_id;
    },
    faculty_branch_id() {
      return this.$store.getters.getProfile.branch;
    }
  },
  watch: {
    selected_session_name(session_name) {
      this.fetch_classes(session_name);
    },
    selected_class_name() {
      this.fetch_students().then(() => {
        this.fetch_class_attendance();
      });
    }
  },
  created() {
    this.fetch_sessions();
  },
  methods: {
    start_class() {
      if (this.class_state == ClassState.NOT_STARTED)
        this.class_state = ClassState.STARTED;
      else if (this.class_state == ClassState.STARTED) {
        this.class_state = ClassState.ENDED;
      } else if (this.class_state == ClassState.ENDED) {
        console.log("class ended already");
      }
      if (this.class_state == ClassState.STARTED) {
        this.class_start_time = moment();
        classroom_service
          .start_class({
            classroom: this.selected_class.id,
            faculty: this.$store.getters.getProfile.id,
            start_time: this.class_start_time.format()
          })
          .then(class_attendance => {
            this.class_attendance_id = class_attendance.id;
          });
      } else if (this.class_state == ClassState.ENDED) {
        this.class_end_time = moment();
        classroom_service.end_class(this.class_attendance_id, {
          end_time: this.class_end_time.format()
        });
      }
    },
    get_attendance_btn_color(std, day) {
      var color = {
        P: "success",
        A: "error",
        "": "primary",
        L: "warning"
      }[std[day].value];
      return color;
    },
    set_attendance(std, day) {
      var std_attendance = std[day];
      var value = { A: "L", P: "A", "": "P", L: "" }[std_attendance.value];
      if (value == "") {
        // delete the attendance
        std_attendance.sending = true;
        classroom_service
          .delete_student_attendance(std_attendance.attendance_id)
          .then(() => {
            std_attendance.value = value;
            std_attendance.attendance_id = undefined;
            std_attendance.sending = false;
          })
          .catch(error => {
            console.log(error);
            std_attendance.sending = false;
          });
      } else {
        classroom_service
          .set_student_attendance({
            attendance: value,
            class_attendance: this.class_attendance_id,
            student: std.id
          })
          .then(std_attendace => {
            std_attendance.value = std_attendace.attendance;
            std_attendance.attendance_id = std_attendace.id;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    add_students(students) {
      console.log("students", students);
      this.students.splice(students.length);
      students.forEach((std, index) => {
        var student = {
          id: std.id,
          student_id: std.profile_id,
          name: std.name,
          mon: { value: "" },
          tue: { value: "" },
          wed: { value: "" },
          thu: { value: "" },
          fri: { value: "" },
          sat: { value: "" },
          sun: { value: "" }
        };
        for (let day = 1; day < 32; day++) student[String(day)] = { value: "" };
        this.$set(this.students, index, student);
        // this.students.push(student);
      });
    },
    update_class_attendance_data(class_attendance) {
      var day = class_attendance.start_time.format("ddd").toLowerCase();
      this.students.forEach(std => {
        class_attendance.entries.forEach(entry => {
          if (entry.student == std.id) {
            std[day].value = entry.attendance;
            std[day].attendance_id = entry.id;
          }
        });
      });
    },
    add_class_attendances(class_attendances) {
      var is_todays = att =>
        att.start_time.isAfter(moment().startOf("day")) &&
        att.start_time.isBefore(moment().endOf("day"));
      this.active_attendance_for_today = [];
      class_attendances.forEach(class_attendance => {
        class_attendance.start_time = moment(class_attendance.start_time);
        if (is_todays(class_attendance)) {
          if (!class_attendance.end_time)
            this.active_attendance_for_today.push(class_attendance);
        } else {
          this.update_class_attendance_data(class_attendance);
        }
      });

      if (this.active_attendance_for_today.length > 1) {
        this.error =
          "You have started multiple classes, select one to continue";
      } else {
        this.select_active_class_attendance(
          this.active_attendance_for_today[0]
        );
      }
    },
    select_active_session() {
      this.sessions.forEach(session => {
        if (session.is_active) {
          this.selected_session_name = session.name;
        }
      });
    },
    select_active_class_attendance(active_class_attendance) {
      this.update_class_attendance_data(active_class_attendance);
      this.class_start_time = active_class_attendance.start_time;
      this.class_state = ClassState.STARTED;
      this.class_attendance_id = active_class_attendance.id;
      this.active_attendance_for_today = [active_class_attendance];
      this.error = "";
      this.disable_attendance = false;
    },
    fetch_class_attendance() {
      this.receiving = true;
      classroom_service
        .get_attendance({
          classroom: this.selected_class.id,
          facult: this.$store.getters.getProfile.id,
          start_time_after: moment()
            .startOf("week")
            .format()
        })
        .then(attendances => {
          this.add_class_attendances(attendances);
        })
        .catch(error => {
          console.log(error);
        });
    },
    fetch_sessions() {
      this.receiving = true;
      session_service
        .all()
        .then(sessions => {
          this.sessions = sessions;
          this.receiving = false;
          this.select_active_session();
        })
        .catch(error => {
          console.log(error);
          this.receiving = false;
        });
    },
    fetch_students() {
      this.receiving = true;
      var query_params = {
        classroom: this.selected_class.id
      };
      return classroom_service
        .students(query_params)
        .then(students => {
          this.add_students(students);
          this.receiving = false;
          return Promise.resolve();
        })
        .catch(error => {
          console.log(error);
          this.receiving = false;
          return Promise.reject();
        });
    },
    fetch_classes(session_name) {
      this.receiving = true;
      var query_params = {
        session__name: session_name,
        faculty__profile__profile_id: this.faculty_id
      };
      classroom_service
        .all(query_params)
        .then(classes => {
          this.classes = classes;
          this.receiving = false;
        })
        .catch(error => {
          console.log(error);
          this.receiving = false;
        });
    }
  }
};
</script>