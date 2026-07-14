const chats = [
    {
    id: 1, name: 'User 1', avatar: 'U1', color: 'linear-gradient(135deg, #2aabee, #5eb5f7)',
    online: true, lastSeen: 'Online',
    messages: [
    { text: 'Hello! How are you?', time: '10:30', outgoing: false, read: true },
    { text: 'Building a chat web app!', time: '10:32', outgoing: true, read: true }
    ],
    unread: 0
    },
    {
    id: 2, name: 'Design Team', avatar: 'DT', color: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
    online: false, lastSeen: '5m ago',
    messages: [{ text: 'Meeting at 3 PM', time: 'Yesterday', outgoing: false, read: true }],
    unread: 2
    }
    ];
    const emojiCategories = {
    '😀': ['😀','😃','😄','😁','😆','😅','😂','🙂','😉','😊'],
    '👍': ['👍','👎','👌','✌️','👋','🤝','👏','🙏','💪']
    };
    let currentChatId = null;
    let currentEmojiCategory = Object.keys(emojiCategories)[0];
    let isDark = true;
    const chatList = document.getElementById('chatList');
    const chatContent = document.getElementById('chatContent');
    const emptyState = document.getElementById('emptyState');
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const emojiBtn = document.getElementById('emojiBtn');
    const emojiPicker = document.getElementById('emojiPicker');
    const emojiList = document.getElementById('emojiList');
    const emojiPickerHeader = document.getElementById('emojiPickerHeader');
    const chatHeaderAvatar = document.getElementById('chatHeaderAvatar');
    const chatHeaderName = document.getElementById('chatHeaderName');
    const chatHeaderStatus = document.getElementById('chatHeaderStatus');
    const searchInput = document.getElementById('searchInput');
    const app = document.getElementById('app');
    const backBtn = document.getElementById('backBtn');
    const themeToggle = document.getElementById('themeToggle');
    const toast = document.getElementById('toast');
    function renderChatList(filter = '') {
    chatList.innerHTML = '';
    const filtered = chats.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    filtered.forEach(chat => {
    const lastMsg = chat.messages[chat.messages.length - 1];
    const item = document.createElement('div');
    item.className = 'chat-item' + (chat.id === currentChatId ? ' active' : '');
    item.innerHTML = `
    <div class="avatar" style="background:${chat.color}">${chat.avatar}${chat.online ? '<div class="avatar-online"></div>' : ''}</div>
    <div class="chat-info">
    <div class="chat-info-top"><span class="chat-name">${chat.name}</span><span class="chat-time">${lastMsg ? lastMsg.time : ''}</span></div>
    <div class="chat-info-bottom"><span class="chat-last-message">${lastMsg ? lastMsg.text : ''}</span>${chat.unread > 0 ? `<span class="unread-badge">${chat.unread}</span>` : ''}</div>
    </div>`;
    item.onclick = () => selectChat(chat.id);
    chatList.appendChild(item);
    });
    }
    function selectChat(chatId) {
    currentChatId = chatId;
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    chat.unread = 0;
    emptyState.style.display = 'none';
    chatContent.style.display = 'flex';
    chatHeaderAvatar.textContent = chat.avatar;
    chatHeaderAvatar.style.background = chat.color;
    chatHeaderName.textContent = chat.name;
    chatHeaderStatus.textContent = chat.online ? 'Online' : chat.lastSeen;
    renderMessages(chat);
    renderChatList(searchInput.value);
    app.classList.add('show-chat');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    messageInput.focus();
    }
    function renderMessages(chat) {
    messagesContainer.innerHTML = '';
    chat.messages.forEach(msg => {
    const group = document.createElement('div');
    group.className = `message-group ${msg.outgoing ? 'outgoing' : 'incoming'}`;
    const message = document.createElement('div');
    message.className = `message ${msg.outgoing ? 'outgoing' : 'incoming'}`;
    message.innerHTML = `${msg.text}<span class="message-time">${msg.time}</span>`;
    group.appendChild(message);
    messagesContainer.appendChild(group);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentChatId) return;
    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    chat.messages.push({ text, time, outgoing: true, read: true });
    messageInput.value = '';
    sendBtn.disabled = true;
    renderMessages(chat);
    renderChatList(searchInput.value);
    }
    sendBtn.onclick = sendMessage;
    messageInput.oninput = () => sendBtn.disabled = !messageInput.value.trim();
    renderChatList();
    lucide.createIcons();

