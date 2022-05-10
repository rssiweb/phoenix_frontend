<template>
  <v-container>
    <h1>Time-Sheet</h1>
    <v-data-table :headers="headers" :items="items"> </v-data-table>
  </v-container>
</template>
<script>
import { REPORT_ATTENDANCE } from "@/store/actions";
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "reports-page",
  data() {
    return {
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Associate ID",
          value: "id",
        },
        {
          text: "Max classes",
          value: "class_count",
        },
      ],
    };
  },
  computed: {
    ...mapState("report", {
      items: "attendance_report",
    }),
  },
  created() {
    var month = moment().format("MM-YYYY");
    this.$store.dispatch(REPORT_ATTENDANCE, month);
  },
};
</script>