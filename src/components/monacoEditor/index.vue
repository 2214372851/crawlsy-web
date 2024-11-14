<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>
<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {editorProps} from './index'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/python/python.contribution";
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js';
import 'monaco-editor/esm/vs/editor/contrib/folding/browser/folding.js';
import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController.js';
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController.js';


const pythonKeywords = [
  "False", "None", "True", "_", "and", "as", "assert", "async", "await", "break", "case",
  "class", "continue", "def", "del", "elif", "else", "except", "exec", "finally", "for", "from",
  "global", "if", "import", "in", "is", "lambda", "match", "nonlocal", "not", "or", "pass", "print",
  "raise", "return", "try", "while", "with", "yield", "int", "float", "complex", "abs", "all", "any",
  "bin", "bool", "callable", "chr", "classmethod", "delattr", "dict", "dir", "eval", "execfile", "filter",
  "format", "frozenset", "getattr", "globals", "hasattr", "hash", "input", "isinstance", "iter", "len",
  "list", "map", "max", "memoryview", "min", "next", "object", "open", "ord", "pow", "property", "range",
  "reduce", "reload", "repr", "round", "self", "set", "setattr", "slice", "sorted", "staticmethod", "str",
  "sum", "super", "tuple", "type", "vars", "zip"
]

let code = "";

// 注册Python的自动补全
monaco.languages.registerCompletionItemProvider('python', {
  // @ts-ignore
  provideCompletionItems: function () {
    let suggestions = [];

    // Python 关键词补全
    pythonKeywords.forEach(item => {
      suggestions.push({
        label: item,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: item
      });
    })

    const regex = /(?:^|\s)(def|class)\s+([a-zA-Z_][a-zA-Z0-9_]*)|([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*=)/g;
    let match;

    while ((match = regex.exec(code)) !== null) {
      const name = match[2] || match[3];
      if (name) {
        suggestions.push({
          label: name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: name
        });
      }
    }

    return {suggestions};
  },
});

async function getMonacoWorker(label: string) {
  try {
    if (label === 'json') {
      const {default: jsonWorker} = await import('monaco-editor/esm/vs/language/json/json.worker?worker');
      return new jsonWorker();
    }
    if (['css', 'scss', 'less'].includes(label)) {
      const {default: cssWorker} = await import('monaco-editor/esm/vs/language/css/css.worker?worker');
      return new cssWorker();
    }
    if (['html', 'handlebars', 'razor'].includes(label)) {
      const {default: htmlWorker} = await import('monaco-editor/esm/vs/language/html/html.worker?worker');
      return new htmlWorker();
    }
    if (['typescript', 'javascript'].includes(label)) {
      const {default: tsWorker} = await import('monaco-editor/esm/vs/language/typescript/ts.worker?worker');
      return new tsWorker();
    }

    const {default: EditorWorker} = await import('monaco-editor/esm/vs/editor/editor.worker?worker');
    return new EditorWorker();
  } catch (error) {
    console.error("加载 Monaco Worker 时发生错误:", error);
    throw error;
  }
}

export default defineComponent({
  name: 'monacoEditor',
  props: editorProps,
  emits: ['update:modelValue', 'change', 'editor-mounted', 'save-change'],
  setup(props, {emit}) {
    self.MonacoEnvironment = {
      async getWorker(_: string, label: string) {
        return getMonacoWorker(label);
      },
    }

    let editor: monaco.editor.IStandaloneCodeEditor
    const codeEditBox = ref()

    const init = () => {
      try {
        editor = monaco.editor.create(codeEditBox.value, {
          value: props.modelValue,
          language: props.language,
          theme: props.theme,
          ...props.options,
        })

        editor.addCommand(
            monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, 0),
            function () {
              const value = editor.getValue()
              emit('save-change', value)
            }
        );

        editor.onDidChangeModelContent(() => {
          const value = editor.getValue()
          code = value
          emit('update:modelValue', value)
          emit('change', value)
        })

        emit('editor-mounted', editor)
      } catch (error) {
        console.error("初始化 Monaco 编辑器时发生错误:", error);
      }
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
