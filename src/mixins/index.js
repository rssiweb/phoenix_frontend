import Vue from 'vue'
// import decode_error_message from "@/extras/error"
import { mapGetters, mapState } from "vuex";
import moment from "moment";

Vue.mixin({
    components: {
        // EmptyState,
    },
    data() {
        return {
            // global data
            google_api_key: '',
            website_title: "Phoenix",
            media_base: process.env.VUE_APP_MEDIA_BASE || '',
            base_url: process.env.VUE_APP_BASE_URL || ''
        }
    },
    computed: {
        ...mapState("profile", {
            my_profile: (state) => state.profile
        }),
        ...mapGetters("auth", [
            "isAuthenticated"
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