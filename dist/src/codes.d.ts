export declare enum Disconnect {
    NormalClosure = 1000,
    GoingAway = 1001,
    ProtocolError = 1002,
    UnsupportedData = 1003,
    NoStatusReceived = 1005,
    AbnormalClosure = 1006,
    InvalidPayloadData = 1007,
    PolicyViolation = 1008,
    MessageTooBig = 1009,
    MandatoryExtension = 1010,
    ServerError = 1011,
    ServiceRestart = 1012,
    TryAgainLater = 1013,
    BadGateway = 1014,
    TLSHandshake = 1015
}
export declare enum ConnectionState {
    Connecting = 0,
    Open = 1,
    Closing = 2,
    Closed = 3
}
