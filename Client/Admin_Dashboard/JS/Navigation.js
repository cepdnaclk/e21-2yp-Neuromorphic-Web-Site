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