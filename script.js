
//Create a UserAccount class
class UserAccount {
    constructor(userId, pin, balance = 1000) {
      this.userId = userId;
      this.pin = pin;
      this.balance = balance;
    }
  
    deposit(amount) {
      if (amount > 0) {
        this.balance += amount;
        alert(`Deposited $${amount}`);
      } else {
        alert("Invalid deposit amount.");
      }
    }
  
    withdraw(amount) {
      if (amount > 0 && amount <= this.balance) {
        this.balance -= amount;
        alert(`Withdraw $${amount}`);
      } else if (amount > this.balance) {
        alert("Insufficient funds.");
      } else {
        alert("Invalid withdrawal amount.");
      }
    }
  
    credit(amount) {
      if (amount > 0) {
        this.balance += amount;
        alert(`Credited $${amount}`);
      } else {
        alert("Invalid credit amount.");
      }
    }
  
    checkBalance() {
      return this.balance;
    }
  
    changeCredentials(newUserId, newPin) {
      this.userId = newUserId;
      this.pin = newPin;
      alert("User ID and PIN changed successfully.");
    }
  }
  
  //Initialize an account
  let currentAccount = new UserAccount("user123", "1234");
  
  // DOM Elements
  const loginSection = document.getElementById("login-section");
  const atmSection = document.getElementById("atm-section");
  const loginMessage = document.getElementById("login-message");
  const welcomeMessage = document.getElementById("welcome-message");
  const balanceDisplay = document.getElementById("balance");
  const userIdInput = document.getElementById("user-id");
  const pinInput = document.getElementById("pin");
  const amountInput = document.getElementById("amount");
  const addUser = document.getElementById("add-user")
  
  //Login Functionality
  document.getElementById("login-btn").addEventListener("click", () => {
    const enteredUserId = userIdInput.value;
    const enteredPin = pinInput.value;
  
    if (enteredUserId === currentAccount.userId && enteredPin === currentAccount.pin) {
      loginSection.style.display = "none";
      atmSection.style.display = "block";
      welcomeMessage.textContent = `Welcome, ${currentAccount.userId}!`;
      updateBalance();
    } else {
      alert("Invalid User ID or PIN.");
    }
  });
  
  //ATM Functionalities
  document.getElementById("deposit").addEventListener("click", () => {
    const amount = parseFloat(amountInput.value);
    currentAccount.deposit(amount);
    updateBalance();
  });
  
  document.getElementById("withdraw").addEventListener("click", () => {
    const amount = parseFloat(amountInput.value);
    currentAccount.withdraw(amount);
    updateBalance();
  });
  
  document.getElementById("credit").addEventListener("click", () => {
    const amount = parseFloat(amountInput.value);
    currentAccount.credit(amount);
    updateBalance();
  });
  
  document.getElementById("check-balance").addEventListener("click", () => {
    alert(`Your current balance is $${currentAccount.checkBalance()}`);
  });
  
  document.getElementById("exit").addEventListener("click", () => {
    atmSection.style.display = "none";
    loginSection.style.display = "block";
    userIdInput.value = "";
    pinInput.value = "";
  });
  
  document.getElementById("change-credentials").addEventListener("click", () => {
    const newUserId = prompt("Enter new User ID:");
    const newPin = prompt("Enter new PIN:");
    currentAccount.changeCredentials(newUserId, newPin);
  });
  // Add a new button for saving data
const saveDataBtn = document.createElement("button");
saveDataBtn.textContent = "Save Data to File";
document.getElementById("atm-section").appendChild(saveDataBtn);

// Function to generate and download the file
function saveDataToFile() {
  const data = JSON.stringify({
    userId: currentAccount.userId,
    pin: currentAccount.pin,
    balance: currentAccount.balance,
  }, null, 2); // Pretty print JSON
  
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  //Create a temporary anchor element to download the file
  const a = document.createElement("a");
  a.href = url;
  a.download = "atm_data.json"; // File name
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

//function to add new user
function addNewUser() {
  const newUserId = prompt("Enter new User ID:");
  const newPin = prompt("Enter new PIN:");
  const initialBalance = parseFloat(prompt("Enter initial balance:"));

  if (newUserId && newPin && !isNaN(initialBalance) && initialBalance >= 0) {
    currentAccount = new UserAccount(newUserId, newPin, initialBalance);
    alert("New user added successfully.");
    loginSection.style.display = "none";
    atmSection.style.display = "block";
    welcomeMessage.textContent = `Welcome, ${currentAccount.userId}!`;
    updateBalance();
  } else {
    alert("Invalid input. Please try again.");
  }
}

addUser.addEventListener("click", addNewUser);

// Add event listener for saving data
saveDataBtn.addEventListener("click", saveDataToFile);

