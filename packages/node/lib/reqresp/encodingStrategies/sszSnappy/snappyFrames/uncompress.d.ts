import { Uint8ArrayList } from "uint8arraylist";
export declare class SnappyFramesUncompress {
    private buffer;
    private state;
    /**
     * Accepts chunk of data containing some part of snappy frames stream
     * @param chunk
     * @return Buffer if there is one or more whole frames, null if it's partial
     */
    uncompress(chunk: Uint8ArrayList): Uint8ArrayList | null;
    reset(): void;
}
//# sourceMappingURL=uncompress.d.ts.map