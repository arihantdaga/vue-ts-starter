import { Collapse, Dropdown } from "uiv";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Link } from "./link";
import { Logger } from "../../util/log";
import { LoginService } from "../../util/login";

import "./navbar.scss";

@Component({
  template: require("./navbar.html"),
  components: {
    collapse: Collapse
  }
  // props: ["transparentnav"]
})
export class NavbarComponent extends Vue {
  protected logger: Logger;
  loginService: LoginService = LoginService.getInstance();
  loggedinUser = null;

  inverted: boolean = true; // default value

  showNavbar = false;
  transparentnav: boolean;
  // transParentNav = this.$props.transParentNav;

  object: { default: string } = { default: "Default object property!" }; // objects as default values don't need to be wrapped into functions

  links: Link[] = [];

  @Watch("$route.path")
  pathChanged() {
    // this.logger.info('Changed current path to: ' + this.$route.path);
    // this.showNavbar=!this.showNavbar
    // Toggle Navbar only if it is open already
    // console.log(this.$route);
    if (this.showNavbar) {
      this.showNavbar = !this.showNavbar;
    }

    this.checkForHomePage();
  }
  checkForHomePage() {
    if (this.$route.name == "HomePage") {
      this.transparentnav = true;
    } else {
      this.transparentnav = false;
    }
  }

  created() {
    this.loggedinUser = this.loginService.user.data;
    this.checkForHomePage();
  }

  mounted() {
    if (!this.logger) this.logger = new Logger();
    this.$nextTick(() => this.logger.info(this.object.default));
  }
  logout() {
    this.loginService.logout();
    this.$router.replace("/login");
    // // console.log("Logout is called");
    // // console.log(this.loginService.user.token);
  }
}
