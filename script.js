document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const departure = document.getElementById('departure').value;
    const arrival = document.getElementById('arrival').value;
    const date = document.getElementById('date').value;

    let url = `http://localhost:3000/trips/${departure}/${arrival}/${date}`;

    try {
        const response = await fetch(url);
        console.log(response);

        if (response.ok) {
            // Si la réponse est OK, afficher les résultats
            const data = await response.json();
            const resultsDiv = document.getElementById('results');

            if (data.trip.length > 0) {
                resultsDiv.innerHTML = '<ul>';
                data.trip.forEach(trip => {
                    resultsDiv.innerHTML += `
                        <li>
                            <strong>Départ:</strong> ${trip.departure} <br>
                            <strong>Arrivée:</strong> ${trip.arrival} <br>
                            <strong>Date:</strong> ${new Date(trip.date).toLocaleString()} <br>
                            <strong>Prix:</strong> ${trip.price} € <br><br>
                        </li>
                    `;
                });
                resultsDiv.innerHTML += '</ul>';
            } else {
                resultsDiv.innerHTML = 'Aucun trajet trouvé pour cette recherche.';
            }
        } else {
            // Si la réponse échoue, afficher l'erreur
            const data = await response.json();
            document.getElementById('results').innerHTML = `Erreur : ${data.message}`;
        }
    } catch (error) {
        // Si une erreur survient dans la requête
        document.getElementById('results').innerHTML = 'Une erreur est survenue. Veuillez réessayer.';
    }
});