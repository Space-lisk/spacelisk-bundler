import { registerDecorator } from "class-validator";
export function IsCallData(options = {}) {
    return (object, propertyName) => {
        registerDecorator({
            propertyName,
            options: {
                message: `${propertyName} invalid`,
                ...options,
            },
            name: "isCallData",
            target: object.constructor,
            constraints: [],
            validator: {
                validate(value) {
                    return !!value && (value.length === 2 || value.length >= 42);
                },
            },
        });
    };
}
//# sourceMappingURL=IsCallCode.js.map