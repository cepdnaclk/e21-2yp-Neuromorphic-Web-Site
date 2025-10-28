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