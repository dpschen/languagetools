<script setup>
import A from './fixture-script.vue'
import B from './fixture-script-setup.vue'
import C from './fixture-script-setup-type-only.vue'

function on() {}
/** @param {string} payload */
function onStr(payload) {}
/** @param {number} [payload] */
function onNum(payload) {}
/** @param {{ foo?: string }} payload */
function onObj(payload) {}
/** @param {{ foo: string }} payload */
function onObj2(payload) {}
/** @param {{ bar: string }} payload */
function onObj3(payload) {}
</script>

<template>
  <A a="" @a="on" />
  <A a="" @a="onStr" />
  <A a="" @a="onNum" @b.once="onNum" />
  
  <B a="" @a="on" />
  <B a="" @a="onStr" />
  <B a="" @a="onNum" @b.once="onNum" />

  <C a="" @a="on" />
  <C a="" @a="onStr" />
  <C a="" @a="onNum" @b.once="onNum" />
</template>
