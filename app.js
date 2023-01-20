// discord.si 1.0.0 by Adam Lamrani
require('dotenv').config();
const translate = require('translate');
translate.engine = "deepl";
translate.key = process.env.DEEPL_KEY;

// Konfiguracja discorda
const {Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});


// Konfiguracja OpenAI
const { Configuration, OpenAIApi } = require('openai');
const { RequiredError } = require('openai/dist/base');
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
}); 
const openai = new OpenAIApi(configuration); 


// Discord listener and AI reply
client.on('messageCreate', async function(message){
   try{
        if(message.author.bot){ return; }
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. \n Human: Hello, how are you? \n AI: I'm fine. Thanks. How about you? \n Human: I'm Fine. Who are you? \n AI: I am created to answer your questions and act like a human. \n Human: ${message.content} \n AI:`,
            stop: [" AI:"," Human:"],
            temperature: 0.9,
            max_tokens: 2500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
        })

        try{
            const reply = await translate(gptResponse.data.choices[0].text, "pl");
            //const reply = gptResponse.data.choices[0].text;
            message.reply(reply);
        } catch{
            message.reply(`Error`);
        }
        return;
   } catch(err){
        console.log(err);
   }  
});


client.login(process.env.DISCORD_TOKEN);
console.log("bot jest online.")
