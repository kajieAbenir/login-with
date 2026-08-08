import { defineStore } from 'pinia'

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users')) || [],
    currentUser: JSON.parse(sessionStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('currentUser')) || null,
    activityLogs: JSON.parse(localStorage.getItem('activity_logs')) || [],
    cooldowns: JSON.parse(localStorage.getItem('cooldowns')) || []
  }),

  actions: {
    register(userData) {
      // Check if email already exists
      const exists = this.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())
      if (exists) {
        throw new Error('E-mail already registered! Try resetting password if you deserve it.')
      }

      const newUser = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        first_name: userData.fname,
        last_name: userData.lname,
        email: userData.email,
        password: userData.password, // Stored in plain text because security is left aside
        dob_month: userData.month,
        dob_day: parseInt(userData.day),
        dob_year: parseInt(userData.year),
        gender_acquisition: userData.gender,
        signup_reason: userData.reason,
        ligtas_points: 100,
        gacha_pity_count: 0,
        created_at: new Date().toISOString()
      }

      this.users.push(newUser)
      localStorage.setItem('users', JSON.stringify(this.users))
      
      // Auto login
      this.setCurrentUser(newUser)
      this.addLog(newUser.id, 'register', 'manual', 'success', 'Acquired account via signup. Regret scheduled.')
      
      return newUser
    },

    login(email, password) {
      const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
      if (!user) {
        throw new Error('Invalid email or password. Deserved.')
      }

      this.setCurrentUser(user)
      this.addLog(user.id, 'login', 'standard', 'success', 'Logged in successfully. (Somehow)')
      return user
    },

    setCurrentUser(user, remember = true) {
      this.currentUser = user
      if (user) {
        const storage = remember ? localStorage : sessionStorage
        storage.setItem('currentUser', JSON.stringify(user))
      } else {
        localStorage.removeItem('currentUser')
        sessionStorage.removeItem('currentUser')
      }
    },

    logout() {
      if (this.currentUser) {
        this.addLog(this.currentUser.id, 'logout', 'standard', 'success', 'Logged out. Goodbye.')
        this.setCurrentUser(null)
      }
    },

    updateUser(updatedUser) {
      this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u)
      localStorage.setItem('users', JSON.stringify(this.users))
      if (this.currentUser && this.currentUser.id === updatedUser.id) {
        this.setCurrentUser(updatedUser)
      }
    },

    addLog(userId, actionType, optionUsed, outcome, details) {
      const log = {
        id: 'log_' + Date.now() + Math.random().toString(36).substr(2, 4),
        user_id: userId,
        action_type: actionType,
        option_used: optionUsed,
        outcome: outcome,
        details: details,
        created_at: new Date().toISOString()
      }
      this.activityLogs.unshift(log)
      localStorage.setItem('activity_logs', JSON.stringify(this.activityLogs))
    },

    addCooldown(userId, type, durationSeconds) {
      const expiresAt = Date.now() + (durationSeconds * 1000)
      this.cooldowns = this.cooldowns.filter(c => !(c.user_id === userId && c.type === type))
      this.cooldowns.push({ user_id: userId, type, expires_at: expiresAt })
      localStorage.setItem('cooldowns', JSON.stringify(this.cooldowns))
    },

    getCooldown(userId, type) {
      const active = this.cooldowns.find(c => c.user_id === userId && c.type === type)
      if (!active) return 0
      const remaining = Math.ceil((active.expires_at - Date.now()) / 1000)
      if (remaining <= 0) {
        this.cooldowns = this.cooldowns.filter(c => c !== active)
        localStorage.setItem('cooldowns', JSON.stringify(this.cooldowns))
        return 0
      }
      return remaining
    }
  }
})
