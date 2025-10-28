function statusColor(status) {
  switch (status?.toLowerCase()) {
    case "active": return "var(--success)";
    case "completed": return "var(--primary)";
    case "planning": return "var(--warning)";
    case "on-hold": return "var(--secondary)";
    default: return "var(--light)";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Select2
  $("#projectContributors").select2({
    placeholder: "Select authors",
    width: "100%",
    allowClear: true,
  });
});

// Remove image
function removeProjectImage(event) {
  event.stopPropagation(); // Prevent triggering upload click

  const preview = document.getElementById("imagePreview-project");
  const placeholder = document.getElementById("uploadPlaceholderProject");
  const uploadArea = document.getElementById("uploadAreaProject");
  const removeBtn = document.getElementById("removeProjectImageBtn");
  const fileInput = document.getElementById("projectImage");

  preview.src = "";
  preview.style.display = "none";
  placeholder.style.display = "flex";
  uploadArea.classList.remove("has-image");
  removeBtn.style.display = "none";
  fileInput.value = "";
}



// Projects functions
function updateProjectsTable(Data) {
  const tableBody = document.querySelector("#projectsTable tbody");
  let html = "";
  if (Data.length > 0) {
    Data.forEach((project) => {
      const {
        _id,
        title,
        tags = [],
        status,
        duration,
        technologies = [],
        projectContributors = [],
        createdAt,
        image
      } = project;

      const tagDisplay = tags && tags.length >0 ? tags.slice(0, 3).map(t=>`<span class="tech-chip">${t}</span>`).join(" "): " - ";
      const techDisplay = technologies.slice(0, 2).join(", ") + (technologies.length > 2 ? "…" : "");
      const contributorDisplay =  projectContributors && projectContributors.length > 0
        ? projectContributors
        .map(c => `<span class="author-chip">${c.name || "Unnamed"}</span>`)
        .join(" ") : "-";

      html += `
            <tr>
                <td><img src="${image || "img/default.png"}" alt="${title}" class="news-thumb"></td>
                <td>${project.title}</td>
                <td>${tagDisplay || "-"}</td>
                <td><span class="status-badge" style="background-color:${statusColor(status)}">${status}</span></td>
                <td>${duration || "-"}</td>
                <td>${contributorDisplay || "-"}</td>
                <td>${techDisplay || "-"}</td>
                <td>
                    <div class="action-buttons">
                        <button class="table-btn btn-edit" onClick="openProjectModal(${JSON.stringify(project).replace(/"/g, "&apos;")})">
                          <img src="./img_dashbord/table/edit.svg" class="edit-icon"/>
                        </button>
                        <button class="table-btn btn-delete" onClick="deleteItem('${project._id}','projects',updateProjectsTable)">
                            <img src="./img_dashbord/table/delete.svg" class="delete-icon"/>
                        </button>
                    </div>
                </td>
            </tr>`;
    });
  } else {
    html =
      '<tr><td colspan="8" class="text-center">No projects found.</td></tr>';
  }

  tableBody.innerHTML = html;
}


// -------------------------------------------------------------------
//                    Open Modal (Add/Edit Project)
// -------------------------------------------------------------------
async function openProjectModal(project = null) {
  await loadContributors("projectContributors","Select project contributors");

  const modal = document.getElementById("projectModal");
  const title = document.getElementById("projectModalTitle");
  const submitBtn = document.getElementById("projectSubmitBtn");
  const form = document.getElementById("projectForm");

  const preview = document.getElementById("imagePreview-project");
  const placeholder = document.getElementById("uploadPlaceholderProject");
  const uploadArea = document.getElementById("uploadAreaProject");
  const removeBtn = document.getElementById("removeProjectImageBtn");


  if (project) {
    title.textContent = "Edit Project";
    submitBtn.textContent = "Save Changes";

    document.getElementById("projectId").value = project._id;
    document.getElementById("projectTitle").value = project.title;
    document.getElementById("projectTags").value = project.tags?.join(", ") || "";
    document.getElementById("projectDetails").value = project.details || "";
    document.getElementById("projectOverview").value = project.overview || "";
    document.getElementById("projectObjectives").value = project.objectives?.join("\n") || "";
    document.getElementById("projectOutcomes").value = project.outcomes?.join("\n") || "";
    document.getElementById("projectTechnicalApproach").value = project.technicalApproach || "";
    document.getElementById("projectStatus").value = project.status;
    document.getElementById("projectDuration").value = project.duration || "";
    document.getElementById("projectFunding").value = project.funding || "";
    document.getElementById("projectTechnologies").value = project.technologies?.join(", ") || "";
    document.getElementById("projectLink").value = project.link || "";

    if (Array.isArray(project.projectContributors)) {
        const contributorIds = project.projectContributors.map(a => a._id);
        const contributorSelect = document.getElementById("projectContributors");
        for (const option of contributorSelect.options) {
            option.selected = contributorIds.includes(option.value);
        }
    }


    preview.src = project.image ? project.image : "./uploads/news.jpg";
    preview.style.display = "block";
    placeholder.style.display = "none";
    uploadArea.classList.add("has-image");
    removeBtn.style.display = "block";

  } else {
    title.textContent = "Add Project";
    submitBtn.textContent = "Add Project";
    form.reset();
    document.getElementById("projectId").value="";
    
    // Reset image
    removeProjectImage(new Event("click"));
  }

  modal.classList.add("active");
}


// -------------------------------------------------------------------
//                           Handle Form Submit
// -------------------------------------------------------------------
document.getElementById("projectForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const projectId = document.getElementById("projectId").value;
  const formData = new FormData();

  formData.append("title", document.getElementById("projectTitle").value);
  formData.append("details", document.getElementById("projectDetails").value);
  formData.append("overview", document.getElementById("projectOverview").value);
  formData.append("technicalApproach", document.getElementById("projectTechnicalApproach").value);
  formData.append("status", document.getElementById("projectStatus").value);
  formData.append("duration", document.getElementById("projectDuration").value);
  formData.append("funding", document.getElementById("projectFunding").value);
  formData.append("link", document.getElementById("projectLink").value);

  const imageFile = document.getElementById("projectImage").files[0];
  if (imageFile) formData.append("image", imageFile);


  const selectedContributors = $("#projectContributors").val() || [];
  selectedContributors.forEach(c => formData.append("projectContributors[]", c));
  
  const outcomes=document.getElementById("projectOutcomes").value.split("\n").filter(Boolean)
  outcomes.forEach(obj=>formData.append("outcomes[]",obj));

  const objectives = document.getElementById("projectObjectives").value.split("\n").filter(Boolean);
  objectives.forEach(obj => formData.append("objectives[]", obj));

  const tags= document.getElementById("projectTags").value.split(",").map(t => t.trim()).filter(Boolean);
  tags.forEach(obj=>formData.append("tags[]", obj))

  const technologies=document.getElementById("projectTechnologies").value.split(",").map(t => t.trim()).filter(Boolean);
  technologies.forEach(obj=>formData.append("technologies[]", obj));

  
 const repoLines = document
  .getElementById("projectRepositories")
  .value.split("\n")
  .filter(Boolean);

  const repoObjects = repoLines.map((line) => {
    const [title, description, image, link, type] = line.split("|").map((s) => s.trim());
    return { title, description, image, link, type };
  }).filter(r => r.title && r.link);

  formData.append("repositories", JSON.stringify(repoObjects));




  if (projectId) {
    await editItemWithImage("projects", "projects", projectId, formData, updateProjectsTable, "projectModal");
  } else {
    await createItemWithImage("projects", formData, updateProjectsTable, "projectModal", "projects");
  }
});



document.getElementById("projectImage").addEventListener("change", function () {
  const file = this.files[0];
  const preview = document.getElementById("imagePreview-project");
  const placeholder = document.getElementById("uploadPlaceholderProject");
  const uploadArea = document.getElementById("uploadAreaProject");
  const removeBtn = document.getElementById("removeProjectImageBtn");

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    placeholder.style.display = "none";
    removeBtn.style.display = "block";
    uploadArea.classList.add("has-image");
  } else {
    removeProjectImage(new Event("click")); // Reset state
  }
});
