<template>
  <div class="login-wrapper">
    <div class="header-nav">
      <button class="toggle-theme" @click="toggleTheme" type="button">
        Toggle {{ isDark ? 'Light' : 'Dark' }} Mode
      </button>
    </div>

    <div class="login-container">
      <div class="logo">welcome back.</div>

      <form @submit.prevent="handleLogin">
        <input 
          v-model="email" 
          type="email" 
          placeholder="Email or phone number" 
          required 
        />
        <input 
          v-model="password" 
          type="password" 
          placeholder="Password" 
          required 
        />

        <button class="login-btn" type="submit">Log In</button>
      </form>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <router-link to="/login-options" class="forgot">Sign In Options</router-link>
      <router-link to="/forgot-password" class="forgot">Forgotten password?</router-link>

      <div class="divider"></div>
      <router-link to="/signup">
        <button type="button" class="create-btn">Create new account</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '../store/database'

const router = useRouter()
const store = useDatabaseStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isDark = ref(false)

onMounted(() => {
  isDark.value = document.body.classList.contains('dark')
  
  // If user is already logged in, go to dashboard
  if (store.currentUser) {
    router.push('/dashboard')
  }
})

const toggleTheme = () => {
  document.body.classList.toggle('dark')
  isDark.value = document.body.classList.contains('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const handleLogin = () => {
  error.value = ''
  try {
    store.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  width: 100vw;
  transition: background 0.3s;
}

body.dark .login-wrapper {
  background: #18191a;
}

.header-nav {
  position: absolute;
  top: 20px;
  right: 20px;
}

.toggle-theme {
  background: #ffffff;
  border: 1px solid #dddfe2;
  color: #1c1e21;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

body.dark .toggle-theme {
  background: #242526;
  border-color: #3e4042;
  color: #e4e6eb;
}

.toggle-theme:hover {
  background: #f2f3f5;
}

body.dark .toggle-theme:hover {
  background: #3a3b3c;
}

.login-container {
  background: #ffffff;
  width: 360px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: background 0.3s, box-shadow 0.3s;
}

body.dark .login-container {
  background: #242526;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.logo {
  color: #1877f2;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
}

body.dark .logo {
  color: #4599ff;
}

.login-container input {
  width: 100%;
  padding: 14px;
  margin: 8px 0;
  border-radius: 6px;
  border: 1px solid #dddfe2;
  font-size: 15px;
  background: #ffffff;
  color: #1c1e21;
  transition: all 0.3s;
}

body.dark .login-container input {
  background: #3a3b3c;
  border-color: #4e4f50;
  color: #e4e6eb;
}

.login-container input:focus {
  outline: none;
  border-color: #1877f2;
}

body.dark .login-container input:focus {
  border-color: #4599ff;
}

.login-btn {
  width: 100%;
  background: #1877f2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}

.login-btn:hover {
  background: #166fe5;
}

.error-msg {
  color: #e41e3f;
  font-size: 14px;
  margin: 10px 0 0 0;
  font-weight: 500;
}

.forgot {
  display: block;
  margin-top: 16px;
  font-size: 14px;
  color: #1877f2;
  text-decoration: none;
}

body.dark .forgot {
  color: #4599ff;
}

.forgot:hover {
  text-decoration: underline;
}

.divider {
  margin: 20px 0;
  height: 1px;
  background: #dadde1;
}

body.dark .divider {
  background: #3e4042;
}

.create-btn {
  background: #42b72a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.create-btn:hover {
  background: #36a420;
}
</style>
