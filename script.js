// Function to generate a password
function generatePassword() {
  let dictionary = "";
  
  // Get user-selected character sets
  if (document.getElementById("lowercaseCb").checked) {
      dictionary += "abcdefghijklmnopqrstuvwxyz";
  }
  if (document.getElementById("uppercaseCb").checked) {
      dictionary += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (document.getElementById("digitsCb").checked) {
      dictionary += "0123456789";
  }
  if (document.getElementById("specialsCb").checked) {
      dictionary += "!@#$%^&*()_+-={}[];<>:";
  }

  const length = document.querySelector('input[type="range"]').value;
  const passwordField = document.querySelector('input[type="text"]');

  // If no options are selected, show a warning
  if (dictionary.length === 0) {
      passwordField.value = "⚠ Select at least one option";
      return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
      const pos = Math.floor(Math.random() * dictionary.length);
      password += dictionary.charAt(pos);
  }

  passwordField.value = password;
}

// Function to copy the password to clipboard
function copyToClipboard() {
  const passwordField = document.querySelector('input[type="text"]');
  const copyButton = document.querySelector("div.password button");

  if (passwordField.value === "⚠ Select at least one option" || passwordField.value === "") return;

  navigator.clipboard.writeText(passwordField.value).then(() => {
      copyButton.textContent = "Copied!";
      copyButton.style.background = "#FFD700"; // Darker green for effect

      setTimeout(() => {
          copyButton.textContent = "Copy";
          copyButton.style.background = "#8B0000";
      }, 1200);
  });
}

// Event Listeners
document.querySelectorAll('input[type="checkbox"], button.generate')
  .forEach(elem => elem.addEventListener("click", generatePassword));

document.querySelector('input[type="range"]').addEventListener("input", (e) => {
  document.querySelector("div.range span").textContent = e.target.value;
  generatePassword();
});

document.querySelector("div.password button").addEventListener("click", copyToClipboard);

// Generate a password on page load
generatePassword();
