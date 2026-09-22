// bot.js
const http = require('http');
const tmi = require('tmi.js');
const { createClient } = require('@supabase/supabase-js');

// 1. Simple HTTP Server so Render keeps the Web Service alive
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('BenAllDoh 24/7 Twitch Bot is Active!\n');
}).listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});

// 2. Supabase Integration
const SUPABASE_URL = 'https://tsowxzeozeifruvwryhe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzb3d4emVvemVpZnJ1dndyeWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NDU3ODQsImV4cCI6MjEwNTUyMTc4NH0.qZiNivry3s0XCKxZr4DMcuBx1pppWadoVYwqT4yCAEc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. Twitch IRC Bot
const client = new tmi.Client({
    options: { debug: false },
    connection: { reconnect: true, secure: true },
    channels: ['benalldoh']
});

client.connect().then(() => {
    console.log("24/7 Bot Successfully Connected to Twitch Chat!");
}).catch(console.error);

client.on('message', async (channel, tags, message, self) => {
    const displayName = tags['display-name'] || tags.username || 'Anonymous';
    const username = (tags.username || displayName).toLowerCase();

    try {
        await supabase.rpc('increment_chatter', {
            p_username: username,
            p_display_name: displayName
        });
        await supabase.rpc('increment_total_messages');
    } catch (err) {
        console.error("Database log error:", err);
    }
});
