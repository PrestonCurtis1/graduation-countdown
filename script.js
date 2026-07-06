document.addEventListener("DOMContentLoaded", function () {
  initializeCountdown();
});
let currentYear = new Date().getFullYear();
let graduationDate = `${currentYear}-07-22`;
let interval;
console.log(`Date is currently set to: ${graduationDate}.`);
function initializeCountdown(){
  let header = document.createElement("h1");
  header.innerText = "Graduation Countdown";

  let headerDiv = document.createElement("div");
  headerDiv.id = "header";
  headerDiv.appendChild(header);
  document.body.appendChild(headerDiv);

  let paragraph = document.createElement("p");
  paragraph.id = "countdown-display";
  paragraph.innerText = "Start the Countdown";

  let startBtn = document.createElement("button");
  startBtn.id = "start";
  startBtn.setAttribute("onclick", "startCountdown(graduationDate);");
  startBtn.innerText = "Start";
  let stopBtn = document.createElement("button");
  stopBtn.id = "stop";
  stopBtn.setAttribute("onclick", "clearInterval(interval);");
  stopBtn.innerText = "Stop";
  let setBtn = document.createElement("button");
  setBtn.id = "set";
  setBtn.setAttribute("onclick", "endCountdown();");
  setBtn.innerText = "Set 0";
  
  let countdownDiv = document.createElement("div");
  countdownDiv.id = "countdown"
  countdownDiv.appendChild(paragraph);
  countdownDiv.appendChild(startBtn);
  countdownDiv.appendChild(stopBtn);
  countdownDiv.appendChild(setBtn);
  document.body.appendChild(countdownDiv);
}

function startCountdown(endDate){
  clearInterval(interval);
  let difference = getDifference(endDate);
  updateCountdown(difference);
  interval = setInterval(function () {
    updateCountdown(getDifference(endDate));
  },1000);
}

function updateCountdown(difference){
  if (difference != null){
    let output = "";
    output += `<span id="years"><b>${difference.years}</b> years</span>`;
    output += `<span id="months"><b>${difference.months}</b> months</span>`;
    output += `<span id="days"><b>${difference.days}</b> days</span>`;
    output += `<span id="hours"><b>${difference.hours}</b> hours</span>`;
    output += `<span id="minutes"><b>${difference.minutes}</b> minutes</span>`;
    output += `<span id="seconds"><b>${difference.seconds}</b> seconds</span>`;
    let display = document.getElementById("countdown-display");
    display.innerHTML = output;
  } else {
    endCountdown();
  }
}

async function endCountdown(){
  clearInterval(interval)
  let display = document.getElementById("countdown-display");
  display.innerText = await fetchCelebrationMessagePromise();
  rainConfetti(1000);
} 

function rainConfetti(totalParticles) {  
  // A palette of vibrant party colors
  const colors = ['#FFC107', '#FF5722', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#4CAF50'];

  for (let i = 0; i < totalParticles; i++) {
    // Pick one random color from the palette for this specific particle
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    confetti({
      particleCount: 1,          
      startVelocity: 0,          
      gravity: 1.1,              
      ticks: 250,                
      spread: 20,                
      colors: [randomColor],     // Pass the single random color in an array
      origin: { 
        x: Math.random(),        
        y: Math.random() * -0.5  
      }
    });
  }
}

function getDifference(endDate){
  let countdownDate = new Date(endDate);
  let currentDate = new Date();
  if (countdownDate < currentDate) return null;
  let years = countdownDate.getFullYear() - currentDate.getFullYear();
  let months = countdownDate.getMonth() - currentDate.getMonth();
  if (months < 0 || (months === 0 && countdownDate.getDate() < currentDate.getDate())) {
    years--;
    months = (months + 12) % 12;
  }
  if (countdownDate.getDate() < currentDate.getDate()) {
    months--;
  }
  let days = countdownDate.getDate() - currentDate.getDate();
  if (days < 0) {
    let prevMonth = new Date(countdownDate.getFullYear(), countdownDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  let diffMs = countdownDate - currentDate;
  let hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  return { years, months, days, hours, minutes, seconds };
}

/* ===================================================================
1. CALLBACK VERSION (COMMENTED OUT)
===================================================================

function fetchCelebrationMessageCallback(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'celebrations.json', true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const messages = JSON.parse(xhr.responseText);
        
        // Select a random message from the array
        const randomIndex = Math.floor(Math.random() * messages.length);
        const selectedMessage = messages[randomIndex];
        
        // Return the message via the callback
        callback(null, selectedMessage);
      } catch (error) {
        callback(new Error("Failed to parse JSON"), null);
      }
    } else {
      callback(new Error(`Request failed with status: ${xhr.status}`), null);
    }
  };

  xhr.onerror = function () {
    callback(new Error("Network connection error"), null);
  };

  xhr.send();
}

// Example usage of the callback version:
// fetchCelebrationMessageCallback((error, message) => {
//   if (!error) {
//     document.getElementById('celebration-span').textContent = message;
//   }
// });
*/


// ===================================================================
// 2. PROMISE VERSION
// ===================================================================

function fetchCelebrationMessagePromise() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'celebrations.json', true);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const messages = JSON.parse(xhr.responseText);
          
          // Select a random message from the array
          const randomIndex = Math.floor(Math.random() * messages.length);
          const selectedMessage = messages[randomIndex];
          
          resolve(selectedMessage);
        } catch (error) {
          reject(new Error("Failed to parse JSON data"));
        }
      } else {
        reject(new Error(`Request failed with status: ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network connection error"));
    };

    xhr.send();
  });
}