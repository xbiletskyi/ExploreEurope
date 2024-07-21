document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('searchButton').addEventListener('click', function () {
        const origin = document.getElementById('origin').value;
        const destination = document.getElementById('destination').value;
        const departureAt = document.getElementById('departureAt').value;
        const returnBefore = document.getElementById('returnBefore').value;
        const budget = document.getElementById('budget').value;
        const minStay = document.getElementById('minStay').value;
        const maxStay = document.getElementById('maxStay').value;
        const schengenOnly = document.getElementById('schengenOnly').checked;
        const timeLimitSeconds = document.getElementById('timeLimitSeconds').value;

        if (!origin || !departureAt || !budget) {
            alert("Origin, Departure At, and Budget are mandatory fields.");
            return;
        }

        let url = `http://localhost:60001/v1/trips?origin=${origin}&departureAt=${departureAt}&budget=${budget}`;

        if (destination) {
            url += `&destination=${destination}`;
        }
        if (returnBefore) {
            url += `&returnBefore=${returnBefore}`;
        }
        if (minStay) {
            url += `&minStay=${minStay}`;
        }
        if (maxStay) {
            url += `&maxStay=${maxStay}`;
        }
        if (schengenOnly) {
            url += `&schengenOnly=${schengenOnly}`;
        }
        if (timeLimitSeconds) {
            url += `&timeLimitSeconds=${timeLimitSeconds}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(trips => {
                populateTable(trips);
                $('#tripTable').DataTable();
            })
            .catch(error => { console.error('Error fetching data: ', error); });
    });
});

function populateTable(trips) {
    const tableBody = document.querySelector('#tripTable tbody');
    tableBody.innerHTML = '';  // Clear any existing rows
    trips.forEach((trip) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trip.totalPrice}</td>
            <td>${trip.totalFlights}</td>
            <td>${trip.uniqueCities}</td>
            <td>${trip.uniqueCountries}</td>
            <td>${new Date(trip.departureAt).toLocaleDateString()}</td>
            <td>${new Date(trip.arrivalAt).toLocaleDateString()}</td>
            <td>${formatTripSchedule(trip.tripSchedule)}</td>
        `;
        tableBody.appendChild(row);
    });
}

function formatTripSchedule(schedule) {
    return schedule.map(flight => `
        ${flight.flightNumber} from ${flight.originAirportName} (${flight.originAirportCode}) to ${flight.destinationAirportName} (${flight.destinationAirportCode}) on ${new Date(flight.departureAt).toLocaleString()}
    `).join('<br>');
}

function encodeCredentials(username, password) {
    return btoa(`${username}:${password}`);
}
