import { respond, giveDonorRole } from '../utils/discord';
import { getFoxyTransactions } from '../utils/foxycart';
import { getPaypalTransactions } from '../utils/paypal';

import { InteractionType, InteractionResponseType, MessageFlags } from 'discord-api-types/v9';
import { isValidRequest, PlatformAlgorithm } from 'discord-verify';

import { Router } from 'itty-router';
const router = Router();

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const failure = (lastUpdate) => {
    return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: `No donation found for that ${lastUpdate ? `email. (Note: PayPal transactions were last updated <t:${new Date(lastUpdate).getTime() / 1000}:R>)` : 'ID.'}`,
            flags: MessageFlags.Ephemeral
        }
    });
}

// Discord interaction route
router.post('/', async (request, env) => {
    const interaction = await request.json();

    if (interaction.type === InteractionType.Ping)
        return respond({ type: InteractionResponseType.Pong });

    if (interaction.type === InteractionType.ApplicationCommand) {
        const code = interaction.data.options[0].value;

        const isEmail = emailRegex.test(code);
        const transactions = await getFoxyTransactions(code, isEmail, env);

        if (transactions.length === 0) {
            if (!isEmail) return failure();

            const [paypalTransactions, lastUpdate] = await getPaypalTransactions(code, env);
            if (paypalTransactions.length === 0) return failure(lastUpdate);
        }

        const userId = interaction.member.user.id;
        const success = await giveDonorRole(userId, env.GUILD_ID, env.DONOR_ROLE_ID, env.DISCORD_TOKEN);

        return respond({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: success
                    ? 'You\'ve been given the donor role, thank you!'
                    : 'Something went wrong, please ask a staff member for help',
                flags: MessageFlags.Ephemeral
            }
        });
    }
});

router.get('*', () => new Response('Not found', { status: 404 }));

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === 'POST' && url.pathname === '/') {
            const isValid = await isValidRequest(request, env.DISCORD_PUBLIC_KEY, PlatformAlgorithm.Cloudflare);
            if (!isValid) return new Response('Bad request signature.', { status: 401 });
        }

        return router.handle(request, env);
    }
};