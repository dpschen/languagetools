import { createEditorContext, getProjectPath } from '../support/helpers'
import { TestServer } from '../support/TestServer'

describe('project', () => {
  const server = new TestServer()
  const projects = ['typescript-diagnostics'] as const

  afterAll(async () => await server.close())
  describe.each(projects)('%s', (project) => {
    const editor = createEditorContext(server, getProjectPath(project))

    afterAll(async () => await editor.closeAll())

    test('checks exports in <script setup>', async () => {
      await editor.open('src/script-setup.vue')
      const { semantic } = await editor.getDiagnostics('src/script-setup.vue')

      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })

    test.each(['script', 'script-setup'])(
      'checks prop types when using %s',
      async (kind) => {
        await editor.open(`src/${kind}-prop-wrong-type.vue`)
        const { semantic } = await editor.getDiagnostics(
          `src/${kind}-prop-wrong-type.vue`,
        )

        expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
      },
    )

    test('diagnostics work aftere lang change', async () => {
      await editor.open('src/script-lang-change.vue')

      const before = await editor.getDiagnostics('src/script-lang-change.vue')
      expect(before.semantic).toHaveLength(0)
      expect(before.syntax).toMatchObject(
        [
          {
            text: `Type assertion expressions can only be used in TypeScript files.`,
          },
        ].map((item) => expect.objectContaining(item)),
      )

      await editor.replaceIn(
        'src/script-lang-change.vue',
        '<script setup>',
        () => '<script setup lang="ts">',
      )

      const after = await editor.getDiagnostics('src/script-lang-change.vue')
      expect(after.syntax).toHaveLength(0)
      expect(after.semantic).toMatchObject(
        [
          {
            text: `Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.`,
          },
        ].map((item) => expect.objectContaining(item)),
      )
    })

    test('v-html', async () => {
      const fileName = await editor.open('src/v-html.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })

    test('v-memo', async () => {
      const fileName = await editor.open('src/v-memo.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })

    test('v-model', async () => {
      const fileName = await editor.open('src/v-model.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })

    test('v-model-checkbox', async () => {
      const fileName = await editor.open('src/v-model-checkbox.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })

    test('v-model-input', async () => {
      const fileName = await editor.open('src/v-model-input.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })

    test('v-model-select', async () => {
      const fileName = await editor.open('src/v-model-select.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })

    test('v-on-native', async () => {
      const fileName = await editor.open('src/v-on-native.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })

    test('v-on', async () => {
      const fileName = await editor.open('src/v-on.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })

    test('v-once', async () => {
      const fileName = await editor.open('src/v-once.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })

    test('v-pre', async () => {
      const fileName = await editor.open('src/v-pre.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot(
        `Array []`,
      )
    })

    test('v-show', async () => {
      const fileName = await editor.open('src/v-show.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })

    test('v-text', async () => {
      const fileName = await editor.open('src/v-text.vue')
      const { semantic } = await editor.getDiagnostics(fileName)
      expect(semantic.map((diagnostic) => diagnostic.text)).toMatchSnapshot()
    })
  })
})
