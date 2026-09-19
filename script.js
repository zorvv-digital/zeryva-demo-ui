const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const micSendIcon = document.getElementById('mic-send-icon');
const chatContainer = document.getElementById('chat-container');

// Toggle between Mic and Send icon based on input length
messageInput.addEventListener('input', () => {
  if (messageInput.value.trim().length > 0) {
    micSendIcon.classList.remove('fa-microphone');
    micSendIcon.classList.add('fa-paper-plane');
  } else {
    micSendIcon.classList.remove('fa-paper-plane');
    micSendIcon.classList.add('fa-microphone');
  }
});

// Format current time
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
}

// Handle sending message
function sendMessage() {
  const text = messageInput.value.trim();
  if (text.length === 0) return;

  // Add my message
  const myMessageHtml = `
    <div class="message-box my-message" style="opacity: 0; transform: translateY(10px); animation: fadeIn 0.3s forwards;">
      <p>${text}<br><span>${getCurrentTime()}</span></p>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', myMessageHtml);
  
  // Clear input
  messageInput.value = '';
  micSendIcon.classList.remove('fa-paper-plane');
  micSendIcon.classList.add('fa-microphone');
  
  scrollToBottom();

  // Mock reply after a short delay
  setTimeout(() => {
    receiveReply(text);
  }, 1000 + Math.random() * 1500);
}

// Mock receive reply
function receiveReply(originalMessage) {
  const replies = [
    "That's interesting! Tell me more.",
    "Haha, yeah exactly!",
    "I'll have to get back to you on that.",
    "Sounds like a plan.",
    "Got it.",
    "Sure thing!",
    "What do you mean by that?",
    "Okay!"
  ];
  
  const randomReply = replies[Math.floor(Math.random() * replies.length)];
  
  const friendMessageHtml = `
    <div class="message-box friend-message" style="opacity: 0; transform: translateY(10px); animation: fadeIn 0.3s forwards;">
      <p>${randomReply}<br><span>${getCurrentTime()}</span></p>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', friendMessageHtml);
  
  scrollToBottom();
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Add CSS animation for fading in messages
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Event listeners
sendBtn.addEventListener('click', () => {
  if (micSendIcon.classList.contains('fa-paper-plane')) {
    sendMessage();
  } else {
    alert('Microphone feature not implemented in mock.');
  }
});

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Scroll to bottom on load
scrollToBottom();

// Demo call buttons
const videoCallBtn = document.getElementById('video-call-btn');
const audioCallBtn = document.getElementById('audio-call-btn');

videoCallBtn.addEventListener('click', () => {
  alert('Starting Video Call Demo...');
});

audioCallBtn.addEventListener('click', () => {
  alert('Starting Voice Call Demo...');
});
