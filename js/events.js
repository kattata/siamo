let defaultEvent;

// fetch all events
fetch("https://kasialaniecka.com/siamo/wp-json/tribe/events/v1/events")
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        appendCalendar(json);
        addEventInfo(json.events[0]);
    });


function appendCalendar(data) {
    // group events by months
    var eventsByMonth = {};
    for (var key in data.events) {
        var month = data.events[key].start_date_details.month;
        if (!eventsByMonth[month]) {
            eventsByMonth[month] = [];
        }
        eventsByMonth[month].push(data.events[key]);
    }

    // loop through the groups and display names of the months
    for (const key in eventsByMonth) {
        if (eventsByMonth.hasOwnProperty(key)) {
            const element = eventsByMonth[key];

            document.querySelector('.events-calendar').innerHTML += `
                <div class="event-by-month" id="event-${element[0].start_date_details.month}">
                <h2>${element[0].start_date_details.month}</h2>
                </div>
            `;
        }
    }
    // loop through events and assign them to months
    for (const event of data.events) {
        document.querySelector(`#event-${event.start_date_details.month}`).innerHTML += `
        <div class="events-calendar-line" onclick="selectEventId(this.id)" id="${event.id}">
        <p class="date">${event.start_date_details.day}/${event.start_date_details.month}/${event.start_date_details.year}</p>
        <p>${event.title}</p>
        </div>
         `;
    }
}

//fetch selected event
async function selectEventId(id) {
    let response = await fetch(`https://kasialaniecka.com/siamo/wp-json/tribe/events/v1/events/${id}`);
    let data = await response.json();
    addEventInfo(data);
    selectedEvent = data;
}

// add event info based on the selected event
function addEventInfo(e) {

    // add description
    document.querySelector('.events-details img').src = `${e.image.url}`;

    // add event info
    document.querySelector('.event-info').innerHTML = `
    <h2>${e.title}</h2>
    <div class="event-info-line">
        <p>Date:</p>
        <p>${e.start_date_details.day}/${e.start_date_details.month}/${e.start_date_details.year}</p>
    </div>
    <div class="event-info-line">
        <p>Time:</p>
        <p>${e.start_date_details.hour}:${e.start_date_details.minutes}</p>
    </div>
    <div class="event-info-line">
        <p>Place:</p>
        <p class="right-align">${e.venue.venue}</p>
    </div>
    <div class="event-info-line">
        <p>Address:</p>
        <p class="right-align">${e.venue.address}</p>
    </div>
    <div class="event-info-line">
        <p>Price:</p>
        <p>${e.cost}</p>
    </div>
    `;

    //add description
    document.querySelector('.event-description').innerHTML = `
    ${e.description}
    `;

}

// sign up modal
let signUpModal = document.querySelector('.signup-modal');
let signUpBg = document.querySelector('.signup-bg');

// show modal
let signUpBtn = document.querySelector(".signup-button");
signUpBtn.addEventListener('click', showSignUpModal);

let selectedEvent;

function showSignUpModal() {
    //slide out modal
    signUpModal.style.transform = "translateX(0px)";
    signUpBg.style.opacity = 0.3;
    signUpBg.style.visibility = "visible";

    //append selected event to the modal
    document.querySelector('.signup-modal-details').innerHTML = `
        <h2>${selectedEvent.title}</h2>
        <p>When</p>
        <h3>${selectedEvent.start_date_details.day}/${selectedEvent.start_date_details.month}/${selectedEvent.start_date_details.year} 
        at ${selectedEvent.start_date_details.hour}:${selectedEvent.start_date_details.minutes}</h3>
        <p>Where</p>
        <h3>${selectedEvent.venue.venue}, ${selectedEvent.venue.address}</h3>
        <p>Price</p>
        <h3>${selectedEvent.cost}</h3>
    `;
}

// hide modal
let cancelBtn = document.querySelector(".cancel-button");
cancelBtn.addEventListener('click', hideSignUpModal);

function hideSignUpModal(e) {
    e.preventDefault();
    //slide in modal
    signUpModal.style.transform = "translateX(400px)";
    signUpBg.style.opacity = 0;
    signUpBg.style.visibility = "hidden";
}

// confirm signup
let confirmBtn = document.querySelector(".confirm-buttton");
