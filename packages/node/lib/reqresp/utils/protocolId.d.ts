import { Encoding, Protocol } from "../types";
/**
 * https://github.com/ethereum/consensus-specs/blob/v1.2.0/specs/phase0/p2p-interface.md#protocol-identification
 */
export declare function formatProtocolID(protocolPrefix: string, method: string, version: number, encoding: Encoding): string;
/**
 * https://github.com/ethereum/consensus-specs/blob/v1.2.0/specs/phase0/p2p-interface.md#protocol-identification
 */
export declare function parseProtocolID(protocolId: string): Protocol;
//# sourceMappingURL=protocolId.d.ts.map