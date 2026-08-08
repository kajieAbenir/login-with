<template>
  <div class="forgot-wrapper">
    <div class="header-container">
      <h1>Forgot Password?</h1>
      <h5>Aww... deserve.</h5>
      <button class="toggle-theme" @click="toggleTheme" type="button">
        Toggle {{ isDark ? 'Light' : 'Dark' }} Mode
      </button>
      <router-link to="/">
        <button class="toggle-theme" type="button">Back</button>
      </router-link>
      <h4>Anyways, please choose how you'll reset your password.</h4>
    </div>

    <section class="login-grid">
      <button 
        v-for="opt in resetOptions" 
        :key="opt.id"
        type="button" 
        :class="['login-btn', opt.icon, { exclude: opt.exclude }]"
        @click="triggerResetOption(opt)"
      >
        {{ opt.name }}
      </button>
    </section>

    <div class="header-container footer">
      <h6>remake by: <a href="https://github.com/kajieAbenir" target="_blank">Brent Kyrjeh Abenir</a></h6>
    </div>

    <!-- Reset Simulation Modal -->
    <div v-if="activeModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ activeModal.name }}</h3>
        <div class="modal-body">
          <p v-if="modalState === 'loading'" class="loading-state">
            <span class="spinner"></span>
            Contacting the supernatural / network layers...
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

const store = useDatabaseStore()
const isDark = ref(false)
const activeModal = ref(null)
const modalState = ref('loading') // 'loading' | 'result'
const modalResult = ref({ outcome: 'failure', message: '' })

const resetOptions = [
  { id: 'adminApproval', name: 'Reset with Admin Approval', icon: 'icon-approval', exclude: true },
  { id: 'jnt', name: 'Reset with J&T Express', icon: 'icon-jnt', exclude: true },
  { id: 'shopeepay', name: 'Reset with ShopeePay', icon: 'icon-spp', exclude: true },
  { id: 'microwave', name: 'Reset via Microwave', icon: 'icon-microwave' },
  { id: 'gacha', name: 'Reset via Gacha (0.5% Drop Rate)', icon: 'icon-gacha' },
  { id: 'slots', name: 'Spin for a New Password', icon: 'icon-slots' },
  { id: 'roulette', name: 'Account Russian Roulette', icon: 'icon-roulette' },
  { id: 'flappybird', name: 'Flappy Reset', icon: 'icon-flappy' },
  { id: 'manifestation', name: 'Reset via Manifestation (Hold for 10 mins)', icon: 'icon-manifest' },
  { id: 'ouija', name: 'Reset with Spirit Guidance', icon: 'icon-ouija' },
  { id: 'hexcode', name: 'Reset using Hex Code', icon: 'icon-dialup' },
  { id: 'morsecode', name: 'Reset with Morse Code', icon: 'icon-morse' }
]

onMounted(() => {
  isDark.value = document.body.classList.contains('dark')
})

const toggleTheme = () => {
  document.body.classList.toggle('dark')
  isDark.value = document.body.classList.contains('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const triggerResetOption = (option) => {
  activeModal.value = option
  modalState.value = 'loading'
  
  setTimeout(() => {
    modalState.value = 'result'
    
    const user = store.currentUser
    if (!user) {
      modalResult.value = {
        outcome: 'failure',
        message: 'Account reset failed: You must have an active session to query password resets. Please register/login first.'
      }
      return
    }

    let msg = ''
    let outcome = 'failure'

    switch (option.id) {
      case 'gacha':
        const roll = Math.random() * 100
        if (roll < 0.5) {
          msg = 'CRITICAL PULL! You hit the 0.5% drop rate! Your password has been reset to "5StarGachaPw123". Make sure you remember it!'
          outcome = 'success'
          store.addLog(user.id, 'reset', option.id, 'success', 'Password reset via 5-star Gacha drop!')
        } else {
          msg = `PULL FAILURE: You pulled a 3-star Common Trash password. Drop rate was not on your side. Pity count: ${user.gacha_pity_count || 0 + 1}/180.`
          user.gacha_pity_count = (user.gacha_pity_count || 0) + 1
          store.updateUser(user)
          store.addLog(user.id, 'reset', option.id, 'failure', `Pulled trash password. Pity at ${user.gacha_pity_count}.`)
        }
        break
      case 'microwave':
        msg = 'Password heated at 800W for 30 seconds. Warm, crunchy, and reset to "crispy12345". Success!'
        outcome = 'success'
        store.addLog(user.id, 'reset', option.id, 'success', 'Password reset via microwave heating.')
        break
      case 'roulette':
        const slot = Math.floor(Math.random() * 6)
        if (slot === 0) {
          msg = 'BANG! The bullet was in the chamber. Your account has been permanently wiped from the database. Deserved. Please register again.'
          outcome = 'failure'
          store.addLog(user.id, 'reset', option.id, 'failure', 'Account deleted by Russian Roulette.')
          store.logout()
          store.users = store.users.filter(u => u.id !== user.id)
          localStorage.setItem('users', JSON.stringify(store.users))
        } else {
          msg = '*Click*. Chamber was empty. Safe! Your password has been successfully reset to "rouletteWinner777".'
          outcome = 'success'
          store.addLog(user.id, 'reset', option.id, 'success', 'Survived Russian Roulette reset.')
        }
        break
      default:
        msg = `Reset challenge for "${option.name}" triggered: Fictional reset endpoint failed. Challenge implementation pending in Phase 4.`
        outcome = 'failure'
        store.addLog(user.id, 'reset', option.id, 'failure', 'Generic mock reset attempt.')
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
@import "../assets/css/forgot-pass.css";
@import "../assets/css/forgot-pass-map.css";
</style>

<style scoped>
.forgot-wrapper {
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

.header-container h5 {
  margin: 0;
  color: #e41e3f;
  font-size: 16px;
}

body.dark .header-container h5 {
  color: #ff526d;
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
