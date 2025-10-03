import { readFileSync} from "fs";
import { $ } from "bun";
const targetVersion = readFileSync("package.json", "utf8").version;

console.log(`Creating tag ${targetVersion}`);



await $`git tag -a ${targetVersion} -m "${targetVersion}"`;
await $`git push origin ${targetVersion}`;

// update versions.json with target version and minAppVersion from manifest.json