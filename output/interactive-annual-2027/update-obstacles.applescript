tell application "Dia"
repeat with w in windows
repeat with t in tabs of w
if id of t is "26419820-78F1-4E0B-9E8C-35991F1A71C1" then focus t
end repeat
end repeat
end tell
tell application "System Events"
tell process "Dia"
set targetName to "Did you meet with any obstacles during development? How did you overcome them?"
set targetValue to "The biggest obstacle was turning my designs into a working app I could install on my phone and use. That was much more ambitious than I expected, even with the tools I was using. I spent a lot of time experimenting with my process, learning Swift and SwiftUI, and figuring out how to work with code as a designer.

I made it manageable by being more deliberate about what needed to be built in code. I focused on refining features that needed to be interactive and couldn't be demonstrated well in After Effects. For simpler transitions that I could communicate through animation, I kept using After Effects prototypes."
set itemsList to entire contents of UI element 1 of scroll area 1 of front window
repeat with e in itemsList
if role of e is "AXTextArea" then
if name of e is targetName then
set oldValue to value of e
set value of e to targetValue
if value of e is targetValue then return "UPDATED AND VERIFIED"
return "VERIFY FAILED"
end if
end if
end repeat
return "FIELD NOT FOUND"
end tell
end tell
