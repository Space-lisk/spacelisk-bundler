import { Uint8ArrayList } from "uint8arraylist";
/**
 * Wraps a buffer chunk stream source with another async iterable
 * so it can be reused in multiple for..of statements.
 *
 * Uses a BufferList internally to make sure all chunks are consumed
 * when switching consumers
 */
export declare class BufferedSource {
    isDone: boolean;
    private buffer;
    private source;
    constructor(source: AsyncGenerator<Uint8ArrayList>);
    [Symbol.asyncIterator](): AsyncIterator<Uint8ArrayList>;
}
//# sourceMappingURL=bufferedSource.d.ts.map