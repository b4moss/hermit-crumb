/**
 * 軽い CLI 引数パース（フレームワーク非依存）。
 *
 * @param {string[]} argv process.argv.slice(2)
 * @returns {{
 *   _: string[],
 *   force: boolean,
 *   list: boolean,
 *   help: boolean,
 *   cwd: string,
 * }}
 */
export function parseArgs(argv) {
  /** @type {{ _: string[], force: boolean, list: boolean, help: boolean, cwd: string }} */
  const args = {
    _: [],
    force: false,
    list: false,
    help: false,
    cwd: process.cwd(),
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];

    if (token === "--force") {
      args.force = true;
      continue;
    }
    if (token === "--list") {
      args.list = true;
      continue;
    }
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (token === "--cwd") {
      const value = argv[++i];
      if (!value) {
        throw new Error("--cwd にはディレクトリを指定してください");
      }
      args.cwd = value;
      continue;
    }
    if (token.startsWith("--cwd=")) {
      args.cwd = token.slice("--cwd=".length);
      continue;
    }
    if (token.startsWith("-")) {
      throw new Error(`不明なオプション: ${token}`);
    }

    args._.push(token);
  }

  return args;
}
