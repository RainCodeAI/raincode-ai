document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.querySelector(".dropdown");
  const submenu = dropdown ? dropdown.querySelector(".submenu") : null;

  if (dropdown && submenu) {
    dropdown.addEventListener("click", function (e) {
      if (e.target.tagName !== "A") {
        e.preventDefault();
        submenu.style.display = submenu.style.display === "block" ? "none" : "block";
      }
    });

    document.addEventListener("click", function (e) {
      if (!dropdown.contains(e.target)) {
        submenu.style.display = "none";
      }
    });
  }

  const modal = document.getElementById("app-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalLogo = modal ? modal.querySelector(".modal-logo") : null;
  const modalSpecs = modal ? modal.querySelector(".modal-specs") : null;
  const modalPhilosophy = modal ? modal.querySelector(".modal-philosophy") : null;
  const modalClose = modal ? modal.querySelector(".modal-close") : null;

  if (!modal || !modalTitle || !modalLogo || !modalSpecs || !modalPhilosophy || !modalClose) {
    return;
  }

  const appCards = document.querySelectorAll(".app-card");

  function openModal(card) {
    const img = card.querySelector("img");
    const name = card.querySelector("h4") ? card.querySelector("h4").textContent : "";
    const specs = card.dataset.specs ? card.dataset.specs.split("|") : [];
    const philosophy = card.dataset.philosophy || "";

    modalTitle.textContent = name;
    modalLogo.src = img ? img.src : "";
    modalLogo.alt = img ? img.alt : name;
    modalPhilosophy.textContent = philosophy;
    modalSpecs.innerHTML = "";
    specs.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.trim();
      modalSpecs.appendChild(li);
    });

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  appCards.forEach((card) => {
    card.addEventListener("click", function () {
      openModal(card);
    });

    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
});
