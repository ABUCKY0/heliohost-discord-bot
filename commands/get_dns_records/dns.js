// Gets all dns records for a given domain
const sslChecker = require('ssl-checker');
const { SlashCommandBuilder, AllowedMentionsTypes, ActionRow, Embed } = require('discord.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { checkAuth } = require('../../utility/authorization.js');
const { config } = require('../../config.js');
const dns = require('dns').promises;
const { isAsyncFunction } = require('util/types');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('dns')
        .setDescription('Check the DNS Records of a website.')
        .addStringOption(option =>
            option.setName('domain')
                .setDescription('The domain to check.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of record to check.')
                .setRequired(true)
                .addChoices(
                    { name: 'A', value: 'A' },
                    { name: 'AAAA', value: 'AAAA' },
                    { name: 'CNAME', value: 'CNAME' },
                    { name: 'MX', value: 'MX' },
                    { name: 'NS', value: 'NS' },
                    { name: 'TXT', value: 'TXT' },
                    { name: 'SRV', value: 'SRV' },
                    { name: 'SOA', value: 'SOA' },
                    { name: 'PTR', value: 'PTR' },
                    { name: 'DNSKEY', value: 'DNSKEY' },
                    { name: 'All of the Above', value: 'ALL' }
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            let domain = interaction.options.getString('domain');
            let type = interaction.options.getString('type');
            // Validate that the URL is valid

            // remove https:// and http:// from the URL
            domain = domain.replace(/(^\w+:|^)\/\//, '');
            domain = domain.replace(/\/$/, '');
            // Strip everything after the first / in the URL
            domain = domain.split('/')[0];
            // Remove first /
            domain = domain.replace(/\//, '');

            // Check if the domain is valid
            if (!domain) {
                await interaction.editReply({ content: "Invalid domain." });
                return;
            }

            let records = {};
            records.a = [];
            records.aaaa = [];
            records.cname = [];
            records.mx = [];
            records.ns = [];
            records.txt = [];
            records.srv = [];
            records.soa = [];
            records.ptr = [];
            records.dnskey = [];

            // Getting the DNS records
            await dns.resolveAny(domain).then((resolvedRecords) => {
                for (recordnum in resolvedRecords) {
                    let record = resolvedRecords[recordnum];
                    let recordType = record.type;
                    console.log(recordType);
                    console.log("Test")
                    switch (recordType) {
                        case 'A':
                            records.a.push(record);
                            break;
                        case 'AAAA':
                            records.aaaa.push(record);
                            break;
                        case 'CNAME':
                            records.cname.push(record);
                            break;
                        case 'MX':
                            records.mx.push(record);
                            console.log("added MX record");
                            break;
                        case 'NS':
                            records.ns.push(record);
                            break;
                        case 'TXT':
                            records.txt.push(record);
                            break;
                        case 'SRV':
                            records.srv.push(record);
                            break;
                        case 'SOA':
                            records.soa.push(record);
                            break;
                        case 'PTR':
                            records.ptr.push(record);
                            break;
                        case 'DNSKEY':
                            records.dnskey.push(record);
                            break;
                    }
                }
            });
            // Wait until dns.resolveAny is done
            

            console.log(records);

            // Displaying the DNS records
            let dnsEmbed = new EmbedBuilder()
                .setTitle(`DNS Records for ${domain}`)
                .setColor('#0099ff')
                .setTimestamp()

            if (type == 'ALL') {
                let fields = [];
                let a_record_string = records.a.map(record => `- \`${record.address}\`, TTL: ${record.ttl}`).join('\n') || 'No A Records found.';
                let aaaa_record_string = records.aaaa.map(record => `- \`${record.address}\`, TTL: ${record.ttl}`).join('\n') || 'No AAAA Records found.';
                let cname_record_string = records.cname.map(record => `- \`${record.address}\`, TTL: ${record.ttl}`).join('\n') || 'No CNAME Records found.';
                let mx_record_string = records.mx.map(record => `- \`${record.exchange}\`, Priority: ${record.priority}`).join('\n') || 'No MX Records found.';
                let ns_record_string = records.ns.map(record => `- \`${record.value}\``).join('\n') || 'No NS Records found.';
                let txt_record_string = records.txt.map(record => `- \`${record.entries.join(" ")}\``).join('\n') || 'No TXT Records found.';
                let srv_record_string = records.srv.map(record => `- \`${record.target}\`, Priority: ${record.priority}`).join('\n') || 'No SRV Records found.';
                let soa_record_string = records.soa.map(record => `- \`${record.nsname}\`, Hostmaster: \`${record.hostmaster}\`, TTL: \`not implemented\``).join('\n') || 'No SOA Records found.';
                let ptr_record_string = records.ptr.map(record => `- \`${record.value}\``).join('\n') || 'No PTR Records found.';
                let dnskey_record_string = records.dnskey.map(record => `- \`${record.value}\``).join('\n') || 'No DNSKEY Records found.';
                fields.push({ name: 'A Records', value: a_record_string });
                fields.push({ name: 'AAAA Records', value: aaaa_record_string });
                fields.push({ name: 'CNAME Records', value: cname_record_string });
                fields.push({ name: 'MX Records', value: mx_record_string });
                fields.push({ name: 'NS Records', value: ns_record_string });
                fields.push({ name: 'TXT Records', value: txt_record_string });
                fields.push({ name: 'SRV Records', value: srv_record_string });
                fields.push({ name: 'SOA Records', value: soa_record_string });
                fields.push({ name: 'PTR Records', value: ptr_record_string });
                fields.push({ name: 'DNSKEY Records', value: dnskey_record_string });


                dnsEmbed.addFields(fields);
                await interaction.editReply({ embeds: [dnsEmbed] });

                return;
            }
            else {
                let fields = [];
                switch (type) {
                    case 'A':
                        fields.push({ name: 'A Records', value: records.a.map(record => `- \`${record.address}\`, TTL: ${record.ttl}`).join('\n') || 'No A Records found.' });
                        break;
                    case 'AAAA':
                        fields.push({ name: 'AAAA Records', value: records.aaaa.map(record => `- \`${record.address}\`, TTL: ${record.ttl}`).join('\n') || 'No AAAA Records found.' });
                        break;
                    case 'CNAME':
                        fields.push({ name: 'CNAME Records', value: records.cname.map(record => `- \`${record.address}\`, TTL: ${record.ttl}`).join('\n') || 'No CNAME Records found.' });
                        break;
                    case 'MX':
                        fields.push({ name: 'MX Records', value: records.mx.map(record => `- \`${record.exchange}\`, Priority: ${record.priority}`).join('\n') || 'No MX Records found.' });
                        break;
                    case 'NS':
                        fields.push({ name: 'NS Records', value: records.ns.map(record => `- \`${record.value}\``).join('\n') || 'No NS Records found.' });
                        break;
                    case 'TXT':
                        fields.push({ name: 'TXT Records', value: records.txt.map(record => `- \`${record.entries.join(" ")}\``).join('\n') || 'No TXT Records found.' });
                        break;
                    case 'SRV':
                        fields.push({ name: 'SRV Records', value: records.srv.map(record => `- \`${record.target}\`, Priority: ${record.priority}`).join('\n') || 'No SRV Records found.' });
                        break;
                    case 'SOA':
                        fields.push({ name: 'SOA Records', value: records.soa.map(record => `- \`${record.nsname}\`, Hostmaster: \`${record.hostmaster}\`, TTL: \`not implemented\``).join('\n') || 'No SOA Records found.' });
                        break;
                    case 'PTR':
                        fields.push({ name: 'PTR Records', value: records.ptr.map(record => `- \`${record.value}\``).join('\n') || 'No PTR Records found.' });
                        break;
                    case 'DNSKEY':
                        fields.push({ name: 'DNSKEY Records', value: records.dnskey.map(record => `- \`${record.value}\``).join('\n') || 'No DNSKEY Records found.' });
                        break;
                }
                
                   let dnsEmbed = new EmbedBuilder()
                    .setTitle(`DNS Records for ${domain}`)
                    .setColor('#0099ff')
                    .setTimestamp()
                    .addFields(fields);
                await interaction.editReply({ embeds: [dnsEmbed] });
                return;
            }
        }
        catch (error) {
            console.error(error);
            await interaction.editReply({ content: "There was an error while checking URL's DNS. Make sure you properly typed the URL, and it's accessable." });
        }
    }
};
