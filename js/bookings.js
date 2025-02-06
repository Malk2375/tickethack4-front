async function getBookedItems() {
    try {
        const response = await fetch('https://tickethack4.vercel.app/bookings');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récup de vos bookings');
        }

        console.log(data);
        return data.bookings;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function displayBookings() {
    const bookedItems = await getBookedItems();
    const bookedItemsDiv = document.getElementById('booked-items');
    bookedItemsDiv.innerHTML = '';

    if (!bookedItems.length) {
        bookedItemsDiv.innerHTML = `<p>Vous n'avez pas encore de trajets payés.</p>`;
        return;
    }

    bookedItems.forEach(item => {
        const trip = item.trip;
        const departureTime = new Date(trip.date);
        const now = new Date();
    
        const timeDiff = departureTime - now;
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        let timeRemainingText;
        if (timeDiff > 0) {
            timeRemainingText = `Départ dans ${hours}h ${minutes}min`;
        } else {
            timeRemainingText = `Trajet déjà parti`;
        }

        bookedItemsDiv.innerHTML += `
            <div class="cart-item card mb-3">
                <div class="card-body">
                    <p><strong>Départ:</strong> ${trip.departure}</p>
                    <p><strong>Arrivée:</strong> ${trip.arrival}</p>
                    <p><strong>Date:</strong> ${departureTime.toLocaleString()}</p>
                    <p><strong>Prix:</strong> ${trip.price} €</p>
                    <p><strong>Temps restant:</strong> ${timeRemainingText}</p>
                    <button class="btn btn-danger" onclick="removeFromBookings('${item._id}')">Delete</button>
                </div>
            </div>
        `;
    });
}

async function removeFromBookings(bookedItemId) {
    try {
        const response = await fetch(`https://tickethack4.vercel.app/bookings/delete/${bookedItemId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la suppression du trajet');
        }

        alert('Trajet supprimé de vos bookings');
        displayBookings();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

displayBookings();
