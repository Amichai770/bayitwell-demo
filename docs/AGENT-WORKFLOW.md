# Shared agent workflow

Version: 2026-09-29.1. Scope: this repository.

## Recorded direction and adoption

Recorded from the founder's 2026-09-29 session: formalize the same handoff process across the connected GitHub repositories. Codex is the default builder for new tasks, including graphics and media writing. Claude (Fable or Opus through Claude Code) is the independent gate. Explicit existing package assignments stay as they are. This records a minimal session summary, not a new claim of approval by the posting GitHub account.

This change is proposed until independently gated and merged under the repository's existing acceptance rules. Adoption and automation activation are separate events. This document governs coordination only; existing product, security, privacy, source, approval and deployment rules retain their authority. It does not authorize a new product package.

## Repository context

Read README.md. This is a public demo shell. Keep private engine code, private repository details, credentials and household data out of this repository and its PRs.

## Working loop

1. Read AGENTS.md, the local governing documents, the assigned issue and the entire current PR discussion. Check current base/head SHAs, authorization, owner, frozen acceptance criteria and dependencies before resuming. Reuse the existing task and PR; do not duplicate another builder's work.
2. One builder owns a bounded task on one branch and draft PR. Preserve any stronger repository-wide ownership rule. Codex builds by default. Explicit prior assignments take precedence; the formal gate must always come from the other model family. Separate reviewer checkout/session from the builder.
3. Freeze scope, criteria, builder, independent reviewer and required evidence on the issue or PR before implementation. Continue ordinary implementation and in-scope corrections under existing authorization without repeatedly asking for it. Changed scope or a closed approval gate requires a concrete decision.
4. Record exact verification commands, results, tested SHA and limitations. For graphics and media, retain preview/render evidence and verify sources, brand and required human content approval. Do not claim application tests, deployment or publication from documentation checks.
5. The independent reviewer checks the exact head against frozen criteria and evidence, then posts a SHA-specific merge-ready or needs-changes verdict. Findings include severity, location, failing scenario and missing evidence. The reviewer does not edit the implementation while supplying its formal gate. A changed head needs a fresh verdict.
6. Correct findings on the same branch and PR. A correction round is one builder correction followed by an independent re-gate; the initial gate is round zero. An unsuccessful round is a re-gate at the new head that still returns needs changes on blocker or high findings. A merge-conflict-only re-gate with unchanged package diff does not count as unsuccessful. After two unsuccessful rounds, stop automatic correction and present one decision card with unresolved findings, both agents' evidence, recommendation and the choice needed. Preserve the counter across sessions and commits; track unsuccessful rounds separately from total correction rounds.
7. A clean model verdict is evidence, not human acceptance. The founder merges or an actor executes an already recorded, scoped merge delegation only when all its preconditions hold. This workflow grants no new merge, deploy, publication, spend, secret or access authority. Record adoption and merge SHA separately; record deployed SHA only when verified.

## Standing directions and records

Keep workflow rules here, with AGENTS.md and CLAUDE.md linking to this file. Keep product architecture, security and other canonical instructions in their existing sources. Task-specific instructions and frozen criteria belong on the task issue/PR; evidence, verdicts and handoffs belong on its PR.

For each new standing direction, record date, source, scope, instruction, rationale if supplied, and exactly which earlier direction it supersedes. Append an approved ruling to the existing decision log through its normal review process; never rewrite historical rulings. If no log exists, the task issue/PR is the decision record. A private-session summary must be identified as such and contain no transcript or sensitive data. Distinguish proposed interpretation, authorization to prepare, adoption, and actual execution. Another repository needs its own explicit scope and recorded adoption.

## Handoff

Post a handoff at each review, correction, blocked or acceptance transition. Preserve earlier evidence. Recheck live head and the latest applicable handoff before acting. When agents share a GitHub account, name the acting agent and model family; account identity alone does not prove independence.

```yaml
handoff_version: 1
repository: Amichai770/bayitwell-demo
task: "<issue or package URL>"
pull_request: "<PR URL>"
actor: "<agent and model family>"
role: "<builder or independent reviewer>"
authorization: "<source reference or identified session summary>"
criteria: "<frozen criteria reference>"
base_sha: "<full SHA>"
head_sha: "<full SHA>"
gate_comment: "<permalink to SHA-specific verdict, or none yet>"
transition: "<ready-for-review | needs-changes | blocked | ready-for-founder>"
correction_round: 0
unsuccessful_correction_rounds: 0
summary: "<change and purpose>"
evidence:
  - command: "<command or named verification procedure>"
    result: "<pass, fail, skipped or not run>"
    tested_sha: "<full SHA>"
    output: "<redacted output reference>"
evidence_level: "<document checked | offline tested | integration verified | live verified>"
findings: "<IDs and links, or none>"
blockers: "<dependency, or none>"
next_owner: "<Claude, Codex or named human>"
next_action: "<one bounded action>"
dispatch: "<not-started | started with run URL | unavailable with reason>"
decision_required: "<concrete decision, or none>"
```

## Automation boundary

This YAML is a recording convention, not an installed validator or dispatcher. A posted handoff or mention does not prove that the next agent started. Keep dispatch at not-started until an actual runner/session acknowledges execution with a reference.

Enable automation only through a separately reviewed implementation and recorded configuration. It must check current head, authorized actors and scope, independent ownership, duplicate transitions and correction limits, and preserve human gates. Record credentials setup without exposing secret values; paid runs need their own bounded authorization. Never infer activation, a successful gate, acceptance or merge from a timer or a posted comment.
