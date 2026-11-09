window.onload = function () {
    console.log("DOM ready!");

    // Sélection du formulaire
    const form = document.querySelector("form");

    // Fonction de validation d'email (fournie dans l'énoncé)
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Interception de la soumission du formulaire
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Récupération des valeurs saisies
        const name = document.querySelector("#name").value.trim();
        const firstname = document.querySelector("#firstname").value.trim();
        const birthday = document.querySelector("#birthday").value;
        const address = document.querySelector("#address").value.trim();
        const email = document.querySelector("#email").value.trim();

        // Éléments de la fenêtre modale
        const modalTitle = document.querySelector(".modal-title");
        const modalBody = document.querySelector(".modal-body");
        const myModal = new bootstrap.Modal(document.getElementById("myModal"));

        let errors = [];

        // 1. Contrôle des champs texte (5 caractères minimum)
        if (name.length < 5) {
            errors.push("Le <strong>Nom</strong> doit contenir au moins 5 caractères.");
        }
        if (firstname.length < 5) {
            errors.push("Le <strong>Prénom</strong> doit contenir au moins 5 caractères.");
        }
        if (address.length < 5) {
            errors.push("L'<strong>Adresse postale</strong> doit contenir au moins 5 caractères.");
        }

        // 2. Contrôle de l'email
        if (!validateEmail(email)) {
            errors.push("L'<strong>Adresse mail</strong> n'est pas valide.");
        }

        // 3. Contrôle de la date de naissance (pas dans le futur)
        if (!birthday) {
            errors.push("Veuillez saisir une <strong>Date de naissance</strong>.");
        } else {
            const birthdayDate = new Date(birthday);
            const birthdayTimestamp = birthdayDate.getTime();
            const nowTimestamp = Date.now();

            if (birthdayTimestamp > nowTimestamp) {
                errors.push("La <strong>Date de naissance</strong> ne peut pas être située dans le futur.");
            }
        }

        // 4. Affichage dans la modale
        if (errors.length > 0) {
            // Cas d'erreur : affichage de la liste des champs invalides
            modalTitle.textContent = "Erreur de validation";
            modalBody.innerHTML = `
                <div class="alert alert-danger mb-0" role="alert">
                    <p class="mb-2">Veuillez corriger les erreurs suivantes :</p>
                    <ul class="mb-0 ps-3">
                        ${errors.map(err => `<li>${err}</li>`).join('')}
                    </ul>
                </div>
            `;
            myModal.show();
        } else {
            // Cas de succès : affichage des informations validées
            modalTitle.textContent = `Bienvenue ${firstname} ${name}`;
            
            // Formatage de la date en français
            const dateFormatted = new Date(birthday).toLocaleDateString('fr-FR');
            
            // Construction du lien Google Maps dynamique
            const mapsUrl = `http://maps.google.com/maps?q=${encodeURIComponent(address)}`;
            
            modalBody.innerHTML = `
                <p>Vous êtes né(e) le <strong>${dateFormatted}</strong>.</p>
                <p>Vous habitez à : <a href="${mapsUrl}" target="_blank" class="fw-bold text-info">${address}</a></p>
                <p>Votre adresse email : <a href="mailto:${email}" class="text-info">${email}</a></p>
            `;
            myModal.show();
        }
    });
};