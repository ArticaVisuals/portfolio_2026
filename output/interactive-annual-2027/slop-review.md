# Slop review: Gaia questionnaire draft

## Layer 0, deterministic scanners

| Scanner | Exit | Finding |
|---|---|---|
| scan_residue.py | 0 | No mechanical defects |
| scan_placeholders.py | 0 | No mechanical defects |
| lint_voice.py | 0 | No house style violations |

Scanners not run: scan_refs.py, no citations or URLs in the form answers; scan_packages.py, no code or dependency declarations; score_substance.py, this is a questionnaire rather than a note vault.

## Findings

### F-001 [MEDIUM] [confidence: high] Unsupported distinction between prototypes
Location: Other technological features
Quote: "A separate live map prototype used Mapbox GL."
Test: attribution
Artifact: The published case study identifies core interactions built in SwiftUI and a live prototype running on Mapbox GL. It does not establish that these were separate prototypes. The claim that Mapbox GL was used is supported; the distinction is not.
Cluster: n/a (structural)

## Not flagged, and why

- The three strategic goals are a source-specific framework, not an empty three-part list. Deleting them loses the project's actual organizing criteria.
- The map, bottom sheet, clustering, and detail tabs recur because the form asks separate questions about features, interactions, and navigation. Their relationships answer each prompt.
- The two longer answers propose first-person reflections grounded in the documented design and implementation. Micah should review these as suggested wording for his experience, rather than treating them as interview quotations.
- No invented timeline, media inventory, audience feedback, launch status, visitor figures, or download counts appear in the draft. Those required fields remain pending.
