// Simplified AI-Enhanced Bookstore Features
// Dark Mode + Chat Widget

document.addEventListener('DOMContentLoaded', function () {
    initDarkMode();
    initChatWidget();
});

// ============================================
// DARK MODE
// ============================================

function initDarkMode() {
    const btn = document.createElement('button');
    btn.id = 'dark-mode-toggle';
    const isDark = localStorage.getItem('darkMode') === 'enabled';

    btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    btn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px;
        width: 50px; height: 50px; border-radius: 50%; border: none;
        color: white; cursor: pointer; z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.4); font-size: 1.2rem;
        background: ${isDark ? 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)' : 'linear-gradient(135deg, #434343 0%, #000000 100%)'};
    `;
    document.body.appendChild(btn);

    if (isDark) applyDarkMode();

    btn.addEventListener('click', function () {
        const currentlyDark = document.body.classList.contains('dark-mode');
        if (currentlyDark) {
            document.body.classList.remove('dark-mode');
            btn.innerHTML = '<i class="fas fa-moon"></i>';
            btn.style.background = 'linear-gradient(135deg, #434343 0%, #000000 100%)';
            localStorage.setItem('darkMode', 'disabled');
        } else {
            applyDarkMode();
            btn.innerHTML = '<i class="fas fa-sun"></i>';
            btn.style.background = 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)';
            localStorage.setItem('darkMode', 'enabled');
        }
    });
}

function applyDarkMode() {
    document.body.classList.add('dark-mode');
    if (document.getElementById('dark-mode-styles')) return;

    const style = document.createElement('style');
    style.id = 'dark-mode-styles';
    style.textContent = `
        body.dark-mode { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important; color: #e0e0e0 !important; }
        body.dark-mode .navbar { background: linear-gradient(135deg, #0f3460 0%, #16213e 100%) !important; }
        body.dark-mode .card { background: #1e2a38 !important; color: #e0e0e0 !important; border-color: #2d3e50 !important; }
        body.dark-mode .card-text { color: #b0b0b0 !important; }
        body.dark-mode footer { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%) !important; }
        body.dark-mode .form-control { background: #1e2a38 !important; color: #e0e0e0 !important; border-color: #2d3e50 !important; }
        body.dark-mode .alert { background: #1e2a38 !important; color: #e0e0e0 !important; border-color: #2d3e50 !important; }
        body.dark-mode h1, body.dark-mode h2, body.dark-mode h3,
        body.dark-mode h4, body.dark-mode h5, body.dark-mode h6 { color: #e0e0e0 !important; }
        body.dark-mode .table { background: #1e2a38 !important; color: #e0e0e0 !important; }
    `;
    document.head.appendChild(style);
}

// ============================================
// CHAT WIDGET
// ============================================

function initChatWidget() {
    // Floating chat button
    const chatBtn = document.createElement('button');
    chatBtn.id = 'chat-toggle-btn';
    chatBtn.innerHTML = '<i class="fas fa-comment-dots"></i>';
    chatBtn.style.cssText = `
        position: fixed; bottom: 30px; left: 30px;
        width: 55px; height: 55px; border-radius: 50%; border: none;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white; font-size: 1.4rem; cursor: pointer; z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.4);
    `;
    document.body.appendChild(chatBtn);

    // Chat panel
    const chatBox = document.createElement('div');
    chatBox.id = 'chat-box';
    chatBox.style.cssText = `
        position: fixed; bottom: 95px; left: 30px; width: 300px; height: 380px;
        background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        display: none; flex-direction: column; overflow: hidden; z-index: 1000;
    `;
    chatBox.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 15px; font-weight: 600;">
            <i class="fas fa-headset"></i> Chat with us
        </div>
        <div id="chat-messages" style="flex: 1; padding: 12px; overflow-y: auto; font-size: 0.9rem;">
            <div style="background:#f1f1f1; padding:8px 12px; border-radius:10px; margin-bottom:8px; max-width:80%;">
                Hi! How can I help you today?
            </div>
        </div>
        <div style="display:flex; border-top:1px solid #eee;">
            <input id="chat-input" type="text" placeholder="Type a message..."
                style="flex:1; border:none; padding:10px; outline:none;">
            <button id="chat-send" style="border:none; background:#667eea; color:white; padding:0 16px; cursor:pointer;">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `;
    document.body.appendChild(chatBox);

    chatBtn.addEventListener('click', () => {
        chatBox.style.display = chatBox.style.display === 'none' ? 'flex' : 'none';
    });

    const sendBtn = chatBox.querySelector('#chat-send');
    const input = chatBox.querySelector('#chat-input');
    const messages = chatBox.querySelector('#chat-messages');

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        const userMsg = document.createElement('div');
        userMsg.style.cssText = 'background:#667eea; color:white; padding:8px 12px; border-radius:10px; margin-bottom:8px; max-width:80%; margin-left:auto;';
        userMsg.textContent = text;
        messages.appendChild(userMsg);
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        setTimeout(() => {
            const reply = document.createElement('div');
            reply.style.cssText = 'background:#f1f1f1; padding:8px 12px; border-radius:10px; margin-bottom:8px; max-width:80%;';
            reply.textContent = "Thanks for your message! Our team will get back to you shortly.";
            messages.appendChild(reply);
            messages.scrollTop = messages.scrollHeight;
        }, 600);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });
}