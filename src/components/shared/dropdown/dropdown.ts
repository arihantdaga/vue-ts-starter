import { Component, Vue, Watch } from "vue-property-decorator";

import "./dropdown.scss";

@Component({
  props: {
    role: {
      type: String,
      required: false,
      default: ""
    },
    unscroll: {
      type: [HTMLElement, String],
      required: false,
      default: null
    },
    align: {
      type: String,
      required: false,
      default: "bottom"
    },
    x: {
      type: Number,
      required: false,
      default: 0
    },
    y: {
      type: Number,
      required: false,
      default: 0
    },
    beforeOpen: {
      type: Function,
      required: false,
      default: resolve => resolve()
    },
    trigger: {
      type: String,
      required: false,
      default: "click"
    },
    closeOnClick: {
      type: Boolean,
      required: false,
      default: false
    },
    isIcon: {
      type: Boolean,
      required: false,
      default: true
    },
    className: {
      type: String,
      required: false,
      default: ""
    }
  },
  template: require("./dropdown.html"),
  name: "custom-dropdown"
})
export class CustomDropDown extends Vue {
  isHidden = true;
  isLoading = false;
  id = null;
  timeout = null;
  top = 10;
  right;
  bottom;
  left = 0;
  width = 10;
  constructor() {
    super();
  }
  created() {
    const $root = this.$root;
    // --- hide dropdown if other dropdowns show
    // --- or document clicked
    $root.$on("bp-dropdown:open", () => (this.isHidden = true));
    $root.$on("bp-dropdown:hide", () => (this.isHidden = true));
    // --- hide dropdown on document click event
    if (this.$props.trigger === "click" && !$root["is-bp-dropdown"]) {
      Object.defineProperty($root, "is-bp-dropdown", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: true
      });
      document.onmousedown = e => {
        const target: any = e.target;
        const dropdown =
          target.closest(".bp-dropdown__btn") ||
          target.closest(".bp-dropdown__body");
        if (!dropdown) {
          $root.$emit("bp-dropdown:hide");
        }
      };
    }
    this.id = "bp-dropdown-" + this.generateRandomId();
  }
  mounted() {}
  updated() {}
  // Function for calling from parent to trigger autosize
  resize() {}

  generateRandomId() {
    return Math.random()
      .toString(36)
      .substr(2, 10);
  }
  _onToggle(e) {
    if (this.$props.trigger !== "click") {
      return;
    }
    this.checkCustomCallback(e);
  }
  _onBtnEnter(e) {
    if (this.$props.trigger !== "hover" || !this.isHidden) {
      return;
    }
    this.checkCustomCallback(e);
  }
  _onBtnLeave(e) {
    if (this.$props.trigger !== "hover") {
      return;
    }
    if (this.$props.role) {
      this.timeout = setTimeout(() => (this.isHidden = true), 100);
    }
    const to = e.toElement;
    if (!to) {
      return;
    }
    const isDropdown =
      to.closest(".bp-dropdown__btn") || to.closest(".bp-dropdown__body");
    if (isDropdown) {
      return;
    }
    this.prepare();
  }
  _onBodyClick() {
    if (this.$props.closeOnClick) {
      this.isHidden = true;
    }
  }
  _onBodyEnter() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  _onBodyLeave(e) {
    if (this.$props.trigger !== "hover") {
      return;
    }
    const to = e.toElement;
    if (!to) {
      return;
    }
    if (to.closest(".bp-dropdown__btn") || to.closest(".bp-dropdown__sub")) {
      return;
    }
    this.prepare();
  }
  checkCustomCallback(e) {
    if (!this.isHidden) {
      this.prepare();
      return;
    }
    // --- custom callback before open
    const promise = new Promise(resolve => {
      this.isLoading = true;
      this.$props.beforeOpen.call(this, resolve);
    });
    promise.then(() => {
      this.isLoading = false;
      if (!e.target.closest(".bp-dropdown__body")) {
        // --- hide dropdown if other dropdowns show
        this.$root.$emit("bp-dropdown:open");
      }
      setTimeout(this.prepare, 0);
    });
    promise.catch(() => {
      throw Error("bp-dropdown promise error");
    });
  }
  prepare() {
    this.isHidden = !this.isHidden;
    if (!this.isHidden) {
      this.$nextTick(() => {
        const button: any = this.$el.firstElementChild;
        const container = document.getElementById(this.id);
        this.setWidth(button.offsetWidth);
        this.setPosition(button, container);
      });
    }
  }
  setWidth(width) {
    this.width = width;
  }
  setPosition(btn, body) {
    if (!btn || !body) {
      return;
    }
    const coords = this.getCoords(btn);
    // --- current position
    const currentTop = coords.top;
    const currentLeft = coords.left;
    // --- btn size
    const btnWidth = btn.offsetWidth;
    const btnHeight = btn.offsetHeight;
    // --- body size
    const bodyWidth = body.offsetWidth;
    const bodyHeight = body.offsetHeight;
    switch (this.$props.align) {
      case "top":
        this.top = currentTop + pageYOffset - bodyHeight;
        this.left = currentLeft + pageXOffset;
        break;
      case "right":
        this.top = currentTop + pageYOffset;
        this.left = currentLeft + pageXOffset + btnWidth;
        break;
      case "bottom":
        this.top = currentTop + pageYOffset + btnHeight;
        this.left = currentLeft + pageXOffset;
        break;
      case "left":
        this.top = currentTop + pageYOffset;
        this.left = currentLeft + pageXOffset - bodyWidth;
        break;
      default:
        this.top = currentTop + pageYOffset + btnHeight;
        this.left = currentLeft + pageXOffset;
        break;
    }
    this.top += this.$props.y;
    this.left += this.$props.x;
  }
  getCoords(el) {
    el = el.getBoundingClientRect();
    return {
      top: el.top - pageYOffset,
      left: el.left - pageXOffset
    };
  }

  @Watch("isHidden")
  isHiddenChanged(isHidden) {
    if (this.$props.unscroll) {
      const el =
        this.$props.unscroll instanceof HTMLElement
          ? this.$props.unscroll
          : document.querySelector(this.$props.unscroll);
      if (el) {
        el.style.overflow = !isHidden ? "hidden" : "";
      }
    }
  }
}
