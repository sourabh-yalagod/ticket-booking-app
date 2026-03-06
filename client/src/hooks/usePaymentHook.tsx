import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const usePaymentHook = () => {

    const handlePayment = async (amount: number): Promise<boolean> => {

        const order = await axios.post(
            baseUrl + "/api/testing/payment/create-order",
            {
                amount,
                currency: "INR",
                receipt: "ticket_receipt"
            }
        );

        return new Promise((resolve) => {

            const options = {
                key: "rzp_test_S0vMTGWf7dYe6S",
                amount: order.data.amount,
                currency: "INR",
                name: "Movie Ticket",
                description: "Ticket Booking",
                order_id: order.data.id,

                handler: async function (response: any) {

                    try {
                        await axios.post(
                            baseUrl + "/api/testing/payment/verify",
                            response
                        );

                        resolve(true); // ✅ payment success
                    } catch (error) {
                        resolve(false); // ❌ verification failed
                    }
                },

                modal: {
                    ondismiss: function () {
                        resolve(false); // ❌ user closed payment window
                    }
                },

                theme: {
                    color: "#3399cc"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        });
    };

    return { handlePayment };
};

export default usePaymentHook;