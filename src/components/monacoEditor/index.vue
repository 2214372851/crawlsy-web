<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>
<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {editorProps} from './index'
import * as monaco from 'monaco-editor'

export default defineComponent({
  name: 'monacoEditor',
  props: editorProps,
  emits: ['update:modelValue', 'change', 'editor-mounted'],
  setup(props, {emit}) {
    self.MonacoEnvironment = {
      async getWorker(_: string, label: string) {
        if (label === 'json') {
          const { default: jsonWorker } = await import('monaco-editor/esm/vs/language/json/json.worker?worker');
          return new jsonWorker();
        }
        if (['css', 'scss', 'less'].includes(label)) {
          const { default: cssWorker } = await import('monaco-editor/esm/vs/language/css/css.worker?worker');
          return new cssWorker();
        }
        if (['html', 'handlebars', 'razor'].includes(label)) {
          const { default: htmlWorker } = await import('monaco-editor/esm/vs/language/html/html.worker?worker');
          return new htmlWorker();
        }
        if (['typescript', 'javascript'].includes(label)) {
          const { default: tsWorker } = await import('monaco-editor/esm/vs/language/typescript/ts.worker?worker');
          return new tsWorker();
        }

        const { default: EditorWorker } = await import('monaco-editor/esm/vs/editor/editor.worker?worker');
        return new EditorWorker();
      },
    }
    let editor: monaco.editor.IStandaloneCodeEditor
    const codeEditBox = ref()
    const init = () => {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      })
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
      })
      editor = monaco.editor.create(codeEditBox.value, {
        value: props.modelValue,
        language: props.language,
        theme: props.theme,
        ...props.options,
      })
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue()
        emit('update:modelValue', value)
        emit('change', value)
      })
      emit('editor-mounted', editor)
    }
    watch(
        () => props.modelValue,
        newValue => {
          if (editor) {
            const value = editor.getValue()
            if (newValue !== value) {
              editor.setValue(newValue)
            }
          }
        }
    )
    watch(
        () => props.options,
        newValue => {
          editor.updateOptions(newValue)
        },
        {deep: true}
    )
    watch(
        () => props.language,
        newValue => {
          monaco.editor.setModelLanguage(editor.getModel()!, newValue)
        }
    )
    onBeforeUnmount(() => {
      editor.dispose()
    })
    onMounted(() => {
      init()
    })
    return {codeEditBox}
  },
})
</script>
<style lang="less" scoped>
.codeEditBox {
  width: v-bind(width);
  height: v-bind(height);
}
</style>