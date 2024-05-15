/**
 * Sink for `<response_chunk>*`, from
 * ```bnf
 * response ::= <response_chunk>*
 * ```
 * Collects a bounded list of responses up to `maxResponses`
 */
export declare function collectMaxResponse<T>(source: AsyncIterable<T>, maxResponses: number): Promise<T[]>;
//# sourceMappingURL=collectMaxResponse.d.ts.map