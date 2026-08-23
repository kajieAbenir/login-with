<template>
  <div class="joke-wrapper">
    <div class="header-nav">
      <button class="toggle-theme" @click="toggleTheme" type="button">
        Toggle {{ isDark ? 'Light' : 'Dark' }} Mode
      </button>
      <router-link to="/">
        <button class="toggle-theme" type="button">Home</button>
      </router-link>
    </div>

    <div class="joke-card">
      <div class="meme-header">
        <span class="warning-badge">⚠️ CRITICAL SECURITY BREACH: COMMON SENSE NOT FOUND ⚠️</span>
        <h1>YOU ACTUALLY LOGGED IN NORMALLY?!</h1>
        <p class="subtitle">
          Did you seriously expect a legitimate corporate SaaS dashboard from a website with 
          <b>"Login with Malunggay Pandesal"</b> and <b>"Reset Password via Microwave"</b>?
        </p>
      </div>

      <!-- Laughing Cat Meme GIF -->
      <div class="gif-container">
        <img 
          src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1dzBja3lyeHFjcGtsOGc3eGF0dnp2dXp4MnF6ZXF1d3pibTF0YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/unQ3IJU2RG7DO/giphy.gif" 
          alt="Laughing Cat Meme"
          class="meme-gif"
        />
      </div>

      <!-- Prank Clearance Dossier -->
      <div class="clearance-dossier" v-if="user">
        <h3>📋 Authentication Victim Dossier</h3>
        <div class="dossier-grid">
          <p><b>Victim Name:</b> <span>{{ user.first_name }} {{ user.last_name }}</span></p>
          <p><b>Compromised Email:</b> <code>{{ user.email }}</code></p>
          <p><b>Gender Acquired:</b> <span>via {{ formatGender(user.gender_acquisition) }}</span></p>
          <p><b>Security Clearance:</b> <span class="badge-danger">CLUELESS</span></p>
          <p><b>Diagnosis:</b> <i>Expected a real database in a meme portfolio.</i></p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="joke-actions">
        <a 
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="action-btn rickroll-btn"
        >
          🕺 Get Rickrolled for Real (YouTube)
        </a>

        <router-link to="/login-options" class="action-btn options-btn">
          ⚡ Try 32 Worse Login Options Instead
        </router-link>

        <router-link to="/forgot-password" class="action-btn forgot-btn">
          💀 Reset Password via Russian Roulette
        </router-link>

        <router-link to="/dashboard" class="action-btn dash-btn">
          📊 View Past Terrible Decisions (Dashboard)
        </router-link>
      </div>
    </div>

    <div class="footer">
      <h6>remake by: <a href="https://github.com/kajieAbenir" target="_blank">Brent Kyrjeh Abenir</a></h6>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDatabaseStore } from '../store/database'

const store = useDatabaseStore()
const isDark = ref(false)

const user = computed(() => store.currentUser)

onMounted(() => {
  isDark.value = document.body.classList.contains('dark')
  
  if (user.value) {
    store.addLog(
      user.value.id,
      'login',
      'normal_login',
      'failure',
      'Attempted standard credentials login and got trolled by laughing cat.'
    )
  }
})

const toggleTheme = () => {
  document.body.classList.toggle('dark')
  isDark.value = document.body.classList.contains('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const formatGender = (gender) => {
  const map = {
    windows: 'Windows Update',
    raffle: 'Lotto 6/58 Raffle',
    factory: 'Factory Settings',
    coscom: 'CosCom Issue'
  }
  return map[gender] || gender
}
</script>

<style scoped>
.joke-wrapper {
  min-height: 100vh;
  background: #f0f2f5;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 60px 20px 40px;
  box-sizing: border-box;
  transition: background 0.3s;
}

body.dark .joke-wrapper {
  background: #18191a;
}

.header-nav {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
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

.joke-card {
  max-width: 700px;
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: background 0.3s, box-shadow 0.3s;
}

body.dark .joke-card {
  background: #242526;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.warning-badge {
  display: inline-block;
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 16px;
}

body.dark .warning-badge {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border-color: rgba(255, 193, 7, 0.3);
}

.meme-header h1 {
  margin: 0 0 12px;
  font-size: 26px;
  color: #e41e3f;
}

body.dark .meme-header h1 {
  color: #ff526d;
}

.subtitle {
  font-size: 15px;
  line-height: 1.5;
  color: #555;
  margin: 0 0 20px;
}

body.dark .subtitle {
  color: #b0b3b8;
}

.gif-container {
  margin: 16px auto 24px;
  max-width: 380px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.meme-gif {
  width: 100%;
  display: block;
}

/* Dossier */
.clearance-dossier {
  background: #f8f9fa;
  border: 1px solid #e4e6eb;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 20px 0 24px;
  text-align: left;
}

body.dark .clearance-dossier {
  background: #18191a;
  border-color: #3e4042;
}

.clearance-dossier h3 {
  margin: 0 0 12px;
  font-size: 15px;
  color: #1c1e21;
}

body.dark .clearance-dossier h3 {
  color: #e4e6eb;
}

.dossier-grid p {
  margin: 6px 0;
  font-size: 13px;
  color: #333;
  display: flex;
  justify-content: space-between;
}

body.dark .dossier-grid p {
  color: #e4e6eb;
}

.badge-danger {
  background: #ffebee;
  color: #c62828;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 11px;
}

body.dark .badge-danger {
  background: rgba(198, 40, 40, 0.2);
  color: #ef5350;
}

/* Action Buttons */
.joke-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 600px) {
  .joke-actions {
    grid-template-columns: 1fr;
  }
}

.action-btn {
  display: block;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
  text-align: center;
  border: none;
  cursor: pointer;
}

.rickroll-btn {
  background: #ff0000;
  color: white;
}

.rickroll-btn:hover {
  background: #cc0000;
  transform: translateY(-2px);
}

.options-btn {
  background: #1877f2;
  color: white;
}

.options-btn:hover {
  background: #166fe5;
  transform: translateY(-2px);
}

.forgot-btn {
  background: #e41e3f;
  color: white;
}

.forgot-btn:hover {
  background: #c21330;
  transform: translateY(-2px);
}

.dash-btn {
  background: #42b72a;
  color: white;
}

.dash-btn:hover {
  background: #36a420;
  transform: translateY(-2px);
}

.footer {
  margin-top: 30px;
  text-align: center;
}
</style>
