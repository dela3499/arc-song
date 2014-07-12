*The goal here is to identify the app's components, so I can rewrite it using ReactJS*

First, I'll take a look at each page and identify all the components on it. Then I'll identify all the common ones. 

1. Home
Title
Graphic
Song 
Artist
Link - Get Started
Link - Gallery
Link - About

2. Transition Finder
Back
Help
Instructions
Play
Transition-found
'Undo'
Player
 time elapsed
 time remaining
 progress bar
 transition lines
Continue

3. Section Grouping
Back
Help
Instructions
Groups
Clips
 - background
 - progress bar
Continue
(Drag and drop)

4. Phrase transitions in a section
instructions
back
help
thumbnail
 - groups
  - group
   - sections
    - progress bar & background
continue
play
transition
number of transitions
set transitions equal
player
 - time elapsed
 - time remaining
 - progress bar

5. Group phrases
Instructions
group
 - sections
 - progress
groups
 - phrases
  - progress

6. Edit graphic
back
help
do another
instructions
permute random
color scheme
download
opacity
text


What reusable components have you identified? 
1. Progress bar
2. Sound clip
3. Playback control buttons
4. Navigation
5. Groups/collections of clips

How would you implement each of these in ReactJS?
What questions do you need to answer to implement these?
1. Properties to feed in
2. Internal, private state
3. Parent-child relationships
4. Callbacks required

--
Progress bar
1. Properties: 
 - sound object/file/url
 - repeat
 - play on hover
 - scrubbing allowed
 - what to play from file
 - transitions/markers? 
2. Private state: 
 - playback position? 


---
What are the properties of the global application state? 
 - song url
 - current user activity / screen
 - section transitions
 - phrase transitions
 - 

// perhaps I shouldn't even store a variable called transitions, but instead create sections on the 'transition-finding' page.

----
Working back from the end, what data do I need? 
1. Raster Image 
2. Vector Image
3. Arc Spec
4. Essential Phrase Matches
5. Phrase Matches
6. Suffix Tree
7. Phrase String
8. Phrase Object Array
9. Section Object Array
10. Song

----
