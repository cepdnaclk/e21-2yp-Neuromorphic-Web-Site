// Navigation functions
function initializeNavigation() {
    // Set up navigation
    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const section = this.getAttribute("data-section");
            navigateToSection(section);
        });
    });
}

function navigateToSection(section) {
    // Update active nav link
    navLinks.forEach((nav) => nav.classList.remove("active"));
    document.querySelector(`[data-section="${section}"]`).classList.add("active");

    // Show corresponding section
    contentSections.forEach((section) => section.classList.remove("active"));
    document.getElementById(section).classList.add("active");

    // Update page title
    pageTitle.textContent = document.querySelector(`[data-section="${section}"] span`).textContent;

    // Load section data
    loadSectionData(section);
}