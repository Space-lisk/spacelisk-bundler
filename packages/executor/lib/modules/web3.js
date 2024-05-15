export class Web3 {
    constructor(config, version) {
        this.config = config;
        this.version = version;
    }
    clientVersion() {
        return `skandha/${this.version.version}-${this.version.commit}`;
    }
}
//# sourceMappingURL=web3.js.map