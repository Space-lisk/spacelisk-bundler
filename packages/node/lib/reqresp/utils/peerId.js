export function prettyPrintPeerId(peerId) {
    const id = peerId.toString();
    return `${id.substr(0, 2)}...${id.substr(id.length - 6, id.length)}`;
}
//# sourceMappingURL=peerId.js.map