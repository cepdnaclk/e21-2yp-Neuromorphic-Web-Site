document.addEventListener("DOMContentLoaded", function () {
  // Initialize Select2
  $("#publicationAuthors").select2({
    placeholder: "Select authors",
    width: "100%",
    allowClear: true,
  });
});