tell application "Dia"
repeat with w in windows
repeat with t in tabs of w
if id of t is "26419820-78F1-4E0B-9E8C-35991F1A71C1" then focus t
end repeat
end repeat
end tell
tell application "System Events"
tell process "Dia"
set answerNames to {"Your email","Please write the interviewee’s name(s) and role(s) on the project here. Required question","Please write the project’s name here. Required question","Please describe your project in 100 words or more. Required question","From concept to completion, how long did the project take to produce? Required question","How many people and/or agencies worked on the development? Required question","How many videos, images, and other media elements does the project have? Required question","What software, back-end technology and programming languages were used? Required question","What was the project’s objective, and who was its target audience?","Was the project part of a larger promotional campaign? If so, how?","Did you meet with any obstacles during development? How did you overcome them?","What are the project’s core features?","Describe any special interactive features that the project has.","What was the thinking behind the navigation structure?","Are there any special navigational features?","Are there any other technological features you’d like to call attention to?","What was the response to the project like? For web projects and/or apps, how many visitors or downloads has it received since launch? Required question","What was the most challenging aspect of the project?","Did you learn anything new during the process?"}
set answerValues to {"micah.hoang@hey.com","Micah Hoang, designer. I worked independently on the strategy, naming, visual identity, interface design, and app prototyping.","Gaia","Gaia is a self-initiated reimagining of iNaturalist that grew out of my interest in the outdoors and the people who share what they find there. I wanted to make contributing to biodiversity science feel approachable to someone who is curious about nature but would never call themselves a naturalist. I renamed the platform and designed its identity, then carried that system into a working iOS prototype. A branching mark, colors drawn from the natural world, and botanical illustrations establish the visual language. The interface puts a map at the center of discovery and guides people toward making an observation. Each find connects a personal moment outdoors to a shared record of living things. I worked alone from strategy through implementation, building core interactions in SwiftUI. The proposal also includes print, outdoor, and community-event applications, showing how the same invitation could reach people beyond the app.","14 weeks, over the course of one ArtCenter term.","One person. I developed Gaia independently, from naming and brand strategy through the visual system, interface, and working app prototype.","The full online case study includes 20 still images, one animated GIF, and 13 videos, for 34 media assets in total. The competition submission used a smaller selection from that presentation.","I used Figma for interface design and flow mapping, and Swift and SwiftUI in Xcode for the iOS prototype. The project also includes a live map prototype running on Mapbox GL. Midjourney supported directed image generation; Claude, Claude Code, and Codex supported app development, prototype testing, and token management.","I wanted to make biodiversity participation accessible to people who already notice nature but may not see themselves as qualified to contribute. The audience includes casual walkers and anyone curious about a plant or animal they encounter. The design also had to respect the scientific purpose that makes iNaturalist useful.

I organized the work around access, motivation, and meaning: make it easier to begin, give people a reason to return, and show how an individual observation contributes to a shared record. Those goals shaped the name, language, visual identity, and observation experience.","Gaia was a self-initiated brand and product proposal. I extended it into outdoor advertising, print, and community-event materials to show how people might encounter it before opening the app. The applications include billboards, street banners, field notes, and bioblitz materials. Botanical gardens, museums, and trailheads offered a useful context for the identity because people are already there to look closely at the living world.","The main design problem was making the experience welcoming while keeping its scientific purpose clear. I used plain language and a map-led entry point, then gave the interface a consistent system of icons, content cards, and observation details.

Building the prototype introduced another set of constraints. Map clustering, a bottom sheet, and detail tabs have to work together as people move between browsing and inspecting a find. I built those core interactions in SwiftUI so I could judge the experience in use and refine the design beyond static screens.","The core experience centers on a discovery map, browsing observations, viewing the details of a find, and an observation flow. Map clustering helps organize nearby finds, while a bottom sheet and detail tabs provide ways to move into more information. The interface connects each observation to a community record.

The brand system continues through the product in custom icons, botanical illustrations, species badges, and data and content cards. I wanted the app to feel recognizable as Gaia while people were using it, including in the practical screens where they browse or record a find.","The relationship between the map and the bottom sheet was a central part of the prototype. People can explore geographically, move into the information about a find, and use detail tabs to inspect it more closely. I built map clustering, the sheet, the observation flow, and the tabs as working interactions.

I also treated the response to an observation as part of the design. A small moment of recognition gives the find some weight and supports the larger aim of making observation something people want to repeat.","I started with the map because it gives people a familiar way to explore what is around them. Someone should be able to enter through curiosity about a place or an organism, without first needing to understand the platform's scientific structure.

The navigation follows that progression: explore the map, inspect a find, and move toward making an observation. The bottom sheet and detail tabs let information become more specific as someone chooses to go deeper. Plain language supports that progression throughout the interface.","The map, bottom sheet, and detail tabs work as related layers of exploration. Clustering organizes observations at the map level; the sheet brings a find into focus; and tabs organize its details. That structure lets the experience begin with a broad view and become more specific without presenting all the information at once.","I took the design into a working SwiftUI prototype because I wanted to evaluate interactions on a device. The map, sheet behavior, observation flow, and detail tabs were the core pieces to make functional. The live map prototype used Mapbox GL.

AI tools supported the making process: directed image generation with Midjourney, and app development, testing, and token management with Claude, Claude Code, and Codex. I owned the design decisions and used those tools to develop and test the proposal.","Gaia was developed as a student project and has not had an official public release. The work is presented in my portfolio as a brand and product proposal, with a working prototype. I don't have visitor or download figures to report.","The hardest part was carrying the invitation in the identity into the actual experience of using the app. A new name and warmer colors could make the platform look approachable, but the interface still had to help someone begin. I kept returning to the person who notices something outdoors and is curious about it, but does not think of themselves as a naturalist.

That shaped the map-led experience, the plain language, and the observation flow. It also shaped the visual system. Botanical illustrations and expressive typography gave the project warmth, while the icons, data cards, and working typography had to make information easy to navigate.

Building the prototype made the challenge more concrete. A map, a bottom sheet, and detail tabs have to make sense together while someone is using them. I built those core interactions in SwiftUI so I could work through their behavior alongside their appearance. The aim was to carry the same care from the first impression through the practical act of browsing or recording a find.","Gaia gave me a clearer understanding of how much of a brand lives in everyday product decisions. The name and mark establish an impression, but the language around an observation, the organization of a detail screen, and the response to a find continue that impression. Those decisions became part of the identity work.

I also learned from taking the interface into a working app. In a static layout, I could judge the hierarchy of an individual screen. In the prototype, I had to consider how the map, sheet, observation flow, and detail tabs connected as an experience. That made implementation a useful part of the design process.

Working independently across the project meant I could follow a decision from strategy into the product and the wider applications. The branching mark, natural color palette, icons, and botanical imagery had to work across very different contexts. I came away wanting to bring that same continuity to future projects, with the brand's purpose expressed in the things people actually use."}
set itemsList to entire contents of UI element 1 of scroll area 1 of front window
set resultText to ""
repeat with e in itemsList
set r to role of e
if r is "AXTextField" or r is "AXTextArea" then
set fieldName to name of e
repeat with i from 1 to count of answerNames
if fieldName is item i of answerNames then
set existingValue to value of e
set targetValue to item i of answerValues
if existingValue is targetValue then
if value of e is targetValue then
set resultText to resultText & "VERIFIED: " & fieldName & linefeed
else
set resultText to resultText & "VERIFY FAILED: " & fieldName & linefeed
end if
else
set resultText to resultText & "MISMATCH OR EMPTY: " & fieldName & linefeed
end if
end if
end repeat
end if
end repeat
return resultText
end tell
end tell
