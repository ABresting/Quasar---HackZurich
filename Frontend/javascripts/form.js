const submit = document.getElementById('form_button');

submit.addEventListener("click", function (event) {
    let address = document.getElementById('address').value;
    if(address[0]=='0'&&address[1]=='1'){
        address = address.slice(2);
        console.log("Trimming the prefix")
    }
    console.log(address)
    const amount = document.getElementById('amount').value;
    event.preventDefault();
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "http://139.59.103.146:3000/mintnft";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({"address" : address, "nft_type": "GymNFT", "nft_count": amount}));
    console.log("Request made")
    window.location.href = "success.html";
});