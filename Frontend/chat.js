




const chatPopup = document.getElementById('chatPopup');
const chatToggle = document.getElementById('chatToggle');
const chatBody = chatPopup.querySelector('.chat-body');
const chatList = document.getElementById('chatList');
const chatMessages = document.getElementById('chatMessages');

const chats = {
    chat1: [
        { sender: 'other', text: 'Hello! How can I help you?' },
        { sender: 'user', text: 'I want to book an appointment.' },
        { sender: 'other', text: 'Sure, I can help with that.' }
    ],
    chat2: [
        { sender: 'other', text: 'Are you available for a video call?' },
        { sender: 'user', text: 'Yes, I am.' }
    ],
    chat3: [
        { sender: 'other', text: 'Your test results are ready.' },
        { sender: 'user', text: 'Thank you!' }
    ]
};

function renderMessages(chatId) {
    chatMessages.innerHTML = '';
    if (!chats[chatId]) return;
    chats[chatId].forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', msg.sender);
        msgDiv.textContent = msg.text;
        chatMessages.appendChild(msgDiv);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatToggle.addEventListener('click', () => {
    const expanded = chatPopup.classList.toggle('expanded');
    if (expanded) {
        chatBody.style.display = 'flex';
        chatMessages.style.display = 'none';
        // Remove active class from all chat list items
        Array.from(chatList.children).forEach(item => item.classList.remove('active'));
    } else {
        chatBody.style.display = 'none';
    }
});

chatList.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-list-item')) {
        // Remove active class from all
        Array.from(chatList.children).forEach(item => item.classList.remove('active'));
        // Add active class to clicked
        e.target.classList.add('active');
        // Render messages for selected chat
        const chatId = e.target.getAttribute('data-chat');
        renderMessages(chatId);
        chatMessages.style.display = 'flex';
    }
});
