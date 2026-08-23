<template>
  <div class="options-wrapper">
    <div class="header-container">
      <h1>Login Options</h1>
      <p class="subtitle">Forty-four unhinged, unprofessional, and entirely fictional authentication portals.</p>
      
      <div class="header-actions">
        <button class="toggle-theme" @click="toggleTheme" type="button">
          Toggle {{ isDark ? 'Light' : 'Dark' }} Mode
        </button>
        <router-link to="/">
          <button class="toggle-theme" type="button">Back</button>
        </router-link>
      </div>
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
            <div class="modal-actions">
              <button class="close-modal-btn" @click="closeModal">Close</button>
              <router-link v-if="modalResult.outcome === 'success'" to="/dashboard">
                <button class="dashboard-btn">Go to Dashboard ➔</button>
              </router-link>
            </div>
          </div>
          <div v-else-if="modalState === 'challenge'" class="challenge-state">
            <p class="challenge-prompt">{{ challenge.prompt }}</p>
            <div v-if="challenge.type === 'google'" class="challenge-choices">
              <label v-for="choice in challenge.choices" :key="choice" class="challenge-check">
                <input v-model="challenge.answer" type="checkbox" :value="choice"> {{ choice }}
              </label>
              <button class="challenge-submit" type="button" @click="submitChallenge(challenge.answer)">Verify products</button>
            </div>
            <div v-else-if="challenge.type === 'choice'" class="challenge-choices">
              <button
                v-for="choice in challenge.choices"
                :key="choice"
                class="challenge-choice"
                type="button"
                @click="submitChallenge(choice)"
              >
                {{ choice }}
              </button>
            </div>
            <div v-else-if="challenge.type === 'text'" class="challenge-input">
              <textarea v-model="challenge.answer" :maxlength="challenge.maxLength" rows="4" placeholder="Type your fictional answer..."></textarea>
              <small>{{ challenge.answer.length }}/{{ challenge.maxLength }}</small>
              <button class="challenge-submit" type="button" @click="submitChallenge(challenge.answer)">Submit</button>
            </div>
            <div v-else-if="challenge.type === 'range'" class="challenge-input">
              <input v-model.number="challenge.answer" type="range" :min="challenge.min" :max="challenge.max">
              <strong>{{ challenge.answer }}</strong>
              <button class="challenge-submit" type="button" @click="submitChallenge(challenge.answer)">Confirm</button>
            </div>
            <form v-else-if="challenge.type === 'form'" class="challenge-input" @submit.prevent="submitChallenge(challenge.answer)">
              <input v-model="challenge.answer" :placeholder="challenge.placeholder || 'Fictional details only'" :inputmode="challenge.inputmode || 'text'">
              <small v-if="challenge.notice">{{ challenge.notice }}</small>
              <button class="challenge-submit" type="submit">{{ challenge.button || 'Submit' }}</button>
            </form>
            <div v-else-if="challenge.type === 'file'" class="challenge-input">
              <input type="file" :accept="challenge.accept || '*/*'" @change="challenge.answer = $event.target.files[0]?.name || ''">
              <small>{{ challenge.notice || 'The file stays in your browser; this is a fake scanner.' }}</small>
              <button class="challenge-submit" type="button" :disabled="!challenge.answer" @click="submitChallenge(challenge.answer)">Start fake scan</button>
            </div>
            <div v-else-if="challenge.type === 'whack'" class="whack-grid">
              <button v-for="cell in 9" :key="cell" type="button" :class="{ active: cell === challenge.target }" @click="whackFingerprint(cell)">{{ cell === challenge.target ? '☝' : '·' }}</button>
              <small>Fingerprint whacked: {{ challenge.hits }}/8</small>
            </div>
            <div v-else-if="challenge.type === 'endless'" class="challenge-input">
              <strong>Challenge #{{ challenge.level }}</strong>
              <code>while (loggedOut) { solveAnotherChallenge() }</code>
              <button class="challenge-submit" type="button" @click="challenge.level++">Submit solution &amp; receive another</button>
              <small>This one is intentionally never-ending.</small>
            </div>
            <div v-else-if="challenge.type === 'settings'" class="ios-settings">
              <button v-for="item in challenge.choices" :key="item" type="button" @click="submitChallenge(item)">{{ item }} <span>›</span></button>
            </div>
            <div v-else-if="challenge.type === 'nothing'" class="nothing-state" aria-label="Nothing happens">…</div>
            <button v-else class="challenge-submit" type="button" @click="submitChallenge(true)">Attempt the impossible</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDatabaseStore, DUMMY_USERS } from '../store/database'
import { useRouter } from 'vue-router'

const store = useDatabaseStore()
const router = useRouter()
const isDark = ref(false)
const activeModal = ref(null)
const modalState = ref('loading') // 'loading' | 'result'
const modalResult = ref({ outcome: 'failure', message: '' })
const challenge = ref({ type: 'choice', prompt: '', choices: [], answer: '' })
let optionTimer = null
let googleShuffleTimer = null

const challengeDefinitions = {
  google: { prompt: 'Choose every real Google product hidden among fake products.', choices: ['Google Search', 'Googol Plex', 'Google Drive', 'Goggle Shoes'], valid: ['Google Search', 'Google Drive'] },
  facebook: { prompt: 'Loading your account... choose the most likely status.', choices: ['Zucced', 'Un-Zucced', 'Still loading', 'Emotionally available'], valid: ['Zucced'] },
  github: { prompt: 'Complete the never-ending JavaScript challenge.', choices: ['Semicolon', 'Promise.resolve()', 'It continues forever', 'All of the above'], valid: ['It continues forever'] },
  linkedin: { prompt: 'Select the correct professional summary.', choices: ['Seeking login opportunities', 'Synergizing authentication verticals', 'Please call my HR', 'All are suspicious'], valid: ['All are suspicious'] },
  x: { type: 'text', prompt: 'Write a fictional post with exactly 280 characters.', maxLength: 280, answer: '' },
  riotgames: { prompt: 'Select the target in this extremely safe target practice.', choices: ['Target A', 'Target B', 'The login button', 'No targets, only paperwork'], valid: ['The login button'] },
  cosmarket: { prompt: 'Choose the cheapest flawless cosplay item.', choices: ['Perfect wig - P999', 'Perfect cape - P1,000', 'Flawless armor - P999,999', 'Nothing is flawless'], valid: ['Nothing is flawless'] },
  groomer: { prompt: 'Choose a harmless fictional grooming appointment status.', choices: ['Pet is fluffy', 'Pet is a cloud', 'Pet approved itself', 'All require brushing'], valid: ['All require brushing'] },
  spotify: { prompt: 'Guess the song from three increasingly unhelpful clues.', choices: ['It has sound', 'It was released sometime', 'The artist had a name', 'All clues are useless'], valid: ['All clues are useless'] },
  applemusic: { prompt: 'Arrange the albums chronologically. One insists it was released yesterday.', choices: ['Yesterday', 'Today', 'Tomorrow', 'The timeline is lying'], valid: ['The timeline is lying'] },
  paypal: { prompt: 'Choose an emotionally available payment method.', choices: ['Cash', 'Card', 'PayPal', 'None of the above'], valid: ['None of the above'] },
  visa: { prompt: 'Use only fictional test values. Why was the test card rejected?', choices: ['Too fictional', 'Not fictional enough', 'Card is shy', 'All of the above'], valid: ['All of the above'] },
  jollibee: { prompt: 'Build a fictional order before the login rider arrives.', choices: ['Chickenjoy', 'Burger steak', 'Jolly spaghetti', 'The rider ate it'], valid: ['The rider ate it'] },
  mcdonalds: { prompt: 'The pretend QR scanner found one status.', choices: ['Scanning', 'Still scanning', 'Ice cream machine broken', 'QR code achieved enlightenment'], valid: ['Ice cream machine broken'] },
  kfc: { prompt: 'Which secret spice is definitely not secret?', choices: ['Salt', 'Pepper', 'Mystery 12', 'All are classified'], valid: ['All are classified'] },
  starbucks: { type: 'range', prompt: 'Set the imaginary milk amount to exactly 73%.', min: 0, max: 100, answer: 50, valid: 73 },
  pandesal: { type: 'range', prompt: 'Bake the fictional malunggay pandesal at exactly 180 C.', min: 100, max: 250, answer: 160, valid: 180 },
  settings: { prompt: 'Find the one setting that should not exist.', choices: ['Wi-Fi', 'Battery', 'Enable extra settings', 'Settings settings'], valid: ['Settings settings'] },
  id: { prompt: 'Choose the only acceptable demo verification.', choices: ['Upload a real ID', 'Type a passport number', 'Use a fictional ID card', 'Share a photo'], valid: ['Use a fictional ID card'] },
  age: { type: 'range', prompt: 'Set your fictional account age to 4,821.', min: 0, max: 10000, answer: 18, valid: 4821 },
  pdf: { prompt: 'Choose a safe demo document for the scanner.', choices: ['Real ID', 'Private document', 'Blank sample PDF', 'Medical record'], valid: ['Blank sample PDF'] },
  fingerprint: { prompt: 'Choose the fingerprint that is definitely a cartoon.', choices: ['Fingerprint A', 'Fingerprint B', 'Cartoon fingerprint', 'Your real fingerprint'], valid: ['Cartoon fingerprint'] },
  onlyfans: { prompt: 'Account balance: P0.00. Choose a response.', choices: ['Top up', 'Wait for imaginary invoice', 'Nothing', 'Borrow from fictional friend'], valid: ['Nothing'] },
  phub: { prompt: 'Incognito mode detected. What is the only safe action?', choices: ['Close the tab', 'Share history', 'Disable privacy', 'Upload a document'], valid: ['Close the tab'] },
  winrar: { prompt: 'Your trial expired. Choose a button.', choices: ['Buy', 'Close', 'Read the license', 'Start another trial'], valid: ['Close'] },
  ikea: { prompt: 'Assemble the fictional table perfectly.', choices: ['Attach the legs', 'Lose the allen key', 'Read step 47', 'The table is upside down'], valid: ['Attach the legs'] },
  internetexplorer: { prompt: 'Dial-up connection progress: select the current status.', choices: ['0.01%', 'Still connecting', 'Gateway timeout', 'All are accurate'], valid: ['All are accurate'] },
  pldt: { prompt: 'The DSL light is blinking. Choose the next troubleshooting step.', choices: ['Restart modem', 'Restart modem again', 'Restart modem 14 times', 'All of the above'], valid: ['All of the above'] },
  globe: { prompt: 'Signal strength: 0 bars. Choose a solution.', choices: ['Climb a tree', 'Spin in place', 'Ask the mango tree', 'All are equally effective'], valid: ['All are equally effective'] },
  duolingo: { prompt: 'Translate the fictional warning before the timer ends.', choices: ['The owl is watching me', 'The owl is asleep', 'I am the owl', 'The owl is a router'], valid: ['The owl is watching me'] },
  barangay: { prompt: 'Which fictional office should you visit first?', choices: ['Office A', 'Office B', 'The wrong office', 'The captain is at lunch'], valid: ['The wrong office'] },
  tor: { prompt: 'Arrange prerequisites when every subject requires every other subject.', choices: ['Start anywhere', 'Start nowhere', 'Ask the registrar', 'All are correct'], valid: ['All are correct'] },
  nso: { prompt: 'The fictional document is yellowed. What happens next?', choices: ['Photocopy it three times', 'Photocopy the photocopies', 'Visit a branch 50 km away', 'All of the above'], valid: ['All of the above'] },
  utang: { prompt: 'How much fictional moral debt is owed?', choices: ['None', 'A medical degree', 'A casserole', 'Nobody agrees'], valid: ['Nobody agrees'] },
  load: { prompt: 'Your fictional load balance is P0.01 short. Choose a response.', choices: ['Add load', 'Try again', 'Ask the network nicely', 'All fail identically'], valid: ['All fail identically'] },
  pisowifi: { prompt: 'Insert a pretend coin into the pretend hotspot.', choices: ['P1 coin', 'P5 coin', 'A USB coin', 'The coin slot is imaginary'], valid: ['The coin slot is imaginary'] },
  seen: { prompt: 'Your message was seen. Choose the current status.', choices: ['Typing...', 'Typing forever...', 'Reply received', 'Left on seen'], valid: ['Left on seen'] },
  approval: { prompt: 'Your request is in queue #4,821. Choose what happens next.', choices: ['Queue advances', 'Queue reverses', 'Email arrives', 'The queue becomes self-aware'], valid: ['The queue becomes self-aware'] },
  jnt: { prompt: 'Select the parcel status.', choices: ['Delivered', 'Thrown to the ocean', 'Parcel not found', 'All are possible'], valid: ['All are possible'] },
  spx: { prompt: 'Your parcel has traveled outside the selected country. Choose its destination.', choices: ['Moon', 'Neighboring country', 'Somewhere unexpected', 'All are plausible'], valid: ['All are plausible'] },
  ligtas: { prompt: 'Complete the fictional safety check.', choices: ['Wear a helmet', 'Check the exit', 'Do not lick the router', 'All of the above'], valid: ['All of the above'] },
  psychology: { type: 'text', prompt: 'Explain how this button makes you feel in exactly 500 characters.', maxLength: 500, answer: '' },
  jackie: { prompt: 'Name three things that are not Jackie Chan.', choices: ['A chair', 'A cloud', 'A login form', 'All three'], valid: ['All three'] },
  microwave: { prompt: 'Set the imaginary snack and press the imaginary start button.', choices: ['Popcorn', 'Pandesal', 'Please rotate login', 'All of the above'], valid: ['Please rotate login'] }
}

// Each option has its own little parody mechanic. Inputs are deliberately demo-only
// and are never sent anywhere.
Object.assign(challengeDefinitions, {
  google: { type: 'google', prompt: 'Choose every real Google product. One decoy changes position every second.', choices: ['Google Search', 'Googol Plex', 'Google Drive', 'Google Maps', 'Google Sneeze'], valid: ['Google Search', 'Google Drive', 'Google Maps'], answer: [] },
  facebook: { type: 'loading', prompt: 'Loading your account…', loading: 'Your account has been Zucced.' },
  github: { type: 'endless', prompt: 'Complete this JavaScript challenge.', level: 1 },
  linkedin: { type: 'form', prompt: 'Enter a fictional professional summary; HR will be notified about this login.', placeholder: 'Name — headline — impressive-but-fictional achievement', button: 'Generate resume preview', notice: 'The preview is a local demo only.' },
  x: { type: 'text', prompt: 'Write exactly 280 characters. Every Post click reduces the limit by one.', maxLength: 280, answer: '', shrinking: true },
  riotgames: { type: 'choice', prompt: 'Target practice complete: select the harmless cardboard target.', choices: ['Cardboard target', 'The login button', 'A cloud', 'The terms of service'], valid: ['Cardboard target'] },
  cosmarket: { type: 'choice', prompt: 'Select the cheapest item with no flaws. Every item has a flaw.', choices: ['₱99 wig (missing hair)', '₱100 cape (haunted)', '₱101 armor (cardboard)', 'Nothing is flawless'], valid: ['Nothing is flawless'] },
  groomer: { type: 'choice', prompt: 'Pet-grooming task: select the small touch-up that a dog would approve.', choices: ['Trim one paw tuft', 'Brush a tail knot', 'Wash a mud spot', 'Give tax advice'], valid: ['Trim one paw tuft'] },
  spotify: { type: 'choice', prompt: 'Clue 1: it has sound. Clue 2: someone made it. Clue 3: it may be a song. Guess anyway.', choices: ['Untitled Audio File', 'The Silence', 'A Song Probably', 'All clues are useless'], valid: ['All clues are useless'] },
  applemusic: { type: 'choice', prompt: 'Arrange albums chronologically. One album insists it released yesterday.', choices: ['1982 → 1998 → Yesterday', 'Yesterday → 1982 → 1998', 'Time is lying', 'Alphabetical order'], valid: ['Time is lying'] },
  paypal: { type: 'choice', prompt: 'Fake sandbox checkout: choose a payment method.', choices: ['Demo card', 'Demo wallet', 'Imaginary cash', 'All are emotionally unavailable'], valid: ['All are emotionally unavailable'] },
  visa: { type: 'form', prompt: 'Use clearly fake test values only. This form rejects every value and stores nothing.', placeholder: '0000 0000 0000 0000', inputmode: 'numeric', button: 'Try test card' },
  jollibee: { type: 'choice', prompt: 'Build a menu order before the login rider arrives.', choices: ['Chickenjoy', 'Jolly Spaghetti', 'Burger Steak', 'The rider ate it'], valid: ['The rider ate it'] },
  mcdonalds: { type: 'file', prompt: 'Upload a QR image from a demo screen.', accept: 'image/*', notice: 'No image leaves your browser. The scan will be denied either way.' },
  kfc: { type: 'choice', prompt: 'Which secret spice is definitely not secret?', choices: ['Salt', 'Pepper', 'Mystery spice #12', 'Colonel keyboard dust'], valid: ['Mystery spice #12'] },
  starbucks: { type: 'range', prompt: 'Venti recipe: set the imaginary milk slider to 73%. (Ice and shots will complain later.)', min: 0, max: 100, answer: 50, valid: 73 },
  pandesal: { type: 'range', prompt: '🍞 How many fictional breadcrumbs are in this malunggay pandesal? One question every 48 hours.', min: 0, max: 999, answer: 100, valid: -1, cooldown: true },
  settings: { type: 'settings', prompt: 'Scroll the endless iOS-style settings list and find Enable Normal Login.', choices: [...Array(60)].map((_, i) => i === 47 ? 'Enable Normal Login' : ['Wi‑Fi', 'Bluetooth', 'Battery', 'Privacy', 'Wallpaper', 'General'][i % 6] + ' ' + (i + 1)), valid: ['Enable Normal Login'] },
  id: { type: 'form', prompt: 'Demo ID verification supports all countries and documents — but only fictional entries.', placeholder: 'Fictional document number', button: 'Verify demo ID' },
  age: { type: 'range', prompt: 'Enter a fictional age. Under 18 triggers a theatrical, non-destructive self-destruct.', min: 0, max: 100, answer: 18, valid: 19, age: true },
  pdf: { type: 'file', prompt: 'Upload a harmless sample PDF for a fake scanner.', accept: '.pdf,application/pdf', notice: 'The file stays in your browser; sensitive documents are not appropriate here.' },
  fingerprint: { type: 'whack', prompt: 'Whack the cartoon fingerprint eight times.', hits: 0, target: 5 },
  onlyfans: { type: 'nothing', prompt: '…' },
  phub: { type: 'nothing', prompt: '…' },
  winrar: { type: 'choice', prompt: 'Enter your WinRAR license key. Don’t have one?', choices: ['I don’t have one', 'I definitely have one', 'Ask in 2047', 'Close'], valid: ['I don’t have one'] },
  ikea: { type: 'choice', prompt: 'Jigsaw assembly requires 100% perfection. Which piece goes first?', choices: ['Piece A', 'Piece B', 'The lost Allen key', 'Instruction page 47'], valid: ['The lost Allen key'] },
  internetexplorer: { type: 'loading', prompt: 'Dialing 56k… krrrr—beep—shhhhhh…', loading: 'Busy signal. Please try again in 1998.' },
  pldt: { type: 'loading', prompt: 'Loading…', loading: null },
  globe: { type: 'form', prompt: 'Paywall detected. Enter any transaction number.', placeholder: 'Transaction number', button: 'Unlock signal' },
  duolingo: { type: 'endless', prompt: 'Translate “The owl has my router.”', level: 1 },
  barangay: { type: 'choice', prompt: 'Collect five barangay stamps in the wrong order. Start at:', choices: ['Treasurer', 'Health Desk', 'Wrong Window', 'Captain'], valid: ['Wrong Window'] },
  tor: { type: 'choice', prompt: 'Arrange subjects by prerequisites. Every subject requires every other subject.', choices: ['Start anywhere', 'Start nowhere', 'Ask registrar', 'All are correct'], valid: ['All are correct'] },
  nso: { type: 'choice', prompt: 'Spin the wheel to create a fictional certificate character.', choices: ['Captain Breadcrumb', 'Marites the Time Traveler', 'Sir Wi‑Fi', 'Doctor Pancit'], valid: ['Doctor Pancit'] },
  utang: { type: 'choice', prompt: 'Remember who offered the fictional favor. Everyone recalls it differently.', choices: ['Tita’s casserole', 'Ninong’s tricycle fare', 'Classmate’s reviewer', 'Nobody agrees'], valid: ['Nobody agrees'] },
  load: { type: 'form', prompt: 'Enter a phone number to check your load balance.', placeholder: '09XX XXX XXXX', inputmode: 'tel', button: 'Check balance' },
  pisowifi: { type: 'loading', prompt: 'Insert a fake ₱1 coin…', loading: 'Connected for 0.3 seconds.' },
  seen: { type: 'loading', prompt: 'Message sent. Typing…', loading: null },
  approval: { type: 'choice', prompt: 'Submit an admin approval request. You will be emailed when approved.', choices: ['Submit request'], valid: ['Submit request'] },
  jnt: { type: 'form', prompt: 'Enter a parcel number and trust the tracking system at your own risk.', placeholder: 'JNT123456789', button: 'Track parcel' },
  spx: { type: 'form', prompt: 'Track a parcel that has somehow travelled outside your selected country.', placeholder: 'SPXPH123456789', button: 'Track parcel' },
  ligtas: { type: 'choice', prompt: 'Earn a fictional Ligtas Point with a safety check.', choices: ['Wear a helmet', 'Check the exit', 'Do not lick the router', 'All of the above'], valid: ['All of the above'] },
  psychology: { type: 'choice', prompt: 'Existential button study: is the button observing you, or are you observing it?', choices: ['I clicked, therefore I am', 'The button is a mirror', 'Maybe the form remembers me', 'I need a snack'], valid: ['I need a snack'] },
  jackie: { type: 'choice', prompt: 'HAIYAAAA! Which object must be removed from this login stunt?', choices: ['A chair', 'A cloud', 'A login form', 'All three'], valid: ['A chair'] },
  microwave: { type: 'choice', prompt: 'Set an imaginary snack, timer, and power level.', choices: ['Popcorn at 900W', 'Pandesal at 600W', 'Please rotate login', 'All of the above'], valid: ['Please rotate login'] }
})

const activePersona = computed(() => {
  return store.currentUser || DUMMY_USERS[0]
})

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
  if (!store.currentUser) {
    store.setCurrentUser(DUMMY_USERS[0])
  }
})

const toggleTheme = () => {
  document.body.classList.toggle('dark')
  isDark.value = document.body.classList.contains('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const triggerLoginOption = (option) => {
  window.clearTimeout(optionTimer)
  window.clearInterval(googleShuffleTimer)
  activeModal.value = option
  const definition = challengeDefinitions[option.id]
  challenge.value = { ...definition, answer: Array.isArray(definition.answer) ? [] : (definition.answer ?? '') }
  if (option.id === 'pandesal' && store.getCooldown(activePersona.value.id, 'pandesal')) {
    modalResult.value = { outcome: 'failure', message: 'The bakery is cooling down. You can ask another breadcrumb question after 48 hours.' }
    modalState.value = 'result'
    return
  }
  if (definition.type === 'loading') {
    modalState.value = 'loading'
    if (definition.loading) {
      optionTimer = window.setTimeout(() => {
        modalResult.value = { outcome: 'failure', message: definition.loading }
        modalState.value = 'result'
        if (option.id === 'pisowifi') optionTimer = window.setTimeout(closeModal, 300)
      }, option.id === 'pisowifi' ? 1000 : 1600)
    }
    return
  }
  modalState.value = 'challenge'
  if (option.id === 'google') {
    googleShuffleTimer = window.setInterval(() => {
      const choices = challenge.value.choices
      challenge.value.choices = [...choices.slice(1), choices[0]]
    }, 1000)
  }
}

const submitChallenge = (answer) => {
  const user = activePersona.value
  const definition = challengeDefinitions[activeModal.value.id]
  if (definition.type === 'nothing') return
  if (definition.shrinking) {
    definition.maxLength -= 1
    challenge.value.maxLength = definition.maxLength
    challenge.value.answer = ''
    challenge.value.prompt = `The limit changed to ${definition.maxLength}. Type exactly that many characters; clicking Post will reduce it again.`
    return
  }
  if (activeModal.value.id === 'pandesal') store.addCooldown(user.id, 'pandesal', 172800)
  if (definition.age) {
    const passed = Number(answer) > 18
    modalResult.value = { outcome: passed ? 'success' : 'failure', message: passed ? 'Happy birthday! Your fictional adulthood has been acknowledged.' : 'This account self-destructed theatrically. No real account was affected.' }
    store.addLog(user.id, 'login', activeModal.value.id, passed ? 'success' : 'failure', modalResult.value.message)
    modalState.value = 'result'
    return
  }
  const passed = definition.type === 'text'
    ? answer.length === definition.maxLength
    : definition.type === 'google'
      ? [...answer].sort().join('|') === [...definition.valid].sort().join('|')
      : Array.isArray(definition.valid) ? definition.valid.includes(answer) : answer === definition.valid
  const customFailure = {
    visa: 'Test card rejected: it is either too fictional or not fictional enough.',
    globe: 'Invalid transaction number. The paywall remains emotionally unmoved.',
    load: 'Sorry, your load balance is not enough to make the purchase.',
    jnt: ['Your parcel has been thrown to the ocean.', 'Parcel not found.', 'Tracking page is still loading.'][Math.floor(Math.random() * 3)],
    spx: 'Your parcel was last scanned outside the selected country. It is seeing the world.',
    pdf: 'Scanner denied the sample document. Please keep private documents private.',
    mcdonalds: 'Scanning denied. The pretend QR code achieved enlightenment.',
    linkedin: 'Your HTML resume preview was generated. HR will call about this login.',
    approval: 'Approval request submitted. You will be emailed when the admin queue remembers you.',
    winrar: 'Yeah, I figured.',
    microwave: 'Please rotate login.'
  }
  modalResult.value = {
    outcome: passed ? 'success' : 'failure',
    message: passed ? `${activeModal.value.name}: Verification accepted. Your fictional account is now mostly authenticated.` : (customFailure[activeModal.value.id] || `${activeModal.value.name}: Verification denied. The challenge was technically possible, which makes this awkward.`)
  }
  store.addLog(user.id, 'login', activeModal.value.id, passed ? 'success' : 'failure', modalResult.value.message)
  modalState.value = 'result'
}

const closeModal = () => {
  window.clearTimeout(optionTimer)
  window.clearInterval(googleShuffleTimer)
  activeModal.value = null
}

const whackFingerprint = (cell) => {
  if (cell !== challenge.value.target) return
  challenge.value.hits += 1
  challenge.value.target = Math.ceil(Math.random() * 9)
  if (challenge.value.hits >= 8) submitChallenge(true)
}
</script>

<style>
@import "../assets/css/login-options.css";
@import "../assets/css/login-options-map.css";
</style>

<style scoped>
.options-wrapper {
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  padding: 2rem 1rem;
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

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #65676b;
}

body.dark .subtitle {
  color: #b0b3b8;
}

.header-actions {
  display: flex;
  gap: 10px;
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

.dashboard-btn {
  background: #1877f2;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.challenge-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.challenge-prompt {
  margin: 0;
  line-height: 1.5;
}

.challenge-choices {
  display: grid;
  gap: 8px;
}

.challenge-choice,
.challenge-submit {
  border: 0;
  border-radius: 6px;
  padding: 10px 14px;
  background: #1877f2;
  color: white;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.challenge-choice:hover,
.challenge-submit:hover {
  background: #0d65d8;
}

.challenge-input {
  display: grid;
  gap: 8px;
}

.challenge-input textarea {
  width: 100%;
  resize: vertical;
  border: 1px solid #ccd0d5;
  border-radius: 6px;
  padding: 10px;
  font: inherit;
}

.challenge-input input:not([type="range"]),
.challenge-input textarea {
  box-sizing: border-box;
}

.challenge-check {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid #ccd0d5;
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
}

.challenge-check input {
  width: auto;
}

.whack-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.whack-grid button {
  min-height: 56px;
  background: #e4e6eb;
  color: #8b949e;
  font-size: 20px;
}

.whack-grid button.active {
  background: #a65e3e;
  color: white;
}

.whack-grid small {
  grid-column: 1 / -1;
  color: #65676b;
}

.ios-settings {
  max-height: 280px;
  overflow-y: auto;
  border: 1px solid #ccd0d5;
  border-radius: 8px;
}

.ios-settings button {
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-radius: 0;
  border-bottom: 1px solid #e4e6eb;
  background: white;
  color: #1c1e21;
  text-align: left;
}

.ios-settings button:last-child {
  border-bottom: 0;
}

.nothing-state {
  min-height: 120px;
  display: grid;
  place-items: center;
  color: #8b949e;
  font-size: 2rem;
}

.challenge-input input[type="range"] {
  width: 100%;
  accent-color: #1877f2;
}

.challenge-input small {
  color: #65676b;
}

body.dark .challenge-input textarea {
  background: #18191a;
  border-color: #4b4d4f;
  color: #f1f1f1;
}

body.dark .challenge-input small {
  color: #b0b3b8;
}

body.dark .challenge-check,
body.dark .ios-settings {
  border-color: #4b4d4f;
}

body.dark .ios-settings button {
  background: #242526;
  color: #f1f1f1;
  border-color: #3a3b3c;
}

body.dark .whack-grid button {
  background: #3a3b3c;
}

body.dark .whack-grid button.active {
  background: #a65e3e;
}

body.dark .dashboard-btn {
  background: #4599ff;
  color: #18191a;
}
</style>
