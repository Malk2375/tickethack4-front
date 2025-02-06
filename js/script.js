// Écouteur d'événement pour le bouton de recherche
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
            resultsDiv.innerHTML = ''; // Réinitialise les résultats

            if (data.trip.length > 0) {
                data.trip.forEach(trip => {
                    // Générer le HTML pour chaque trajet
                    resultsDiv.innerHTML += `
                        <strong>Départ:</strong> ${trip.departure} <br>
                        <strong>Arrivée:</strong> ${trip.arrival} <br>
                        <strong>Date:</strong> ${new Date(trip.date).toLocaleString()} <br>
                        <strong>Prix:</strong> ${trip.price} € <br>
                        <button class="btn btn-success" id="add-trip" data-trip-id="${trip._id}">Add to cart</button><br><br>
                    `;
                });
            } else {
                resultsDiv.innerHTML = 'Aucun trajet trouvé pour cette recherche.';
            }
        } else {
            const data = await response.json();
            document.getElementById('results').innerHTML = `Erreur : ${data.message}`;
        }
    } catch (error) {
        document.getElementById('results').innerHTML = 'Une erreur est survenue. Veuillez réessayer.';
    }
});
async function getCartItems() {
    const response = await fetch('http://localhost:3000/cart', 
        {
            method: 'GET',
            credentials : 'include'
        }
    );
    const data = await response.json();
    console.log(data);
    return data;
}
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
document.getElementById('results').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('btn-success')) {
        const tripId = event.target.getAttribute('data-trip-id');
        console.log('Trip ID:', tripId);
    
        if (tripId) {
            console.log('Envoi de la requête pour ajouter au panier...');
            fetch("http://localhost:3000/cart/add", {
                method: "POST",
                credentials : 'include',
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ tripId }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Réponse du serveur:', data); 
                displayCart();
            })

            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
        }
    }
    // if (tripId.trim().length > 0) {
    //   fetch("https://weather-app-nu-five-64.vercel.app/weather", {
    //     method: "POST",
    //     headers: {
    //       "Content-type": "application/json",
    //     },
    //     body: JSON.stringify({ cityName: cityName }),
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       if (data.result) {
    //         document.querySelector("#cityList").innerHTML += `      
    //           <div class="cityContainer">
    //               <p class="name">${data.weather.cityName}</p>
    //               <p class="description">${data.weather.description}</p>
    //               <img class="weatherIcon" src="images/${data.weather.main}.png" />
    //               <div class="temperature">
    //                       <p class="tempMin">${data.weather.tempMin}°C</p>
    //                       <span>-</span>
    //                       <p class="tempMax">${data.weather.tempMax}°C</p>
    //               </div>
    //               <button class="deleteCity" id="${data.weather.cityName}">Delete</button>
    //           </div>`;
    //         deleteCity();
    //         document.querySelector("#cityNameInput").value = "";
    //       }
    //     });
    // } else {
    //   alert("Vous devez remplir le champ de saisie !");
    // }
  });

// function addTripToCard() {
//     const buttons = document.querySelector("#add-trip");
//     for (let i = 0; i < buttons.length; i++) {
//         buttons[i].addEventListener("click", function () {

//           fetch(`http://localhost:3000/cart/add`, {
//             method: "POST",
//             headers: {
//                 "Content-type": "application/json",
//             },
//             body: JSON.stringify({ tripId }),
//           })
//             .then((response) => response.json())
//             .then((data) => {
//                 if (data.result) {
//                   document.querySelector("#cart-items").innerHTML += `      
//                     <div class="tripsContainer">
//                         <p class="name">${data.trip.cityName}</p>
//                         <p class="description">${data.weather.description}</p>
//                         <img class="weatherIcon" src="images/${data.weather.main}.png" />
//                         <div class="temperature">
//                                 <p class="tempMin">${data.weather.tempMin}°C</p>
//                                 <span>-</span>
//                                 <p class="tempMax">${data.weather.tempMax}°C</p>
//                         </div>
//                         <button class="deleteCity" id="${data.weather.cityName}">Delete</button>
//                     </div>`;
//                   deleteCity();
//                   document.querySelector("#cityNameInput").value = "";
//                 }
//               });
//         });
//       }
// }