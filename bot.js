const tmi = require('tmi.js');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tsowxzeozeifruvwryhe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzb3d4emVvemVpZnJ1dndyeWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NDU3ODQsImV4cCI6MjEwNTUyMTc4NH0.qZiNivry3s0XCKxZr4DMcuBx1pppWadoVYwqT4yCAEc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const client = new tmi.Client({
    options: { debug: false },
    connection: { reconnect: true, secure: true },
    channels: ['benalldoh']
});

client.connect().then(() => {
    console.log("24/7 Bot Connected to Twitch Chat!");
}).catch(console.error);

client.on('message', async (channel, tags, message, self) => {
    const displayName = tags['display-name'] || tags.username || 'Anonymous';
    const username = (tags.username || displayName).toLowerCase();

    try {
        // Increment chatter count
        await supabase.rpc('increment_chatter', {
            p_username: username,
            p_display_name: displayName
        });

        // Increment total channel messages
        await supabase.rpc('increment_total_messages');
    } catch (err) {
        console.error("Database update error:", err);
    }
});
