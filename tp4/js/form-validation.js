// Mise à jour en temps réel du compteur de caractères
function calcNbChar(id) {
  const inputElement = document.querySelector(`#${id}`);
  if (!inputElement) return;

  const rowElement = inputElement.closest(".row");
  const countElement = rowElement ? rowElement.querySelector("[data-count]") : null;

  if (countElement) {
    countElement.textContent = inputElement.value.length + " car.";
  }
}

// Validation du format de l'adresse e-mail
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Validation des règles du formulaire (TP3 + TP4)
function validateForm() {
  const name = document.querySelector("#name").value.trim();
  const firstname = document.querySelector("#firstname").value.trim();
  const birthday = document.querySelector("#birthday").value;
  const address = document.querySelector("#address").value.trim();
  const email = document.querySelector("#email").value.trim();

  const errors = [];

  if (name.length < 5) {
    errors.push("Le nom doit contenir au moins 5 caractères.");
  }
  if (firstname.length < 5) {
    errors.push("Le prénom doit contenir au moins 5 caractères.");
  }
  if (!birthday) {
    errors.push("La date de naissance est obligatoire.");
  } else {
    const birthDate = new Date(birthday);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (birthDate > today) {
      errors.push("La date de naissance ne peut pas être dans le futur.");
    }
  }
  if (address.length < 5) {
    errors.push("L'adresse postale doit contenir au moins 5 caractères.");
  }
  if (!validateEmail(email)) {
    errors.push("L'adresse mail n'est pas valide.");
  }

  return errors;
}

// Affichage de la liste des contacts sauvegardés dans le tableau HTML
function displayContactList() {
  const contactList = contactStore.getList();
  const tbody = document.querySelector("#contact-table tbody");
  const countBadge = document.querySelector("#contact-count");

  if (countBadge) {
    countBadge.textContent = contactList.length;
  }

  tbody.innerHTML = "";

  for (const contact of contactList) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.adress)}`;

    tbody.innerHTML += `
      <tr>
        <td>${contact.name}</td>
        <td>${contact.firstname}</td>
        <td>${contact.date}</td>
        <td><a href="${mapsUrl}" target="_blank" rel="noopener noreferrer">${contact.adress}</a></td>
        <td><a href="mailto:${contact.mail}">${contact.mail}</a></td>
      </tr>
    `;
  }
}

// Affichage d'une notification visuelle sous le formulaire
function showFeedback(message, type = "success") {
  const feedbackDiv = document.querySelector("#form-feedback");
  if (!feedbackDiv) return;

  feedbackDiv.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mt-3 mb-0" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
    </div>
  `;
}

// Initialisation au chargement du DOM
window.onload = function () {
  displayContactList();

  // Interception de la soumission du formulaire
  document.querySelector("#contact-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      showFeedback("<strong>Erreur de validation :</strong><br>" + errors.join("<br>"), "danger");
      return;
    }

    const name = document.querySelector("#name").value.trim();
    const firstname = document.querySelector("#firstname").value.trim();
    const birthday = document.querySelector("#birthday").value;
    const address = document.querySelector("#address").value.trim();
    const email = document.querySelector("#email").value.trim();

    contactStore.add(name, firstname, birthday, address, email);
    displayContactList();

    // Réinitialisation du formulaire et des compteurs de caractères
    event.target.reset();
    ["name", "firstname", "birthday", "address", "email"].forEach((id) => calcNbChar(id));

    showFeedback("Contact ajouté avec succès.", "success");
  });

  // Interception du clic sur le bouton GPS
  document.querySelector("#gps").addEventListener("click", function (event) {
    event.preventDefault();
    getLocation();
  });

  // Interception du clic sur le bouton Reset
  document.querySelector("#reset").addEventListener("click", function (event) {
    event.preventDefault();
    contactStore.reset();
    displayContactList();
    showFeedback("Liste des contacts réinitialisée.", "warning");
  });
};