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
    const backBtn = document.getElementById('backBtn');
    const menuBtn = document.getElementById('menuBtn');
    const chatTitle = document.querySelector('.chat-title');
    const searchInput = document.getElementById('searchInput');

    // Settings Modal Selectors
    const settingsModal = document.getElementById('settingsModal');
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const languageSelect = document.getElementById('languageSelect');

    // =========================================
    // 1. Settings Modal & UI Toggles
    // =========================================
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }

    // Close modal if clicking outside the content
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.add('hidden');
            }
        });
    }

    // Dark Mode / Luxury Theme Toggle
    if (darkModeToggle) {
        // Load saved preference
        const savedDarkMode = localStorage.getItem('luxDarkMode');
        if (savedDarkMode === 'false') {
            document.body.classList.remove('dark-mode');
            darkModeToggle.checked = false;
        } else {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('luxDarkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('luxDarkMode', 'false');
            }
        });
    }

    // Language Selection Logic
    if (languageSelect) {
        const savedLang = localStorage.getItem('luxLang') || 'en';
        languageSelect.value = savedLang;

        const translations = {
            en: { search: 'Search', message: 'Message', settings: 'Settings' },
            es: { search: 'Buscar', message: 'Mensaje', settings: 'Ajustes' },
            fr: { search: 'Rechercher', message: 'Message', settings: 'Paramètres' },
            de: { search: 'Suche', message: 'Nachricht', settings: 'Einstellungen' }
        };

        const applyLanguage = (lang) => {
            const dict = translations[lang] || translations.en;
            if (searchInput) searchInput.placeholder = dict.search;
            if (messageInput) messageInput.placeholder = dict.message;
            const modalTitle = document.querySelector('.modal-header h2');
            if (modalTitle) modalTitle.textContent = dict.settings;
        };

        // Apply on load
        applyLanguage(savedLang);

        // Apply on change
        languageSelect.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            localStorage.setItem('luxLang', selectedLang);
            applyLanguage(selectedLang);
        });
    }

    // =========================================
    // 2. PWA Install Logic
    // =========================================
    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the default browser mini-infobar
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show custom install button
        showInstallPromotion();
    });

    function showInstallPromotion() {
        // Check if button already exists
        if (document.getElementById('pwaInstallBtn')) return;

        const installBtn = document.createElement('button');
        installBtn.id = 'pwaInstallBtn';
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
            // Hide the app provided install promotion
            installBtn.style.display = 'none';
            
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                // We've used the prompt, and can't use it again, throw it away
                deferredPrompt = null;
                // Remove button permanently after prompt handled
                installBtn.remove();
            }
        });

        // Add hover effect via JS
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
        // Hide the app-provided install promotion
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) installBtn.remove();
        console.log('PWA was installed');
    });

    // =========================================
    // 3. Chat List Navigation
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
            const oldAvatar = headerInfo.querySelector('.avatar');
            if (oldAvatar) oldAvatar.replaceWith(avatar);
            
            if (chatTitle) chatTitle.textContent = chatName;

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
    // 4. Message Sending & UI Interactivity
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
