document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // DOM Element Selectors
    // =========================================
    const appContainer = document.querySelector('.app-container');
    const chatItems = document.querySelectorAll('.chat-item');
    const folderItems = document.querySelectorAll('.folder-item');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const messageArea = document.getElementById('messageArea');
    const backBtn = document.querySelector('.back-btn');
    const chatTitle = document.querySelector('.chat-title');
    const chatStatus = document.querySelector('.chat-status');
    const menuBtn = document.querySelector('.menu-btn');

    // =========================================
    // 1. Chat List Navigation
    // =========================================
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove 'active' class from all chat items
            chatItems.forEach(chat => chat.classList.remove('active'));
            
            // Add 'active' class to the clicked chat item
            item.classList.add('active');

            // Update the main chat header with the selected chat's info
            const chatName = item.querySelector('.chat-name').textContent;
            const avatar = item.querySelector('.avatar').cloneNode(true);
            avatar.classList.add('small');
            
            const headerInfo = document.querySelector('.chat-header-info');
            headerInfo.querySelector('.avatar').replaceWith(avatar);
            
            if (chatTitle) chatTitle.textContent = chatName;
            if (chatStatus) chatStatus.textContent = 'online'; // Default status for demo

            // Handle Mobile View: Slide in the chat window
            if (window.innerWidth <= 768) {
                appContainer.classList.add('chat-open');
            }
        });
    });

    // =========================================
    // Sidebar Folder Navigation
    // =========================================
    folderItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove 'active' class from all folders
            folderItems.forEach(folder => folder.classList.remove('active'));
            
            // Add 'active' class to clicked folder
            item.classList.add('active');

            // Optional: Mobile sidebar auto-close on selection (if implemented)
            // appContainer.classList.remove('sidebar-open');
        });
    });

    // =========================================
    // Mobile Navigation Controls
    // =========================================
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            appContainer.classList.remove('chat-open');
        });
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            appContainer.classList.toggle('sidebar-open');
        });
    }

    // =========================================
    // 2. Message Sending & UI Interactivity
    // =========================================
    const sendMessage = () => {
        const text = messageInput.value.trim();
        if (text === '') return; // Don't send empty messages

        // Create the message container
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'sent');

        // Create the bubble container
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');

        // Create the text paragraph
        const para = document.createElement('p');
        para.textContent = text;

        // Create the timestamp
        const timeSpan = document.createElement('span');
        timeSpan.classList.add('message-time');
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeSpan.textContent = `${hours}:${minutes}`;

        // Assemble the message
        bubbleDiv.appendChild(para);
        bubbleDiv.appendChild(timeSpan);
        messageDiv.appendChild(bubbleDiv);
        messageArea.appendChild(messageDiv);

        // Clear the input bar
        messageInput.value = '';

        // Scroll to the bottom of the message area smoothly
        messageArea.scrollTo({
            top: messageArea.scrollHeight,
            behavior: 'smooth'
        });

        // Micro-interaction: Send button pulse
        sendBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            sendBtn.style.transform = 'scale(1)';
        }, 150);
    };

    // Event listener for Send Button click
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // Event listener for "Enter" key press inside the input
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent new line on enter
                sendMessage();
            }
        });
    }

    // =========================================
    // Initialize default states
    // =========================================
    // Scroll to bottom on initial load
    if (messageArea) {
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    // Smooth transition styling for send button
    if (sendBtn) {
        sendBtn.style.transition = 'transform 0.15s ease, background 0.3s ease';
    }
});
