import { Component, Vue } from "vue-property-decorator";
import VueRouter, { Location, Route, RouteConfig } from "vue-router";
import { Constants } from "../../config/constants";
import { showAlert } from "../../util/alerts.service";

import "./home.scss";
import { DataService } from "../../util/data";

@Component({
  template: require("./home.html"),
  name: "home"
})
export class HomeComponent extends Vue {
  title: string = "My App";
  description: string = "My App";
  constructor() {
    super();
  }
}
