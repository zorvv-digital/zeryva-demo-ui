const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const micSendIcon = document.getElementById('mic-send-icon');
const chatContainer = document.getElementById('chat-container');
const userDp = document.getElementById('user-dp');
const userName = document.getElementById('user-name');

const pathSegments = window.location.pathname.split('/').filter(Boolean);
let projectId = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';

// Fallback to query parameter if path is just the index file or empty
if (!projectId || projectId === 'index.html') {
  const urlParams = new URLSearchParams(window.location.search);
  projectId = urlParams.get('project_id') || projectId;
}

console.log("Using Project ID:", projectId);

if (projectId) {
  fetch(`/api/v1/projects/${projectId}`)
    .then(res => res.json())
    .then(data => {
      if (data.name) userName.textContent = data.name;
      if (data.image_url) userDp.src = data.image_url;
    })
    .catch(err => console.error('Error fetching project:', err));
}

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

// API receive reply
async function receiveReply(originalMessage) {
  const typingId = 'typing-' + Date.now();
  const typingHtml = `
    <div class="message-box friend-message" id="${typingId}" style="opacity: 0; transform: translateY(10px); animation: fadeIn 0.3s forwards;">
      <p class="typing-indicator">
        <span></span><span></span><span></span>
      </p>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', typingHtml);
  scrollToBottom();

  let responseText = "Sorry, I couldn't reach the server right now.";
  try {
    if (!projectId || projectId === 'index.html') {
      console.warn("No project ID found in URL. Cannot call API.");
      responseText = "Error: Project ID is missing from the URL. Please add ?project_id=YOUR_ID to the URL.";
    } else {
      const res = await fetch(`/api/v1/projects/${projectId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: originalMessage })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          responseText = data.response;
        }
      } else {
        console.error("Backend returned error status:", res.status);
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }

  const typingElement = document.getElementById(typingId);
  if (typingElement) typingElement.remove();

  const friendMessageHtml = `
    <div class="message-box friend-message" style="opacity: 0; transform: translateY(10px); animation: fadeIn 0.3s forwards;">
      <p>${responseText}<br><span>${getCurrentTime()}</span></p>
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
