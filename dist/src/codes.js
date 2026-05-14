export var Close;
(function (Close) {
    Close[Close["NormalClosure"] = 1000] = "NormalClosure";
    Close[Close["GoingAway"] = 1001] = "GoingAway";
    Close[Close["ProtocolError"] = 1002] = "ProtocolError";
    Close[Close["UnsupportedData"] = 1003] = "UnsupportedData";
    Close[Close["NoStatusReceived"] = 1005] = "NoStatusReceived";
    Close[Close["AbnormalClosure"] = 1006] = "AbnormalClosure";
    Close[Close["InvalidPayloadData"] = 1007] = "InvalidPayloadData";
    Close[Close["PolicyViolation"] = 1008] = "PolicyViolation";
    Close[Close["MessageTooBig"] = 1009] = "MessageTooBig";
    Close[Close["MandatoryExtension"] = 1010] = "MandatoryExtension";
    Close[Close["ServerError"] = 1011] = "ServerError";
    Close[Close["ServiceRestart"] = 1012] = "ServiceRestart";
    Close[Close["TryAgainLater"] = 1013] = "TryAgainLater";
    Close[Close["BadGateway"] = 1014] = "BadGateway";
    Close[Close["TLSHandshake"] = 1015] = "TLSHandshake";
})(Close || (Close = {}));
;
export var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["Connecting"] = 0] = "Connecting";
    ConnectionState[ConnectionState["Open"] = 1] = "Open";
    ConnectionState[ConnectionState["Closing"] = 2] = "Closing";
    ConnectionState[ConnectionState["Closed"] = 3] = "Closed";
})(ConnectionState || (ConnectionState = {}));
;
