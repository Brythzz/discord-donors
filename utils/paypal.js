const baseApi = 'https://api.paypal.com/v1';
const donationEventCode = 'T0013';

const getAuthToken = async (env) => {
    const auth = btoa(env.PAYPAL_CLIENT_ID + ':' + env.PAYPAL_SECRET);

    const response = await fetch(`${baseApi}/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${auth}`
        },
        body: 'grant_type=client_credentials'
    });

    return await response.json();
}

export const fetchPaypalTransactions = async (env) => {
    const { access_token } = await getAuthToken(env);

    const date = new Date();
    const end = date.toISOString();
    date.setMonth(date.getMonth() - 1);

    const params = new URLSearchParams({
        start_date: date.toISOString(),
        end_date: end,
        fields: 'all'
    });

    const response = await fetch(`${baseApi}/reporting/transactions?${params}`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    return await response.json();
}

export const getPaypalTransactions = async (email, env) => {
    const { transaction_details:transactions, last_refreshed_datetime:lastUpdate } = await fetchPaypalTransactions(env);

    return [transactions.filter(t =>
        t.transaction_info.transaction_event_code === donationEventCode
        && t.payer_info.email_address === email
    ), lastUpdate];
}
