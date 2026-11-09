# Grad ICP Workshop Demo

A self-contained classroom demo: source-grounded ICP portfolio reviewer and
job-specific interview coach. Built for a 45-minute graduate workshop.

## Folder map

```
.
├── CLAUDE.md              ← you are here
├── DEMO-RUNBOOK.md        ← how to run the 45-minute workshop
├── ICP.md                 ← shared candidate context + Decagon-specific lens
├── sources/
│   ├── SOURCE-INDEX.md    ← master index of all sources, dates, coverage, contradictions
│   ├── additional-evidence.md
│   ├── airpods-evidence.md
│   ├── gaia-evidence.md
│   ├── national-park-cards-evidence.md
│   ├── optro-evidence.md
│   └── decagon-brand-design-lead.md
├── .claude/skills/
│   ├── portfolio-review/SKILL.md   ← /portfolio-review skill
│   └── interview-prep/SKILL.md     ← /interview-prep skill
└── outputs/
    ├── PORTFOLIO-REVIEW.md    ← pre-run review of Optro opening for Decagon
    └── INTERVIEW-BRIEF.md     ← standalone interview coach doc for Claude chat
```

## Shared practice reference

`references/interview-question-bank.md` contains 24 educational questions from the supplied IBM CDO Design Team guide. The original PDF is beside it. Interview prep reads this reference automatically and selects relevant bank examples alongside customized questions for an adaptive, open-ended interview. The bank is not employer-requirement evidence.

## Evidence rules

1. **Source-grounded only.** Every factual claim must trace to a file in
   `sources/`. If a claim cannot be traced, flag it as unsupported.
2. **Assess only the supplied material.** Text-only input supports copy
   judgments. Attached, readable visuals may support visual judgments; state
   the scope and never pretend to have seen an unprovided page.
3. **Preserve evidence boundaries.** Each source file lists what cannot be
   inferred. Do not upgrade attribution verbs, assume graduation, invent
   output-scale numbers, or resolve disputed store counts.
4. **Distinguish strategy from employer requirements.** ICP.md Part 1 is the
   candidate's own portfolio strategy. Part 2 is the actual Decagon role.
   Do not conflate them.
5. **Unverified facts stay unverified.** See the list in ICP.md. Do not
   assume answers for graduation date, years of experience, location,
   employment status, or disputed numbers.
6. **No changes outside this folder.** This demo does not touch the portfolio
   website, Framer, or any file outside `output/grad-icp-workshop-demo/`.

## Adaptive interview contract

### Opening and coaching

Every new full round begins with a short, clearly simulated recruiter or design-manager introduction, then “Tell me about yourself.” Stop and wait. Do not impersonate a real employee or supply an example before the candidate answers. Coach positioning → relevant experience → genuine interest in this role, with a flexible 60–90-second target. Give concise feedback on relevance, personal contribution, evidence, and natural voice; offer a supported example labeled “Suggested answer,” then invite a retry. When ready, proceed one question at a time. Apply this coaching/retry loop after later answers too; respect explicit requests to skip a retry or move on.

### Fit the selected role and ICP

- Build a role-specific interviewer lens from the selected job description and relevant company notes: role, seniority, workstreams, expected decisions, constraints, and 6–8 prioritized competencies. Attach a source quote or locator to each stated requirement. Rank relevance without presenting invented numerical hiring weights.
- Separate employer statements from the candidate's ICP hypotheses. Infer likely hiring-reader concerns only when grounded in the actual role; label them as simulation choices. Do not claim to know an employer's actual interview questions, private rubric, employees, or hiring process. A “Lead” title alone does not establish direct reports.
- Translate each priority into an evaluation goal: what the interviewer would need to learn, evidence they could reasonably ask for, and useful follow-ups. A recruiter may probe motivation, role fit, logistics, and attribution; a design manager may probe decisions, craft, systems, collaboration, and trade-offs when the job supports these. State which persona is simulated and keep that lens consistent within the round.
- Include questions about role requirements even where the candidate's evidence is thin. Ask for a real example or a clearly labeled hypothetical response; never invent experience to close a gap. Do not judge unprovided visuals or demand confidential work.

### Seeds and live question selection

Provide 8–12 role-relevant seed questions spanning the priority map, not a fixed script or a limit. Use the shared IBM bank only when relevant, with IDs and adaptation labels. Add customized questions grounded in the job and candidate context; there is no mandatory bank/custom question ratio. In the portable brief include each selected bank question's wording, source, and role relevance so the new chat needs no local bank access.

Choose the next question from the role map, previous answer, underexplored competencies, and candidate's requested focus. Ask one focused question, then wait. Use a substantive follow-up when the last answer leaves an important decision, contribution, rationale, constraint, or outcome unclear; avoid mechanical follow-ups after every answer. After one or two follow-ups, broaden coverage unless the candidate asks to go deeper. Do not repeatedly demand unavailable metrics or force every answer into Optro/the same project. Clarifying a fact is different from changing the question.

There is no fixed question cap. Continue generating relevant new questions after the seeds are exhausted while the candidate wants to practice. Do not say “question X of 5” or conclude because a seed list ended. Do not dump the remaining questions into the conversation. Keep a compact in-chat ledger of the active role, persona, round, competencies covered, question angles, stories, confirmed facts, and open gaps. Use it to avoid near-duplicates; merely rewording a prior question is not a fresh angle.

### Natural-language controls

- “Continue,” “next,” or “one more”: ask a fresh relevant question or meaningful follow-up; do not require a command syntax.
- “Go deeper on [topic]”: focus subsequent questions on that role-relevant competency.
- “Retry”: repeat the current question, retaining the same intent; coach the new answer.
- “Reshuffle,” “retake,” “restart,” or “new round”: start another full round with a new brief simulated intro and the same mandatory “Tell me about yourself” opening. Thereafter select substantially different angles, scenarios, stories, and ordering using the question ledger. Keep confirmed candidate facts and evidence limits. A requested fixed-question drill may intentionally repeat a question. Do not pretend variation is guaranteed across independent chats without a shared history.
- “Switch job”: use a supplied job file or pasted/attached job description. Confirm the company and role in one sentence, rebuild the role-specific priorities and lens, and start a new round. Keep candidate facts, but retire the previous employer's requirements, questions, and role-specific evaluation. Ask for the new description when it is unavailable; never infer it from the filename alone. Do not mix company notes across roles.
- “Pause,” “stop,” or “end”: stop asking questions; offer a concise recap and reusable checkpoint with the active role, relevant source context, asked-question ledger, candidate-confirmed facts, and next focus. During very long practice, offer a checkpoint before context is lost. Do not claim unlimited memory or automatically persist local files from a regular voice chat.

### Job files and portability — existing pre-work still works

Keep targets/job-description.txt as the default. Students need only the one job they were already asked to bring. Additional jobs are optional later: put another readable file such as targets/company-role.txt beside the existing file and invoke /interview-prep brief targets/company-role.txt. Never require a folder migration or rewrite candidate sources.

In Code, preserve each role's brief in outputs/interviews/<company-role>/INTERVIEW-BRIEF.md, and keep outputs/INTERVIEW-BRIEF.md as the current handoff so the existing workshop prompts still work. Resolve filename collisions without overwriting a different role. Include selected job requirements and provenance, candidate context, interviewer lens, priority/evaluation map, unknowns, opening, seeds, adaptive rules, and controls inside each standalone brief.

A regular Claude chat cannot read the local targets/ folder automatically. To switch jobs there, share the new job description or the newly generated brief. It can rebuild the lens in the chat, but cannot claim to save changes back to local files. Carry a checkpoint into a different chat if cross-session variation is wanted.

