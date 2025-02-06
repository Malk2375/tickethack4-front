// Fonction pour récupérer les éléments du panier
async function getCartItems() {
    const response = await fetch('http://localhost:3000/cart');
    const data = await response.json();
    console.log(data);
    return data;
}

// Fonction pour afficher les éléments du panier
async function displayCart() {
    const cartItems = await getCartItems();
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = ''; // Réinitialiser les éléments avant l'affichage

    if (cartItems.message) {
        cartDiv.innerHTML = `<p>${cartItems.message}</p>`; // Affiche le message si le panier est vide
        return;
    }

    cartItems.forEach(item => {
        cartDiv.innerHTML += `
            <div class="cart-item card mb-3">
                <div class="card-body">
                    <p><strong>Départ:</strong> ${item.departure}</p>
                    <p><strong>Arrivée:</strong> ${item.arrival}</p>
                    <p><strong>Date:</strong> ${new Date(item.date).toLocaleString()}</p>
                    <p><strong>Prix:</strong> ${item.price} €</p>
                    <button class="btn btn-danger" onclick="removeFromCart('${item._id}')">Supprimer</button>
                </div>
            </div>
        `;
    });
}

// Fonction pour supprimer un trajet du panier
async function removeFromCart(tripId) {
    const response = await fetch('http://localhost:3000/cart/remove', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tripId })
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        displayCart(); // Met à jour le panier après la suppression
    } else {
        alert('Erreur lors de la suppression du trajet');
    }
}

// Appel pour afficher les éléments au chargement
displayCart();
