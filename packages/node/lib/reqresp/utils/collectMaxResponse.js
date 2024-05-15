/**
 * Sink for `<response_chunk>*`, from
 * ```bnf
 * response ::= <response_chunk>*
 * ```
 * Collects a bounded list of responses up to `maxResponses`
 */
export async function collectMaxResponse(source, maxResponses) {
    // else: zero or more responses
    const responses = [];
    for await (const response of source) {
        responses.push(response);
        if (maxResponses !== undefined && responses.length >= maxResponses) {
            break;
        }
    }
    return responses;
}
//# sourceMappingURL=collectMaxResponse.js.map