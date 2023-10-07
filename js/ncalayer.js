var SOCKET_URL = 'wss://127.0.0.1:13579/';
var callback = null;
var response;

async function sign() {
    await request();
}

function connect() {
    if (connect.webSocket && connect.webSocket.readyState < 2) {
        console.log("reusing the socket connection [state = " + connect.webSocket.readyState + "]: " + connect.webSocket.url);
        return Promise.resolve(connect.webSocket);
    }

    return new Promise(function (resolve, reject) {
        connect.webSocket = new WebSocket(SOCKET_URL);

        connect.webSocket.onopen = function () {
            console.log("socket connection is opened [state = " + connect.webSocket.readyState + "]: " + connect.webSocket.url);
            resolve(connect.webSocket);
        };

        connect.webSocket.onerror = function (err) {
            unblockScreen();
            console.error("socket connection error : ", err);
            reject(err);
        };

        connect.webSocket.onclose = function (event) {
            if (event.wasClean) {
                console.error("socket connection is closed ");
            } else {
                console.log('Connection error');
                openDialog();
            }
            console.log('Code: ' + event.code + ' Reason: ' + event.reason);
        };
    });
}

async function request() {
    blockScreen();

    var selectedStorages = []
    var storageCheckboxes = document.querySelectorAll('input[name=storage-check]:checked')
    for (var i = 0; i < storageCheckboxes.length; i++) {
        selectedStorages.push(storageCheckboxes[i].value)
    }

    var signatureType = document.getElementById('signatureType').value;

    var dataToSign = document.getElementById("dataToSign").value;

    var decode = $('input[name=decode]:checked').val();

    var encapsulate = $('input[name=encapsulate]:checked').val();

    var digested = $('input[name=digested]:checked').val();

    var extKeyUsageOidString = document.getElementById("extKeyUsageOids").value;
    var extKeyUsageOids = extKeyUsageOidString ? extKeyUsageOidString.split(",") : [];

    var caCertsString = document.getElementById("caCerts").value;
    var caCerts;
    if (document.getElementById("buildChain").checked) {
        caCerts = caCertsString ? caCertsString.split(",") : null;
    } else {
        caCerts = null;
        // caCerts = []; // CertPathBuilder will not be invoked. Any certificate will be accepted.
    }

    var localeRadio = $('input[name=locale]:checked').val();

    var tsaProfile = null;
    if (document.getElementById("tsaProfile").checked) {
        tsaProfile = {};
    }

    var iin = $('input[name=iin]').val();
    var bin = $('input[name=bin]').val();
    var serialNumber = $('input[name=serialNumber]').val();

    var signInfo = {
        "module": "kz.gov.pki.knca.basics",
        "method": "sign",
        "args": {
            "allowedStorages": selectedStorages,
            "format": signatureType,
            "data": dataToSign,
            "signingParams": { decode, encapsulate, digested, tsaProfile },
            "signerParams": {
                "extKeyUsageOids": extKeyUsageOids,
                "iin": iin,
                "bin": bin,
                "serialNumber": serialNumber,
                "chain": caCerts
            },
            "locale": localeRadio
        }
    }

    if (selectedStorages.length == 0) {
        delete signInfo.args.allowedStorages;
    }

    return connect().then((webSocket) => {

        webSocket.send(JSON.stringify(signInfo))

        return new Promise((resolve, reject) => {
            webSocket.onmessage = ({ data }) => {
                response = JSON.parse(data);
                if (response != null) {
                    var responseStatus = response['status'];
                    if (responseStatus === true) {
                        var responseBody = response['body'];
                        if (responseBody != null) {
                            unblockScreen();
                            if (responseBody.hasOwnProperty('result')) {
                                var result = responseBody.result;
                                $("#signature").val(result);
                            }
                        }
                    } else if (responseStatus === false) {
                        unblockScreen();
                        var responseCode = response['code'];
                        alert(responseCode);
                    }
                }
                resolve(response);
            }
        })
    })
        .catch(function (err) {
            unblockScreen();
            console.log(err)
        });
}


function blockScreen() {
    $.blockUI({
        message: '<img src="js/loading.gif" /><br/>NCALayer-дің жауабын күте тұрыңыз<br/>Подождите, выполняется операция в NCALayer...',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    });
}

function unblockScreen() {
    $.unblockUI();
}

function openDialog() {
    if (confirm("NCALayer-ге қосылғанда қате шықты. NCALayer-ды қайта қосып, ОК-ді басыңыз\nОшибка при подключении к NCALayer. Запустите NCALayer и нажмите ОК") === true) {
        location.reload();
    }
}
