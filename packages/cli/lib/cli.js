import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { cmds } from "./cmds/index.js";
import { globalOptions } from "./options/index.js";
import { registerCommandToYargs } from "./util/index.js";
import { getVersionData } from "./util/version.js";
const { version } = getVersionData();
const topBanner = `skandha: TypeScript Implementation of the ERC 4337 bundler client.
  * Version: ${version}
  * by Etherspot, 2023`;
const bottomBanner = `📖 For more information, check the CLI reference:
  * https://etherspot.github.io/skandha/reference/cli
✍️ Give feedback and report issues on GitHub:
  * https://https://github.com/etherspot/skandha`;
export const yarg = yargs(hideBin(process.argv));
/**
 * Common factory for running the CLI and running integration tests
 * The CLI must actually be executed in a different script
 */
export function getSkandhaCli() {
    const skandha = yarg
        .parserConfiguration({
        // As of yargs v16.1.0 dot-notation breaks strictOptions()
        // Manually processing options is typesafe tho more verbose
        "dot-notation": false,
    })
        .options(globalOptions)
        // blank scriptName so that help text doesn't display the cli name before each command
        .scriptName("")
        .demandCommand(1)
        // Control show help behaviour below on .fail()
        .showHelpOnFail(false)
        .usage(topBanner)
        .epilogue(bottomBanner)
        .version(topBanner)
        .alias("h", "help")
        .alias("v", "version")
        .recommendCommands();
    // yargs.command and all ./cmds
    for (const cmd of cmds) {
        registerCommandToYargs(skandha, cmd);
    }
    // throw an error if we see an unrecognized cmd
    skandha.recommendCommands().strict();
    return skandha;
}
//# sourceMappingURL=cli.js.map