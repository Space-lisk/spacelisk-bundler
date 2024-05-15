import { newInstance, ChaCha20Poly1305 } from "@chainsafe/as-chacha20poly1305";
import { noise, stablelib } from "@chainsafe/libp2p-noise";
import { digest } from "@chainsafe/as-sha256";
const ctx = newInstance();
const asImpl = new ChaCha20Poly1305(ctx);
// same to stablelib but we use as-chacha20poly1305 and as-sha256
const varCrypto = {
    ...stablelib,
    hashSHA256(data) {
        return digest(data);
    },
    chaCha20Poly1305Encrypt(plaintext, nonce, ad, k) {
        return asImpl.seal(k, nonce, plaintext, ad);
    },
    chaCha20Poly1305Decrypt(ciphertext, nonce, ad, k, dst) {
        return asImpl.open(k, nonce, ciphertext, ad, dst);
    },
};
export function createNoise() {
    return noise({ crypto: varCrypto });
}
//# sourceMappingURL=noise.js.map