const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetSystemChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setsystemchannel',
      aliases: ['setsc', 'ssc'],
      usage: 'setsystemchannel <channel mention/ID>',
      description: oneLine`
        Sets the system text channel for your server, where Calypso's system messages will be sent. 
        Provide no channel to clear the current system channel.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setsystemchannel #general']
    });
  }
  run(message, args) {
    const systemChannelId = message.client.db.settings.selectSystemChannelId.pluck().get(message.guild.id);
    let oldSystemChannel = '`None`';
    if (systemChannelId) oldSystemChannel = message.guild.channels.cache.get(systemChannelId);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `system channel` was successfully updated.')
      .addField('Setting', 'System Channel', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateSystemChannelId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Current Value', `${oldSystemChannel} ➔ \`None\``, true));
    }

    const channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel) 
      return this.sendErrorMessage(message, 'Invalid argument. Please mention a text channel or provide a channel ID.');
    message.client.db.settings.updateSystemChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed.addField('Current Value', `${oldSystemChannel} ➔ ${channel}`, true));
  }
};