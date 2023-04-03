socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    handleData(data);
}

document.addEventListener('DOMContentLoaded', () => {
    const data = {}
    socket.send(JSON.stringify(''));
})
