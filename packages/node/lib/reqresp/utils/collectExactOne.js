import { RequestErrorCode, RequestInternalError } from "../request/errors.js";
/**
 * Sink for `<response_chunk>*`, from
 * ```bnf
 * response ::= <response_chunk>*
 * ```
 * Expects exactly one response
 */
export async function collectExactOne(source) {
    for await (const response of source) {
        return response;
    }
    throw new RequestInternalError({ code: RequestErrorCode.EMPTY_RESPONSE });
}
//# sourceMappingURL=collectExactOne.js.map