import axios from "axios";
import { apis } from "../apis";

const baseUrl = import.meta.env.VITE_BASE_URL;

const usePaymentHook = () => {

    const handlePayment = async (amount: number): Promise<boolean> => {
        const order = await apis.createPaymentIntent(amount);
        const data = JSON.parse(order.data)
        if (!order.isSuccess) return false;
        return new Promise((resolve) => {

            const options = {
                key: "rzp_test_S0vMTGWf7dYe6S",
                amount: data.amount,
                currency: "INR",
                name: "Movie Ticket",
                description: "Ticket Booking",
                order_id: data.id,

                handler: async function (response: any) {
                    const payload = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    };
                    try {
                        await axios.post(
                            baseUrl + "/api/payment/verify",
                            payload,
                            {
                                headers: {
                                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                                }
                            }
                        );
                        resolve(true)
                    } catch (error) {
                        resolve(false)
                    }
                },

                modal: {
                    ondismiss: function () {
                        resolve(false);
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