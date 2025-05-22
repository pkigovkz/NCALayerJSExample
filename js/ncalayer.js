var SOCKET_URL = 'wss://127.0.0.1:13579/';
var callback = null;
var response;
var sampleLogo = "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";

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

    if (document.getElementById("isArray").checked) {
        dataToSign = [
            dataToSign
        ];
    }

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

    // you can put your own logo on the signing dialog. otherwise it will be empty. max 50000 chars in base64
    signInfo.args.logo = sampleLogo;

    if (document.getElementById("isAllowExpired").checked) {
        signInfo.args.signingParams.allowExpired = true;
    }

    if (document.getElementById("isAllowRevoked").checked) {
        signInfo.args.signingParams.allowRevoked = true;
    }

    if (document.getElementById("isOutputCert").checked) {
        signInfo.args.signingParams.outputCert = true;
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
                                if (result.hasOwnProperty('signature')) {
                                    var signature = result.signature;
                                    var certificate = result.certificate;
                                    $("#signature").val(signature + "\n" + certificate);
                                } else {
                                    $("#signature").val(result);
                                }
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
