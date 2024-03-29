import Vue from 'vue'
// import decode_error_message from "@/extras/error"
import { mapGetters, mapState } from "vuex";
import moment from "moment";
import constants from "@/constants";
Vue.mixin({
    components: {
        // EmptyState,
    },
    data() {
        return {
            // global data
            constants: constants,
            google_api_key: '',
            website_title: "Phoenix",
            media_base: process.env.VUE_APP_MEDIA_BASE || '',
            base_url: process.env.VUE_APP_BASE_URL || ''
        }
    },
    computed: {
        ...mapState("user", {
            me: (state) => state.user
        }),
        ...mapGetters("auth", [
            "isAuthenticated",
            "authUsername",
            "authId",
        ]),
    },
    methods: {
        
        first_of(arr) {
            if (arr && arr.length > 0)
                return arr[0]
        },
        scroll_top() {
            window.scrollTo(0, 0);
        },
        date_to_txt(datetime) {
            return moment(datetime).fromNow()
        }
    }
})