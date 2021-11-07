<script setup>
import { ref } from 'vue'

const a = ref(false)
let b  = 5
/** @type {{ foo: string} | undefined} */
let c
</script>

<template>
  <div v-show="a" />
  <div v-show="b" />
  <div v-show="c" />
  <div v-show="c != null" />
</template>
