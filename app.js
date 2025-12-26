// --- CONFIGURATION ---
const SB_URL = "https://xkvozzzamcolofmedrto.supabase.co";
const SB_KEY = "sb_publishable__8qGVSppJs2gRDGm_uvVUA_4JXH-icx";

const secretLibrary = ["lambda", "quantum", "redstone", "polymath", "logic"];
let currentSecret = "";
let typedKeys = "";

// --- DATABASE FUNCTIONS ---
async function refreshSecret() {
    try {
        const response = await fetch(`${SB_URL}/rest/v1/discount_records?select=secret_word`, {
            headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` }
        });
        const usedData = await response.json();
        const usedWords = usedData.map(item => item.secret_word);

        // Find first word not in the used list
        const available = secretLibrary.filter(word => !usedWords.includes(word));
        currentSecret = available.length > 0 ? available[0] : "expert";
        
        console.log("Global Secret Word:", currentSecret);
    } catch (e) {
        console.error("Database Error:", e);
        currentSecret = "skillz"; // Local fallback
    }
}

async function saveClaim(name, word, code) {
    await fetch(`${SB_URL}/rest/v1/discount_records`, {
        method: "POST",
        headers: {
            "apikey": SB_KEY,
            "Authorization": `Bearer ${SB_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_name: name, secret_word: word, final_code: code })
    });
}

// --- INPUT LISTENER ---
window.addEventListener('keydown', async (e) => {
    typedKeys += e.key.toLowerCase();
    
    if (typedKeys.endsWith(currentSecret)) {
        const userName = prompt("SECRET FOUND! Enter your name for the log:");
        if (userName) {
            const uniqueCode = `JS-${currentSecret.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
            await saveClaim(userName, currentSecret, uniqueCode);
            alert(`SUCCESS! Your code: ${uniqueCode}`);
            refreshSecret();
        }
        typedKeys = "";
    }
    if (typedKeys.length > 20) typedKeys = typedKeys.substring(1);
});

refreshSecret();