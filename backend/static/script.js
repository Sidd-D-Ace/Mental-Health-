document.addEventListener("DOMContentLoaded", function () {
    
    // Define elements safely after DOM loads
    const loaderContainer = document.getElementById('loading-container'); 

    function showSection(sectionId) {
        const sections = ["feeling-good", "heavy-mind", "advice-section"];

        // Hide all sections
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.display = "none";
        });

        // Show the selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.style.display = "block";
        }

        // Clear advice section when switching main sections
        if (sectionId !== "advice-section") {
            const adviceSec = document.getElementById("advice-section");
            if (adviceSec) {
                adviceSec.innerHTML = "";
                adviceSec.style.display = "none";
            }
        }
    }

    // For user feeling good
    window.showPositiveAdvice = async function () {
        const adviceSection = document.getElementById("advice-section");
        
        try {
            // Show loader and clear old advice
            if (loaderContainer) loaderContainer.style.display = 'block';
            adviceSection.style.display = "none"; 

            const response = await fetch("/get_positive_advice");
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            adviceSection.innerHTML = `
                <h2>🌟 Stay Positive!</h2>
                <div class="ai-content">${data.advice}</div>
                <button onclick="showSection('feeling-good')" class="category-btn" style="margin-top:10px;">Back</button>
            `;
            showSection("advice-section");

        } catch (error) {
            console.error("Error:", error);
            adviceSection.innerHTML = `<p>Sorry, we couldn't fetch advice. Please try again.</p>`;
            showSection("advice-section");
        } finally {
            if (loaderContainer) loaderContainer.style.display = 'none';
        }
    };

    window.showAdvice = async function (emotion) {
        const adviceSection = document.getElementById("advice-section");
        
        // 1. Show the loader (using the container we defined)
        if (loaderContainer) {
            loaderContainer.style.display = 'block';
            // Optional: You can explicitly set text here if you want dynamic text
            // loaderContainer.querySelector('p').innerText = "Connecting to therapist...";
        }
        
        // Hide advice section while loading
        adviceSection.style.display = 'none';

        try {
            const response = await fetch("/get_advice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emotion })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            // 2. Inject the AI response
            adviceSection.innerHTML = `
                <h2>Support for ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}</h2>
                <div class="ai-content">${data.advice}</div>
                <button onclick="showSection('heavy-mind')" class="category-btn" style="margin-top:10px;">Go Back</button>
            `;

            // 3. Switch view to the advice section
            showSection("advice-section");

        } catch (error) {
            console.error("❌ Error:", error);
            adviceSection.innerHTML = `
                <p>Sorry, I couldn't reach the therapist. Please try again.</p>
                <button onclick="showSection('heavy-mind')" class="category-btn">Back</button>
            `;
            showSection("advice-section");
        } finally {
            // 4. Hide loader
            if (loaderContainer) loaderContainer.style.display = 'none';
        }
    };

    // Make functions globally accessible so HTML buttons can see them
    window.showSection = showSection;
});