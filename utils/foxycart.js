const apiBase = 'https://api.foxy.io';

const fetchToken = async (refreshToken, clientId, clientSecret) => {
    const response = await fetch(`${apiBase}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'FOXY-API-VERSION': '1',
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`
    });

    const data = await response.json();
    return data.access_token;
}

const fetchTransactions = async env => {
    const token = await fetchToken(env.FOXY_REFRESH_TOKEN, env.FOXY_CLIENT_ID, env.FOXY_CLIENT_SECRET);

    const response = await fetch(`${apiBase}/stores/${env.FOXY_STORE_ID}/transactions`, {
        method: 'GET',
        headers: {
            'FOXY-API-VERSION': '1',
            Authorization: `Bearer ${token}`
        }
    });

    const node = await response.json();
    return node._embedded['fx:transactions'];
}

export const getFoxyTransactions = async (code, isEmail, env) => {
    const transactions = await fetchTransactions(env);

    return transactions.filter(t => isEmail
        ? t.customer_email === code
        : t.id === parseInt(code)
    );
}
