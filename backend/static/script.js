document.addEventListener("DOMContentLoaded", function () {
    
    // --- DARK MODE LOGIC ---
    const themeBtn = document.getElementById('theme-toggle');
    
    // 1. Check for saved preference on load
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (themeBtn) themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }

    // 2. Toggle Function
    window.toggleTheme = function() {
        const root = document.documentElement;
        const isDark = root.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeBtn.textContent = '🌙'; // Switch to Moon icon
        } else {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeBtn.textContent = '☀️'; // Switch to Sun icon
        }
    };
    
    const loaderContainer = document.getElementById('loading-container'); 
    const chatFeed = document.getElementById('chat-feed');
    const introContent = document.getElementById('intro-content');
    const inputField = document.getElementById('user-input');

    // Allow "Enter" key to send
    inputField.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            handleUserMessage();
        }
    });

    // --- MAIN TRANSITION LOGIC ---
    // This removes the "How are you feeling" screen smoothly
    function hideIntroAndShowMessage(userText) {
        if (!introContent) return;

        // 1. Fade out the intro
        introContent.classList.add('fade-out');

        // 2. Wait for animation (500ms), then hide intro and add user message
        setTimeout(() => {
            introContent.style.display = 'none';
            
            // Create User Bubble
            const userBubble = document.createElement('div');
            userBubble.className = 'user-message-bubble';
            userBubble.textContent = userText;
            
            // Insert before the loader
            chatFeed.insertBefore(userBubble, loaderContainer);
            
            // Auto scroll to bottom
            chatFeed.scrollTop = chatFeed.scrollHeight;
        }, 450);
    }

    // --- BUTTON HANDLER ---
    // Called when clicking "Feeling Good" or "Heavy Mind"
    window.handleTransition = function(text, type) {
        hideIntroAndShowMessage(text);
        
        // Wait slightly for the user bubble to appear, then show the specific section
        setTimeout(() => {
            if (type === 'positive') {
                showPositiveAdvice(); // Trigger existing logic
            } else if (type === 'heavy') {
                showSection('heavy-mind'); // Trigger existing logic
            }
        }, 600);
    };

    // --- TEXT INPUT HANDLER ---
    window.handleUserMessage = function() {
        const text = inputField.value.trim();
        if (!text) return;

        inputField.value = ""; // Clear input
        hideIntroAndShowMessage(text);

        // Simulate AI thinking for custom text input
        setTimeout(() => {
            if (loaderContainer) loaderContainer.style.display = 'block';
            chatFeed.scrollTop = chatFeed.scrollHeight;

            // Simple logic to route based on keywords (Mock AI)
            setTimeout(() => {
                if (loaderContainer) loaderContainer.style.display = 'none';
                
                // Simple keyword matching for demo
                const lowerText = text.toLowerCase();
                if (lowerText.includes('good') || lowerText.includes('happy') || lowerText.includes('great')) {
                    showPositiveAdvice();
                } else {
                    // Default to heavy mind support if not explicitly positive
                    showSection('heavy-mind');
                }
            }, 1000);
        }, 600);
    };

    // --- EMOTION BUTTON HANDLER (Sub-buttons) ---
    window.handleEmotion = function(emotion) {
        // Just append a bubble for the sub-selection too
        const userBubble = document.createElement('div');
        userBubble.className = 'user-message-bubble';
        userBubble.textContent = emotion.charAt(0).toUpperCase() + emotion.slice(1);
        chatFeed.insertBefore(userBubble, loaderContainer);

        // Call existing API logic
        showAdvice(emotion);
    };

    // --- EXISTING FUNCTIONS (Slightly modified to append instead of replace) ---

    function showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove("hidden");
            section.style.display = "block";
            
            // Move the section to the bottom of the chat feed
            chatFeed.insertBefore(section, loaderContainer);
            chatFeed.scrollTop = chatFeed.scrollHeight;
        }
    }

    window.showPositiveAdvice = async function () {
        // (Logic remains similar, just ensuring elements exist)
        const adviceSection = document.getElementById("advice-section");
        if(loaderContainer) loaderContainer.style.display = 'block';

        try {
            const response = await fetch("/get_positive_advice");
            const data = await response.json();
            
            adviceSection.innerHTML = `
                <div class="message ai-message">
                    <div class="message-content">
                        <p><strong>🌟 Stay Positive!</strong></p>
                        <p>${data.advice || "Keep smiling!"}</p>
                    </div>
                </div>`;
            
            showSection("advice-section");
        } catch (e) {
            console.error(e);
        } finally {
            if(loaderContainer) loaderContainer.style.display = 'none';
        }
    };

    window.showAdvice = async function (emotion) {
        const adviceSection = document.getElementById("advice-section");
        if (loaderContainer) loaderContainer.style.display = 'block';
        chatFeed.scrollTop = chatFeed.scrollHeight;

        try {
            const response = await fetch("/get_advice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emotion })
            });
            const data = await response.json();

            // Append new advice rather than overwriting previous advice completely
            const newAdviceDiv = document.createElement('div');
            newAdviceDiv.innerHTML = `
                <div class="message ai-message" style="margin-top:15px">
                    <div class="message-content">
                        <p><strong>Support for ${emotion}:</strong></p>
                        <p>${data.advice}</p>
                    </div>
                </div>`;
            
            // Insert before loader
            chatFeed.insertBefore(newAdviceDiv, loaderContainer);
            
            // Hide emotion grid to clean up chat? (Optional: hide heavy-mind section)
            // document.getElementById('heavy-mind').style.display = 'none';

        } catch (error) {
            console.error(error);
        } finally {
            if (loaderContainer) loaderContainer.style.display = 'none';
            chatFeed.scrollTop = chatFeed.scrollHeight;
        }
    };

    window.resetConversation = function() {
        location.reload(); // Simplest way to reset animation and state
    };
});