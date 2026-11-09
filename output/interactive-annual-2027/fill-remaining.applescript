tell application "Dia"
repeat with w in windows
repeat with t in tabs of w
if id of t is "26419820-78F1-4E0B-9E8C-35991F1A71C1" then focus t
end repeat
end repeat
end tell
tell application "System Events"
tell process "Dia"
set answerNames to {"From concept to completion, how long did the project take to produce? Required question","How many videos, images, and other media elements does the project have? Required question","What was the response to the project like? For web projects and/or apps, how many visitors or downloads has it received since launch? Required question"}
set answerValues to {"14 weeks, over the course of one ArtCenter term.","The full online case study includes 20 still images, one animated GIF, and 13 videos, for 34 media assets in total. The competition submission used a smaller selection from that presentation.","Gaia was developed as a student project and has not had an official public release. The work is presented in my portfolio as a brand and product proposal, with a working prototype. I don't have visitor or download figures to report."}
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
if existingValue is "" or existingValue is targetValue then
set value of e to targetValue
if value of e is targetValue then
set resultText to resultText & "FILLED: " & fieldName & linefeed
else
set resultText to resultText & "VERIFY FAILED: " & fieldName & linefeed
end if
else
set resultText to resultText & "PRESERVED EXISTING ANSWER: " & fieldName & linefeed
end if
end if
end repeat
end if
end repeat
return resultText
end tell
end tell
