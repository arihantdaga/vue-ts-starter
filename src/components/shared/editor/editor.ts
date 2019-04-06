import  MediumEditor  from 'medium-editor';
import { Component, Vue, Watch } from "vue-property-decorator";
@Component({
props: {
    text: {
        type: [String],
    },
    customTag: {
        type: [String],
        default: () => 'div'
    },
    options: {
        type: [Object],
        default: ()=> {}
    },
    refTag: {
      type: [String],
      default: () => 'medium-editor'
    }
    
},
name: 'medium-editor'
})
export class MediumEditorCompomnent extends Vue{
    api: MediumEditor.MediumEditor;
    emit: any;

    constructor(){
        super();
    }
    render (createElement) {
        return createElement(this.$props.customTag, { ref: this.$props.refTag});
      }
      mounted(){
        this.createAndSubscribe();

      }
      beforeDestroy(evt){
        this.tearDown();

      }
      tearDown(){
        this.api.unsubscribe('editableInput', this.emit)
        this.api.destroy()
      }
      createAndSubscribe(){
        let elem = this.$refs[this.$props.refTag] as HTMLElement;
        elem.innerHTML = this.$props.text;

        this.api = new MediumEditor(this.$refs[this.$props.refTag], this.$props.options)

        // bind edit operations to model
        // we need to store the handler in order to later on detach it again
        this.emit = event => this.$emit('edit', {event, api: this.api})
        this.api.subscribe('editableInput', this.emit)

        // emit event to give parent access to MediumEditor instance
        this.$emit('editorCreated', this.api);
      }
      @Watch("text")
      textChanged(newText){
        // innerHTML MUST not be performed if the text did not actually change.
        // otherwise, the caret position will be reset.
        let elem = this.$refs[this.$props.refTag] as HTMLElement;

        if (newText !== elem.innerHTML) {
          this.api.setContent(this.$props.text, 0)
          elem.innerHTML = this.$props.text
        }
      }

      @Watch("options")
      optionsChanged (newOptions) {
        if (newOptions !== this.$props.options) {
          this.tearDown()
          this.createAndSubscribe()
        }
      }

}

// export default {
//   name: 'medium-editor',
//   props: {
//     text: [String],
//     customTag: {
//       type: [String],
//       default: () => 'div'
//     },
//     options: {
//       type: [Object],
//       default: () => {}
//     }
//   },
//   render (h) {
//     return h(this.customTag, { ref: 'element' })
//   },

//   mounted (evt) {
//     this.createAndSubscribe()
//   },

//   beforeDestroy (evt) {
//     this.tearDown()
//   },
//   methods: {
//     tearDown () {
//       this.api.unsubscribe('editableInput', this.emit)
//       this.api.destroy()
//     },
//     createAndSubscribe () {
//       this.$refs[this.$props.refTag].innerHTML = this.text

//       this.api = new MediumEditor(this.$refs[this.$props.refTag], this.options)

//       // bind edit operations to model
//       // we need to store the handler in order to later on detach it again
//       this.emit = event => this.$emit('edit', {event, api: this.api})
//       this.api.subscribe('editableInput', this.emit)

//       // emit event to give parent access to MediumEditor instance
//       this.$emit('editorCreated', this.api);
//     }
//   },
//   watch: {
//     text (newText) {
//       // innerHTML MUST not be performed if the text did not actually change.
//       // otherwise, the caret position will be reset.
//       if (newText !== this.$refs[this.$props.refTag].innerHTML) {
//         this.api.setContent(this.text, 0)
//         this.$refs[this.$props.refTag].innerHTML = this.text
//       }
//     },
//     /**
//      * There is currently no way to change the options of a medium editor
//      * without destroying and re-setting up the MediumEditor object.
//      * We only tear down the editor, if the options actually changed.
//      * See: https://github.com/yabwe/medium-editor/issues/1129
//      */
//     options (newOptions) {
//       if (newOptions !== this.options) {
//         this.tearDown()
//         this.createAndSubscribe()
//       }
//     }
//   },
//   MediumEditor
// }
