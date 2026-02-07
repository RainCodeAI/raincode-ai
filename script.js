document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.querySelector(".dropdown");
  const submenu = dropdown.querySelector(".submenu");

  dropdown.addEventListener("click", function (e) {
    // Only prevent default if the clicked element is not a link
    if (e.target.tagName !== 'A') {
      e.preventDefault();
      submenu.style.display = submenu.style.display === "block" ? "none" : "block";
    }
  });

  // Close submenu when clicking outside
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) {
      submenu.style.display = "none";
    }
  });
});