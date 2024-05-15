export var ChunkType;
(function (ChunkType) {
    ChunkType[ChunkType["IDENTIFIER"] = 255] = "IDENTIFIER";
    ChunkType[ChunkType["COMPRESSED"] = 0] = "COMPRESSED";
    ChunkType[ChunkType["UNCOMPRESSED"] = 1] = "UNCOMPRESSED";
    ChunkType[ChunkType["PADDING"] = 254] = "PADDING";
})(ChunkType || (ChunkType = {}));
export const IDENTIFIER = Buffer.from([0x73, 0x4e, 0x61, 0x50, 0x70, 0x59]);
export const IDENTIFIER_FRAME = Buffer.from([
    0xff, 0x06, 0x00, 0x00, 0x73, 0x4e, 0x61, 0x50, 0x70, 0x59,
]);
//# sourceMappingURL=common.js.map