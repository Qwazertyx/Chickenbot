const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokemon')
        .setDescription('let you choose a pokemon'),
	async execute(interaction) {
		const select = new StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Make a selection!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Bulbasaur')
					.setDescription('The dual-type Grass/Poison Seed Pokémon.')
					.setValue('bulbasaur'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Charmander')
					.setDescription('The Fire-type Lizard Pokémon.')
					.setValue('charmander'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Squirtle')
					.setDescription('The Water-type Tiny Turtle Pokémon.')
					.setValue('squirtle'),
			);

		const row = new ActionRowBuilder()
			.addComponents(select);

		await interaction.reply({
			content: 'Choose your starter!',
			components: [row],
		});
		
		const filter = i => i.customId === 'starter' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            await i.deferUpdate();

            if (i.values[0] === 'bulbasaur') {
                await i.followUp('You chose Bulbasaur!');
            } else if (i.values[0] === 'charmander') {
                await i.followUp('You chose Charmander!');
            } else if (i.values[0] === 'squirtle') {
                await i.followUp('You chose Squirtle!');
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply('You did not make a selection in time.');
            }
        });
    },
};