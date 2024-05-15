export class RedirectAPI {
    constructor(config) {
        this.config = config;
        this.provider = this.config.getNetworkProvider();
    }
    async redirect(method, params) {
        return await this.provider
            .send(method, params)
            .then((result) => ({ result }))
            .catch((err) => {
            if (err.body) {
                try {
                    const body = JSON.parse(err.body);
                    /** NETHERMIND ERROR PARSING */
                    if (body.error.data &&
                        body.error.code == -32015 &&
                        body.error.data.startsWith("Reverted ")) {
                        body.error.code = 3;
                        body.error.message = "execution reverted";
                        body.error.data = body.error.data.slice(9);
                    }
                    /**  */
                    /** BIFROST ERROR PARSIGN */
                    if (body.error.data &&
                        body.error.code == -32603 &&
                        body.error.data) {
                        body.error.code = 3;
                        body.error.message = "execution reverted";
                    }
                    return body;
                    // eslint-disable-next-line no-empty
                }
                catch (err) { }
            }
            throw err;
        });
    }
}
//# sourceMappingURL=redirect.js.map