tell application "Dia"
repeat with w in windows
repeat with t in tabs of w
if id of t is "26419820-78F1-4E0B-9E8C-35991F1A71C1" then focus t
end repeat
end repeat
end tell
tell application "System Events"
tell process "Dia"
set targetName to "Is the audience you were targeting a particularly difficult one to reach?"
set targetValue to "I wouldn't describe the audience as particularly difficult to reach. I wanted Gaia to welcome anyone who notices something in the natural world and wants to share it. That could be a high school student photographing something in their backyard, a retired nature enthusiast, a hobbyist, or a professional. They would bring different levels of knowledge, but each could contribute a finding and learn something about what was around them.

The problem I saw in iNaturalist was that its name and visual language made it feel like a tool built for professionals. Someone who was simply curious about nature might not see themselves as a naturalist, even though they had something to contribute.

My goal with Gaia was to make that invitation clearer through the name, look, and feel of the app. I wanted students and older adults alike to feel comfortable exploring and sharing what they noticed. The rebrand needed to welcome people across ages and experience levels, with room to learn as they participated."
set itemsList to entire contents of UI element 1 of scroll area 1 of front window
repeat with e in itemsList
if role of e is "AXTextArea" then
if name of e is targetName then
set oldValue to value of e
set resultText to value of e
return value of e
end if
end if
end repeat
return "FIELD NOT FOUND"
end tell
end tell
