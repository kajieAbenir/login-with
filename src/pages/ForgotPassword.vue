<template>
  <div class="forgot-wrapper">
    <div class="header-container">
      <h1>Forgot Password?</h1>
      <h5>Aww... deserve.</h5>
      <div class="header-actions">
        <button class="toggle-theme" @click="toggleTheme" type="button">
          Toggle {{ isDark ? 'Light' : 'Dark' }} Mode
        </button>
        <router-link to="/">
          <button class="toggle-theme" type="button">Back</button>
        </router-link>
      </div>
    </div>

    <!-- Step 1: Email Verification Step (Enter desired email first) -->
    <div v-if="!verifiedUser" class="verify-email-box">
      <h3>Step 1: Enter your account email</h3>
      <p class="verify-desc">We need to check if your account exists in our totally secure database before subjecting you to password recovery.</p>

      <form @submit.prevent="verifyEmail" class="verify-form">
        <div class="input-row">
          <input 
            v-model="inputEmail" 
            type="email" 
            placeholder="e.g. juan.iron4@valorant.ph" 
            required 
          />
          <button type="submit" class="verify-btn">Verify Email ➔</button>
        </div>
      </form>

      <p v-if="verifyError" class="error-banner">{{ verifyError }}</p>

      <!-- Quick Dummy Email Suggestions -->
      <div class="dummy-suggestions">
        <span>Or click a dummy account email:</span>
        <div class="email-chips">
          <button 
            v-for="dummy in dummyUsers" 
            :key="dummy.id" 
            type="button" 
            class="chip-btn"
            @click="selectDummyEmail(dummy.email)"
          >
            {{ dummy.email }}
          </button>
        </div>
      </div>
    </div>

    <!-- Step 2: Showcase of 12 Reset Options once Email is verified -->
    <div v-else class="reset-section">
      <div class="target-user-card">
        <div class="target-info">
          <span class="target-tag">Target Account Verified ✅</span>
          <h3>{{ verifiedUser.first_name }} {{ verifiedUser.last_name }}</h3>
          <span class="target-email">{{ verifiedUser.email }}</span>
        </div>
        <div class="target-meta">
          <span>Current Password: <code>{{ verifiedUser.password }}</code></span>
          <span>Pity Count: <b>{{ verifiedUser.gacha_pity_count || 0 }}/180</b></span>
          <button class="change-btn" @click="clearVerifiedUser">Change Target Email</button>
        </div>
      </div>

      <div class="instructions-banner">
        <h4>Please choose how you'll reset your password:</h4>
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
    </div>

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
            Contacting the supernatural / network layers for <b>{{ verifiedUser?.email }}</b>...
          </p>
          <div v-else-if="modalState === 'result'" class="result-state">
            <div :class="['result-icon', modalResult.outcome]"></div>
            <p class="result-text">{{ modalResult.message }}</p>
            <div class="modal-actions">
              <button class="close-modal-btn" @click="closeModal">Close</button>
              <router-link v-if="modalResult.outcome === 'success'" to="/">
                <button class="login-redirect-btn">Go to Login ➔</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDatabaseStore, DUMMY_USERS } from '../store/database'

const store = useDatabaseStore()
const isDark = ref(false)
const inputEmail = ref('')
const verifyError = ref('')
const verifiedUser = ref(null)

const activeModal = ref(null)
const modalState = ref('loading') // 'loading' | 'result'
const modalResult = ref({ outcome: 'failure', message: '' })

const dummyUsers = computed(() => DUMMY_USERS)

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
  
  // If user already logged in or active in store, prefill and verify
  if (store.currentUser) {
    verifiedUser.value = store.currentUser
    inputEmail.value = store.currentUser.email
  } else {
    // Default to first dummy user
    inputEmail.value = DUMMY_USERS[0].email
  }
})

const toggleTheme = () => {
  document.body.classList.toggle('dark')
  isDark.value = document.body.classList.contains('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const selectDummyEmail = (email) => {
  inputEmail.value = email
  verifyError.value = ''
  verifyEmail()
}

const verifyEmail = () => {
  verifyError.value = ''
  const found = store.findUserByEmail(inputEmail.value)
  if (!found) {
    verifyError.value = `❌ Email "${inputEmail.value}" was not found in our records. Did you forget your email address too?`
    verifiedUser.value = null
    return
  }

  verifiedUser.value = found
}

const clearVerifiedUser = () => {
  verifiedUser.value = null
  verifyError.value = ''
}

const triggerResetOption = (option) => {
  if (!verifiedUser.value) {
    verifyError.value = 'Please verify your email address first.'
    return
  }

  activeModal.value = option
  modalState.value = 'loading'
  
  setTimeout(() => {
    modalState.value = 'result'
    const targetUser = verifiedUser.value
    let msg = ''
    let outcome = 'failure'

    switch (option.id) {
      case 'gacha':
        const roll = Math.random() * 100
        const isPity = (targetUser.gacha_pity_count || 0) >= 179
        if (roll < 0.5 || isPity) {
          const newPw = '5StarGachaPw_' + Math.floor(1000 + Math.random() * 9000)
          targetUser.password = newPw
          targetUser.gacha_pity_count = 0
          store.updateUser(targetUser)
          msg = `🌟 CRITICAL 5-STAR PULL! You hit the reset banner! Password updated to "${newPw}". Remember it this time!`
          outcome = 'success'
          store.addLog(targetUser.id, 'reset', option.id, 'success', `Gacha reset pull success. New password: ${newPw}`)
        } else {
          targetUser.gacha_pity_count = (targetUser.gacha_pity_count || 0) + 1
          store.updateUser(targetUser)
          msg = `💀 3-STAR TRASH PULL: You pulled "Common Rusty Key (Invalid)". Reset failed. Pity counter increased to ${targetUser.gacha_pity_count}/180.`
          outcome = 'failure'
          store.addLog(targetUser.id, 'reset', option.id, 'failure', `Gacha trash pull. Pity: ${targetUser.gacha_pity_count}`)
        }
        break

      case 'microwave':
        const microPw = 'warmCrispy_' + Math.floor(100 + Math.random() * 900)
        targetUser.password = microPw
        store.updateUser(targetUser)
        msg = `🔥 Beep... Beep... Beep! Password heated at 800W for 30s. Crispiness level: Maximum. Password reset to "${microPw}".`
        outcome = 'success'
        store.addLog(targetUser.id, 'reset', option.id, 'success', `Microwave heated reset to ${microPw}`)
        break

      case 'roulette':
        const chamber = Math.floor(Math.random() * 6)
        if (chamber === 0) {
          msg = `💥 BANG! The chamber was loaded. Your account (${targetUser.email}) has been permanently wiped from existence. Deserved.`
          outcome = 'failure'
          store.addLog(targetUser.id, 'reset', option.id, 'failure', 'Account wiped by Russian Roulette.')
          store.users = store.users.filter(u => u.id !== targetUser.id)
          localStorage.setItem('users', JSON.stringify(store.users))
          if (store.currentUser?.id === targetUser.id) {
            store.logout()
          }
          verifiedUser.value = null
        } else {
          const safePw = 'luckySurvivor777'
          targetUser.password = safePw
          store.updateUser(targetUser)
          msg = `*Click*... Chamber was empty! You survived! Password reset to "${safePw}".`
          outcome = 'success'
          store.addLog(targetUser.id, 'reset', option.id, 'success', 'Survived Russian Roulette reset.')
        }
        break

      case 'adminApproval':
        msg = `📋 Queue Ticket #1,492,041 issued for ${targetUser.first_name}. Estimated wait time: 4 to 6 business weeks. Bribing the admin with iced coffee reduces wait time by 0%.`
        outcome = 'failure'
        store.addLog(targetUser.id, 'reset', option.id, 'pending', 'Admin approval reset pending in queue.')
        break

      case 'jnt':
        msg = `📦 J&T Express: Your replacement password has been packed into a bubble-wrap parcel. Rider marked it as "Delivered" but tossed it over your neighbor's roof.`
        outcome = 'failure'
        store.addLog(targetUser.id, 'reset', option.id, 'failure', 'J&T lost the password parcel.')
        break

      case 'shopeepay':
        msg = `🛒 ShopeePay: Insufficient ShopeeCoins balance. Please check in daily for 365 consecutive days to earn 1 password reset token.`
        outcome = 'failure'
        store.addLog(targetUser.id, 'reset', option.id, 'failure', 'ShopeeCoins insufficient.')
        break

      case 'slots':
        const r1 = Math.floor(Math.random() * 3)
        const r2 = Math.floor(Math.random() * 3)
        const r3 = Math.floor(Math.random() * 3)
        const icons = ['🍒', '🔔', '7️⃣']
        const spin = `${icons[r1]} | ${icons[r2]} | ${icons[r3]}`
        if (r1 === r2 && r2 === r3) {
          const slotPw = 'jackpotJackpot777'
          targetUser.password = slotPw
          store.updateUser(targetUser)
          msg = `🎰 JACKPOT! [${spin}] All three matched! Password reset to "${slotPw}".`
          outcome = 'success'
          store.addLog(targetUser.id, 'reset', option.id, 'success', `Slots Jackpot reset: ${slotPw}`)
        } else {
          msg = `🎰 [${spin}] No match! Better luck next spin. Casino always wins.`
          outcome = 'failure'
          store.addLog(targetUser.id, 'reset', option.id, 'failure', `Slots failed spin: ${spin}`)
        }
        break

      case 'flappybird':
        msg = `🐦 Flappy Reset: You hit a pipe on pipe #2. Score required to reset: 100. Try again!`
        outcome = 'failure'
        store.addLog(targetUser.id, 'reset', option.id, 'failure', 'Flappy Bird pipe crash.')
        break

      case 'manifestation':
        msg = `🧘 Manifestation failed: You blinked after 4 seconds. You must stare at the button without un-clicking for 10 straight minutes.`
        outcome = 'failure'
        store.addLog(targetUser.id, 'reset', option.id, 'failure', 'Manifestation interrupted.')
        break

      case 'ouija':
        msg = `👻 Spirit Guidance: The planchette moved to "N - O". The spirits are currently away on break.`
        outcome = 'failure'
        store.addLog(targetUser.id, 'reset', option.id, 'failure', 'Spirits said no.')
        break

      case 'hexcode':
        msg = `📟 Hex string decoded: 0x44 0x45 0x53 0x45 0x52 0x56 0x45 -> "DESERVE". Access denied.`
        outcome = 'failure'
        store.addLog(targetUser.id, 'reset', option.id, 'failure', 'Hex code translated to DESERVE.')
        break

      case 'morsecode':
        msg = `📻 Morse Code: ... --- ... (SOS). Signals lost in ionosphere. Login denied.`
        outcome = 'failure'
        store.addLog(targetUser.id, 'reset', option.id, 'failure', 'Morse code dropped.')
        break

      default:
        msg = `Reset attempt via ${option.name} recorded. Fictional reset service timed out.`
        outcome = 'failure'
        store.addLog(targetUser.id, 'reset', option.id, 'failure', `${option.name} timed out.`)
        break
    }

    modalResult.value = { outcome, message: msg }
  }, 1000)
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
  width: 100%;
  padding: 2rem 1rem;
  transition: background 0.3s;
  box-sizing: border-box;
}

.header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 10px;
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

/* Step 1: Verify Email Box */
.verify-email-box {
  max-width: 600px;
  margin: 20px auto 40px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: background 0.3s;
}

body.dark .verify-email-box {
  background: #242526;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.verify-email-box h3 {
  margin-top: 0;
  color: #1c1e21;
}

body.dark .verify-email-box h3 {
  color: #e4e6eb;
}

.verify-desc {
  font-size: 14px;
  color: #65676b;
  margin-bottom: 20px;
}

body.dark .verify-desc {
  color: #b0b3b8;
}

.verify-form {
  margin-bottom: 16px;
}

.input-row {
  display: flex;
  gap: 10px;
}

.input-row input {
  flex: 1;
  padding: 12px;
  border: 1px solid #dddfe2;
  border-radius: 6px;
  font-size: 15px;
  background: #ffffff;
  color: #1c1e21;
}

body.dark .input-row input {
  background: #3a3b3c;
  border-color: #4e4f50;
  color: #e4e6eb;
}

.verify-btn {
  background: #1877f2;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
}

.verify-btn:hover {
  background: #166fe5;
}

.error-banner {
  background: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  margin: 12px 0;
}

body.dark .error-banner {
  background: rgba(198, 40, 40, 0.2);
  color: #ef5350;
}

.dummy-suggestions {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 16px;
  text-align: left;
}

body.dark .dummy-suggestions {
  border-color: #3e4042;
}

.dummy-suggestions span {
  font-size: 12px;
  color: #888;
  display: block;
  margin-bottom: 8px;
}

.email-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip-btn {
  background: #f0f2f5;
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
  color: #1c1e21;
  transition: all 0.2s;
}

body.dark .chip-btn {
  background: #3a3b3c;
  border-color: #4e4f50;
  color: #e4e6eb;
}

.chip-btn:hover {
  border-color: #1877f2;
  color: #1877f2;
}

/* Step 2: Target User Card */
.target-user-card {
  max-width: 1000px;
  margin: 0 auto 24px;
  background: #e7f3ff;
  border: 1px solid #1877f2;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

body.dark .target-user-card {
  background: rgba(69, 153, 255, 0.12);
  border-color: #4599ff;
}

.target-tag {
  font-size: 11px;
  font-weight: bold;
  color: #1877f2;
  display: block;
}

body.dark .target-tag {
  color: #4599ff;
}

.target-info h3 {
  margin: 2px 0;
  color: #1c1e21;
}

body.dark .target-info h3 {
  color: #e4e6eb;
}

.target-email {
  font-size: 13px;
  color: #666;
}

body.dark .target-email {
  color: #b0b3b8;
}

.target-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
}

.target-meta code {
  background: rgba(0,0,0,0.06);
  padding: 2px 6px;
  border-radius: 4px;
}

body.dark .target-meta code {
  background: rgba(255,255,255,0.1);
}

.change-btn {
  background: transparent;
  border: 1px solid #1877f2;
  color: #1877f2;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

body.dark .change-btn {
  border-color: #4599ff;
  color: #4599ff;
}

.instructions-banner {
  text-align: center;
  margin-bottom: 20px;
}

.instructions-banner h4 {
  margin: 0;
  color: #555;
}

body.dark .instructions-banner h4 {
  color: #b0b3b8;
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
  max-width: 440px;
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

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.close-modal-btn {
  background: #e4e6eb;
  color: #1c1e21;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

body.dark .close-modal-btn {
  background: #3a3b3c;
  color: #e4e6eb;
}

.login-redirect-btn {
  background: #1877f2;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

body.dark .login-redirect-btn {
  background: #4599ff;
  color: #18191a;
}
</style>
