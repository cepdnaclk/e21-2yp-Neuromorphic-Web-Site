// ------------------------------------------------------------------
//                          Render Contributors Table
// -------------------------------------------------------------------
function updateContributorsTable(contributors) {
  const tbody = document.querySelector("#contributorsTable tbody");
  let html = "";

  if (contributors.length > 0) {
    contributors.forEach((contributor) => {
      html += `
              <tr>
                   <td style="text-align:center">
                   <img src="${contributor.image || "./uploads/contributors/no-photo.png"}" alt="${contributor.name}" class="contributor-image-table"></td>
                  <td>${contributor.name}</td>
                  <td>${contributor.email}</td>
                  <td>${contributor.position}</td>
                  <td>${contributor.phone}</td>
                  <td>
                     <div class="action-buttons">
                          <button class="table-btn btn-edit" onclick="openContributorModal(${JSON.stringify(
                            contributor
                          ).replace(/"/g, "&apos;")})">
                            <img src="./img_dashbord/table/edit.svg" class="edit-icon"/>
                          </button>

                        <button class="table-btn btn-delete" onclick="deleteItem('${
                          contributor._id
                        }','contributors',updateContributorsTable)">
                            <img src="./img_dashbord/table/delete.svg" class="delete-icon"/>
                        </button>     
                     </div>
                  </td>
                  `;
    });
  } else {
    html =
      '<tr><td colspan="6" class="text-center">No contributors found.</td></tr>';
  }

  tbody.innerHTML = html;
}



// -------------------------------------------------------------------
//                    Open Modal (Add/Edit)
// -------------------------------------------------------------------
function openContributorModal(contributor = null) {
  const modal = document.getElementById("contributorModal");
  const title = document.getElementById("contributorModalTitle");
  const form = document.getElementById("contributorForm");
  const submitBtn = document.getElementById("contributorSubmitBtn");

  // Rest form first
  form.reset();
  document.getElementById("contributorId").value = "";
  const preview = document.getElementById("imagePreview");

  if (contributor) {
    // Edit Mode
    title.textContent = "Edit Contributor";
    submitBtn.textContent = "Save Changes";

    document.getElementById("contributorId").value = contributor._id;
    document.getElementById("contributorName").value = contributor.name;
    document.getElementById("contributorEmail").value = contributor.email;
    document.getElementById("contributorPosition").value = contributor.position;
    document.getElementById("contributorPhone").value =contributor.phone || "-";

    // Show exiting image
    if (preview) {
      preview.src = contributor.image?contributor.image: "./uploads/contributors/no-photo.png";
      preview.style.display = "block";
    }
  } else {
    // Add Mode
    title.textContent = "Add Contributor";
    submitBtn.textContent = "Add Contributor";
    preview.src = "./uploads/contributors/no-photo.png";
    preview.style.display = "none";
  }
  modal.classList.add("active");
}




// -----------------------------------------------------------------------------------------
//                                    Handle Form Submit
// ------------------------------------------------------------------------------------------
document.getElementById("contributorForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const contributorId = document.getElementById("contributorId").value;

    const contributorData = new FormData();

    contributorData.append("name" ,document.getElementById("contributorName").value);
    contributorData.append("email" ,document.getElementById("contributorEmail").value);
    contributorData.append("position" ,document.getElementById("contributorPosition").value);
    contributorData.append("phone" ,document.getElementById("contributorPhone").value);

    const imageFile = document.getElementById("contributorImage").files[0];
    if (imageFile) {
      contributorData.append("image", imageFile);
    }

    if (contributorId) {
      // Edit existing contributor
      await editItemWithImage(
        "contributors",
        "contributors",
        contributorId,
        contributorData,
        updateContributorsTable,
        "contributorModal"
      );
    } else {
      // Create new contributor
      await createItemWithImage(
        "contributors",
        contributorData,
        updateContributorsTable,
        "contributorModal",
        "contributors"
      );
    }
  });

  
document.getElementById("contributorImage").addEventListener("change", function (e) {
    const file = e.target.files[0];
    const preview = document.getElementById("imagePreview");
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
});
