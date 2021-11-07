<script setup>
function on() {}
/** @param {Event} event */
function onEvent(event) {}
/** @param {MouseEvent} event */
function onMouse(event) {}
/** @param {PointerEvent} event */
function onPointer(event) {}
/** @param {KeyboardEvent} event */
function onKeyboard(event) {}
</script>

<template>
  <button @click="on" />
  <button @click="onEvent" />
  <button @click="onMouse" />
  <button @click="onPointer" />
  <button @click="onKeyboard" />

  <button @click="onMouse($event)" />
  <button @click="onKeyboard($event)" />
  
  <button @pointerenter="onPointer" />
  <button @keypress="onKeyboard" />
  
  <button @click="onMouse" />
  <button @click.left="onMouse" />
  <button @click.right="onMouse" />
  <button @click.prevent.middle="onMouse" />
  <button @click.enter="onMouse" />

  <button 
      @click="onMouse" 
      @click.left="onEvent" 
      @click.up="onEvent" 
      @click.shift.left.exact="onEvent" 
      @keypress.enter="onKeyboard" 
      @keypress.middle="onKeyboard" 
      @keypress.shift.left.exact="onKeyboard" 
      @keypress.shift.right.exact="onKeyboard" 
  />

</template>
