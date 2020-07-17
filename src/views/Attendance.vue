<template>
  <auth-base-layout>
    <v-container>
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
        <v-col>
          <v-data-table :headers="table_headers" :items="students" :items-per-page="20"></v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </auth-base-layout>
</template>
<script>
import AuthBaseLayout from "@/layouts/AuthBase";
import classroom_service from "@/services/classroom";
import student_service from "@/services/student";
import session_service from "@/services/session";

export default {
  name: "attendance-page",
  components: {
    AuthBaseLayout
  },
  data() {
    return {
      receiving: false,
      sessions: [],
      selected_session_name: null,
      classes: [],
      selected_class_name: null,
      students: [],
      table_headers: []
    };
  },
  computed: {
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
      this.fetch_students();
    }
  },
  created() {
    this.fetch_sessions();
  },
  methods: {
    select_active_session() {
      this.sessions.forEach(session => {
        if (session.is_active) {
          this.selected_session_name = session.name;
        }
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
        a: this.selected_class.name,
        session__name: this.session_name
      };
      student_service
        .all(query_params)
        .then(students => {
          this.students = students;
          this.receiving = false;
        })
        .catch(error => {
          console.log(error);
          this.receiving = false;
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