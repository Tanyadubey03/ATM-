// Updated UserAccount class to handle multiple accounts
class UserAccount {
  constructor(userId, pin, balance = 1000) {
    this.userId = userId;
    this.pin = pin;
    this.balance = balance;
  }

  static loadFromStorage() {
    const savedData = localStorage.getItem("userAccounts");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return parsedData.map(
        (account) => new UserAccount(account.userId, account.pin, account.balance)
      );
    }
    return [];
  }

  static saveToStorage(accounts) {
    const data = JSON.stringify(accounts);
    localStorage.setItem("userAccounts", data);
  }

  static addAccount(userId, pin, balance = 1000) {
    const accounts = UserAccount.loadFromStorage();
    const newAccount = new UserAccount(userId, pin, balance);
    accounts.push(newAccount);
    UserAccount.saveToStorage(accounts);
    return newAccount;
  }
}

// Default account for user
const defaultAccount = UserAccount.addAccount("defaultUser", "password123", 1000);

// Load accounts
let accounts = UserAccount.loadFromStorage();
let currentAccount = null;

// DOM Elements
const loginSection = document.getElementById("login-section");
const atmSection = document.getElementById("atm-section");
const loginMessage = document.getElementById("login-message");
const welcomeMessage = document.getElementById("welcome-message");
const balanceDisplay = document.getElementById("balance");
const userIdInput = document.getElementById("user-id");
const pinInput = document.getElementById("pin");
const amountInput = document.getElementById("amount");
const addUser = document.getElementById("add-user");

// Login Functionality
document.getElementById("login-btn").addEventListener("click", () => {
  const enteredUserId = userIdInput.value;
  const enteredPin = pinInput.value;

  currentAccount = accounts.find(
    (account) => account.userId === enteredUserId && account.pin === enteredPin
  );

  if (currentAccount) {
    loginSection.style.display = "none";
    atmSection.style.display = "block";
    welcomeMessage.textContent = `Welcome, ${currentAccount.userId}!`;
    updateBalance();
  } else {
    alert("Invalid User ID or PIN.");
  }
});

// ATM Functionalities
document.getElementById("deposit").addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);
  if (currentAccount && amount > 0) {
    currentAccount.balance += amount;
    alert(`Deposited $${amount}`);
    UserAccount.saveToStorage(accounts);
    updateBalance();
  } else {
    alert("Invalid deposit amount.");
  }
});

document.getElementById("withdraw").addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);
  if (currentAccount && amount > 0 && amount <= currentAccount.balance) {
    currentAccount.balance -= amount;
    alert(`Withdrew $${amount}`);
    UserAccount.saveToStorage(accounts);
    updateBalance();
  } else if (amount > currentAccount.balance) {
    alert("Insufficient funds.");
  } else {
    alert("Invalid withdrawal amount.");
  }
});

document.getElementById("check-balance").addEventListener("click", () => {
  if (currentAccount) {
    alert(`Your current balance is $${currentAccount.balance}`);
  }
});

document.getElementById("exit").addEventListener("click", () => {
  atmSection.style.display = "none";
  loginSection.style.display = "block";
  userIdInput.value = "";
  pinInput.value = "";
});

document.getElementById("change-credentials").addEventListener("click", () => {
  if (currentAccount) {
    const newUserId = prompt("Enter new User ID:");
    const newPin = prompt("Enter new PIN:");
    if (newUserId && newPin) {
      currentAccount.userId = newUserId;
      currentAccount.pin = newPin;
      alert("User ID and PIN changed successfully.");
      UserAccount.saveToStorage(accounts);
    } else {
      alert("Invalid input.");
    }
  }
});

// Function to update the balance on the page
function updateBalance() {
  if (currentAccount) {
    balanceDisplay.textContent = `Balance: $${currentAccount.balance}`;
  }
}

// Function to add a new user
function addNewUser() {
  const newUserId = prompt("Enter new User ID:");
  const newPin = prompt("Enter new PIN:");
  const initialBalance = parseFloat(prompt("Enter initial balance:"));

  if (newUserId && newPin && !isNaN(initialBalance) && initialBalance >= 0) {
    const newAccount = UserAccount.addAccount(newUserId, newPin, initialBalance);
    accounts.push(newAccount);
    alert("New user added successfully.");
    loginSection.style.display = "none";
    atmSection.style.display = "block";
    currentAccount = newAccount;
    welcomeMessage.textContent = `Welcome, ${currentAccount.userId}!`;
    updateBalance();
  } else {
    alert("Invalid input. Please try again.");
  }
}

addUser.addEventListener("click", addNewUser);

// Add Save Data Button
const saveDataBtn = document.createElement("button");
saveDataBtn.textContent = "Save Data to File";
document.getElementById("atm-section").appendChild(saveDataBtn);

// Function to generate and download the file
function saveDataToFile() {
  const data = JSON.stringify(accounts, null, 2); // Pretty print JSON

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element to download the file
  const a = document.createElement("a");
  a.href = url;
  a.download = "atm_data.json"; // File name
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Add event listener for saving data
saveDataBtn.addEventListener("click", saveDataToFile);
