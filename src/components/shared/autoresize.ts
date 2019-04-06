import autosize from "autosize";
import { Component, Vue, Watch } from 'vue-property-decorator';


@Component({
    props: ['handle-change', 'value'],
    template: `<textarea @input="handleChange" >{{ value }}</textarea>`,
    name:"auto-resize-textarea"
})
export class AutoSizeTextArea extends Vue{
    constructor(){
        super();
    }
    mounted() {
        autosize(this.$el)
    }
    updated(){
        autosize.update(this.$el);
    }
    // Function for calling from parent to trigger autosize
    resize(){
        autosize.update(this.$el);
    }
}


