<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  if (savedTheme === 'dark') {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
})
</script>

<style>
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
  transition: background-color 0.3s, color 0.3s;
  overflow-x: hidden;
}
</style>
