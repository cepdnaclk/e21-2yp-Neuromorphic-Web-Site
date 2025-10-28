// Main application initialization
document.addEventListener("DOMContentLoaded", function () {
    if(authToken){
        showAdminPanel();
        loadSection('admin/dashboard',loadDashboardData);
    }else{
        console.log('Show the loging page');
        showLoginPage();
    }

    // setup navigation
    initializeNavigation();

    // setup login form
    loginForm.addEventListener('submit',handleLogin);

});


// Load data for a specific section
function loadSectionData(section) {
    switch (section) {
        case "dashboard":
            loadSection('admin/dashboard',loadDashboardData);
            break;
        case "contributors":
            loadSection('contributors',updateContributorsTable);
            break;
        case "news":
            loadSection('news',updateNewsTable);
            break;
        case "publication":
            loadSection('publications',updatePublicationTable);
            break;
        case "projects":
            loadSection('projects',updateProjectsTable);
            break;
        case "users":
            loadSection('admin/users',updateUsersTable);
            break;
        case "blogs":
            loadSection("blogs",updateBlogsTable);
    }
}