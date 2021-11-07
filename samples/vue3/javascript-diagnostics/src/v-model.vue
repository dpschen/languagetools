<script setup>
import { ref, defineComponent } from 'vue'

const A = defineComponent({
  props: { modelValue: { type: String, required: true } },
})
const B = defineComponent({
  props: {
    foo: { type: String, required: true },
    bar: { type: [String, Number], required: true },
  }
}) 

const str = ref('')
const num = ref(1)
</script>

<template>
  <A v-model="str" />
  <B v-model="str" />

  <A v-model="num" />
  <B v-model="num" />
  
  <A v-model:foo="str" />
  <B v-model:foo="str" />

  <A v-model:foo="num" />
  <B v-model:foo="num" />

  <A v-model:bar="str" />
  <B v-model:bar="str" />

  <A v-model:bar="num" />
  <B v-model:bar="num" />
</template>
