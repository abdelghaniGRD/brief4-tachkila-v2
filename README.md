# Resources

- github: https://github.com/abdelghaniGRD/brief4-tachkila-v2
- planification: https://gouroudabdelghani.atlassian.net/jira/software/projects/TV/boards/2?filter=&groupBy=none&atlOrigin=eyJpIjoiZjE3NTNjZjQ5MzQ0NDYxNzlhMGJkYmNlN2ZkNWM2NzYiLCJwIjoiaiJ9
  -vercel: https://tachkila-v2-app.vercel.app/

# Tachkila

Tachkila is a lightweight football club management interface for Atlas FC. It brings the player roster and starting lineup together, with a separate page prepared for the 2026/2027 match season.

## Features

- **Squad:** add, edit and remove players; search by name and filter by position.
- **Composition:** assign players to eleven pitch positions or the bench.
- **Player details:** track shirt number, age, captain and fitness status where supported by the form.
- **Matches:** a 2026/2027 season page with All, Upcoming and Played views. Match entry and filtering are not implemented yet.

## Run locally

Serve the project folder with a local static web server, then open `index.html` in your browser. For example, use the Live Server extension in Visual Studio Code. No package installation or build step is required.

The pages load Tailwind CSS from its CDN, so an internet connection is needed for the styling.

## Project structure

```text
index.html          Squad page
compsition.html     Composition page
matchs.html         Matches page
css/style.css       Project styles
js/                 Page behavior and player data helpers
presentation/       Project overview presentation
```

## Data storage

Player records are saved in the browser's local storage under `tachkilaPlayers`. The data stays in that browser on that device; this project does not include a server or cloud sync.

## Presentation

An editable PowerPoint overview deck is available at [`presentation/Tachkila-Overview.pptx`](presentation/Tachkila-Overview.pptx).
