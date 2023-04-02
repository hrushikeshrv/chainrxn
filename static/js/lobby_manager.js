const lobbyNameInput = document.querySelector('#lobby-name');
const joinLobbyButton = document.querySelector('#join-lobby');

lobbyNameInput.onkeyup = function(e) {
    if (e.keyCode === 13) joinLobbyButton.click();
}

joinLobbyButton.addEventListener('click', () => {
    const lobbyName = lobbyNameInput.value;
    if (!lobbyName) return;
    window.location.pathname = '/live/' + lobbyName;
})