const toggleBtn = document.getElementById('themeToggle');
const loginBtn = document.getElementsByClassName('login-btn');
const body = document.body;

// -------

// This is to turn off/on the dark mode.

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark');
  
  // Optional: Save preference to local storage
  if (body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
}

// -------

// We need a separate js for separate functions for different methods on resetting password lol
// ARE WE DEADASS SERIOUS ON THIS TwT