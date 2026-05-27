# ResQ-link: AI-Driven Emergency Response System

Hey there! This is **ResQ-link**, the project I built for the **BITS Pilani x Mappls (MapmyIndia) Hackathon**. 

ResQ-link is a unified, intelligent dispatch platform that connects civilians in distress directly to emergency responders (medical, police, and fire crews) in real-time, using AI-agent routing and Mappls location services.

---

## The Vision & How It Helps

During emergencies, every second counts. Traditional systems rely on manual calls, dispatcher routing, and inaccurate location details. I wanted to build something that completely automates this chain:
1. **Instant SOS**: A citizen holds down the SOS button. 
2. **AI Classification**: Instead of just sending a generic alert, the system parses context (e.g., "there's a massive fire and people are trapped") using LLMs to classify the tier and dispatch the correct units autonomously.
3. **Smart Dispatch**: Using Mappls routing APIs, the system calculates real-time ETAs, checks traffic, and routes the *closest* available responder.
4. **Live Command Center**: A web dashboard maps all dispatch vehicles moving in real-time to the scene.

---

## Tech Stack I Used

I split the system into four main blocks to keep it modular:

*   **Mobile Client (`ui-source`)**: Built with **Next.js**, **TailwindCSS**, and **ShadCN**. It features a glassmorphic UI, a 3-second hold SOS trigger, and an AI helper that categorizes reports.
*   **Unified State Engine (`state-engine`)**: A **Node.js** & **Express** backend running **WebSockets (Socket.io)**. It coordinates the overall simulation state, tracks responder coordinates, and broadcasts live telemetry.
*   **Web Dashboard (`web-dashboard`)**: The central control room for dispatcher oversight. It integrates the **Mappls JS Map SDK** to draw geofences, highlight routes, and show live-updating vehicle markers.
*   **AI Agent Server (`mcp-server`)**: A **Python** server built using **FastMCP**. It wraps Mappls REST APIs (Distance Matrix, Reverse Geocoding, Nearby Places) as tools so that the LLM agent can call them dynamically.

---

## Challenges I Faced (and how I solved them)

Building an end-to-end simulation in 36 hours wasn't easy. Here are some of the main roadblocks I ran into:

### 1. The "Flying Ambulance" Problem (GPS Simulation)
In my early tests, when an ambulance was dispatched, it would fly diagonally over buildings straight to the coordinate like a bird. To make the dashboard simulation look realistic, I wrote an L-shape block driving algorithm inside the WebSocket state engine. The markers now stick to simulated Manhattan street blocks, making the movement feel like actual driving.

### 2. Mappls API Key Auth & Demo Fail-safes
API keys can be unpredictable during live hackathon presentations (either due to network dips or rate limit caps). To ensure my demo was rock-solid, I built a hybrid fallback layer directly inside my FastMCP tools. If the live Mappls network call fails, the tool gracefully falls back to a simulated matrix dataset so the AI dispatch engine keeps running without breaking.

### 3. Accidental SOS Triggers
A quick tap on an SOS button in a pocket is a disaster for emergency services. I redesigned the SOS section to require a strict **3-second hold gesture** with visual scale progress. If the user lets go early, it cancels, preventing false dispatches.

### 4. WebSocket Cross-Origin Syncing
Synchronizing states between the Next.js app (running on port 3001), the command dashboard, and the state engine (on port 3000) was tricky. I solved this by treating the State Engine as the single source of truth, emitting delta updates through WebSockets to all connected panels.

---

## How to Run It

I wrote a unified Windows batch script (`start-demo.cmd`) to spin everything up with one click.

1. Clone this repository.
2. Open terminal in the root directory.
3. Run:
   ```cmd
   start-demo.cmd
   ```
This script automatically kills any orphaned node processes and spins up all 4 services in their own terminal windows so you can see the telemetry logs, AI thoughts, web dashboard, and phone UI side by side.
