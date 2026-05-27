const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Allow parsing dynamic text from the mobile app
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Initial Database State of Agencies
let units = {
    "Amb-04": { type: "Medical", lat: 28.6250, lng: 77.2100, status: "Available", symbol: "🚑" },
    "Pol-12": { type: "Police", lat: 28.6010, lng: 77.2250, status: "Patrolling", symbol: "🚓" },
    "Fire-01": { type: "Fire", lat: 28.6180, lng: 77.2150, status: "Available", symbol: "🚒" }
};

const incidentTarget = { lat: 28.6139, lng: 77.2090 };

// Llama 3.1 Thought Process Simulation Stream
let aiThoughts = [ "[System] Awaiting SOS Telemetry..." ];
let thoughtIndex = 0;

let isSimulationActive = false;

app.post('/api/trigger-sos', (req, res) => {
    isSimulationActive = true;
    
    let type = req.body.emergencyType || "";
    let desc = req.body.description || "";
    let dataStr = (type + " " + desc).toLowerCase();

    // Reset units so they can drive again if pressed twice!
    Object.keys(units).forEach(k => {
        units[k].status = (k === "Pol-12") ? "Patrolling" : "Available";
        if (k==="Amb-04") { units[k].lat=28.6250; units[k].lng=77.2100; }
        if (k==="Pol-12") { units[k].lat=28.6010; units[k].lng=77.2250; }
        if (k==="Fire-01") { units[k].lat=28.6180; units[k].lng=77.2150; }
    });

    if (dataStr.includes("disaster") || dataStr.includes("collapse")) {
        aiThoughts = [
            `[MCP Core] Intercepted Civilian SOS: Tier 2 DISASTER!`,
            `[Llama 3.1] Mass casualty potential! Exceeding local capacity. Autonomously dispatching multi-agency support (Fire, Medical, Police).`
        ];
        units["Fire-01"].status = "Dispatched";
        units["Amb-04"].status = "Dispatched";
        units["Pol-12"].status = "Dispatched";
    } else if (dataStr.includes("fire") || dataStr.includes("blaze")) {
        aiThoughts = [
            `[MCP Core] Intercepted Civilian SOS: Tier 1 FIRE.`,
            `[Llama 3.1] Thermal threshold exceeded! Dispatching Fire-01 (Structure Breach) and Pol-12 (Crowd/Traffic Control).`
        ];
        units["Fire-01"].status = "Dispatched";
        units["Pol-12"].status = "Dispatched";
    } else if (dataStr.includes("medical") || dataStr.includes("injur")) {
        aiThoughts = [
            `[MCP Core] Intercepted Civilian SOS: Tier 1 MEDICAL.`,
            `[Llama 3.1] Vitals alert detected. Dispatching Amb-04 for triage.`
        ];
        units["Amb-04"].status = "Dispatched";
    } else if (dataStr.includes("suicide") || dataStr.includes("harm")) {
        aiThoughts = [
            `[MCP Core] Intercepted Civilian SOS: CRITICAL SELF-HARM RISK.`,
            `[Llama 3.1] Immediate threat to life detected. Autonomously dispatching Police (Pol-12) and Medical (Amb-04) for rapid de-escalation.`
        ];
        units["Amb-04"].status = "Dispatched";
        units["Pol-12"].status = "Dispatched";
    } else {
        let printText = desc || type || "General SOS Signal";
        aiThoughts = [
            `[MCP] Intercepted Signal: "${printText}". Evaluating...`,
            `[Llama 3.1] Situation unclear. Dispatching Pol-12 for rapid reconnaissance.`
        ];
        units["Pol-12"].status = "Dispatched";
    }
    
    thoughtIndex = 0; // Reset animation
    res.json({status: "Intelligent Dispatch Active!"});
});

io.on('connection', (socket) => {
    console.log('React Web Dashboard Connected to Unified State Engine');
    
    // Initial Sync
    socket.emit('stateEngineSync', { units, target: incidentTarget });

    // GPS Telematics Simulation (Moves the units on the map in real-time)
    const moveInterval = setInterval(() => {
        if(!isSimulationActive) return; // Wait for mobile app click

        Object.keys(units).forEach(key => {
            let u = units[key];
            if (u.status === "Dispatched") {
                let dLat = incidentTarget.lat - u.lat;
                let dLng = incidentTarget.lng - u.lng;
                
                // Simulated Manhattan City Block Driving (L-Shape Streets) at constant speed
                // This prevents them from flying diagonally over buildings like birds!
                let speed = 0.0005; // Fixed street speed
                
                if (Math.abs(dLng) > speed) {
                    u.lng += Math.sign(dLng) * speed; 
                } else if (Math.abs(dLat) > speed) {
                    u.lat += Math.sign(dLat) * speed;
                } else {
                    u.status = "Arrived On Scene";
                }
            }
        });
        socket.emit('liveTrackingUpdate', units);
    }, 1200); // 1.2 second polling simulates GPS device ticking

    // Stream LLM Thought Chunks (One-Shot Sequence)
    const logInterval = setInterval(() => {
        if(!isSimulationActive) return; // Wait for mobile app click
        
        // Stop the loop completely once the AI finishes its thought process!
        // This prevents the Voice API and logs from infinitely repeating!
        if (thoughtIndex < aiThoughts.length) {
            const thought = aiThoughts[thoughtIndex];
            socket.emit('aiLogChunk', { time: new Date().toLocaleTimeString(), message: thought });
            thoughtIndex++;
        }
    }, 4000);

    socket.on('disconnect', () => {
        clearInterval(moveInterval);
        clearInterval(logInterval);
    });
});

server.listen(3000, () => {
  console.log('Simulation State Engine active on port 3000 (WebSocket)');
});
