export default class RpcError extends Error {
    // error codes from: https://eips.ethereum.org/EIPS/eip-1474
    constructor(msg, code, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data = undefined) {
        super(msg);
        this.code = code;
        this.data = data;
    }
}
//# sourceMappingURL=rpc-error.js.map