# Dependency security review — 2026-11-19

Reviewed all **201 Dependabot records**, including closed records, against the
actual lockfiles at `4230259ca0e976f08306e502c3d2b21d2e7f253a` and this branch.
The `main` and `develop` dependency lockfiles were identical at review time.
[The accompanying JSON](dependabot-review-2026-11-19.json) records every alert
number, advisory, vulnerable range, original GitHub state, baseline versions,
patched versions, and disposition. npm ranges use `semver`; Ruby ranges use
`Gem::Requirement`. A missing dependency is recorded as an empty version list.

| Original state | Records | Baseline affected | After this change affected |
| --- | ---: | ---: | ---: |
| Open | 60 | 60 | 1 |
| Manually dismissed | 10 | 10 | 0 |
| Automatically dismissed | 17 | 17 | 0 |
| Fixed | 114 | 6 | 0 |
| **Total** | **201** | **93** | **1** |

This branch remedies 92 previously affected records. The other 108 were already
unaffected. GitHub scans the default branch, so the dependency fixes will not
clear its alerts merely by opening or merging this PR into `develop`.

## Alert state corrections

All 10 manual dismissals used `fix_started` without an applied fix. These alerts
were restored to open: **123, 144, 145, 146, 147, 148, 149, 150, 151, 155**.
The 17 automatically dismissed records were also still vulnerable and restored:
**160, 169, 175, 176, 177, 179, 183, 191, 192, 196, 197, 199, 200, 201, 215,
219, 228**. No alert was dismissed to make this review pass.

Six Ruby records marked fixed were vulnerable again in the checked-in baseline:
**77, 78, 79** (ActiveSupport 7.1.6) and **118, 119, 120** (concurrent-ruby 1.3.3).
GitHub rejects reopening fixed records with HTTP 409. Their currently open
counterparts **144–149** remain the tracking records; the version fixes in this
branch remedy both sets of records. No previously fixed npm advisory matched a
vulnerable baseline version.

## Remediation and compatibility

Most packages are refreshed within their existing supported ranges, including
Babel 7, xmldom 0.8/0.9, brace-expansion 1/2/5, fast-uri 3, joi 17, js-yaml 3/4,
nanoid 3, launch-editor, handlebars, shell-quote, ip-address, zod, body-parser,
and compression. Updating React Navigation core within its existing 7.x range
removes the vulnerable `query-string` / `decode-uri-component` dependency.

The existing undici override is advanced from 6.28.0 to patched 6.29.1. Additional
resolutions are scoped to consumers that still require an affected major:

- `get-uri` uses basic-ftp 6.2.6; a local FTP download exercises the actual
  get-uri → basic-ftp consumer path.
- `xcode` uses uuid 11.1.1, retaining its CommonJS `v4()` API; a real example
  Xcode project is parsed and a project UUID is generated.
- React Native CLI Android config and Apple platform tools use fast-xml-parser
  5.12.1; the example Android manifest and shared Xcode scheme are parsed.
- Expo config-plugins and builder-bob use glob 14.0.2. Their promise-based glob
  API is exercised; legacy glob 7 consumers are deliberately left on their
  existing API rather than forcing all glob versions to one major.
- ts-morph and typescript-estree use minimatch 11.0.1; matching is exercised,
  with package build, typecheck, and lint covering the real parent tools.
- Metro 0.84.4 uses image-size 2.1.0. A checked-in Yarn patch switches to its
  named `imageSize` export and reads image files as buffers, since version 2
  removed the path-taking API. Both in-memory sizing and real filesystem asset
  metadata extraction are exercised. Remove this patch after an upstream Metro
  upgrade provides the same compatibility.

Run `yarn test:dependency-compat` to repeat these consumer checks. The two Expo
config-plugin test suites now declare the Node test environment: these plugins
execute in Node, and uuid's conditional exports must resolve its Node entry
rather than the React Native environment's fallback browser ESM entry. The
plugin behavior assertions are unchanged.

Ruby patches retain CocoaPods 1.15.2 and xcodeproj 1.25.1: ActiveSupport 7.2.4,
concurrent-ruby 1.3.8, addressable 2.9.2, and JSON 2.21.2. The old concurrent-ruby
cap prevented security patches and is removed. Ruby's floor is made explicit as
3.2, matching the already-locked Bundler 4 requirement. Use the companion CI PR's
Ruby 3.3 setup when installing this lockfile. CFPropertyList 3.0.9 declares Ruby
`<3.2`, so the resolver selects compatible 3.0.8; moving to CFPropertyList 4 would
require an unrelated xcodeproj upgrade.

## Remaining advisory

**[Alert #225](https://github.com/pedrol2b/react-native-vision-camera-mlkit/security/dependabot/225),
[GHSA-8474-xrp6-wh69](https://github.com/advisories/GHSA-8474-xrp6-wh69)** remains
open: ActiveSupport `safe_constantize` can suffer denial of service. Published
patches require ActiveSupport 8.0.5.2 or 8.1.4.1, while CocoaPods Core requires
ActiveSupport `<8`, including the current upstream release. Forcing version 8
would violate CocoaPods' dependency contract. The project contains no Rails or
ActionCable app and no direct `safe_constantize` use; this limits the observed
application exposure but is not treated as proof the advisory is harmless.
Track a compatible upstream CocoaPods/ActiveSupport fix and re-audit before
release. Do not mark this alert fixed or dismiss it based on this PR.

## Verification

- Immutable Yarn install passed.
- `yarn npm audit --all --recursive --no-deprecations --json`: **zero npm
  vulnerability advisories**, exit 0. Baseline had 89 affected-version advisory
  records (including advisories absent from the Dependabot snapshot).
- Normal Yarn audit still reports five maintenance/deprecation notices: eslint
  9, git-raw-commits, glob 7, inflight, and rimraf 3. These are documented rather
  than misrepresented as vulnerability-free maintenance status.
- Jest: **10 suites / 104 tests passed**. The extra four orientation tests in the
  original working directory are uncommitted and intentionally absent here.
- Typecheck, lint, package build, and dependency consumer checks passed.
- Ruby bundle install/check, `bundle exec pod --version` (1.15.2), and loading
  ActiveSupport/CocoaPods/addressable/JSON/concurrent-ruby passed on Ruby 3.3.12.
- Fresh bundler-audit against ruby-advisory-db commit
  `49bb1fbb35476f27f8cfbfcb943790633836dc1c` reports only #225.

Advisory evidence comes from GitHub's repository/advisory APIs, npm's live audit
endpoint and package metadata, RubyGems metadata, and ruby-advisory-db. All
version comparisons and report counts were rechecked after the final lockfile
update. Native enabled/disabled builds still need the security branch's CI;
no claim is made that JS-only checks validate native runtime behavior.
