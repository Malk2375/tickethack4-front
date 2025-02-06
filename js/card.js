async function getCartItems() {
    try {
        const response = await fetch('https://tickethack4.vercel.app/cart');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la récupération du panier');
        }

        console.log(data);
        return data.cart; // Retourne directement la liste des trajets dans le panier
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function displayCart() {
    const cartItems = await getCartItems();
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = '';

    if (!cartItems.length) {
        cartDiv.innerHTML = `<p>Votre panier est vide.</p>`; // Affiche un message si le panier est vide
        return;
    }

    cartItems.forEach(item => {
        const trip = item.trip;
        cartDiv.innerHTML += `
            <div class="cart-item card mb-3">
                <div class="card-body">
                    <p><strong>Départ:</strong> ${trip.departure}</p>
                    <p><strong>Arrivée:</strong> ${trip.arrival}</p>
                    <p><strong>Date:</strong> ${new Date(trip.date).toLocaleString()}</p>
                    <p><strong>Prix:</strong> ${trip.price} €</p>
                    <button class="btn btn-danger" onclick="removeFromCart('${item._id}')">Delete</button>
                    <button class="btn btn-success" onclick="payForTrip('${item._id}')">Buy</button>
                </div>
            </div>
        `;
    });
}

async function removeFromCart(cartItemId) {
    try {
        const response = await fetch(`https://tickethack4.vercel.app/${cartItemId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la suppression du trajet');
        }

        alert('Trajet supprimé du panier');
        displayCart();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function payForTrip(cartItemId) {
    try {
        const response = await fetch(`https://tickethack4.vercel.app/cart/pay/${cartItemId}`, {
            method: 'POST'
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors du paiement');
        }

        alert('Trajet payé et ajouté aux réservations');
        window.location.href = 'bookings.html';
        // displayCart();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

displayCart();
