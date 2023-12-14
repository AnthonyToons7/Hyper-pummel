function fetchLeaderBoard(type) {
    return fetch(`/games/hyper-pummel/private/fetchLeaderboard.php?filterType=${type}`)
    .then(function(response) {
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        return response.json();
    })
    .then(function(users) {
        return users;
    })
    .catch(function(error) {
        throw error;
    });
}

const buttons = document.querySelectorAll(".button-filter");
buttons.forEach(button => {
    button.addEventListener("click",()=>{
        document.querySelectorAll(".leaderboard-place").forEach(player=>player.remove());
        let rankNumber = 1;
        getUsers(button.id, rankNumber)

    })
});
function getUsers(id, rankNumber) {
    try {
        fetchLeaderBoard(id)
        .then(function(users) {
            users.forEach(function(player, index) {
                const container = document.createElement("div");
                const rank = document.createElement("div");
                const name = document.createElement("div");
                const type = document.createElement("div");
                const cps = document.createElement("div");
                const date = document.createElement("div");
                const browser = document.createElement("div");

                rank.textContent = rankNumber;
                name.textContent = player["PLAYER_NAME"];
                type.textContent = player["TYPE"];
                cps.textContent = player["CPS"];
                date.textContent = player["DATE"];
                browser.textContent = player["BROWSER"];

                const placeClasses = ["first", "second", "third"];
                if (index < placeClasses.length) {
                    container.classList.add(placeClasses[index]);
                }
                container.classList.add("leaderboard-place");

                container.append(rank, name, type, cps, date, browser);
                document.querySelector(".leaderboard").appendChild(container);
                rankNumber++;
            });
        })
    } catch (error) {
            
    }
}
document.addEventListener("DOMContentLoaded",()=>{
    getUsers("controller", 1)
})