import Vue from "vue";
import VueRouter from "vue-router";
import { makeHot, reload } from "./util/hot-reload";
import { createRouter } from "./router";
import { LoginService } from "./util/login";
import Filters from "./util/filter";
import infiniteScroll from "vue-infinite-scroll";

// import BootstrapVue from 'bootstrap-vue';

// import Dropdown from 'bp-vuejs-dropdown';

// var VueAutosize = require('vue-autosize')

// import vuescroll from 'vue-scroll'

import "./sass/main.scss";
import { CustomLoaderComponent } from "./components/shared/customLoader";

// Importing custom Components Required Everywhere -

import vueHeadful from "vue-headful";

declare global {
  interface Window {
    something: any;
    pramukhIME: any;
  }
  var FB: any;
  var ga: any;
}

const navbarComponent = () =>
  import("./components/navbar").then(({ NavbarComponent }) => NavbarComponent);
// const customLoaderComponent = () => import('./components/shared/customLoader').then(({ CustomLoaderComponent }) => CustomLoaderComponent);
// const navbarComponent = () => import(/* webpackChunkName: 'navbar' */'./components/navbar').then(({ NavbarComponent }) => NavbarComponent);

if (process.env.ENV === "development" && module.hot) {
  const navbarModuleId = "./components/navbar";

  // first arguments for `module.hot.accept` and `require` methods have to be static strings
  // see https://github.com/webpack/webpack/issues/5668
  makeHot(
    navbarModuleId,
    navbarComponent,
    module.hot.accept("./components/navbar", () =>
      reload(
        navbarModuleId,
        (<any>require("./components/navbar")).NavbarComponent
      )
    )
  );
}

// All Global Filters
for (let filter in Filters.filtersnow) {
  // console.log(filter);
  Vue.filter(filter, Filters.filtersnow[filter]);
}

// All Global Components
Vue.component("custom-loader", CustomLoaderComponent);
Vue.component("vue-headful", vueHeadful);
Vue.use(infiniteScroll);
// Vue.use(BootstrapVue);
// Vue.use(Dropdown);
// Vue.use(VueAutosize)
// Vue.use(vuescroll);

// Vue.directive('title', {
//   inserted: (el, binding) => document.title = binding.value,
//   update: (el, binding) => document.title = binding.value
// })

// Vue.directive('title', {
//   inserted: (el, binding) => document.title = binding.value,
//   update: (el, binding) => document.title = binding.value
// });

// For Ion Icons and other custom Compomnents
Vue.config.ignoredElements = ["ion-icon"];

let router = createRouter();

let app = new Vue({
  el: "#app-main",
  router: router,
  components: {
    navbar: navbarComponent
    // 'custom-loader': CustomLoaderComponent
  },
  data: {
    loginService: LoginService.getInstance(),
    defaultTitle: "Hello || This is my app",
    transparentNav: false
  },
  created() {
    // this.loginService.checkLogin();
  }
});

router.beforeEach((to, from, next) => {
  next();
});

router.afterEach((to, from) => {
  // setTimeout(() => app.loading = false, 1500); // timeout for demo purposes
});
