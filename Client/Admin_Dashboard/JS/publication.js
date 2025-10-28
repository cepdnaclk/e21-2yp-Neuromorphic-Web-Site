document.addEventListener("DOMContentLoaded", function () {
  // Initialize Select2
  $("#publicationAuthors").select2({
    placeholder: "Select authors",
    width: "100%",
    allowClear: true,
  });
});

//-----------------------------------------------------------------------
//                       Render Publication Table
//-----------------------------------------------------------------------
function updatePublicationTable(data) {
  const tableBody = document.querySelector("#publicationsTable tbody");
  let html = "";

  if (data.length > 0) {
    data.forEach((pub) => {
      html += `
        <tr>
          <td>${pub.title}</td>
          <td>${pub.authors && pub.authors.length > 0 ? pub.authors.map(a => `<span class="author-chip">${a.name}</span>`).join(" ") : "-"}</td>
          <td>${pub.journal}</td>
          <td>${pub.year}</td>
          <td>${pub.doi || "—"}</td>
          <td>
            <div class="action-buttons">
              <button class="table-btn btn-edit" onclick='openPublicationModal(${JSON.stringify(pub).replace(/"/g, "&apos;")})'>
                <img src="./img_dashbord/table/edit.svg" class="edit-icon"/>
              </button>
              <button class="table-btn btn-delete" onclick="deleteItem('${pub._id}','publications',updatePublicationTable)">
                <img src="./img_dashbord/table/delete.svg" class="delete-icon"/>
              </button>
            </div>
          </td>
        </tr>`;
    });
  } else {
    html = '<tr><td colspan="6" class="text-center">No publications found.</td></tr>';
  }

  tableBody.innerHTML = html;
}

//-----------------------------------------------------------------------
//                       Open Add/Edit Publication Modal
//-----------------------------------------------------------------------
async function openPublicationModal(publication = null) {
  await loadContributors("publicationAuthors","Select Authors");
  const modal = document.getElementById("publicationModal");
  const title = document.getElementById("publicationModalTitle");
  const submitBtn = document.getElementById("publicationSubmitBtn");
  const form = document.getElementById("publicationForm");
  const authorSelect = document.getElementById("publicationAuthors");

    if (publication) {
    // Editing existing publication
    title.textContent = "Edit Publication";
    submitBtn.textContent = "Save Changes";
    document.getElementById("publicationId").value = publication._id || "";
    document.getElementById("publicationTitle").value = publication.title || "";
    document.getElementById("publicationJournal").value = publication.journal || "";
    document.getElementById("publicationYear").value = publication.year || "";
    document.getElementById("publicationDescription").value = publication.description || "";
    document.getElementById("publicationLink").value = publication.link || "";
    document.getElementById("publicationDoi").value = publication.doi || "";

    if (Array.isArray(publication.authors)) {
      const authorIds = publication.authors.map(a => a._id);
      for (const option of authorSelect.options) {
        option.selected = authorIds.includes(option.value);
      }
    }
  } else {
    // Adding new publication
    title.textContent = "Add Publication";
    submitBtn.textContent = "Save Publication";
    form.reset();
    document.getElementById("publicationId").value = "";
  }

  modal.classList.add("active");
}

//-----------------------------------------------------------------------
//                       Handle Publication Form Submit
//-----------------------------------------------------------------------
document.getElementById("publicationForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const publicationId = document.getElementById("publicationId").value;
    const title = document.getElementById("publicationTitle").value;
    const authors = $("#publicationAuthors").val();
    const journal = document.getElementById("publicationJournal").value;
    const year = document.getElementById("publicationYear").value;
    const description = document.getElementById("publicationDescription").value;
    const link = document.getElementById("publicationLink").value;
    const doi = document.getElementById("publicationDoi").value;

    const publicationData = {
      title,
      authors,
      journal,
      year,
      description,
      link,
      doi,
    };

    if (publicationId) {
      // Update existing publication
      await editItem(
        "publications",
        publicationId,
        publicationData,
        "publications",
        updatePublicationTable,
        "publicationModal"
      );
    } else {
      // Create new publication
      await createItem(
        "publications",
        publicationData,
        updatePublicationTable,
        "publicationModal",
        "publications"
      );
    }
  });
