// Character counter for brief
const briefTextarea = document.getElementById("newsBrief");
const briefCounter = document.getElementById("briefCounter");

briefTextarea.addEventListener("input", function () {
  briefCounter.textContent = this.value.length;
});

// Remove image
function removeImage(event) {
  event.stopPropagation(); // Prevent triggering the upload click

  const preview = document.getElementById("imagePreview-news");
  const placeholder = document.getElementById("uploadPlaceholderNews");
  const uploadArea = document.getElementById("uploadAreaNews");
  const removeBtn = document.getElementById("removeImageBtn");
  const fileInput = document.getElementById("newsImage");

  preview.src = "";
  preview.classList.remove("show");
  preview.style.display = "none";
  placeholder.style.display = "flex";
  uploadArea.classList.remove("has-image");
  removeBtn.style.display = "none";
  fileInput.value = "";
}

// News functions
function updateNewsTable(newsData) {
  const tableBody = document.querySelector("#newsTable tbody");
  let html = "";

  if (newsData.length > 0) {
    newsData.forEach((news) => {
      const date = new Date(news.date).toLocaleDateString();
      const imageSrc = news.image ? news.image : "./uploads/news.jpg";
      html += `
            <tr>
                <td><img src="${imageSrc}" alt="News Image" class="news-thumb" /></td>
                <td>${news.title}</td>
                <td>${news.author}</td>
                <td>${date}</td>
                <td>${news.brief}</td>
                <td>${
                  news.link && news.link !== "#"
                    ? `<a href="${news.link}" target="_blank">View</a>`
                    : "-"
                }</td>
                <td>
                    <div class="action-buttons">
                          <button class="table-btn btn-edit" onclick='openNewsModal(${JSON.stringify(
                            news
                          ).replace(/'/g, "&apos;")})'>
                            <img src="./img_dashbord/table/edit.svg" class="edit-icon"/>
                        </button>
                        <button class="table-btn btn-delete" onClick="deleteItem('${
                          news._id
                        }','news',updateNewsTable)">
                            <img src="./img_dashbord/table/delete.svg" class="delete-icon"/>
                        </button>
                    </div>
                </td>
            </tr>`;
    });
  } else {
    html = '<tr><td colspan="7" class="text-center">No news found.</td></tr>';
  }

  tableBody.innerHTML = html;
}

//--------------------------------------
//     Open modal for Add/Edit user
//--------------------------------------
function openNewsModal(news = null) {
  console.log("call");
  const modal = document.getElementById("newsModal");
  const title = document.getElementById("newsModalTitle");
  const form = document.getElementById("newsForm");
  const submitBtn = document.getElementById("newsSubmitBtn");
  const placeholder = document.getElementById("uploadPlaceholderNews");
  const uploadArea = document.getElementById("uploadAreaNews");
  const removeBtn = document.getElementById("removeImageBtn");
}
