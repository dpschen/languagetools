<script setup>
import { ref } from 'vue'

const a = ref(false)
let b  = 5
/** @type {{ foo: string} | undefined} */
let c
</script>

<template>
  <div v-pre="a" />
  <div v-pre="b" />
  <div v-pre="c" />
  <div v-pre="c?.foo" />
</template>
