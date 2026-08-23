<template>
  <div class="signup-wrapper">
    <div class="header">
      login with...?
      <button class="toggle-theme" @click="toggleTheme" type="button">
        Toggle {{ isDark ? 'Light' : 'Dark' }} Mode
      </button>
    </div>
    
    <div class="container">
      <h2>Register</h2>
      <p class="subtitle">Please provide your totally legitimate information below.</p>

      <form @submit.prevent="handleSignup" novalidate>

        <div class="field-group">
          <label for="fname">First Name</label>
          <input 
            id="fname" 
            v-model="fname" 
            type="text" 
            placeholder="e.g. Captain Obvious"
            :class="{ 'field-error': errors.fname }"
            @blur="validate('fname')"
          />
          <span v-if="errors.fname" class="field-error-msg">{{ errors.fname }}</span>
        </div>

        <div class="field-group">
          <label for="lname">Last Name</label>
          <input 
            id="lname" 
            v-model="lname" 
            type="text" 
            placeholder="Smith? Doe? Unknown?"
            :class="{ 'field-error': errors.lname }"
            @blur="validate('lname')"
          />
          <span v-if="errors.lname" class="field-error-msg">{{ errors.lname }}</span>
        </div>

        <div class="field-group">
          <label for="email">E-mail</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="your@email.com"
            :class="{ 'field-error': errors.email }"
            @blur="validate('email')"
          />
          <span v-if="errors.email" class="field-error-msg">{{ errors.email }}</span>
        </div>

        <div class="field-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="12345 is fine"
            :class="{ 'field-error': errors.password }"
            @blur="validate('password')"
          />
          <!-- Joke password strength bar -->
          <div v-if="password.length > 0" class="strength-wrap">
            <div class="strength-bar">
              <div class="strength-fill" :style="{ width: strengthPct + '%', background: strengthColor }"></div>
            </div>
            <span class="strength-label" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
          </div>
          <span v-if="errors.password" class="field-error-msg">{{ errors.password }}</span>
        </div>

        <div class="field-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword" 
            v-model="confirmPassword" 
            type="password" 
            placeholder="Type it again (hopefully the same)"
            :class="{ 'field-error': errors.confirmPassword }"
            @blur="validate('confirmPassword')"
          />
          <span v-if="errors.confirmPassword" class="field-error-msg">{{ errors.confirmPassword }}</span>
        </div>

        <div class="field-group">
          <label>Date of Birth</label>
          <div class="dob">
            <select v-model="month" title="month" :class="{ 'field-error': errors.dob }" @change="validate('dob')">
              <option value="">Month</option>
              <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
            </select>
            <select v-model="day" title="day" @change="validate('dob')">
              <option value="">Day</option>
              <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
            </select>
            <select v-model="year" title="year" @change="validate('dob')">
              <option value="">Year</option>
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <span v-if="errors.dob" class="field-error-msg">{{ errors.dob }}</span>
          <span v-if="day > 28" class="field-hint">⚠️ Day {{ day }} is not valid in most calendars. That's the point.</span>
        </div>

        <div class="field-group">
          <div class="gender">
            <fieldset :class="{ 'field-error-border': errors.gender }">
              <legend>How did you <b>acquire</b> your gender?</legend>

              <div>
                <input id="gender-windows" v-model="gender" type="radio" value="windows" @change="validate('gender')" />
                <label for="gender-windows">via Windows Update</label>
              </div>
              <div>
                <input id="gender-raffle" v-model="gender" type="radio" value="raffle" @change="validate('gender')" />
                <label for="gender-raffle">via Lotto 6/58</label>
              </div>
              <div>
                <input id="gender-factory" v-model="gender" type="radio" value="factory" @change="validate('gender')" />
                <label for="gender-factory">via Factory Settings</label>
              </div>
              <div>
                <input id="gender-other" v-model="gender" type="radio" value="coscom" @change="validate('gender')" />
                <label for="gender-other">via CosCom Issue</label>
              </div>
            </fieldset>
            <span v-if="errors.gender" class="field-error-msg">{{ errors.gender }}</span>
          </div>
        </div>

        <div class="field-group">
          <label for="reason">Why are you even signing up?</label>
          <input 
            id="reason" 
            v-model="reason" 
            type="text" 
            placeholder="Loneliness? Curiosity? Free pizza?"
            :class="{ 'field-error': errors.reason }"
            @blur="validate('reason')"
          />
          <span v-if="errors.reason" class="field-error-msg">{{ errors.reason }}</span>
        </div>

        <p v-if="submitError" class="error-msg">{{ submitError }}</p>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          <span v-if="isLoading" class="btn-spinner"></span>
          {{ isLoading ? 'Registering...' : 'Sign Up (Regret Later)' }}
        </button>
        <router-link to="/" class="back-link">Already have an account? Back</router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '../store/database'

const router = useRouter()
const store = useDatabaseStore()

const fname = ref('')
const lname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const month = ref('')
const day = ref('')
const year = ref('')
const gender = ref('')
const reason = ref('')
const submitError = ref('')
const isLoading = ref(false)
const isDark = ref(false)

const errors = ref({
  fname: '', lname: '', email: '', password: '', confirmPassword: '',
  dob: '', gender: '', reason: ''
})

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const days = Array.from({ length: 40 }, (_, i) => i + 1)

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i)
})

// --- Joke password strength meter ---
// It peaks at 'Strong' for literally any non-empty string after 4 chars, which is the joke.
const strengthPct = computed(() => {
  const len = password.value.length
  if (len === 0) return 0
  if (len === 1) return 15
  if (len === 2) return 30
  if (len === 3) return 55
  if (len === 4) return 80
  return 100  // "12345" -> 100% -> Strong. As promised.
})

const strengthLabel = computed(() => {
  const pct = strengthPct.value
  if (pct === 0)   return ''
  if (pct <= 15)   return 'Very Weak (wow)'
  if (pct <= 30)   return 'Weak (still better than nothing)'
  if (pct <= 55)   return 'Getting There...'
  if (pct <= 80)   return 'Almost Strong!'
  return 'Very Strong ✅ (12345 is iconic)'
})

const strengthColor = computed(() => {
  const pct = strengthPct.value
  if (pct <= 15)   return '#e41e3f'
  if (pct <= 30)   return '#ff7043'
  if (pct <= 55)   return '#ffa726'
  if (pct <= 80)   return '#66bb6a'
  return '#42b72a'
})

// --- Per-field validation ---
const validate = (field) => {
  switch (field) {
    case 'fname':
      errors.value.fname = fname.value.trim() ? '' : 'First name is required. Even a nickname works.'
      break
    case 'lname':
      errors.value.lname = lname.value.trim() ? '' : 'Last name is required. "Unknown" is a valid option.'
      break
    case 'email': {
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email.value.trim()) {
        errors.value.email = 'Email is required. We need someone to send passive-aggressive newsletters to.'
      } else if (!emailRx.test(email.value)) {
        errors.value.email = 'That does not look like an email. Please try again.'
      } else {
        errors.value.email = ''
      }
      break
    }
    case 'password':
      errors.value.password = password.value.length >= 1 ? '' : 'Password is required. "12345" is genuinely accepted.'
      break
    case 'confirmPassword':
      errors.value.confirmPassword = password.value === confirmPassword.value ? '' : 'Passwords do not match. You forgot your own password already?'
      break
    case 'dob':
      errors.value.dob = (month.value && day.value && year.value) ? '' : 'Please fill in your completely valid birthday.'
      break
    case 'gender':
      errors.value.gender = gender.value ? '' : 'Please choose how you acquired your gender.'
      break
    case 'reason':
      errors.value.reason = reason.value.trim() ? '' : 'You must give us a reason, no matter how ridiculous.'
      break
  }
}

const validateAll = () => {
  validate('fname'); validate('lname'); validate('email')
  validate('password'); validate('confirmPassword')
  validate('dob'); validate('gender'); validate('reason')
  return Object.values(errors.value).every(e => e === '')
}

onMounted(() => {
  isDark.value = document.body.classList.contains('dark')
  if (store.currentUser) router.push('/dashboard')
})

const toggleTheme = () => {
  document.body.classList.toggle('dark')
  isDark.value = document.body.classList.contains('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const handleSignup = async () => {
  submitError.value = ''
  if (!validateAll()) {
    submitError.value = 'Some fields need attention. Check above.'
    return
  }
  isLoading.value = true
  // Small artificial delay so the loading state is visible
  await new Promise(r => setTimeout(r, 600))
  try {
    store.register({
      fname: fname.value.trim(),
      lname: lname.value.trim(),
      email: email.value.trim(),
      password: password.value,
      month: month.value,
      day: day.value,
      year: year.value,
      gender: gender.value,
      reason: reason.value.trim()
    })
    router.push('/dashboard')
  } catch (err) {
    submitError.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.signup-wrapper {
  min-height: 100vh;
  background: #f0f2f5;
  width: 100%;
  transition: background 0.3s;
  padding-bottom: 60px;
}

body.dark .signup-wrapper {
  background: #18191a;
}

.header {
  background: #3b5998;
  color: white;
  padding: 15px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
}

body.dark .header {
  background: #242526;
  border-bottom: 1px solid #3e4042;
}

.toggle-theme {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 0;
  transition: background 0.2s;
}

.toggle-theme:hover {
  background: rgba(255, 255, 255, 0.3);
}

.container {
  width: 420px;
  margin: 40px auto;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: background 0.3s, box-shadow 0.3s;
}

body.dark .container {
  background: #242526;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

h2 {
  text-align: center;
  color: #333;
  margin-top: 0;
}

body.dark h2 {
  color: #e4e6eb;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin: 12px 0 6px;
  font-weight: bold;
  color: #555;
  font-size: 14px;
}

body.dark label {
  color: #b0b3b8;
}

input, select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background: #ffffff;
  color: #1c1e21;
  transition: background 0.3s, border-color 0.3s, color 0.3s;
}

body.dark input, body.dark select {
  background: #3a3b3c;
  border-color: #4e4f50;
  color: #e4e6eb;
}

input:focus, select:focus {
  outline: none;
  border-color: #3b5998;
}

body.dark input:focus, body.dark select:focus {
  border-color: #4599ff;
}

.dob {
  display: flex;
  justify-content: space-between;
}

.dob select {
  width: 32%;
}

.gender {
  margin: 15px 0;
}

.gender fieldset {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px 14px;
}

body.dark .gender fieldset {
  border-color: #4e4f50;
}

.gender legend {
  font-weight: bold;
  color: #555;
  padding: 0 6px;
}

body.dark .gender legend {
  color: #b0b3b8;
}

.gender div {
  display: flex;
  align-items: center;
  margin: 6px 0;
}

.gender input[type="radio"] {
  margin-right: 8px;
  cursor: pointer;
}

.gender label {
  margin: 0;
  font-weight: normal;
  cursor: pointer;
}

.error-msg {
  color: #e41e3f;
  font-size: 14px;
  margin: 10px 0 0 0;
  font-weight: 500;
  text-align: center;
}

button {
  margin-top: 20px;
  padding: 12px;
  background: #3b5998;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

button:hover {
  background: #2d4373;
}

body.dark button {
  background: #4599ff;
  color: #18191a;
}

body.dark button:hover {
  background: #357ae8;
}

.back-link {
  text-align: center;
  margin-top: 15px;
  color: #3b5998;
  text-decoration: none;
  font-size: 14px;
}

body.dark .back-link {
  color: #4599ff;
}

.back-link:hover {
  text-decoration: underline;
}

/* ── new for Phase 2 ── */
.subtitle {
  text-align: center;
  color: #888;
  font-size: 13px;
  margin: -8px 0 16px;
}

body.dark .subtitle {
  color: #b0b3b8;
}

.field-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
}

input.field-error, select.field-error {
  border-color: #e41e3f !important;
  background-color: #fff5f7;
}

body.dark input.field-error, body.dark select.field-error {
  border-color: #e41e3f !important;
  background-color: rgba(228, 30, 63, 0.08);
}

.field-error-border {
  border-color: #e41e3f !important;
}

.field-error-msg {
  color: #e41e3f;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

.field-hint {
  color: #ff7043;
  font-size: 12px;
  margin-top: 4px;
}

.error-msg {
  color: #e41e3f;
  font-size: 14px;
  margin: 10px 0 0 0;
  font-weight: 500;
  text-align: center;
}

/* Strength bar */
.strength-wrap {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

body.dark .strength-bar {
  background: #3e4042;
}

.strength-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s, background 0.3s;
}

.strength-label {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.3s;
}

/* Submit button with spinner */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-left-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
