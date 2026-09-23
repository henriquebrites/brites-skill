#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { Command } from "commander";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.join(__dirname, "..");
const skillsDir = path.join(packageRoot, "skills");
const pkg = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));

const AGENT_DIRS = {
  claude: ".claude/skills",
  cursor: ".cursor/skills",
};

function listSkills() {
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function readDescription(skillName) {
  const skillMdPath = path.join(skillsDir, skillName, "SKILL.md");
  const content = fs.readFileSync(skillMdPath, "utf8");
  const match = content.match(/^description:\s*(.+)$/m);
  return match ? match[1].trim() : "";
}

const program = new Command();
program.name("brites-skill").description(pkg.description).version(pkg.version);

program
  .command("list")
  .alias("ls")
  .description("List available skills")
  .action(() => {
    for (const name of listSkills()) {
      console.log(`${name}\n  ${readDescription(name)}\n`);
    }
  });

program
  .command("install")
  .description("Install skills into the current project (or globally with -g)")
  .option("-s, --skills <names...>", "skills to install (default: all)")
  .option("-a, --agents <agents...>", "target agents: claude, cursor (default: both)", ["claude", "cursor"])
  .option("-g, --global", "install into the user's home directory instead of the current project")
  .action((options) => {
    const available = listSkills();
    const skillsToInstall = options.skills ?? available;
    const invalidSkills = skillsToInstall.filter((name) => !available.includes(name));
    if (invalidSkills.length > 0) {
      console.error(`Unknown skill(s): ${invalidSkills.join(", ")}`);
      console.error(`Available skills: ${available.join(", ")}`);
      process.exitCode = 1;
      return;
    }

    const invalidAgents = options.agents.filter((agent) => !(agent in AGENT_DIRS));
    if (invalidAgents.length > 0) {
      console.error(`Unknown agent(s): ${invalidAgents.join(", ")}`);
      console.error(`Supported agents: ${Object.keys(AGENT_DIRS).join(", ")}`);
      process.exitCode = 1;
      return;
    }

    const baseDir = options.global ? os.homedir() : process.cwd();

    for (const agent of options.agents) {
      const targetRoot = path.join(baseDir, AGENT_DIRS[agent]);
      for (const skillName of skillsToInstall) {
        const source = path.join(skillsDir, skillName);
        const target = path.join(targetRoot, skillName);
        if (fs.existsSync(target) && fs.realpathSync(source) === fs.realpathSync(target)) {
          console.log(`Skipped ${skillName} (already the source, ${path.relative(baseDir, target)})`);
          continue;
        }
        fs.mkdirSync(target, { recursive: true });
        fs.cpSync(source, target, { recursive: true });
        console.log(`Installed ${skillName} -> ${path.relative(baseDir, target)}`);
      }
    }
  });

program.parse();
