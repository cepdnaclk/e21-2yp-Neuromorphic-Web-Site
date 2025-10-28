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