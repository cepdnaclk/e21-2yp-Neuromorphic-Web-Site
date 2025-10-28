// Character counter for brief
const briefTextarea = document.getElementById("newsBrief");
const briefCounter = document.getElementById("briefCounter");

briefTextarea.addEventListener("input", function () {
  briefCounter.textContent = this.value.length;
});
