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
            try {
                if (!i.isButton() && !i.isStringSelectMenu()) return;
                if (i.deferred || i.replied) return;

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
                    const lastLine = lines.slice(-2);
                    const packlastlines = lines.slice(-20);

                    function calculateAveragePercentage(percentages) {
                        if (percentages.length === 0) {
                            return 0;
                        }

                        const sum = percentages.reduce((total, percentage) => total + percentage, 0);
                        return sum / percentages.length;
                    }

					const percentages7Days = [];
					for (let i = lines.length - 1; i >= lines.length - 7; i--) {
						const line = lines[i];
						const match = /:\s(\d+\.\d+)/.exec(line);
						if (match) {
							const percentage = parseFloat(match[1]);
							percentages7Days.push(percentage);
						}
					}

					const percentages30Days = [];
					for (let i = lines.length - 1; i >= lines.length - 30; i--) {
						const line = lines[i];
						const match = /:\s(\d+\.\d+)/.exec(line);
						if (match) {
							const percentage = parseFloat(match[1]);
							percentages30Days.push(percentage);
						}
					}
					const averagePercentage7Days = percentages7Days.length > 0 ? calculateAveragePercentage(percentages7Days) : 0;
                    const averagePercentage30Days = percentages30Days.length > 0 ? calculateAveragePercentage(percentages30Days) : 0;

                    const rowWithButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('toggle-text')
                            .setLabel('📝')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('toggle-percentage')
                            .setLabel('🧮')
                            .setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setCustomId('toggle-all')
							.setLabel('🤓')
							.setStyle(ButtonStyle.Danger)
                    );

                    const fullTextCollector = interaction.channel.createMessageComponentCollector({
                        filter: component =>
                            (component.customId === 'toggle-text' || component.customId === 'toggle-all' || component.customId === 'toggle-percentage') &&
                            component.user.id === interaction.user.id,
                        time: 20000
                    });

                    fullTextCollector.on('collect', async component => {
                        try {
                            if (!component.isButton()) return;
                            if (component.deferred || component.replied) return;

                            if (component.customId === 'toggle-text') {
                                await component.update({
                                    content: "```\n" + packlastlines.join('\n') + "```",
                                    files: [],
                                    components: []
                                });
                            } else if (component.customId === 'toggle-percentage') { 
                        		await component.update({
                                    content: `\`\`\`\nAverage Percentage (last 7 days): ${averagePercentage7Days.toFixed(2)}%\nGain in % (last 7 days) : ${(averagePercentage7Days * 7).toFixed(2)}%\nAverage Percentage (last 30 days): ${averagePercentage30Days.toFixed(2)}%\nGain in % (last 30 days) : ${(averagePercentage30Days * 30).toFixed(2)}%\`\`\``,
                                    files: [],
                                    components: []
                                });
							} else if (component.customId === 'toggle-all') {
								await component.update({
									content: "```\n" + packlastlines.join('\n') + "```" + '\n' + `\`\`\`\nAverage Percentage (last 7 days): ${averagePercentage7Days.toFixed(2)}%\nGain in % (last 7 days) : ${(averagePercentage7Days * 7).toFixed(2)}%\nAverage Percentage (last 30 days): ${averagePercentage30Days.toFixed(2)}%\nGain in % (last 30 days) : ${(averagePercentage30Days * 30).toFixed(2)}%\`\`\``,
									files: [{
										attachment: imageFile,
										name: 'image.png'
									}],
									components: []
								});
								}
                        } catch (error) {
                            console.error(error);
                        }
                    });

                    await i.followUp({
                        content: "```\n" + lastLine.join('\n') + "```",
                        files: [{
                            attachment: imageFile,
                            name: 'image.png'
                        }],
                        components: [rowWithButtons]
                    });
                }
            } catch (error) {
                console.error(error);
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply('You did not make a selection in time.');
            }
        });
    },
};
