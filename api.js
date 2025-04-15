const API_URL = "https://example.com/api/emissions";

function fetchEmissionsData() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => console.log("Emissions Data:", data))
    .catch(err => console.error("API Error:", err));
}
