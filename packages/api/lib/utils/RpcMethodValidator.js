/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import RpcError from "types/lib/api/errors/rpc-error.js";
import * as RpcErrorCodes from "types/lib/api/errors/rpc-error-codes.js";
import logger from "../logger.js";
export function validationFactory(metadataKey, model) {
    // eslint-disable-next-line func-names
    return function (target, propertyName, descriptor) {
        Reflect.defineMetadata(metadataKey, model, target, propertyName);
        const method = descriptor.value;
        // eslint-disable-next-line func-names
        descriptor.value = async function (...args) {
            const schema = Reflect.getOwnMetadata(metadataKey, target, propertyName);
            const errors = await validate(plainToInstance(schema, args[0]));
            if (errors.length > 0) {
                logger.info({
                    data: {
                        errors,
                        arguments: args[0],
                    },
                }, "Invalid Request");
                throw new RpcError("Invalid Request", RpcErrorCodes.INVALID_REQUEST);
            }
            return method.apply(this, args);
        };
    };
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const RpcMethodValidator = (dto) => validationFactory(Symbol("rpc-method"), dto);
//# sourceMappingURL=RpcMethodValidator.js.map