# Build your ICP Brain — facilitator guide

45 minutes · approximately 12 graduate students · in person · six pairs.

## Teaching goal

Each student leaves with a source-grounded ICP.md, two reusable Claude Code skills, one actionable project review, and a portable interview brief. In class, they improve their “Tell me about yourself” introduction through feedback and a retry. A full mock interview is follow-up work.

## Timing and slide cues

| Clock | Slides | Action |
|---|---|---|
| 0–4 | 1–4 | Show both outcomes. Use the prepared Micah/Decagon demo; keep the demonstration to roughly two minutes. |
| 4–10 | 5–9 | Open folders. Run prompt 1. Students correct the candidate summary before continuing. |
| 10–20 | 10–14 | Prompt 2 defines the reader/tension; prompt 3 saves context and creates both skills. |
| 20–28 | 15–16 | Run portfolio-review on one project. Keep one useful edit and challenge one recommendation. |
| 28–33 | 17–21 | Run interview-prep. Transfer the full brief into a regular Claude chat. Use prompt 6, switch to voice, and hear the simulated interviewer intro and “Tell me about yourself.” |
| 33–42 | 22–23 | Six pairs: four minutes per person to answer “Tell me about yourself,” receive coaching, and retry; one final minute to save a takeaway. |
| 42–45 | 24–26 | Verify saved files and a next step. Close with contact information. |

Slides 27–28 are references. Send slide 27 before class; slide 28 supplies extra context for the instructor’s demo.

## Before class

Send STUDENT-PROMPTS.md and the pre-work checklist. Students should test Code and voice before arriving, collect readable materials in a local folder, save one complete job description, and bring headphones. Miro links alone may not be readable by the agent: export the relevant frame as readable text/PDF and verify ingestion. Have a plain-text excerpt ready for a scanned or inaccessible file.

Rehearse with the demo folder opened as the project root in Claude Code. This is what makes `.claude/skills/` belong to the active project. Check both slash commands in a fresh session. Keep the prepared review and brief available if generation is slow. The prototype’s source audit and simulated answers are rehearsal aids, not the speaker’s personal endorsement of every generated recommendation.

For a live Decagon demonstration, retain the actual role title and the listing’s title/body inconsistency. Do not imply that the prototype verifies eligibility or predicts a hiring outcome. The provided role asks for 4–6 years; the demo does not invent a professional timeline to match it.

## Demo sequence

1. Show ICP.md: the same candidate, broad hiring lens, and a separate Decagon-specific lens.
2. Run `/portfolio-review` against the Optro opening and shared-motion-system paragraph. Show one sourced critique and its limitation: copy cannot establish visual craft.
3. Run `/interview-prep` for the saved Decagon role. Open the resulting self-contained brief.
4. In a regular Claude conversation, paste/upload the brief. Confirm the role and evidence before enabling voice. Start a new mock with the simulated interviewer introduction and “Tell me about yourself.” Answer aloud, hear feedback, and retry. Do not reveal an example answer before the first attempt.

## Facilitation notes

- Read the prompt aloud briefly, demonstrate the action, then give students time to run it. Avoid narrating every file operation.
- Prompt 1 is a factual checkpoint. Correct invented contributions, unread files, and unconfirmed outcomes immediately.
- A relationship map adds stories and collaboration context. It is not evidence of employer criteria. Remove irrelevant private contact details before ingestion.
- If a student has no job description, let them choose one before building the job-specific lens. Label any temporary role hypothesis as illustrative.
- A short file path is the only technical detail needed on the skills slide. The agent creates the files; students verify where they are and how to invoke them.
- Coach the opening with current positioning → one or two relevant experiences → why this role. Aim for about 60–90 seconds, with flexibility. Only offer an example after hearing the student’s answer.
- Have partners use their own chats and briefs. One speaks while the other listens for relevance, personal action, and truthfulness. Each gets coaching and a retry.
- Use push-to-talk if background speech interrupts the exercise. If voice is unavailable, speak the answer aloud to the partner, type a faithful summary, and run the same feedback/retry cycle. Do not call this a successful voice test.
- If a student falls behind, finish the reviewed ICP context and one critique first. The saved interview brief can be completed after class.

## Recording frames

Slide 3: overview of portfolio review → job-specific brief → one coached answer.

Slide 21: activating voice, hearing the simulated interviewer intro, answering “Tell me about yourself,” receiving coaching, and retrying. All demonstration frames are intentionally empty and editable, with a 16:9 shape. Technical demonstration frames also appear on slides 5 (folder), 9 (audit), 14 (saved files/skills), 16 (review/pushback), and 19 (handoff).

## Product references (checked October 26, 2026)

- Claude Code skills: https://code.claude.com/docs/en/skills
- Claude voice, including switching between text and voice: https://support.claude.com/en/articles/11101966-use-voice-mode
- Decagon target: https://jobs.ashbyhq.com/decagon/60613af4-9061-426a-b4d6-720a4399be37

Two-way voice runs in regular Claude; Code provides dictation. The interview brief carries the context across conversations. Do not assume local project files are automatically present in the regular chat.


## Prompt treatment and student paths

The six prompts use black boxes with IBM Plex Mono and an explicit destination label. Their exact text is maintained in STUDENT-PROMPTS.md. The student pre-work email specifies sources/ and targets/ folders and filenames that match those prompts. The instructor prototype has its own portable source excerpts; it need not rename its Decagon file to match the student handout.


## Shared bank and adaptive practice

The existing student homework remains valid. Students bring the same files and one job description; do not resend a changed checklist or require a new download. Use the updated deck prompts 3, 5, and 6 in class: prompt 3 updates existing skills, prompt 5 creates the adaptive portable context pack, and prompt 6 runs it in regular Claude. The starter ZIP is refreshed for future downloads.

The bank provides relevant examples, not a fixed five-question script or a mandatory ratio. The brief includes sourced role priorities, a simulated interviewer lens, candidate evidence and unknowns, 8–12 seeds, and instructions to generate further role-specific questions and follow-ups. Inferences about the ICP are labeled; actual employer scripts and private rubrics are not known.

Keep the 45-minute schedule and introduction/retry exercise unchanged. Afterward demonstrate “continue,” “retry,” and “new round.” New rounds repeat the opening but vary substantive question angles using in-chat history. A pause/checkpoint carries progress into another chat; no unlimited memory is implied.

Additional jobs are optional after class: keep targets/job-description.txt and add another targets/company-role.txt when desired. In Code, invoke `/interview-prep brief targets/company-role.txt`; per-role briefs are preserved and the standard outputs/INTERVIEW-BRIEF.md stays the active handoff. In a regular voice chat, share the new description or generated brief and say “Switch jobs.” It cannot read local files automatically. Candidate facts stay shared; each employer lens is rebuilt separately.
