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
I'm concerned with the way I implement user interactions, or inverse data flow from low-level react components to higher-level ones. 
There are several ways I've seen to do this: 
1. Callbacks
Create methods at the app-level component. Pass callbacks to lower-level components. 
Bad: poor organization of app-level functions, need callbacks passed as properties through all intermediate components between app-level and user-interaction level.
Good: simple and clear.
Better: some namespacing/modularity/separation of functionality & fewer intermediate properties

2. function that returns service-like objects
Define a functino at app-level which returns an object, which itself contains methods that update app-level state.
Bad: need to call function, rather than pass object
Good: service-like separation of functionality at app-level

3. Pub/Sub & Events
Establish topics/events for major functional units, like music playback. Pass in actions as data.
Bad: lots of ugly publication and subscription code
Good: no properties passed between intermediate components.

4. Dispatcher
Create single app-level function which executes functions based on input argument data
Bad: lots of ugly code at app-level to switch functionality based on input data
Good: uniform means of communicating with app-level functions

5. External
Hold functionality in normal JS objects, rather than react components.
Bad: Leaving structure that react provides, need to manually request renders on update.
Good: simple, obvious way to access functionality

6. Cursors and cortex
Create external specially-wrapped object which can manage updates and trigger react rerenders
Bad: learn new tool. slightly more, and crappier set/get syntax than simple properties
Good: pass single object around, without callbacks

---

Thoughts:
1. My use case is simple, and should feel and look simple in React, if I understand the role it plays

Perhaps I shouldn't keep playback state in the app-level component. One alternative is to maintain external services using cortex and triggering rerenders.

---

The React team has argued for single-directional data flow, which consists of parent components sending data to children through properties, and components updating app state by sending actions to a dispatcher. This is in contrast to two-way bindings, which allow components to update app state directly. Cortex, for instance, takes the two-way binding approach. Angular does the same. Flux is the explicit statement of the single-directional data flow architecture, and Fluxxor implements these ideas.

Fluxxor allows you to implement the Flux architecture in a simple way. 
I've read "thinking in react", but there's no such post for "thinking in Flux". I'll write one now. 

If you've read about Flux, then you know you'll have, in addition to React's nested components, a set of data stores, actions, and a dispatcher. 

When starting out with React, it's recommended you draw a mockup of your app, separated it into components, build them statically, then add interactivity with callbacks. Having made the decision to use Flux, however, means that the last step no longer involves callbacks, but instead actions sent to a dispatcher. 

It's fairly clear what actions need to be sent, and what data they should carry as payload, so that might be the first task. 

But, let's consider some alternative starting points too. Should we start with actions or stores?

Having created a static page, it makes sense to specify all the actions a user can take on a page, or from a component. For instance, on my ArcSong app, I've got a page where a user needs to identify the transitions that occur in a song. On this page, there are many different actions a user can take: 

Go back
Get help
Play/Pause music
Mark transition
Undo
Continue to next page
Scrub playback position

Having specifying all these user actions, I need to formalize their names and payload.

Go back "PREVIOUS_PAGE"
Get help "OPEN_HELP"
Hide help "CLOSE_HELP"
Play/Pause music "TOGGLE_PLAYBACK"
Mark transition "MARK_TRANSITION"
Undo "UNDO_TRANSITION"
Continue to next page "NEXT_PAGE"
Scrub playback position "MOVE_PLAYBACK_POSITION" {pos: 0.5}

Next I'll decide what data store should respond to each action. 

"PREVIOUS_PAGE" AppStore
"OPEN_HELP" AppStore
"CLOSE_HELP" AppStore
"TOGGLE_PLAYBACK" AudioStore
"MARK_TRANSITION" CalcStore
"REMOVE_TRANSITION" CalcStore
"NEXT_PAGE" AppStore
"MOVE_PLAYBACK_POSITION" AudioStore

For easier viewing I'll organize each action according to which store responds to it.

AppStore:
"PREVIOUS_PAGE"
"NEXT_PAGE"
"OPEN_HELP"
"CLOSE_HELP"

AudioStore:
"TOGGLE_PLAYBACK"
"MOVE_PLAYBACK_POSITION"

CalcStore:
"ADD_TRANSITION"
"REMOVE_TRANSITION"

Now, I've defined all the ways a user can interact with my page, all the actions that they trigger, and the stores which respond to them. Now, I'll define the state information from each store which is required to render the page.

AppStore: 
activePageName, string
help, boolean

AudioStore: 
playing, boolean
pos, double [0,1]

CalcStore:
markers : {
            id: { id : lfsjdfl
                  pos: double [0,1]
                }
          }
That's all that's required to fully define the behavior of my app. To implement this behavior, I've now got to do several things. 

1. Setup my components to fire actions upon user interaction
2. Setup dispatcher to send actions to stores
3. Implement state-changing functionality in the stores
4. Setup top-level components to fetch data from stores

To fire off commands to the dispatcher, I'll need to do the following: 
1. Add FluxMixin to top-level component
2. Add FluxChildMixin to action-triggering child components
3. Add this.getFlux().actions.(namespace).someAction(); to components

How can I do this while maintaining a working app? 
 - I'll perform all the necessary operations to fix up playback with Fluxxor.
 
So, the todo list looks to be as follows: 
1. Setup stores
2. Setup actions
3. Setup flux
4. Setup mixins and action triggers
5. Setup store watching and property passing

I've complete all these steps, and am now able to toggle playback state. For now, though, I haven't setup any actual audio playback. I'm only toggling state. The next step is to see how to handle the actual audio playback. 

It seems that I should simply put all that functionality into the store.


























































