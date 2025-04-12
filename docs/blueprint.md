# **App Name**: Rowing Timer Pro

## Core Features:

- Session Configuration: Set up the timing session, including the number of boats to track, session distance, and split distance.
- Global Timer: A central timer to track the overall session time, with start/stop functionality.
- Dashboard View: Display the timing information in a card format with split times and split pace. Boat class and name will be editable.
- Split Time Recording: Record the split times for each boat, calculating and displaying the split pace.
- Performance Analysis: Compare the team's results with world best times, and generate insights. The generated summary will include the percentage compared to the world's best time.

## Style Guidelines:

- Primary color: Pantone 872 (Gold) for headers and titles.
- Secondary color: Pantone 124 (Yellow) for highlights and accents.
- Background color: White for a clean and readable interface.
- Accent color: Pantone 295 (Dark Blue) for interactive elements and buttons.
- Text color: Pantone 877 (Silver) and Black for contrast and readability.
- Clear and readable sans-serif font for timing displays.
- Card-based layout for boat timing information.
- Dashboard with session settings at the top and boat cards below.
- Simple, intuitive icons for start, stop, split, and export functions.
- Subtle animations for timer updates and split recordings.

## Original User Request:
I would like to create a flutter based app that is tailored for the timing for a rowing team/ club practices. During rowing practices, there are often times for time marking sessions, where different boat class would do side by side for a certain distances, let's say 2000m. The major problem now for a simple phone timer is that, I could not do split time to many boats (as it may lead to huge calculation time which is not smart). For the app I am going to create a modular timer to tackle this problem.
The app should contain the following function:
-	A global timer to record the activity (e.g. 2000m)
-	The user can set how many boats/ athletes they are tracking
-	The timer page should then convert into a dashboard view, where it shows all the boat in a card format with individual [split] buttons.
-	The dashboard should contain
	A global timer, with Start and Stop button 
	A row as the sessions’ settings (1. Session distance 2. Split distance 3. Export button)
	A dashboard view showing the timing cards:
-	Where the timing card should have the following features:
	Title: [Boat Class] – [Boat Name]
	Split time: [mm:ss.00]
	Split pace (/500m): [mm:ss.00]
	[Split] button, which will be disabled when the split interval is equal to the session distance
	They can edit the name/ boat classes for each card
	The boat classes are referenced from the World Rowing.com
	Users can edit the interval length (can divide into 8 intervals  250m each/ depends on the distance of the session)
	The card contains two buttons, start/ split (change to “split” when the timer is running)
-	After the activity ends, ask if the user would like to save the activity
-	The activity is saved as CSV / PDF files
	The CSV/ PDF generated should contains a comparison to the boat class’s current world best times (the closest time to world best time, higher the %)
	Overview of the crews overall and detailed times over the session
-	Use a color palette of Pantone 872, 124, White, 295, 877 and Black
  