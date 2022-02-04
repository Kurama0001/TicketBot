const Settings = require('./Config.json');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: 32767 });

client.on('ready', () => {
  console.log(`${client.user.tag} en ligne!`)
})

client.login("TOKEN")

client.on('interactionCreate', async (interaction) => {
  if(!interaction.isButton()) return;

  if(interaction.customId === Settings.BUTTONS.OPEN.CUSTOM_ID) {
    try {
      if(interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}` && Settings.ONE_TICKET_PER_MEMBER === true)) return interaction.reply({ content: String(interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`)), ephemeral: true })
      interaction.guild.channels.create(`ticket-${interaction.user.id}`, { topic: Settings.TOPIC_TICKET, parent: Settings.CATEGORY_TICKET,  permissionOverwrites: [{ id: interaction.user.id, allow: Discord.Permissions.FLAGS.VIEW_CHANNEL }, { id: interaction.guild.id, deny: Discord.Permissions.FLAGS.VIEW_CHANNEL } ]}).then(async (c) => {
        if(Settings.TICKET_ROLE === String && interaction.guild.roles.cache.get(Settings.TICKET_ROLE)) await c.permissionOverwrites.create(Settings.TICKET_ROLE, { VIEW_CHANNEL: true })
        await interaction.reply({ content: String(c), ephemeral: true }) 
        await c.send({ embeds: [new Discord.MessageEmbed().setColor(Settings.EMBEDS.WELCOME_TICKET.COLOR).setFooter({ text: Settings.EMBEDS.WELCOME_TICKET.FOOTER }).setThumbnail(Settings.EMBEDS.WELCOME_TICKET.THUMBNAIL).setTitle(Settings.EMBEDS.WELCOME_TICKET.TITLE).setDescription(Settings.EMBEDS.WELCOME_TICKET.DESCRIPTION)], components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId(Settings.BUTTONS.CLOSE.CUSTOM_ID).setLabel(Settings.BUTTONS.CLOSE.TITLE).setStyle(Settings.BUTTONS.CLOSE.COLOR))] })
      })
    } catch (error) {
      console.log(error);
    }
  }

  if(interaction.customId === Settings.BUTTONS.CLOSE.CUSTOM_ID) {
    try {
      await interaction.deferUpdate()

      interaction.channel.send({ embeds: [new Discord.MessageEmbed().setColor(Settings.EMBEDS.CLOSE_TICKET.COLOR).setFooter({ text: Settings.EMBEDS.CLOSE_TICKET.FOOTER }).setThumbnail(Settings.EMBEDS.CLOSE_TICKET.THUMBNAIL).setTitle(Settings.EMBEDS.CLOSE_TICKET.TITLE).setDescription(Settings.EMBEDS.CLOSE_TICKET.DESCRIPTION)]})
      setTimeout(() => {
        interaction.channel.delete()
      }, parseInt(Settings.TIMEOUT_DELETE_TICKET))
    } catch (error) {
      console.log(error);
    }
  }
})

client.on('messageCreate', async (message) => {
  if(message.content.startsWith(`${Settings.PREFIX}message_open_ticket`)) {
    try {
      message.channel.send({ embeds: [new Discord.MessageEmbed().setColor(Settings.EMBEDS.OPEN_TICKET.COLOR).setFooter({ text: Settings.EMBEDS.OPEN_TICKET.FOOTER }).setThumbnail(Settings.EMBEDS.OPEN_TICKET.THUMBNAIL).setTitle(Settings.EMBEDS.OPEN_TICKET.TITLE).setDescription(Settings.EMBEDS.OPEN_TICKET.DESCRIPTION)], components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId(Settings.BUTTONS.OPEN.CUSTOM_ID).setLabel(Settings.BUTTONS.OPEN.TITLE).setStyle(Settings.BUTTONS.OPEN.COLOR))] })
    } catch (error) {
      console.log(error);
    }
  }
})