export const giveDonorRole = async (userId, guildId, roleId, token) => {
    const res = await fetch(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bot ${token}`
        }
    });

    return res.status === 204;
};

export const respond = (body) => {
    return new Response(JSON.stringify(body), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
