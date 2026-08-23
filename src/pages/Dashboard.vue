<template>
  <div class="dashboard-wrapper">
    <div class="header">
      <span>Dashboard | Login With?</span>
      <div class="header-actions">
        <button class="toggle-theme" @click="toggleTheme" type="button">
          Toggle {{ isDark ? 'Light' : 'Dark' }} Mode
        </button>
        <button class="logout-btn" @click="handleLogout" type="button">
          Log Out
        </button>
      </div>
    </div>

    <div v-if="user" class="dashboard-container">
      <div class="profile-card">
        <div class="avatar">🚪</div>
        <h2>Welcome, {{ user.first_name }} {{ user.last_name }}</h2>
        <p class="email-sub">{{ user.email }}</p>

        <div class="user-stats">
          <div class="stat-box">
            <span class="stat-val">{{ user.ligtas_points }}</span>
            <span class="stat-label">Ligtas Points (Karma)</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">{{ user.gacha_pity_count }}/180</span>
            <span class="stat-label">Gacha Pity Count</span>
          </div>
        </div>

        <div class="user-details">
          <p><b>Gender Acquisition:</b> <span>via {{ formatGender(user.gender_acquisition) }}</span></p>
          <p><b>Absurd Birthdate:</b> <span>{{ user.dob_month }} {{ user.dob_day }}, {{ user.dob_year }}</span></p>
          <p><b>Reason for Registration:</b> <span class="italic">"{{ user.signup_reason }}"</span></p>
        </div>

        <div class="action-buttons">
          <router-link to="/login-options">
            <button class="action-btn">Try Login Options</button>
          </router-link>
          <router-link to="/forgot-password">
            <button class="action-btn alt">Try Reset Options</button>
          </router-link>
          <button class="action-btn danger" @click="confirmDelete">Delete Account 💀</button>
        </div>
      </div>

      <div class="history-card">
        <h3>Terrible Authentication History</h3>
        <div v-if="logs.length === 0" class="no-logs">
          No terrible decisions recorded yet. Go click some buttons!
        </div>
        <div v-else class="timeline">
          <div v-for="log in logs" :key="log.id" :class="['timeline-item', log.outcome]">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <span class="timestamp">{{ formatTime(log.created_at) }}</span>
              <h4 class="action-title">
                {{ formatAction(log.action_type, log.option_used) }}
              </h4>
              <p class="action-details">{{ log.details }}</p>
              <span :class="['badge', log.outcome]">{{ log.outcome.toUpperCase() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '../store/database'

const store = useDatabaseStore()
const router = useRouter()

const isDark = ref(false)

const user = computed(() => store.currentUser)

const logs = computed(() => {
  if (!user.value) return []
  return store.activityLogs.filter(log => log.user_id === user.value.id)
})

// Reactive auth guard: redirect if user logs out or session expires
watchEffect(() => {
  if (!store.currentUser) {
    router.push('/')
  }
})

onMounted(() => {
  isDark.value = document.body.classList.contains('dark')
})

const toggleTheme = () => {
  document.body.classList.toggle('dark')
  isDark.value = document.body.classList.contains('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const handleLogout = () => {
  store.logout()
  router.push('/')
}

const confirmDelete = () => {
  const confirmed = window.confirm(
    `Are you absolutely sure you want to delete your account, ${user.value?.first_name}? ` +
    `This will permanently erase all ${logs.value.length} terrible authentication decisions from our records. ` +
    `There is no undo. Not even via Microwave.`
  )
  if (confirmed) {
    const userId = user.value.id
    store.logout()
    store.users = store.users.filter(u => u.id !== userId)
    store.activityLogs = store.activityLogs.filter(l => l.user_id !== userId)
    localStorage.setItem('users', JSON.stringify(store.users))
    localStorage.setItem('activity_logs', JSON.stringify(store.activityLogs))
    router.push('/')
  }
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

const formatTime = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + 
         ' ' + date.toLocaleDateString()
}

const formatAction = (type, option) => {
  if (type === 'register') return 'Account Registered'
  if (type === 'login') return `Login Attempt: via ${option}`
  if (type === 'reset') return `Password Reset: via ${option}`
  if (type === 'logout') return 'Logged Out'
  return type
}
</script>

<style scoped>
.dashboard-wrapper {
  min-height: 100vh;
  background: #f0f2f5;
  width: 100%;
  transition: background 0.3s;
}

body.dark .dashboard-wrapper {
  background: #18191a;
}

.header {
  background: #3b5998;
  color: white;
  padding: 15px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

body.dark .header {
  background: #242526;
  border-bottom: 1px solid #3e4042;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.toggle-theme, .logout-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.toggle-theme:hover, .logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.logout-btn {
  background: #e41e3f;
  border-color: transparent;
}

.logout-btn:hover {
  background: #c21330;
}

.dashboard-container {
  max-width: 1000px;
  margin: 40px auto;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
}

.profile-card, .history-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s, box-shadow 0.3s;
}

body.dark .profile-card, body.dark .history-card {
  background: #242526;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.avatar {
  font-size: 60px;
  text-align: center;
  margin-bottom: 10px;
}

h2 {
  text-align: center;
  margin: 0;
  color: #333;
}

body.dark h2 {
  color: #e4e6eb;
}

.email-sub {
  text-align: center;
  color: #666;
  margin: 5px 0 20px;
}

body.dark .email-sub {
  color: #b0b3b8;
}

.user-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-box {
  background: #f0f2f5;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  transition: background 0.3s;
}

body.dark .stat-box {
  background: #3a3b3c;
}

.stat-val {
  font-size: 22px;
  font-weight: bold;
  color: #1877f2;
}

body.dark .stat-val {
  color: #4599ff;
}

.stat-label {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

body.dark .stat-label {
  color: #b0b3b8;
}

.user-details {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

body.dark .user-details {
  border-color: #3e4042;
}

.user-details p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

body.dark .user-details p {
  color: #e4e6eb;
}

.user-details span {
  float: right;
  font-weight: 500;
  color: #555;
}

body.dark .user-details span {
  color: #b0b3b8;
}

.user-details .italic {
  font-style: italic;
  color: #777;
}

body.dark .user-details .italic {
  color: #b0b3b8;
}

.action-buttons {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  width: 100%;
  background: #1877f2;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #166fe5;
}

body.dark .action-btn {
  background: #4599ff;
  color: #18191a;
}

body.dark .action-btn:hover {
  background: #357ae8;
}

.action-btn.alt {
  background: #42b72a;
}

.action-btn.alt:hover {
  background: #36a420;
}

.action-btn.danger {
  background: transparent;
  border: 2px solid #e41e3f;
  color: #e41e3f;
}

.action-btn.danger:hover {
  background: #e41e3f;
  color: white;
}

body.dark .action-btn.danger {
  border-color: #ef5350;
  color: #ef5350;
}

body.dark .action-btn.danger:hover {
  background: #ef5350;
  color: white;
}

/* History Card */
h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

body.dark h3 {
  color: #e4e6eb;
  border-color: #3e4042;
}

.no-logs {
  color: #666;
  text-align: center;
  padding: 40px 0;
  font-style: italic;
}

body.dark .no-logs {
  color: #b0b3b8;
}

.timeline {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 20px;
  border-left: 2px solid #eee;
  margin-left: 10px;
}

body.dark .timeline {
  border-color: #3e4042;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-marker {
  position: absolute;
  left: -26px;
  top: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #bbb;
  border: 2px solid white;
  transition: border 0.3s;
}

body.dark .timeline-marker {
  border-color: #242526;
}

.timeline-item.success .timeline-marker {
  background: #42b72a;
}

.timeline-item.failure .timeline-marker {
  background: #e41e3f;
}

.timeline-content {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px 16px;
  position: relative;
  transition: background 0.3s;
}

body.dark .timeline-content {
  background: #18191a;
}

.timestamp {
  font-size: 11px;
  color: #999;
  display: block;
  margin-bottom: 4px;
}

.action-title {
  margin: 0 0 6px 0;
  font-size: 15px;
  color: #333;
}

body.dark .action-title {
  color: #e4e6eb;
}

.action-details {
  margin: 0;
  font-size: 13px;
  color: #666;
}

body.dark .action-details {
  color: #b0b3b8;
}

.badge {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 9px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
}

.badge.success {
  background: #e1f5fe;
  color: #0288d1;
}

.badge.failure {
  background: #ffebee;
  color: #c62828;
}

.badge.pending {
  background: #fff8e1;
  color: #f57f17;
}

body.dark .badge.success {
  background: rgba(2, 136, 209, 0.2);
  color: #29b6f6;
}

body.dark .badge.failure {
  background: rgba(198, 40, 40, 0.2);
  color: #ef5350;
}
</style>
