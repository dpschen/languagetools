<script setup>
import { ref } from 'vue'

const a = ref(false)
let b = 5
/** @type {{ foo: string} | undefined} */
let c
</script>

<template>
  <div v-text="a" />
  <div v-text="b" />
  <div v-text="c" />
  <div v-text="c?.foo" />
</template>
