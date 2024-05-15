import "reflect-metadata";
export declare function validationFactory<T>(metadataKey: symbol, model: {
    new (...args: any[]): T;
}): (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) => void;
export declare const RpcMethodValidator: (dto: any) => (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) => void;
//# sourceMappingURL=RpcMethodValidator.d.ts.map