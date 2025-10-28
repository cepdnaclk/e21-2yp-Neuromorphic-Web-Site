// Dashboard functions

function loadDashboardData(data) {
  // Update stat cards
  document.getElementById("totalContributors").textContent =
    data.stats.totalContributors || 0;
  document.getElementById("totalNews").textContent = data.stats.totalNews || 0;
  document.getElementById("totalEvents").textContent =data.stats.totalPublications || 0;
  document.getElementById("totalProjects").textContent =data.stats.totalProjects || 0;

  // Load recent activities
  updateRecentActivities(data.recentActivities);

  // Load upcoming events
  updateUpcomingEvents(data.upcomingEvents);
}

// ---------------- RECENT ACTIVITIES ----------------
function updateRecentActivities(activities) {
  let activitiesHTML = "";

  if (activities.news && activities.news.length > 0) {
    activitiesHTML += '<h6 style="margin-bottom:2px; font-size:1.6rem">Recent News</h6>';
    activitiesHTML +=
      '<ul style="list-style: none; padding: 0; margin-bottom:5px;">';

    activities.news.forEach((activity) => {
      activitiesHTML += `
        <li style="padding: 8px 0; border-bottom: 1px solid var(--gray-light);">
          <i class="fas fa-newspaper text-primary me-2"></i>     
          <span style="font-size:1.6rem">${activity.title}</span>
        </li>`;
    });
    activitiesHTML += "</ul>";
  }

  if (activities.events && activities.events.length > 0) {
    activitiesHTML += '<h6 style="margin-bottom:2px; font-size:1.6rem;">Recent Events</h6>';
    activitiesHTML += '<ul style="list-style: none; padding: 0;">';

    activities.events.forEach((event) => {
      activitiesHTML += `
        <i class="fas fa-calendar text-success me-2">
          <div style="font-weight: 500; font-size:1.6rem">${event.title}</div>
        </li>`;
    });

    activitiesHTML += "</ul>";
  }

  if (!activitiesHTML) {
    activitiesHTML = '<p class="text-muted">No recent activities found.</p>';
  }

  document.getElementById("recentActivities").innerHTML = activitiesHTML;
}

// ---------------- UPCOMING EVENTS ----------------
function updateUpcomingEvents(events) {
  let eventsHTML = "";

  if (events && events.length > 0) {
    eventsHTML += '<ul style="list-style: none; padding: 0;">';

    events.forEach((event) => {
      const eventDate = new Date(event.startDate).toLocaleString(); // ✅ fixed typo
      eventsHTML += `
        <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);">
          <div style="font-weight: 500; font-size:1.6rem">${event.title}</div>
          <small class="text-muted">${eventDate}</small>
        </li>`;
    });

    eventsHTML += "</ul>";
  } else {
    eventsHTML = '<p class="text-muted">No upcoming events found.</p>';
  }

  document.getElementById("upcomingEvents").innerHTML = eventsHTML;
}
