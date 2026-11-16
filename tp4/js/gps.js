// Demande de la localisation HTML5 à l'utilisateur
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.querySelector("#map").innerHTML =
      '<div class="alert alert-danger mt-2 mb-0">La géolocalisation n\'est pas supportée par ce navigateur.</div>';
  }
}

// Récupération des coordonnées et affichage de la carte OpenStreetMap
function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Remplissage automatique du champ Adresse avec les coordonnées GPS
  const addressInput = document.querySelector("#address");
  if (addressInput) {
    addressInput.value = `${lat},${lon}`;
    if (typeof calcNbChar === "function") {
      calcNbChar("address");
    }
  }

  // Paramètres pour l'affichage de la carte OpenStreetMap
  const zoom = 5;
  const delta = 0.05 / Math.pow(2, zoom - 10);

  const bboxEdges = {
    south: lat - delta,
    north: lat + delta,
    west: lon - delta,
    east: lon + delta,
  };

  const bbox = `${bboxEdges.west}%2C${bboxEdges.south}%2C${bboxEdges.east}%2C${bboxEdges.north}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  // Injection de l'iframe dans #map
  document.getElementById("map").innerHTML = `
    <iframe
      class="mt-2 rounded border"
      width="100%"
      height="220"
      frameborder="0"
      scrolling="no"
      src="${iframeSrc}">
    </iframe>
  `;
}

// Gestion des erreurs ou refus de géolocalisation
function showError(error) {
  let message = "";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "L'utilisateur a refusé la demande de géolocalisation.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Les informations de localisation sont indisponibles.";
      break;
    case error.TIMEOUT:
      message = "La demande de localisation a expiré.";
      break;
    default:
      message = "Une erreur inconnue est survenue.";
      break;
  }
  document.querySelector("#map").innerHTML =
    `<div class="alert alert-warning mt-2 mb-0">${message}</div>`;
}