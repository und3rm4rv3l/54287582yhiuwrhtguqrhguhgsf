const Discord = require("discord.js");
const music = new Discord.Client({disableEveryone: true});
const fs = require("fs");
const cfg = require("./config.json");
const db = require('./database.js')

music.commands = new Discord.Collection();
const queue = new Map();

fs.readdir("./commands/", (err, files) => {
	
	db.Guilds.findOne({"_id": message.guild.id}).then(servidor => {

        if (music.content.startsWith(servidor.setprefix)) {

            db.Bloqueio.findOne({"_id": message.author.id}).then(bloqueio => {

                if(bloqueio) {
                    if ([bloqueio.block].includes(message.author.id) && !['244489368717230090'].includes(message.author.id))
                    return message.channel.send(`<:xguardian:476061993368027148> | ${message.author}! Você foi bloqueado de usar comandos do **Sysop**, se você acha que isso é um engano nos contate! `);
                }


	if (err) console.log(err);
	let jsfile = files.filter(f => f.split(".").pop() === "js")
	if(jsfile.length <= 0) {
		console.log("Comando não encontrado!");
		return;
	}

	jsfile.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		music.commands.set(props.help.name, props);
	});
	     })
        }})
});


music.on("ready", () => {
music.user.setPresence({
        status: 'Online',
        game: {
            name: `sy!help`,
            url: 'https://www.twitch.tv/expextreadriano'
        }
});
});

music.on('message', async message => {
    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
	  if (!prefixes[message.guild.id]) {
		prefixes[message.guild.id] = {
			prefixes: cfg.prefix
		};
    }

    let prefix = prefixes[message.guild.id].prefixes;
    let msg = message.content.toLowerCase();
    let sender = message.author;
    let args = message.content.slice(prefix.length).trim().split(" ");
    let cmd = args.shift().toLowerCase();

    if (!msg.startsWith(prefix)) return;
    if (sender.bot) return;
    
    try {
        let commandFile = require(`./commands/${cmd}.js`); 
        commandFile.run(music, message, args, queue); 
    } catch(e) { 
        console.log("atá"); 
    } finally { 
        console.log(`${message.author.username} Usou o comando:   ${cmd}, na guild: ${message.guild.name}`);
	}
});
music.login(process.env.t);


music.on('ready', async () => {
    console.log(`${music.user.username} está respondendo!`);
});
