export var ClientKind;
(function (ClientKind) {
    ClientKind["Skandha"] = "Skandha";
    ClientKind["Stackup"] = "Stackup";
    ClientKind["Infinitism"] = "Infitinism";
    ClientKind["Voltaire"] = "Voltaire";
    ClientKind["Unknown"] = "Unknown";
})(ClientKind || (ClientKind = {}));
export function clientFromAgentVersion(agentVersion) {
    const slashIndex = agentVersion.indexOf("/");
    const agent = slashIndex >= 0 ? agentVersion.slice(0, slashIndex) : agentVersion;
    const agentLC = agent.toLowerCase();
    if (agentLC === "skandha" || agentLC === "js-libp2p")
        return ClientKind.Skandha;
    return ClientKind.Unknown;
}
//# sourceMappingURL=client.js.map