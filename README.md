# jana

**NPM scripts with better UX.**

Inspired by, but different than [`lana`](https://github.com/paprikka/lana-cli):

- Does not clear the screen
- Does not display `npm` lifecycle hooks (such as `pre*` and `post*`) by default (note: if you want to see them anyways, use the `--hooks` flag)

## Installation

```
npm install -g jana
```

## Usage

```
$ jana --help

Usage:
  $ jana [options]

  --hooks  show npm lifecycle hooks
  --list   only list scripts, don't prompt
  
  --help, -h
  --version, -v
```

**Note:**
- `jana` will print an error, and terminate with exit code `1` if no `package.json` file can be found in the `process.cwd()`.
- `jana` will print a warning, and terminate with exit code `0` if no `scripts` can be found in the `package.json`.

## FAQ

**Q:** How do you pronounce `jana`?

**A:** [[ˈjaːna]](https://en.wiktionary.org/wiki/Jana#German)

## License

[WTFPL](http://www.wtfpl.net/) – Do What the F*ck You Want to Public License.

Made with :heart: by [@MarkTiedemann](https://twitter.com/MarkTiedemannDE).