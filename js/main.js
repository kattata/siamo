"use strict";

let data;

fetch("https://siamo.kattata.online/wp-json/wp/v2/posts?_embed")
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        selectEvent(json);
        data = json;

    });


function selectEvent(posts) {
    let categories = [];
    let noDuplicatedCategories;

    for (const post of posts) {
        categories.push(post.categories);
        let flatCategories = categories.flat();
        noDuplicatedCategories = [...new Set(flatCategories)];

        // document.querySelector('.teams').innerHTML += `
        // <h3>${post.acf.event_name}</h3>
        // `;
    }
    eventSelected(noDuplicatedCategories);
}

async function eventSelected(categories) {
    let response = await fetch(`https://siamo.kattata.online/wp-json/wp/v2/posts?_embed&categories=${categories}`);
    let data = await response.json();
    appendEventsByCategory(data);
}




function appendEventsByCategory(posts) {

    // group events by name
    var eventsByName = {};
    for (var key in posts) {
        var name = posts[key].acf.event_name;
        if (!eventsByName[name]) {
            eventsByName[name] = [];
        }
        eventsByName[name].push(posts[key]);
    }


    for (const key in eventsByName) {
        if (eventsByName.hasOwnProperty(key)) {
            const element = eventsByName[key];

            document.querySelector('#teams').innerHTML += `
                <div class="event-by-name" id="eventName-${element[0].acf.event_name}">
                
                <h2 class="event_name">${element[0].acf.event_name}</h2>
                <h3 class="number">P</h3>
                <h3 class="number">GP</h3>
                <h3 class="number">W/D/L</h3>
                <h3 class="number">GS/GC</h3>
                <h3 class="number">+/-</h3>
                <p class="team_name">${element[0].acf.team_name}</p>
                <p1>${element[0].acf.points}</p1>
                <p1>${element[0].acf.games_played}</p1>
                <p1>${element[0].acf.wins} / ${element[0].acf.draws} / ${element[0].acf.loses}</p1>
                <p1>${element[0].acf.goals_scored} / ${element[0].acf.goals_conceded}</p1>
                <p1>${element[0].acf.difference}</p1>
                </div>
            `;
        }
    }

}

