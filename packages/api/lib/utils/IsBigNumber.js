import { registerDecorator } from "class-validator";
import { BigNumber } from "ethers";
export function IsBigNumber(options = {}) {
    return (object, propertyName) => {
        registerDecorator({
            propertyName,
            options: {
                message: `${propertyName} must be a big number`,
                ...options,
            },
            name: "isBigNumber",
            target: object.constructor,
            constraints: [],
            validator: {
                validate(value) {
                    try {
                        return BigNumber.isBigNumber(BigNumber.from(value));
                    }
                    catch (_) {
                        return false;
                    }
                },
            },
        });
    };
}
//# sourceMappingURL=IsBigNumber.js.map