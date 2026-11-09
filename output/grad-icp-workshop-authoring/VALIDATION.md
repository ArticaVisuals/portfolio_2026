# Validation record

## Deck

- New page: Grad Workshop · ICP + Interview Coach, Write-Test file.
- 28 editable 1920 × 1080 frames: 26 workshop slides and 2 reference slides.
- Six black monospace prompt boxes match STUDENT-PROMPTS.md and its plain-text copy. Prompt paths match the prep email folder structure.
- Programmatic text-bound and text-overlap audit: no issues after three title adjustments.
- Visually inspected the cover, context flow, section divider, prompt, paired practice, voice placeholder and Decagon reference layouts.
- Seven empty 16:9 demonstration frames; no image thumbnails.

## Prototype construction

- Built through Claude desktop Code in “Micah × Decagon — ICP Demo Build.”
- Source audit distinguished the existing ICP strategy from the Decagon requirements.
- Local review caught and corrected unsupported Figma proficiency and Gaia publication assumptions, a disputed store count, an unsupported output count, and mismatched copy/visual scope instructions.
- Both project skill files have name/description YAML frontmatter.

## Live tests

- Opened the prototype folder as the project root in a fresh Claude Code session.
- Invoked /portfolio-review; the UI recognized the project skill and Claude read local context/evidence.
- The response stated copy-only scope and produced three prioritized edits.
- The rehearsal caught an over-specific AI workflow suggestion. Challenged it and requested a sourced correction rather than accepting the suggested copy.

Voice audio and a real spoken answer have not been tested.

The final portfolio review was corrected and saved through Claude Code after the unsupported-detail challenge. The /interview-prep skill was also recognized in the same clean session and read the saved brief and role source.

## Regular Claude handoff

Uploaded the full interview brief into https://claude.ai/chat/656ae718-a020-417d-9490-5b2658d19490 . The coach asked one question and waited. A deliberately weak simulated answer tested inflated attribution, an unsupported count, and unsupported client approval. The coach identified all three, supplied supported feedback and an example, and asked for a retry of the same question. A grounded simulated retry was submitted. The Use voice mode button is visible; audio has not been tested.

Final state: interview-prep validation reported no material failures. The regular Claude coach gave feedback on the supported retry, then was reset to Question 1 and left waiting for Micah’s real answer. The voice button is available. No microphone/audio test was performed. Final deck audit: 28 frames, 6 prompt boxes, 7 empty demonstration frames, no text overlap or overflow.

## IBM question-bank integration

- Extracted all 24 numbered questions from both PDF pages; preserved source IDs, categories, source wording and educational-use attribution.
- The source explicitly describes examples from one team, not an official IBM document or universal process.
- Updated interview-prep to load the provided reference and produce two bank plus three customized questions, labeling adaptations.
- The demo brief includes IBM-07 and IBM-22 verbatim, along with three customized questions. All five are embedded for a portable chat.
- Student starter ZIP contains no candidate data or prebuilt ICP/skills. Empty sources/ and targets/ directories are retained. ZIP integrity check passed.
- Student handout, deck prompt 5, starter prompts and updated two-page prep PDF use the same shared-reference workflow. Prompt text fits the black box (484px content in a 612px box).
- Basecamp native UI confirmed the message is an unpublished draft and both attachments are present. Draft ID 10442646988. Screenshot capture failed in the native Basecamp app; the saved state was verified through its accessibility text.
- Existing regular Claude practice was in progress with an unsent user draft. It was not overwritten or reset; the new brief is ready for the next upload.

## Required interview opening — October 26, 2026

- Updated the demo interview-prep skill and portable INTERVIEW-BRIEF.md: every new full mock starts with a short simulated interviewer introduction, then “Tell me about yourself,” then waits. Examples follow the candidate's answer. Coaching covers positioning, relevant experience, and genuine interest in the role; a retry precedes the five mixed questions.
- Opening is instructor protocol, separate from the two IBM bank questions and three customized questions. All 24 original source questions remain unchanged. Explicit resume or focused-question requests preserve session progress.
- Synced prompts 5–6 across deck.json, student Markdown/plain-text handouts, starter WORKSHOP-PROMPTS.md, and Figma nodes 1506:182 / 1506:199. Checked resulting heights 528 / 484 inside 612px boxes with 36px top inset. Visually inspected both screenshots: no clipped text.
- Revised slides 17, 21, and 22 for the introduction-first sequence. Slide 21 keeps its empty 16:9 video frame. Visually inspected its screenshot.
- Updated instructor runbook/facilitation, teacher CLAUDE.md, starter instructions, and bank usage notes. Rebuilt and checked portfolio-brain-starter.zip (33,015 bytes), empty source/target directories, and prompt/CLAUDE parity.
- Basecamp message was already published when reopened. Replaced only its starter attachment via Edit → Save, preserving existing message text and PDF. Confirmed saved page shows “Edited” and a single 32.2 KB ZIP at blob c481a076-d151-11f1-97ab-0242ac120004. No new post or comment was created. Proof: BASECAMP-STARTER-UPDATED.png.
- Existing regular Claude practice chat and unsent candidate text were not touched. These instruction changes were verified in files and deck; a new live voice session was not run in this pass.

## Fresh voice recording chat — October 26, 2026

Created a new regular Claude chat at https://claude.ai/chat/85effd3d-e33c-4337-afb1-23f4ead847ee, titled “Micah Hoang mock interview setup.” Attached the latest 214-line INTERVIEW-BRIEF.md. Setup requests the simulated intro and “Tell me about yourself” first, followed by grounded coaching/retry, then the five mixed questions. It waits for the spoken cue “Start the interview.” Verified Claude's response: “Ready. Switch to voice mode and say ‘Start the interview.’” The Use voice mode button is visible; microphone/voice were left for Micah to activate when recording. Earlier practice chat is unchanged. Preview: voice-demo/CLAUDE-VOICE-READY.png.


## Adaptive interviews and optional job switching — October 26, 2026

- Changed deck prompts 2/3/5/6 and slide 25, master/student/Desktop prompt handouts, root starter instructions, demo interview-prep skill, instructor guide/runbook, shared-bank usage guidance, and portable Decagon brief. Portfolio critique remains separate and was not rewritten.
- Brief now has a source-linked role-priority map, explicitly simulated ICP/interviewer lens, evidence boundaries, 12 example seeds (two unchanged IBM examples plus ten customized), adaptive follow-up generation, no fixed question cap, new-round/retry/focus controls, question-history ledger and checkpoint, and isolated job switching. A per-role brief mirrors the active handoff. No actual employer script is claimed.
- Compatibility: existing sources/ and targets/job-description.txt remain valid; extra targets/company-role.txt files are optional. Updated class prompts upgrade skills even for an older downloaded starter. Prep email and PDF were not changed. No migration or extra pre-work required.
- Verified master/Desktop/Figma-content prompt parity, all 24 original bank questions and their wording, ZIP integrity and contents, role/current brief parity, and mandatory opening/continuation/job-switch/checkpoint rules. The affected copyable Figma boxes retain 34px mono and have heights 484/528/440 within 612px black boxes (36px top inset); screenshots adaptive-0 through adaptive-3 were inspected with no clipping. Slide 25 body ends at y1040 within 1080px.
- Replaced only the starter ZIP on the existing published Basecamp message. Saved page shows the same prep PDF blob and one new 34.8 KB ZIP (35,602 local bytes), blob 69987e52-d1d1-11f1-9355-0242ac120002. Original message text and user comment preserved; no new message/comment created. Proof: ADAPTIVE-STARTER-BASECAMP.png.
- Claude Code was open on Micah's source-audit session with dictation active. It was left untouched. The existing regular-Claude recording chat still has the earlier attached brief: share the updated INTERVIEW-BRIEF.md to upgrade that existing chat, preserving any real confirmed answers. No new voice or generated-question behavior test was run in this pass; verification covers instruction consistency and deck layout.
