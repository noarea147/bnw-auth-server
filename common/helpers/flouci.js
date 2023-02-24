// require axios
const axios = require('axios');

// getPaymentLink
exports.getPaymentLink = async (amount, paymentID, successLink, failLink) => {
    const paymentData = {
        app_token: process.env.PAYMENT_APP_TOKEN,
        app_secret: process.env.PAYMENT_APP_SECRET,
        amount: amount,
        accept_card: "true",
        session_timeout_secs: 1200,
        success_link: successLink,
        fail_link: failLink,
        developer_tracking_id: paymentID
    }
    const response = await axios.post(process.env.PAYMENT_API_URL, paymentData);
    return response.data.result.link;
}