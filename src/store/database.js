import { defineStore } from 'pinia'

export const DUMMY_USERS = [
  {
    id: 'usr_dummy_1',
    first_name: 'Juan',
    last_name: 'Dela Cruz',
    email: 'juan.iron4@valorant.ph',
    password: '12345',
    dob_month: 'Feb',
    dob_day: 35,
    dob_year: 2002,
    gender_acquisition: 'windows',
    signup_reason: 'To rank up to Bronze (physically impossible).',
    ligtas_points: -20,
    gacha_pity_count: 74,
    created_at: '2026-01-16T10:00:00.000Z'
  },
  {
    id: 'usr_dummy_2',
    first_name: 'Karen',
    last_name: 'Smith',
    email: 'karen.wants.manager@complaints.com',
    password: 'letmespeaktomanager1',
    dob_month: 'Oct',
    dob_day: 40,
    dob_year: 1985,
    gender_acquisition: 'factory',
    signup_reason: 'Looking for the website manager.',
    ligtas_points: 0,
    gacha_pity_count: 12,
    created_at: '2026-01-16T11:00:00.000Z'
  },
  {
    id: 'usr_dummy_3',
    first_name: 'Marites',
    last_name: 'Tolentino',
    email: 'marites.chismis@barangay.gov.ph',
    password: 'alammoba',
    dob_month: 'Jul',
    dob_day: 31,
    dob_year: 1978,
    gender_acquisition: 'coscom',
    signup_reason: 'Narinig ko may libreng malunggay pandesal dito.',
    ligtas_points: 300,
    gacha_pity_count: 150,
    created_at: '2026-01-16T12:00:00.000Z'
  },
  {
    id: 'usr_dummy_4',
    first_name: 'Boy',
    last_name: 'Microwave',
    email: 'microwave.enjoyer@tupperware.net',
    password: 'beepbeepbeep',
    dob_month: 'Dec',
    dob_day: 38,
    dob_year: 1999,
    gender_acquisition: 'raffle',
    signup_reason: 'Testing if HTML can reheat cold pizza.',
    ligtas_points: 80,
    gacha_pity_count: 0,
    created_at: '2026-01-16T13:00:00.000Z'
  },
  {
    id: 'usr_dummy_5',
    first_name: 'Keqing',
    last_name: 'Lover99',
    email: 'c6.qiqi.puller@tighnari.org',
    password: 'lost5050again',
    dob_month: 'Jan',
    dob_day: 1,
    dob_year: 2004,
    gender_acquisition: 'windows',
    signup_reason: 'Need password reset via 0.5% drop rate banner.',
    ligtas_points: 40,
    gacha_pity_count: 179,
    created_at: '2026-01-16T14:00:00.000Z'
  },
  {
    id: 'usr_dummy_6',
    first_name: 'Eugene',
    last_name: 'Roshal',
    email: 'day40.forever@rarlabs.org',
    password: 'buylicensewhen',
    dob_month: 'Nov',
    dob_day: 29,
    dob_year: 1993,
    gender_acquisition: 'factory',
    signup_reason: 'Evaluation trial expires in 40 days (since 2005).',
    ligtas_points: 999,
    gacha_pity_count: 5,
    created_at: '2026-01-16T15:00:00.000Z'
  },
  {
    id: 'usr_dummy_7',
    first_name: 'Blinking',
    last_name: 'RedLight',
    email: 'have.you.restarted@pldt.com.ph',
    password: 'dsl_light_blinking',
    dob_month: 'Apr',
    dob_day: 15,
    dob_year: 2000,
    gender_acquisition: 'coscom',
    signup_reason: 'Your connection speed is currently 0.01 kbps.',
    ligtas_points: 10,
    gacha_pity_count: 22,
    created_at: '2026-01-16T16:00:00.000Z'
  },
  {
    id: 'usr_dummy_8',
    first_name: 'Helpless',
    last_name: 'Learner',
    email: 'spanish.or.vanish@owl.threat',
    password: 'porfavornomehagasdaño',
    dob_month: 'May',
    dob_day: 39,
    dob_year: 2006,
    gender_acquisition: 'windows',
    signup_reason: 'The green owl is watching my house.',
    ligtas_points: 50,
    gacha_pity_count: 88,
    created_at: '2026-01-16T17:00:00.000Z'
  },
  {
    id: 'usr_dummy_9',
    first_name: 'Captain',
    last_name: 'Obvious',
    email: 'captain.obvious@obvious.com',
    password: 'password',
    dob_month: 'Aug',
    dob_day: 20,
    dob_year: 1990,
    gender_acquisition: 'factory',
    signup_reason: 'I am signing up because I clicked sign up.',
    ligtas_points: 100,
    gacha_pity_count: 50,
    created_at: '2026-01-16T18:00:00.000Z'
  },
  {
    id: 'usr_dummy_10',
    first_name: 'Ninong',
    last_name: 'Pautang',
    email: 'doctor.ka.na.ba@kamag-anak.ph',
    password: 'sagotkitadun',
    dob_month: 'Sep',
    dob_day: 33,
    dob_year: 1965,
    gender_acquisition: 'raffle',
    signup_reason: 'Pinag-aral kita nung grade 1 kaya may utang na loob ka.',
    ligtas_points: -500,
    gacha_pity_count: 100,
    created_at: '2026-01-16T19:00:00.000Z'
  }
]

function getInitialUsers() {
  const saved = localStorage.getItem('users')
  if (!saved || JSON.parse(saved).length === 0) {
    localStorage.setItem('users', JSON.stringify(DUMMY_USERS))
    return [...DUMMY_USERS]
  }
  const parsed = JSON.parse(saved)
  // Ensure dummy users exist if list is empty
  if (parsed.length === 0) {
    localStorage.setItem('users', JSON.stringify(DUMMY_USERS))
    return [...DUMMY_USERS]
  }
  return parsed
}

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    users: getInitialUsers(),
    currentUser: JSON.parse(sessionStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('currentUser')) || null,
    activityLogs: JSON.parse(localStorage.getItem('activity_logs')) || [],
    cooldowns: JSON.parse(localStorage.getItem('cooldowns')) || []
  }),

  actions: {
    findUserByEmail(email) {
      if (!email) return null
      return this.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null
    },

    register(userData) {
      const exists = this.findUserByEmail(userData.email)
      if (exists) {
        throw new Error('E-mail already registered! Try resetting password if you deserve it.')
      }

      const newUser = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        first_name: userData.fname,
        last_name: userData.lname,
        email: userData.email,
        password: userData.password,
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
      
      this.setCurrentUser(newUser)
      this.addLog(newUser.id, 'register', 'manual', 'success', 'Acquired account via signup. Regret scheduled.')
      
      return newUser
    },

    login(email, password) {
      const user = this.users.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      )
      if (!user) {
        throw new Error('Invalid email or password. Deserved.')
      }

      this.setCurrentUser(user)
      this.addLog(user.id, 'login', 'standard', 'success', 'Logged in successfully. (Somehow)')
      return user
    },

    selectDummyAccount(dummyUser) {
      const existing = this.findUserByEmail(dummyUser.email) || dummyUser
      this.setCurrentUser(existing)
      this.addLog(existing.id, 'login', 'dummy_select', 'success', `Switched persona to ${existing.first_name} ${existing.last_name}.`)
      return existing
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
    },

    resetAllDummyAccounts() {
      this.users = [...DUMMY_USERS]
      localStorage.setItem('users', JSON.stringify(this.users))
    }
  }
})
