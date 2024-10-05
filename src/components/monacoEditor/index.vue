<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>
<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {editorProps} from './index'
import * as monaco from 'monaco-editor'

const pythonKeywords = [
  // This section is the result of running
  // `import keyword; for k in sorted(keyword.kwlist + keyword.softkwlist): print("  '" + k + "',")`
  // in a Python REPL,
  // though note that the output from Python 3 is not a strict superset of the
  // output from Python 2.
  "False",
  // promoted to keyword.kwlist in Python 3
  "None",
  // promoted to keyword.kwlist in Python 3
  "True",
  // promoted to keyword.kwlist in Python 3
  "_",
  // new in Python 3.10
  "and",
  "as",
  "assert",
  "async",
  // new in Python 3
  "await",
  // new in Python 3
  "break",
  "case",
  // new in Python 3.10
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "exec",
  // Python 2, but not 3.
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "match",
  // new in Python 3.10
  "nonlocal",
  // new in Python 3
  "not",
  "or",
  "pass",
  "print",
  // Python 2, but not 3.
  "raise",
  "return",
  "try",
  "type",
  // new in Python 3.12
  "while",
  "with",
  "yield",
  "int",
  "float",
  "long",
  "complex",
  "hex",
  "abs",
  "all",
  "any",
  "apply",
  "basestring",
  "bin",
  "bool",
  "buffer",
  "bytearray",
  "callable",
  "chr",
  "classmethod",
  "cmp",
  "coerce",
  "compile",
  "complex",
  "delattr",
  "dict",
  "dir",
  "divmod",
  "enumerate",
  "eval",
  "execfile",
  "file",
  "filter",
  "format",
  "frozenset",
  "getattr",
  "globals",
  "hasattr",
  "hash",
  "help",
  "id",
  "input",
  "intern",
  "isinstance",
  "issubclass",
  "iter",
  "len",
  "locals",
  "list",
  "map",
  "max",
  "memoryview",
  "min",
  "next",
  "object",
  "oct",
  "open",
  "ord",
  "pow",
  "print",
  "property",
  "reversed",
  "range",
  "raw_input",
  "reduce",
  "reload",
  "repr",
  "reversed",
  "round",
  "self",
  "set",
  "setattr",
  "slice",
  "sorted",
  "staticmethod",
  "str",
  "sum",
  "super",
  "tuple",
  "type",
  "unichr",
  "unicode",
  "vars",
  "xrange",
  "zip",
  "__dict__",
  "__methods__",
  "__members__",
  "__class__",
  "__bases__",
  "__name__",
  "__mro__",
  "__subclasses__",
  "__init__",
  "__import__"
]

let code = "";
monaco.languages.registerCompletionItemProvider('python', {
  // @ts-ignore
  provideCompletionItems: function () {
    let suggestions = [];
    pythonKeywords.forEach(item => {
      suggestions.push({
        label: item,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: item
      });
    })
    const regex = /\b(?:def|class)\s+([a-zA-Z_][a-zA-Z0-9_]*)|([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*=)/g;
    let match;

    while ((match = regex.exec(code)) !== null) {
      const name = match[1] || match[2];
      if (name) {
        suggestions.push({
          label: name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: name
        });
      }
    }
    return {
      // 最后要返回一个数组
      suggestions: suggestions
    };
  },
});

export default defineComponent({
  name: 'monacoEditor',
  props: editorProps,
  emits: ['update:modelValue', 'change', 'editor-mounted', 'save-change'],
  setup(props, {emit}) {
    self.MonacoEnvironment = {
      async getWorker(_: string, label: string) {
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