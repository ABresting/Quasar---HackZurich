function select(arg) {
    if (arg == "task") {
        document.getElementById('selected').id = "";
        document.getElementById('tasks').classList.add('opened');
        document.getElementById('collection').classList.remove('opened');
        document.getElementById('rewards').classList.remove('opened');
        document.getElementById('collection').classList.add('closed');
        document.getElementById('tasks').classList.remove('closed');
        document.getElementById('rewards').classList.add('closed');
        document.getElementsByTagName('option')[0].id = "selected";

    } else if (arg == "nft") {
        document.getElementById('selected').id = "";
        document.getElementById('tasks').classList.add('closed');
        document.getElementById('collection').classList.add('opened');
        document.getElementById('tasks').classList.remove('opened');
        document.getElementById('collection').classList.remove('closed');
        document.getElementById('rewards').classList.remove('opened');
        document.getElementById('rewards').classList.add('closed');
        document.getElementsByTagName('option')[1].id = "selected";
    } else if ("rewards") {
        document.getElementById('selected').id = "";
        document.getElementById('tasks').classList.add('closed');
        document.getElementById('collection').classList.add('closed');
        document.getElementById('tasks').classList.remove('opened');
        document.getElementById('collection').classList.remove('opened');
        document.getElementById('rewards').classList.remove('closed');
        document.getElementById('rewards').classList.add('opened');
        document.getElementsByTagName('option')[2].id = "selected";
    }
}

function copyAddress(address) {
    navigator.clipboard.writeText(address);
    document.getElementById('copy_alert').style.display = "block";
    setTimeout(hideAlert, 1500);

}

function openQR() {
    document.getElementById('qr_box').style.display = "flex";
}

function closeQR() {
    document.getElementById('qr_box').style.display = "none";
}

function hideAlert() {
    document.getElementById('copy_alert').style.display = "none";
}

