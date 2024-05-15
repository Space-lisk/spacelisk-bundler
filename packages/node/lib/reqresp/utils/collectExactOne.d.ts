/**
 * Sink for `<response_chunk>*`, from
 * ```bnf
 * response ::= <response_chunk>*
 * ```
 * Expects exactly one response
 */
export declare function collectExactOne<T>(source: AsyncIterable<T>): Promise<T>;
//# sourceMappingURL=collectExactOne.d.ts.map