document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const departure = document.getElementById('departure').value;
    const arrival = document.getElementById('arrival').value;
    const date = document.getElementById('date').value;

    const urlSearch = `http://localhost:3000/trips/${departure}/${arrival}/${date}`;
    const urlAddToCart = 'http://localhost:3000/cart/add/';

    try {
        const response = await fetch(urlSearch);
        if (response.ok) {
            const data = await response.json();
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            if (data.trip.length > 0) {
                data.trip.forEach(trip => {
                    resultsDiv.innerHTML += `
                        <strong>Départ:</strong> ${trip.departure} <br>
                        <strong>Arrivée:</strong> ${trip.arrival} <br>
                        <strong>Date:</strong> ${new Date(trip.date).toLocaleString()} <br>
                        <strong>Prix:</strong> ${trip.price} € <br>
                        <button class="btn btn-success add-to-cart-btn" data-id="${trip._id}">Add to card</button><br><br>
                    `;
                });
                document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const tripId = this.getAttribute('data-id');
                        addToCart(tripId);
                    });
                });
            } else {
                resultsDiv.innerHTML = 'Aucun trajet trouvé pour cette recherche.';
                const imageElement = document.createElement('img');
                imageElement.src = 'images/train.png';
                imageElement.alt = 'Pas de résultats';
                resultsDiv.appendChild(imageElement);
            }
        } else {
            const data = await response.json();
            const messageElement = document.getElementById('results');
            messageElement.innerHTML = `${data.message}`;

            if (data.imagePath) {
            const imageElement = document.createElement('img');
            imageElement.src = data.imagePath; 
            imageElement.alt = 'Image d\'erreur'; 
            messageElement.appendChild(imageElement); 
            }
        }
    } catch (error) {
        document.getElementById('results').innerHTML = 'Une erreur est survenue. Veuillez réessayer.';
    }
});
async function addToCart(tripId) {
    try {
        const response = await fetch('http://localhost:3000/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tripId })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de l’ajout au panier');
        }

        alert('Trajet ajouté au panier !');
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}