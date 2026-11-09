window.onload = () => {
    // Récupération des paramètres envoyés via la méthode GET dans l'URL
    const paramsString = document.location.search;
    const searchParams = new URLSearchParams(paramsString);

    // Iterating the search parameters
    for (const param of searchParams) {
        console.log(param);

        const elementId = param[0];
        const elementValue = param[1];
        const element = document.getElementById(elementId);

        if (element !== null) {
            element.textContent = elementValue;
        }

        if (param[0] === "address") {
            element.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(elementValue)}`;
        } else if (param[0] === "email") {
            element.href = `mailto:${elementValue}?subject=Hello!&body=What's up?`;
        }
    }
};