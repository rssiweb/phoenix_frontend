<template>
  <auth-base-layout>
    <v-container :fluid="mode==1">
      <v-row>
        <v-col lg="2" md="4" sm="6">
          <v-select
            :items="classes"
            label="Class"
            :loading="receiving"
            :disabled="receiving || !selected_session_name || class_started"
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
        <template v-for="(btn_txt, index) in attendance_btn.values">
          <v-btn x-small class="ml-4 mr-1" :color="attendance_btn.colors[btn_txt]" :key="btn_txt">{{btn_txt}}</v-btn>{{attendance_btn.description[index]}}
        </template>

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
          <v-icon small>mdi-error</v-icon>
          {{message.error}}
        </p>
        <br/>
        <p class="info--text">
          <v-icon small>mdi-info</v-icon>
          {{message.info}}
        </p>
        <v-spacer></v-spacer>
      </v-row>
      <v-row class="mt-2" v-if="show_all_classes">
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
                <th class="text-center" v-for="item in table_headers" :key="item.value">{{item.text}}</th>
              </tr>
            </thead>
            <tbody v-if="students.length">
              <tr v-for="std in students" :key="std.id">
                <td v-for="header in table_headers" :key="header.value" class="text-center" :class="{'pa-0': mode == 1}">
                  <template v-if="header.btn">
                    <v-btn
                      @click.prevent="set_attendance(std, header.date)"
                      :disabled="!header.editable || disable_attendance || !class_started || std[header.date.format('ddd').toLowerCase()].sending"
                      :class="get_attendance_btn_color(std, header.value)"
                      depressed
                      x-small
                    >{{std[header.value].value}}</v-btn>
                  </template>
                  <template v-else>
                    {{std[header.value]}}
                  </template>
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
      attendance_btn: {
        values: ["", "P", "A", "S"],
        description: ["No Value", "Present", "Absent", "Suspended"],
        colors:{ P: "success", A: "error", "": "primary", S: "warning"},
        next_value: { A: "S", P: "A", "": "P", S: "" },
      },
      message: {
        info: "",
        error: "",
      },
      disable_attendance: false,
      attendace_value_rule: v =>
        ["A", "P"].find(valid => {
          v && v.toUpperCase() != valid;
        }) || "Invalid Value",
      active_attendance: {
        state: ClassState.NOT_STARTED,
        start_time: null,
        end_time: null,
        id: null,
      },
      active_attendance_for_today: [],
      class_attendance_id: null,
      class_attendances: [],
      mode: 0,
      receiving: false,
      sessions: [],
      selected_session_name: null,
      classes: [],
      selected_class_name: null,
      students: [],
      show_all_classes: false,
    };
  },
  computed: {
    class_started() {
      return this.active_attendance.state == ClassState.STARTED;
    },
    class_start_time_str() {
      return this.active_attendance.start_time.format("hh:mm A");
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
      var class_start_moment = moment(this.active_attendance.start_time);
      console.log("class_start_moment", class_start_moment, class_start_moment.date());
      var common_headers = [{ text: "Name", value: "name", btn: false }];
      var weekly_header = [
        ...common_headers,
        {
          text: "SUN",
          value: "sun",
          date: moment().startOf("week"),
          editable: class_start_moment.format("ddd") === "Sun",
          btn: true
        },
        {
          text: "MON",
          value: "mon",
          date: moment().startOf("week").add("days", 1),
          editable: class_start_moment.format("ddd") === "Mon",
          btn: true
        },
        {
          text: "TUE",
          value: "tue",
          date: moment().startOf("week").add("days", 2),
          editable: class_start_moment.format("ddd") === "Tue",
          btn: true
        },
        {
          text: "WED",
          value: "wed",
          date: moment().startOf("week").add("days", 3),
          editable: class_start_moment.format("ddd") === "Wed",
          btn: true
        },
        {
          text: "THU",
          value: "thu",
          date: moment().startOf("week").add("days", 4),
          editable: class_start_moment.format("ddd") === "Thu",
          btn: true
        },
        {
          text: "FRI",
          value: "fri",
          date: moment().startOf("week").add("days", 5),
          editable: class_start_moment.format("ddd") === "Fri",
          btn: true
        },
        {
          text: "SAT",
          value: "sat",
          date: moment().startOf("week").add("days", 6),
          editable: class_start_moment.format("ddd") === "Sat",
          btn: true
        }
      ];
      var monthly_headers = [...common_headers];
      for (let date = 1; date < 32; date++)
        monthly_headers.push({
          date: moment().startOf("month").add("days", date - 1),
          text: String(date),
          value: String(date),
          editable: class_start_moment.date() == date,
          btn: true
        });
      return {
        0: weekly_header,
        1: monthly_headers
      }[this.mode];
    },
    mode_btn_txt() {
      return { 0: "Monthly", 1: "Weekly" }[this.mode];
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
      if (this.active_attendance.state == ClassState.NOT_STARTED)
        this.active_attendance.state = ClassState.STARTED;
      else if (this.active_attendance.state == ClassState.STARTED) {
        this.active_attendance.state = ClassState.ENDED;
      } else if (this.active_attendance.state == ClassState.ENDED) {
        console.log("class ended already");
      }
      if (this.active_attendance.state == ClassState.STARTED) {
        this.active_attendance.start_time = moment();
        classroom_service
          .start_class({
            classroom: this.selected_class.id,
            faculty: this.$store.getters.getProfile.id,
            start_time: this.active_attendance.start_time.format()
          })
          .then(class_attendance => {
            this.class_attendance_id = class_attendance.id;
          });
      } else if (this.active_attendance.state == ClassState.ENDED) {
        this.active_attendance.end_time = moment();
        classroom_service.end_class(this.class_attendance_id, {
          end_time: this.active_attendance.end_time.format()
        });
      }
    },
    get_attendance_btn_color(std, day) {
      var color = this.attendance_btn.colors[std[day].value];
      return color;
    },
    set_attendance(std, date) {
      var std_attendance_weekly = std[date.format('ddd').toLowerCase()];
      console.log(date, date.format('DD'))
      var std_attendance_monthly = std[parseInt(date.format('DD'))];
      var value = this.attendance_btn.next_value[std_attendance_weekly.value];
      console.log(std_attendance_weekly.value, value)
      if (value == "") {
        // delete the attendance
        std_attendance_weekly.sending = true;
        std_attendance_monthly.sending = true;
        classroom_service
          .delete_student_attendance(std_attendance_weekly.attendance_id)
          .then(() => {
            std_attendance_weekly.value = value;
            std_attendance_weekly.attendance_id = undefined;
            std_attendance_weekly.sending = false;
            std_attendance_monthly.value = value;
            std_attendance_monthly.attendance_id = undefined;
            std_attendance_monthly.sending = false;
          })
          .catch(error => {
            console.log(error);
            std_attendance_weekly.sending = false;
            std_attendance_monthly.sending = false;
          });
      } else if(value == "P"){
        classroom_service
          .add_student_attendance({
            attendance: value,
            class_attendance: this.class_attendance_id,
            student: std.id
          })
          .then(std_attendace => {
            std_attendance_weekly.value = std_attendace.attendance;
            std_attendance_weekly.attendance_id = std_attendace.id;
            std_attendance_monthly.value = std_attendace.attendance;
            std_attendance_monthly.attendance_id = std_attendace.id;
          })
          .catch(error => {
            console.log(error);
          });
      } else{
        classroom_service
          .update_student_attendance(std_attendance_weekly.attendance_id, {
            attendance: value,
            class_attendance: this.class_attendance_id,
            student: std.id
          })
          .then(std_attendace => {
            std_attendance_weekly.value = std_attendace.attendance;
            std_attendance_weekly.attendance_id = std_attendace.id;
            std_attendance_monthly.value = std_attendace.attendance;
            std_attendance_monthly.attendance_id = std_attendace.id;
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
      var date = class_attendance.start_time.date()
      this.students.forEach(std => {
        class_attendance.entries.forEach(entry => {
          if (entry.student == std.id) {
            std[day].value = entry.attendance;
            std[day].attendance_id = entry.id;
            std[date].value = entry.attendance;
            std[date].attendance_id = entry.id;
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
          // if (!class_attendance.end_time)
            this.active_attendance_for_today.push(class_attendance);
        } else {
          this.update_class_attendance_data(class_attendance);
        }
      });

      if (this.active_attendance_for_today.length == 0) {
        // wait for user to start a class
        this.disable_attendance = false;
      }
      else {
        this.message.error = "select a class time to continue";
        this.show_all_classes = true;
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
      this.show_all_classes = false
      this.update_class_attendance_data(active_class_attendance);
      this.active_attendance.start_time = active_class_attendance.start_time;
      this.active_attendance.state = ClassState.STARTED;
      this.class_attendance_id = active_class_attendance.id;
      this.active_attendance_for_today = [active_class_attendance];
      this.message.error = "";
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
          this.receiving = false;
          this.add_class_attendances(attendances);
        })
        .catch(error => {
          console.log(error);
          this.receiving = false;
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