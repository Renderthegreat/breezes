export var Disconnect;
(function (Disconnect) {
    Disconnect[Disconnect["NormalClosure"] = 1000] = "NormalClosure";
    Disconnect[Disconnect["GoingAway"] = 1001] = "GoingAway";
    Disconnect[Disconnect["ProtocolError"] = 1002] = "ProtocolError";
    Disconnect[Disconnect["UnsupportedData"] = 1003] = "UnsupportedData";
    Disconnect[Disconnect["NoStatusReceived"] = 1005] = "NoStatusReceived";
    Disconnect[Disconnect["AbnormalClosure"] = 1006] = "AbnormalClosure";
    Disconnect[Disconnect["InvalidPayloadData"] = 1007] = "InvalidPayloadData";
    Disconnect[Disconnect["PolicyViolation"] = 1008] = "PolicyViolation";
    Disconnect[Disconnect["MessageTooBig"] = 1009] = "MessageTooBig";
    Disconnect[Disconnect["MandatoryExtension"] = 1010] = "MandatoryExtension";
    Disconnect[Disconnect["ServerError"] = 1011] = "ServerError";
    Disconnect[Disconnect["ServiceRestart"] = 1012] = "ServiceRestart";
    Disconnect[Disconnect["TryAgainLater"] = 1013] = "TryAgainLater";
    Disconnect[Disconnect["BadGateway"] = 1014] = "BadGateway";
    Disconnect[Disconnect["TLSHandshake"] = 1015] = "TLSHandshake";
})(Disconnect || (Disconnect = {}));
;
export var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["Connecting"] = 0] = "Connecting";
    ConnectionState[ConnectionState["Open"] = 1] = "Open";
    ConnectionState[ConnectionState["Closing"] = 2] = "Closing";
    ConnectionState[ConnectionState["Closed"] = 3] = "Closed";
})(ConnectionState || (ConnectionState = {}));
;
