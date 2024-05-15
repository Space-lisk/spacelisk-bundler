import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { BigNumber } from "ethers";
const tracer = readFileSync(resolve(process.cwd(), "packages", "executor", "tracer.js")).toString();
if (tracer == null) {
    throw new Error("Tracer not found");
}
const regexp = /function \w+\s*\(\s*\)\s*{\s*return\s*(\{[\s\S]+\});?\s*\}\s*$/;
const stringifiedTracer = tracer
    .match(regexp)[1]
    .replace(/\r\n/g, "")
    .replace(/( ){2,}/g, " ");
// UNCOMMENT FOR DEBUG PURPOSES
// eslint-disable-next-line no-console
// console.log(
//   JSON.stringify(
//     {
//       tracer: stringifiedTracer,
//     },
//     undefined,
//     2
//   )
// );
export class GethTracer {
    constructor(provider) {
        this.provider = provider;
    }
    async debug_traceCall(tx) {
        const { gasLimit, ...txWithoutGasLimit } = tx;
        const gas = `0x${BigNumber.from(gasLimit !== null && gasLimit !== void 0 ? gasLimit : 10e6)
            .toNumber()
            .toString(16)}`; // we're not using toHexString() of BigNumber, because it adds a leading zero which is not accepted by the nodes
        const ret = await this.provider.send("debug_traceCall", [
            {
                ...txWithoutGasLimit,
                gas,
            },
            "latest",
            {
                tracer: stringifiedTracer,
            },
        ]);
        return ret;
    }
    async debug_traceCallPrestate(tx) {
        const ret = await this.provider.send("debug_traceCall", [
            tx,
            "latest",
            { tracer: "prestateTracer" },
        ]);
        return ret;
    }
}
//# sourceMappingURL=GethTracer.js.map