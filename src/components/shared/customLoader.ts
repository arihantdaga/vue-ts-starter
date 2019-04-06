import Vue from "vue";
import Component from "vue-class-component";

@Component({
    template: `
                <div class="custom-loader" :class='"s"+widthClass'>
                    <svg class="circular" viewBox="25 25 50 50">
                    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10" :class='{"prim": !colorClass, [colorClass]: colorClass && 1}' />
                    </svg>
                </div>
    `,
    props:['widthClass', 'colorClass'],
    name:'custom-loader'
})
export class CustomLoaderComponent extends Vue {
    constructor() {
        super();
    }

    mounted() { 

    }
}