<script setup>
import { ref } from 'vue'

const a = ref(false)
let b  = 5
/** @type {{ foo: string} | undefined} */
let c
</script>

<template>
  <div v-once="a" />
  <div v-once="b" />
  <div v-once="c" />
  <div v-once="c?.foo" />
</template>
