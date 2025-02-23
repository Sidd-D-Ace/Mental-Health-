
document.addEventListener("DOMContentLoaded", function () {
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
            document.getElementById("advice-section").innerHTML = "";
            document.getElementById("advice-section").style.display = "none";
        }
    }
    //For user feeling good
    window.showPositiveAdvice = async function () {
        console.log("🔍 Sending request for positive advice");
    
        const adviceSection = document.getElementById("advice-section");
    
        try {
            const response = await fetch("http://127.0.0.1:5000/get_positive_advice", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            console.log("🔍 Raw Response:", response);
    
            const data = await response.json();
            console.log("🔍 API Response:", data);
    
            if (data.error) {
                throw new Error(data.error);
            }
    
            adviceSection.innerHTML = `
                <h2>🌟 Stay Positive!</h2>
                <p>${data.advice}</p>
            `;
    
            showSection("advice-section");
    
        } catch (error) {
            console.error("❌ Error fetching positive advice:", error);
            adviceSection.innerHTML = `<p>Sorry, we couldn't fetch advice at the moment. Please try again later.</p>`;
        }
    };
    

    window.showAdvice = async function (emotion) {
        console.log("🔍 Sending request for:", emotion); // Debugging
    
        const adviceSection = document.getElementById("advice-section");
    
        try {
            const requestBody = JSON.stringify({ emotion });
            console.log("🔍 Request Body:", requestBody); // Debugging
    
            const response = await fetch("http://127.0.0.1:5000/get_advice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: requestBody
            });
    
            console.log("🔍 Raw Response:", response); // Debugging
    
            const data = await response.json();
            console.log("🔍 API Response:", data); // Debugging
    
            if (data.error) {
                throw new Error(data.error);
            }
    
            adviceSection.innerHTML = `
                <h2>Advice for ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}</h2>
                <p>${data.advice}</p>
            `;
            showSection("advice-section");
    
        } catch (error) {
            console.error("❌ Error fetching advice:", error);
            adviceSection.innerHTML = `<p>Sorry, we couldn't fetch advice at the moment. Please try again later.</p>`;
        }
    };
    
    
    
    
    // Make functions globally accessible
    window.showSection = showSection;
    window.showAdvice = showAdvice;
});
