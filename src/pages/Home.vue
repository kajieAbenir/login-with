<template>
  <div class="login-wrapper">
    <div class="header-nav">
      <button class="toggle-theme" @click="toggleTheme" type="button">
        Toggle {{ isDark ? 'Light' : 'Dark' }} Mode
      </button>
    </div>

    <!-- Active Persona Notice if Logged In -->
    <div v-if="store.currentUser" class="active-banner">
      <span>Logged in as: <b>{{ store.currentUser.first_name }} {{ store.currentUser.last_name }}</b></span>
      <div class="banner-actions">
        <router-link to="/dashboard" class="banner-link">Dashboard</router-link>
        <button class="banner-btn" @click="store.logout">Logout</button>
      </div>
    </div>

    <!-- Centered Mini Login Box -->
    <div class="login-container">
      <div class="logo">welcome back.</div>
      <p class="subtitle">The gold standard of questionable authentication.</p>

      <form @submit.prevent="handleLogin">
        <!-- Email Dropdown Selector -->
        <div class="input-wrap">
          <label for="emailSelect" class="input-label">Select Account / Email:</label>
          <select 
            id="emailSelect" 
            v-model="email" 
            class="account-select"
            @change="onEmailSelect"
            required
          >
            <option disabled value="">-- Choose a dummy account --</option>
            <option 
              v-for="user in userList" 
              :key="user.id" 
              :value="user.email"
            >
              {{ user.email }} ({{ user.first_name }} {{ user.last_name }})
            </option>
          </select>
        </div>

        <!-- Selected Persona Hint -->
        <div v-if="selectedPersona" class="persona-preview">
          <div class="persona-chip">
            <span>{{ getAvatar(selectedPersona) }} <b>{{ selectedPersona.first_name }} {{ selectedPersona.last_name }}</b></span>
            <span class="karma-tag" :class="{ negative: selectedPersona.ligtas_points < 0 }">
              ✨ {{ selectedPersona.ligtas_points }} Karma
            </span>
          </div>
          <p class="persona-quote">"{{ selectedPersona.signup_reason }}"</p>
        </div>

        <!-- Password Field (Auto-filled or editable) -->
        <div class="input-wrap">
          <label for="passwordInput" class="input-label">Password:</label>
          <input 
            id="passwordInput"
            v-model="password" 
            type="password" 
            placeholder="Password" 
            required 
          />
        </div>

        <button class="login-btn" type="submit" :disabled="isLoggingIn">
          {{ isLoggingIn ? 'Authenticating with maximum security...' : 'Log In' }}
        </button>
      </form>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <router-link to="/login-options" class="forgot">⚡ Sign In Options (32 Parody Logins)</router-link>
      <router-link to="/forgot-password" class="forgot">💀 Forgotten password? (Deserve)</router-link>

      <div class="divider"></div>
      <router-link to="/signup">
        <button type="button" class="create-btn">Create new account</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '../store/database'

const router = useRouter()
const store = useDatabaseStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isDark = ref(false)
const isLoggingIn = ref(false)

const userList = computed(() => store.users)

const selectedPersona = computed(() => {
  return store.findUserByEmail(email.value)
})

onMounted(() => {
  isDark.value = document.body.classList.contains('dark')
  
  if (store.currentUser) {
    email.value = store.currentUser.email
    password.value = store.currentUser.password
  } else if (store.users.length > 0) {
    // Default preselect first dummy user
    email.value = store.users[0].email
    password.value = store.users[0].password
  }
})

const toggleTheme = () => {
  document.body.classList.toggle('dark')
  isDark.value = document.body.classList.contains('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const onEmailSelect = () => {
  error.value = ''
  const found = store.findUserByEmail(email.value)
  if (found) {
    password.value = found.password
  }
}

const getAvatar = (dummy) => {
  const avatars = {
    usr_dummy_1: '🎮',
    usr_dummy_2: '📢',
    usr_dummy_3: '🍵',
    usr_dummy_4: '📻',
    usr_dummy_5: '⭐',
    usr_dummy_6: '📦',
    usr_dummy_7: '📶',
    usr_dummy_8: '🦉',
    usr_dummy_9: '🫡',
    usr_dummy_10: '💸'
  }
  return avatars[dummy.id] || '👤'
}

const handleLogin = async () => {
  error.value = ''
  try {
    store.login(email.value, password.value)
    isLoggingIn.value = true
    await new Promise(r => setTimeout(r, 600))
    router.push('/trolled')
  } catch (err) {
    error.value = err.message
  } finally {
    isLoggingIn.value = false
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
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
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

/* Active Banner */
.active-banner {
  max-width: 400px;
  width: 100%;
  background: #e7f3ff;
  border: 1px solid #1877f2;
  color: #1877f2;
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 13px;
  box-sizing: border-box;
}

body.dark .active-banner {
  background: rgba(69, 153, 255, 0.15);
  border-color: #4599ff;
  color: #4599ff;
}

.banner-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.banner-link {
  font-weight: bold;
  text-decoration: underline;
  color: inherit;
}

.banner-btn {
  background: #1877f2;
  color: white;
  border: none;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

/* Centered Mini Login Container */
.login-container {
  background: #ffffff;
  width: 100%;
  max-width: 400px;
  padding: 28px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  text-align: center;
  box-sizing: border-box;
  transition: background 0.3s, box-shadow 0.3s;
}

body.dark .login-container {
  background: #242526;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
}

.logo {
  color: #1877f2;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 4px;
}

body.dark .logo {
  color: #4599ff;
}

.subtitle {
  font-size: 13px;
  color: #65676b;
  margin: 0 0 20px;
}

body.dark .subtitle {
  color: #b0b3b8;
}

.input-wrap {
  margin-bottom: 12px;
  text-align: left;
}

.input-label {
  display: block;
  font-size: 12px;
  font-weight: bold;
  color: #555;
  margin-bottom: 4px;
}

body.dark .input-label {
  color: #b0b3b8;
}

.account-select, .login-container input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid #dddfe2;
  font-size: 14px;
  background: #ffffff;
  color: #1c1e21;
  box-sizing: border-box;
  transition: all 0.2s;
  cursor: pointer;
}

body.dark .account-select, body.dark .login-container input {
  background: #3a3b3c;
  border-color: #4e4f50;
  color: #e4e6eb;
}

.account-select:focus, .login-container input:focus {
  outline: none;
  border-color: #1877f2;
}

body.dark .account-select:focus, body.dark .login-container input:focus {
  border-color: #4599ff;
}

/* Persona Preview Badge */
.persona-preview {
  background: #f8f9fa;
  border: 1px dashed #ced4da;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 12px;
  text-align: left;
}

body.dark .persona-preview {
  background: #18191a;
  border-color: #3e4042;
}

.persona-chip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #1c1e21;
}

body.dark .persona-chip {
  color: #e4e6eb;
}

.karma-tag {
  font-size: 10px;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.karma-tag.negative {
  background: #ffebee;
  color: #c62828;
}

.persona-quote {
  margin: 4px 0 0;
  font-size: 11px;
  font-style: italic;
  color: #666;
}

body.dark .persona-quote {
  color: #b0b3b8;
}

.login-btn {
  width: 100%;
  background: #1877f2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.2s;
}

.login-btn:hover {
  background: #166fe5;
}

.error-msg {
  color: #e41e3f;
  font-size: 13px;
  margin: 10px 0 0 0;
  font-weight: 500;
}

.forgot {
  display: block;
  margin-top: 14px;
  font-size: 13px;
  color: #1877f2;
  text-decoration: none;
  font-weight: 500;
}

body.dark .forgot {
  color: #4599ff;
}

.forgot:hover {
  text-decoration: underline;
}

.divider {
  margin: 18px 0;
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
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.create-btn:hover {
  background: #36a420;
}
</style>
