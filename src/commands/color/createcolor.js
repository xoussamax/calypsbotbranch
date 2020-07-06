const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

// Color hex regex
const rgx = /^#?[0-9A-F]{6}$/i;

module.exports = class CreateColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'createcolor',
      aliases: ['cc'],
      usage: 'createcolor <hex> <color name>',
      description: 'Creates a new role for the given color hex.',
      type: 'color',
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['createcolor #FF0000 Red']
    });
  }
  async run(message, args) {
    let hex = args.shift();
    if (args.length === 0 || !rgx.test(hex))
      return this.sendErrorMessage(message, 'Invalid arguments. Please provide a color hex and a color name.');
    let colorName = args.join(' ');
    if (!colorName.startsWith('#')) colorName = '#' + colorName;
    if (!hex.startsWith('#')) hex = '#' + hex;
    try {
      const role = await message.guild.roles.create({
        data: {
          name: colorName,
          color: hex,
          permissions: []
        }
      });
      const embed = new MessageEmbed()
        .setTitle('Create Color')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(`Successfully created the ${role} color.`)
        .addField('Hex', `\`${hex}\``, true)
        .addField('Color Name', `\`${colorName.slice(1, colorName.length)}\``, true)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(hex);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 'Something went wrong. Please try again.', err.message);
    }
  }
};