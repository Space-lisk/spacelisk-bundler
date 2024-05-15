export class Web3API {
    constructor(web3Module) {
        this.web3Module = web3Module;
    }
    clientVersion() {
        return this.web3Module.clientVersion();
    }
}
//# sourceMappingURL=web3.js.map