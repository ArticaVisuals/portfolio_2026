# Demo Runbook — Grad ICP Workshop

**Duration:** 45 minutes total. 4-minute show-and-tell, then hands-on.
**What this is:** A source-grounded ICP portfolio reviewer and interview
coach, built entirely from Markdown and local files. No dependencies, no
custom app, no publishing.

---

## 1. Setup (before class)

### Open the demo folder in Claude Code

```bash
cd "/Users/micahhoang/My Drive/Portfolio Prep/Portfolio 2026/output/grad-icp-workshop-demo"
```

Or open Claude Code and add this folder as your working directory.

Claude Code will read `CLAUDE.md` automatically and discover the two skills
in `.claude/skills/`.

### Verify the skills are visible

Type `/portfolio-review` or `/interview-prep` in the Claude Code prompt. If
Claude Code recognizes them, setup is complete. If not, check that
`.claude/skills/portfolio-review/SKILL.md` and
`.claude/skills/interview-prep/SKILL.md` exist and have valid frontmatter.

### Prepare the voice session (separate)

Open a regular Claude chat at claude.ai (not Claude Code). Paste the entire
contents of `outputs/INTERVIEW-BRIEF.md` into the chat. This creates a
standalone interview coach session that works by voice or text.

**Voice vs. dictation:** Live two-way voice coaching runs in regular Claude
chat (claude.ai) with INTERVIEW-BRIEF.md pasted in — Claude speaks and
listens in voice mode. In Claude Code, coaching is text/dictation only:
standard dictation (macOS: Fn Fn, or the microphone icon) transcribes speech
into the text box. Do not claim live mic was tested; demonstrate whichever
input method is available in class.

---

## 2. The 4-Minute Show-and-Tell

### Minute 0–1: Frame the problem

"Every portfolio site is built for someone. Most designers never write down
who. This demo shows what happens when you do — and what an AI coach can
check against that written-down reader."

Show `ICP.md` briefly. Point out:
- The primary ICP reader (skeptical design lead, 10–20 seconds, three
  questions)
- The central tension (range as strength vs. range as generalist flag)
- The one thing to be remembered: "brand designer who thinks in systems"

### Minute 1–2: Show the portfolio reviewer

Open `outputs/PORTFOLIO-REVIEW.md`. Walk through:
- The copy under review (Optro opening — two paragraphs)
- The ICP analysis (attribution is clear, events match the role, broader marketing evidence needs checking)
- Edit 1: surface the systems claim earlier
- Edits 2 and 3: ask for the agent’s actual role and a concrete motion rule before proposing new factual copy
- The scope label: "This review covers copy only, not visual design"

Key point: "This test supplied copy, so the review can assess copy.
If you attach readable visuals, ask for a visual review with an explicit
scope. Always distinguish what was supplied from what was inferred."

### Minute 2–3: Show the interview coach

Switch to the Claude chat where you pasted INTERVIEW-BRIEF.md. Show:
- The requirement-to-story map
- The unknowns list
- Standard workshop opening: simulated interviewer intro → “Tell me about yourself”
- An adaptive interviewer follows the opening: role priorities, example seeds, and meaningful follow-ups, without a fixed question cap

Key point: "The opening helps you introduce yourself for this role. Later questions connect job priorities with your evidence.
Every coach note names what to listen for and what to flag. The coach is instructed to use only supported facts.
Check its output; the instruction does not guarantee factual accuracy."

### Minute 3–4: Live answer attempt

Let the coach introduce its simulated role and ask “Tell me about yourself.” Answer in your own words, then show feedback and one retry. Use positioning → one or two relevant experiences → why this role as the coaching structure. Do not show a model answer before the first attempt. Aim for 60–90 seconds in student practice; keep this demonstration brief.

---

## 3. Optional Follow-up Example — Optro Question 1

Use this after the mandatory opening, or as a separate focused practice. It is not the first question in a new full mock interview.

### Sample Weak Answer, Feedback, and Grounded Retry

This is a simulation for demonstration purposes. All facts and feedback
are grounded in the evidence files.

### Question

"This role requires fast iteration across workstreams while maintaining
craft. Tell me about a time you had to build or evolve a design system
under real time pressure."

### Weak answer (labeled: simulation)

> "For Optro CRX, I basically had to design all the motion for their
> conference. It was a huge event with thousands of people. I used AI to
> generate a bunch of the animations and then cleaned them up. The client
> loved it and it all went really smoothly."

### Coach feedback

**Relevance:** Partially relevant — you named the right project (Optro CRX)
and touched on time pressure, but you didn't describe a system or explain
how you maintained craft across outputs.

**Personal action:** Weak. "Basically had to design all the motion" is vague.
What specifically did you design? The evidence says you translated the visual
identity into keynote sequences and speaker introductions, built shared
motion rules, and owned the month from asset handoff to live execution.

**Evidence flags:**
- "Used AI to generate a bunch of the animations" overstates the evidence.
  The approved copy says "agent-assisted prototypes" that you then "refined
  by hand." The AI was a starting point, not the output.
- "Thousands of people" is vague. The evidence says 1,150 in person and
  3,000 online — but those numbers describe the audience, not your work.
- "The client loved it and it all went really smoothly" is an unsupported
  outcome. The evidence files have no client-satisfaction quote for Optro.

**Better structure:** (1) Name the constraint — sole motion designer, one
month, full conference program. (2) Name the system you built — shared
motion rules for timing, easing, and sequencing. (3) Explain why — one
person cannot hand-animate this volume. (4) Describe the mechanism —
agent-assisted prototypes as starting points, hand-refined final motion.
(5) Name a specific output — the Product Wheel moving between flat diagram
and dimensional view on the ultra-wide screen.

**Suggested answer** (not the candidate's actual words):

> "For Optro CRX 2026, I was the sole motion designer on a conference
> program for 1,150 attendees. I had one month from asset handoff to live
> execution. One person cannot hand-animate a full program in that time,
> so I built shared motion rules — timing, easing, and sequencing
> guidelines — so every sequence moved the same way. I used agent-assisted
> prototypes to apply those rules, then refined the final motion by hand.
> For the executive keynote, I moved the Product Wheel between flat diagram
> and dimensional view on the ultra-wide screen. On site, I adjusted motion
> to each speaker's pacing."

Now retry the same question.

### Grounded retry (labeled: simulation)

> "For Optro CRX 2026, I was the only motion designer on a conference
> program for 1,150 attendees. I had one month from asset handoff to live
> execution. The problem was that one person cannot hand-animate a program
> this size in that time, so I built a shared set of motion rules — timing,
> easing, and sequencing guidelines — so every sequence in the program moved
> the same way. I used agent-assisted prototypes to apply those rules across
> the program, and the guidelines kept evolving as I refined the final motion
> by hand. For the executive keynote, I used the ultra-wide screen to move
> the Product Wheel between flat diagram and dimensional view — each shift
> in perspective explained the structure of Optro's platform. On site, I
> adjusted the motion to the multi-screen setup and to each speaker's
> pacing."

### Coach feedback on retry

**Relevance:** Strong. You named the constraint, the system, the mechanism,
and a specific output.

**Personal action:** Clear. "I was the only motion designer," "I built,"
"I used," "I adjusted." No inflation.

**Evidence:** Fully grounded. Every claim traces to optro-evidence.md.

**One gap to address if asked:** You don't have an output-scale number
(how many keynote sequences, how many speaker introductions). If the
interviewer asks "how many sequences did you produce?" be honest that you'd
need to confirm the exact count rather than estimating.

---

## 4. Invoking the Skills in Claude Code

### Portfolio reviewer

```
/portfolio-review [paste any portfolio copy here]
```

The skill reads ICP.md and all source files, then returns:
- What job the copy does for the ICP reader
- ICP and Decagon-specific analysis
- 3 prioritized edits with source citations

### Interview coach

```
/interview-prep brief
```

Generates or updates `outputs/INTERVIEW-BRIEF.md`.

```
/interview-prep coach
```

Starts an interactive mock interview in Claude Code using text or dictation.
For spoken two-way conversation, use regular Claude voice.

### Voice session (separate Claude chat)

Paste `outputs/INTERVIEW-BRIEF.md` into claude.ai. Follow the coaching
instructions in Section 5 of that document. Use voice mode or dictation
as available. The document is self-contained — no file dependencies.

---

## 5. Handing Off to Voice

After the show-and-tell, if you want to demo live voice coaching:

1. Open the Claude chat where you pasted INTERVIEW-BRIEF.md.
2. Enable voice mode (if available) or use dictation.
3. Say “Start the interview.” The coach gives a simulated introduction and asks “Tell me about yourself.”
4. Answer by speaking. The coach gives feedback in text (or voice if
   voice mode is active).
5. Retry the introduction. Say “continue” for a role-specific question, or “new round” to restart with different substantive questions.

**Note:** Live voice was not tested during demo creation. In Claude Code,
coaching is text/dictation only. For live two-way voice, use the regular
Claude chat session with INTERVIEW-BRIEF.md pasted in. The coaching
instructions and adaptive question-selection rules are the same either way.

---

## 6. Troubleshooting

| Problem | Fix |
|---|---|
| Skills not recognized | Check `.claude/skills/*/SKILL.md` exists with valid `---` frontmatter |
| "No source file found" | Make sure Claude Code's working directory is this demo folder |
| Voice mode unavailable | Use text input — the coaching loop is identical |
| Coach invents facts | Remind it: "Use only the facts in INTERVIEW-BRIEF.md" |
| Reviewer judges unprovided visuals | Ask it to identify what it actually saw. Supply readable screenshots for visual feedback. |


## Rehearsal completed

The portfolio-review skill was invoked in a fresh Claude Code session with this folder as the active project. Its recommendation about AI workflow details was challenged and corrected; the saved review now asks for confirmation rather than claiming unverified implementation details.

The interview brief was uploaded into a regular Claude conversation, and a deliberately weak simulated answer was used to test coaching. The coach flagged inflated team leadership, an unsupported output count, and an unsupported client-reaction claim; it offered a grounded example and asked for a retry of the same question. This tested the text coaching workflow. The actual microphone/audio conversation remains to rehearse personally.

Prepared conversation: https://claude.ai/chat/656ae718-a020-417d-9490-5b2658d19490

Workshop deck, student prompts, prep-email draft, and full timing guide are in the sibling `grad-icp-workshop-authoring` folder. The Figma page is “Grad Workshop · ICP + Interview Coach” in Write-Test.


## Shared IBM bank and adaptive rounds

Interview prep reads the shared bank automatically and selects examples only when relevant. The portable brief now contains role priorities, a simulated ICP interviewer lens, candidate context, 12 seed examples, and rules for further questions and follow-ups. There is no fixed five-question limit. The original IBM-07 and IBM-22 examples remain traceable; all customized questions are simulations, not claimed Decagon scripts.

For the recording, attach the latest INTERVIEW-BRIEF.md and ask the chat to replace the old five-question plan while preserving genuine confirmed facts. Do not submit invented practice answers into the user-facing recording chat. Keep the first turn ready; on “Start the interview,” it introduces the simulated role and asks “Tell me about yourself.” Then demonstrate coaching/retry and, if useful, “continue” or “new round.”

Keep the Desktop student-style input folder free of generated files until the live build. Existing student prep, filenames, and 45-minute timing do not change. Extra jobs are optional later; pass the chosen file to interview-prep or share the new description in regular voice chat.
