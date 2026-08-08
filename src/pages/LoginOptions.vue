<template>
  <div class="options-wrapper">
    <div class="header-container">
      <h1>Login Options</h1>
      <button class="toggle-theme" @click="toggleTheme" type="button">
        Toggle {{ isDark ? 'Light' : 'Dark' }} Mode
      </button>
      <router-link to="/">
        <button class="toggle-theme" type="button">Back</button>
      </router-link>
    </div>
    
    <section class="login-grid">
      <button 
        v-for="opt in loginOptions" 
        :key="opt.id"
        type="button" 
        :class="['login-btn', opt.icon, { exclude: opt.exclude }]"
        @click="triggerLoginOption(opt)"
      >
        {{ opt.name }}
        <span v-if="opt.badge" style="color: red;"><b> {{ opt.badge }}</b></span>
      </button>
    </section>

    <div class="header-container footer">
      <h6>remake by: <a href="https://github.com/kajieAbenir" target="_blank">Brent Kyrjeh Abenir</a></h6>
    </div>

    <!-- Simulation Modal -->
    <div v-if="activeModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ activeModal.name }}</h3>
        <div class="modal-body">
          <p v-if="modalState === 'loading'" class="loading-state">
            <span class="spinner"></span>
            Connecting to secure servers...
          </p>
          <div v-else-if="modalState === 'result'" class="result-state">
            <div :class="['result-icon', modalResult.outcome]"></div>
            <p class="result-text">{{ modalResult.message }}</p>
            <button class="close-modal-btn" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDatabaseStore } from '../store/database'
import { useRouter } from 'vue-router'

const store = useDatabaseStore()
const router = useRouter()
const isDark = ref(false)
const activeModal = ref(null)
const modalState = ref('loading') // 'loading' | 'result'
const modalResult = ref({ outcome: 'failure', message: '' })

const loginOptions = [
  { id: 'google', name: 'Login with Google', icon: 'icon-google' },
  { id: 'facebook', name: 'Login with Facebook', icon: 'icon-facebook' },
  { id: 'github', name: 'Login with GitHub', icon: 'icon-github' },
  { id: 'linkedin', name: 'Login with LinkedIn', icon: 'icon-linkedin' },
  { id: 'x', name: 'Login with X', icon: 'icon-x' },
  { id: 'riotgames', name: 'Login with Riot Games', icon: 'icon-riotgames' },
  { id: 'cosmarket', name: 'Login via Cos Market PH', icon: 'icon-cosmarket' },
  { id: 'groomer', name: 'Login with a Groomer', icon: 'icon-groomer', exclude: true },
  { id: 'spotify', name: 'Login with Spotify', icon: 'icon-spotify' },
  { id: 'applemusic', name: 'Login with Apple Music', icon: 'icon-applemusic' },
  { id: 'paypal', name: 'Login with PayPal', icon: 'icon-paypal' },
  { id: 'visa', name: 'Login with Card Details', icon: 'icon-visa', exclude: true },
  { id: 'jollibee', name: 'Login with Jollibee', icon: 'icon-jollibee', exclude: true },
  { id: 'mcdonalds', name: 'Login with McDonald\'s', icon: 'icon-mcdonalds' },
  { id: 'kfc', name: 'Login with KFC', icon: 'icon-kfc' },
  { id: 'starbucks', name: 'Login with Starbucks', icon: 'icon-starbucks' },
  { id: 'pandesal', name: 'Login with Malunggay Pandesal', icon: 'icon-pandesal', exclude: true },
  { id: 'settings', name: 'Login with Settings', icon: 'icon-settings' },
  { id: 'id', name: 'Login with ID Verification', icon: 'icon-id', exclude: true },
  { id: 'age', name: 'Login with Age Input', icon: 'icon-age', exclude: true },
  { id: 'pdf', name: 'Login with PDF', icon: 'icon-pdf', exclude: true },
  { id: 'fingerprint', name: 'Login with Fingerprint', icon: 'icon-fingerprint' },
  { id: 'onlyfans', name: 'Login with OnlyFans', icon: 'icon-onlyfans' },
  { id: 'phub', name: 'Login with PornHub', icon: 'icon-phub', exclude: true },
  { id: 'winrar', name: 'Login with your WinRAR Trial', icon: 'icon-winrar', exclude: true },
  { id: 'ikea', name: 'Login with IKEA (Needs Assembly)', icon: 'icon-ikea' },
  { id: 'internetexplorer', name: 'Login with Internet Explorer', icon: 'icon-internetexplorer' },
  { id: 'pldt', name: 'Login with PLDT', icon: 'icon-pldt', exclude: true },
  { id: 'globe', name: 'Login with Globe', icon: 'icon-globe', exclude: true },
  { id: 'duolingo', name: 'Login with Duolingo', icon: 'icon-duolingo', badge: '(Or Else)' },
  { id: 'barangay', name: 'Login with Barangay Clearance', icon: 'icon-barangay' },
  { id: 'tor', name: 'Login with Transcript of Records', icon: 'icon-tor' },
  { id: 'nso', name: 'Login with NSO Birth Certificate', icon: 'icon-nso', exclude: true },
  { id: 'utang', name: 'Login with Utang na Loob', icon: 'icon-utang' },
  { id: 'load', name: 'Login with Load Balance', icon: 'icon-load' },
  { id: 'pisowifi', name: 'Login with Piso WiFi', icon: 'icon-pisowifi' },
  { id: 'seen', name: 'Login with Seen Zone', icon: 'icon-seen' },
  { id: 'approval', name: 'Login with Admin Approval', icon: 'icon-approval', exclude: true },
  { id: 'jnt', name: 'Login with J&T', icon: 'icon-jnt', exclude: true },
  { id: 'spx', name: 'Login with Shopee Express', icon: 'icon-spx', exclude: true },
  { id: 'ligtas', name: 'Login with Ligtas Points', icon: 'icon-ligtas' },
  { id: 'psychology', name: 'Login with Psychology Major', icon: 'icon-psychology' },
  { id: 'jackie', name: 'Login with Jackie Chan', icon: 'icon-jackie' },
  { id: 'microwave', name: 'Login via Microwave', icon: 'icon-microwave' }
]

onMounted(() => {
  isDark.value = document.body.classList.contains('dark')
})

const toggleTheme = () => {
  document.body.classList.toggle('dark')
  isDark.value = document.body.classList.contains('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const triggerLoginOption = (option) => {
  activeModal.value = option
  modalState.value = 'loading'
  
  // Simulate network delay
  setTimeout(() => {
    modalState.value = 'result'
    
    // Check if user is logged in
    const user = store.currentUser
    if (!user) {
      modalResult.value = {
        outcome: 'failure',
        message: `Authentication failed: You must register or log in normally first before attempting ${option.name}.`
      }
      return
    }

    // Parody outcome mapping
    let msg = ''
    let outcome = 'failure'

    switch (option.id) {
      case 'winrar':
        msg = 'Your WinRAR 40-day evaluation trial has expired, but because nobody actually buys WinRAR, we let you in anyway! Success!'
        outcome = 'success'
        store.addLog(user.id, 'login', option.id, 'success', 'Bypassed trial screen. WinRAR is free.')
        break
      case 'internetexplorer':
        msg = 'Timeout Error: Internet Explorer took too long to load. Dial-up carrier dropped connection.'
        outcome = 'failure'
        store.addLog(user.id, 'login', option.id, 'failure', 'Gateway timeout.')
        break
      case 'utang':
        msg = 'Login Blocked: You have unpaid moral obligations (Utang na Loob) to your family. Go call your mother.'
        outcome = 'failure'
        store.addLog(user.id, 'login', option.id, 'failure', 'Moral debt unpaid.')
        break
      case 'duolingo':
        msg = 'Duolingo: You missed your Spanish lessons. Access is locked. (The owl is watching your house).'
        outcome = 'failure'
        store.addLog(user.id, 'login', option.id, 'failure', 'Spanish lesson skipped.')
        break
      case 'microwave':
        msg = 'Beep... Beep... Beep... Login session baked successfully! Welcome back.'
        outcome = 'success'
        store.addLog(user.id, 'login', option.id, 'success', 'Session baked.')
        break
      default:
        // Generic failure placeholder for Phase 1
        msg = `${option.name} failed: Fictional OAuth service returned error code 418 (I'm a teapot).`
        outcome = 'failure'
        store.addLog(user.id, 'login', option.id, 'failure', 'Generic parody error.')
        break
    }

    modalResult.value = { outcome, message: msg }
  }, 1200)
}

const closeModal = () => {
  activeModal.value = null
}
</script>

<style>
@import "../assets/css/login-options.css";
@import "../assets/css/login-options-map.css";
</style>

<style scoped>
.options-wrapper {
  min-height: 100vh;
  padding: 2rem;
  transition: background 0.3s;
}

.header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 2rem;
}

.header-container h1 {
  margin: 0;
}

.header-container.footer {
  margin-top: 3rem;
  margin-bottom: 0;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  color: #111;
}

body.dark .modal-content {
  background: #242526;
  color: #f1f1f1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.modal-body {
  margin-top: 1.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  font-weight: 500;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #1877f2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

body.dark .spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-left-color: #4599ff;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.result-icon {
  width: 50px;
  height: 50px;
  background-size: contain;
  background-repeat: no-repeat;
}

.result-icon.success {
  background-image: url("https://uxwing.com/wp-content/themes/uxwing/download/correct-and-true/green-checkmark-line-icon.png");
}

.result-icon.failure {
  background-image: url("https://uxwing.com/wp-content/themes/uxwing/download/correct-and-true/red-cross-line-icon.png");
}

.result-text {
  font-size: 15px;
  line-height: 1.5;
  color: #444;
}

body.dark .result-text {
  color: #b0b3b8;
}

.close-modal-btn {
  background: #1877f2;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

body.dark .close-modal-btn {
  background: #4599ff;
  color: #18191a;
}
</style>
