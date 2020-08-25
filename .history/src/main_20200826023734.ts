import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./index.css";
import "bulma/css/bulma.css";

import { debounce } from "lodash";
console.log("test", debounce);

const app = createApp(App);
app.use(router);
app.mount("#app");
