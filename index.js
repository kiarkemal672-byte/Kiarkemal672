document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // 1. Safe Event Listener Helper
    // Prevents crashes if an element is missing
    // =========================================
    function on(id, event, callback) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener(event, callback);
        } else {
            console.warn(`Element with ID '${id}' not found in the DOM.`);
        }
    }

    // =========================================
    // 2. DOM Element References
    // =========================================
    const appContainer = document.querySelector('.app-container');
    const settingsModal = document.getElementById('settings-modal');
    const messageInput = document.getElementById('message-input');
    const messageArea = document.getElementById('message-area');
    const chatHeaderName = document.getElementById('chat-header-name');
    const chatHeaderAvatar = document.getElementById('chat-header-avatar');

    // =========================================
    // 3. Settings Modal & UI Toggles
    // =========================================
    on('btn-settings', 'click', () => {
        if (settingsModal) settingsModal.classList.remove('hidden');
    });

    on('btn-close-settings', 'click', () => {
        if (settingsModal) settingsModal.classList.add('hidden');
    });

    // Close modal if clicking outside the content
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.add('hidden');
            }
        });
    }

    // Dark Mode / Luxury Theme Toggle
    on('dark-mode-toggle', 'change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('luxDarkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('luxDarkMode', 'false');
        }
    });

    // Load saved Dark Mode preference
    const savedDarkMode = localStorage.getItem('luxDarkMode');
    const darkToggle = document.getElementById('dark-mode-toggle');
    if (darkToggle) {
        if (savedDarkMode === 'false') {
            document.body.classList.remove('dark-mode');
            darkToggle.checked = false;
        } else {
            document.body.classList.add('dark-mode');
            darkToggle.checked = true;
        }
    }

    // Language Selection Logic
    on('language-select', 'change', (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem('luxLang', selectedLang);
        applyLanguage(selectedLang);
    });

    function applyLanguage(lang) {
        const translations = {
            en: { search: 'Search', message: 'Message', settings: 'Settings' },
            es: { search: 'Buscar', message: 'Mensaje', settings: 'Ajustes' },
            fr: { search: 'Rechercher', message: 'Message', settings: 'Paramètres' },
            de: { search: 'Suche', message: 'Nachricht', settings: 'Einstellungen' }
        };
        const dict = translations[lang] || translations.en;
        
        const searchInput = document.getElementById('search-input');
        const settingsTitle = document.getElementById('settings-title');
        
        if (searchInput) searchInput.placeholder = dict.search;
        if (messageInput) messageInput.placeholder = dict.message;
        if (settingsTitle) settingsTitle.textContent = dict.settings;
    }

    // Apply saved language on load
    const savedLang = localStorage.getItem('luxLang') || 'en';
    const langSelect = document.getElementById('language-select');
    if (langSelect) langSelect.value = savedLang;
    applyLanguage(savedLang);

    // =========================================
    // 4. PWA Install Logic
    // =========================================
    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPromotion();
    });

    function showInstallPromotion() {
        if (document.getElementById('pwa-install-btn')) return;

        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.innerHTML = '⬇ Install App';
        
        // Premium Gold/Black Styling matching the theme
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #F4D03F, #D4AF37);
            color: #000;
            border: none;
            padding: 12px 24px;
            border-radius: 30px;
            font-weight: 700;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.5);
            z-index: 9999;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        document.body.appendChild(installBtn);

        installBtn.addEventListener('click', async () => {
            installBtn.style.display = 'none';
            
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
                installBtn.remove();
            }
        });

        installBtn.addEventListener('mouseenter', () => {
            installBtn.style.transform = 'translateX(-50%) scale(1.05)';
            installBtn.style.boxShadow = '0 6px 25px rgba(212, 175, 55, 0.7)';
        });
        installBtn.addEventListener('mouseleave', () => {
            installBtn.style.transform = 'translateX(-50%) scale(1)';
            installBtn.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.5)';
        });
    }

    window.addEventListener('appinstalled', () => {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) installBtn.remove();
        console.log('PWA was installed');
    });

    // =========================================
    // 5. Chat List Navigation
    // =========================================
    const chatItems = ['chat-item-1', 'chat-item-2', 'chat-item-3', 'chat-item-4'];
    
    chatItems.forEach(id => {
        on(id, 'click', () => {
            // Remove 'active' class from all chat items
            document.querySelectorAll('.chat-item').forEach(chat => chat.classList.remove('active'));
            
            // Add 'active' class to the clicked chat item
            const clickedItem = document.getElementById(id);
            clickedItem.classList.add('active');

            // Update the main chat header with the selected chat's info
            const chatName = clickedItem.querySelector('.chat-name').textContent;
            const avatar = clickedItem.querySelector('.avatar').cloneNode(true);
            avatar.classList.add('small');
            
            if (chatHeaderAvatar) {
                chatHeaderAvatar.replaceWith(avatar);
                // Re-assign the variable because we replaced the node
                // Actually, we need to update the ID on the new node so future replacements work
                avatar.id = 'chat-header-avatar';
            }
            
            if (chatHeaderName) chatHeaderName.textContent = chatName;

            // Handle Mobile View: Slide in the chat window
            if (window.innerWidth <= 768 && appContainer) {
                appContainer.classList.add('chat-open');
            }
        });
    });

    // =========================================
    // 6. Sidebar Folder Navigation
    // =========================================
    const folders = ['folder-all', 'folder-work', 'folder-family', 'folder-saved'];
    
    folders.forEach(id => {
        on(id, 'click', () => {
            // Remove 'active' class from all folders
            document.querySelectorAll('.folder-item').forEach(folder => folder.classList.remove('active'));
            
            // Add 'active' class to clicked folder
            const clickedFolder = document.getElementById(id);
            clickedFolder.classList.add('active');
        });
    });

    // =========================================
    // 7. Mobile Navigation Controls
    // =========================================
    on('btn-back', 'click', () => {
        if (appContainer) appContainer.classList.remove('chat-open');
    });

    on('btn-menu', 'click', () => {
        if (appContainer) appContainer.classList.toggle('sidebar-open');
    });

    // =========================================
    // 8. Message Sending & UI Interactivity
    // =========================================
    function sendMessage() {
        if (!messageInput || !messageArea) return;

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
        const sendBtn = document.getElementById('btn-send');
        if (sendBtn) {
            sendBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                sendBtn.style.transform = 'scale(1)';
            }, 150);
        }
    }

    // Event listener for Send Button click
    on('btn-send', 'click', sendMessage);

    // Event listener for "Enter" key press inside the input
    on('message-input', 'keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent new line on enter
            sendMessage();
        }
    });

    // =========================================
    // 9. Initialize default states
    // =========================================
    // Scroll to bottom on initial load
    if (messageArea) {
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    // Smooth transition styling for send button
    const sendBtn = document.getElementById('btn-send');
    if (sendBtn) {
        sendBtn.style.transition = 'transform 0.15s ease, background 0.3s ease';
    }
});
