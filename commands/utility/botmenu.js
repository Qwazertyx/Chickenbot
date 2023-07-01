const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botmenu')
        .setDescription('opens a menu to choose what info you want to see on the bot'),
	async execute(interaction) {
		const select = new StringSelectMenuBuilder()
			.setCustomId('options')
			.setPlaceholder('Make a selection!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('General info')
					.setDescription('Graphic + last performance')
					.setValue('generalinfo'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Val')
					.setDescription('info on Val')
					.setValue('val'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Vico')
					.setDescription('info on Vico')
					.setValue('vico'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Poupi')
					.setDescription('info on Poupi')
					.setValue('poupi'),
			);

		const row = new ActionRowBuilder()
			.addComponents(select);

		await interaction.reply({
			content: 'Make a selection!',
			components: [row],
		});
		
		const filter = i => i.customId === 'options' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            await i.deferUpdate();

            let imagePath;
            let infoText;

            if (i.values[0] === 'generalinfo') {
                imagePath = path.join(__dirname, '../../', 'data', 'generalinfo.png');
                infoText = path.join(__dirname, '../../', 'data', 'generalinfo.txt');
            } else if (i.values[0] === 'val') {
                imagePath = path.join(__dirname, '../../', 'data', 'val.png');
                infoText = path.join(__dirname, '../../', 'data', 'val.txt');
            } else if (i.values[0] === 'vico') {
                imagePath = path.join(__dirname, '../../', 'data', 'vico.png');
                infoText = path.join(__dirname, '../../', 'data', 'vico.txt');
            } else if (i.values[0] === 'poupi') {
                imagePath = path.join(__dirname, '../../', 'data', 'poupi.png');
                infoText = path.join(__dirname, '../../', 'data', 'poupi.txt');
            }

            if (imagePath && infoText) {
                const imageFile = fs.readFileSync(imagePath);
				const textContent = fs.readFileSync(infoText, 'utf-8');
                await i.followUp({
                    content: textContent,
                    files: [{
                        attachment: imageFile,
                        name: 'image.png'
                    }]
                });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply('You did not make a selection in time.');
            }
        });
    },
};