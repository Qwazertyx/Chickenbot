const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 50000 });

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
				const lines = textContent.split('\n');
				const firstLine = lines[0].trim();  // Sélectionne la première ligne et supprime les espaces inutiles
				const lastLine = lines[lines.length - 1].trim();  // Sélectionne la dernière ligne et supprime les espaces inutiles
				const content = `${firstLine}\n${lastLine}`;  // Concatène la première ligne et la dernière ligne avec un saut de ligne entre elles
				
				const rowWithButton = new ActionRowBuilder()//bouton
					.addComponents(
						new ButtonBuilder()
							.setCustomId('toggle-text')
							.setLabel('+')
							.setStyle(ButtonStyle.Secondary)
				);
				const fullTextCollector = interaction.channel.createMessageComponentCollector({
					filter: component => component.customId === 'toggle-text' && component.user.id === interaction.user.id,
					time: 20000
				});
				fullTextCollector.on('collect', async component => {
					const currentLabel = component.label;
		
					await component.update({
						content: "```" + textContent + "```",
						files: [],
						components: [],
						ephemeral: true
					});
				});
		
				await i.followUp({
					content: "```" +content +"```",
					files: [{
						attachment: imageFile,
						name: 'image.png'
					}],
					components: [rowWithButton],
					ephemeral: true
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