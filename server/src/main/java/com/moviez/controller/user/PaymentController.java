package com.moviez.controller.user;

import com.moviez.dto.CreateOrderRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/testing/payment")
@RequiredArgsConstructor
public class PaymentController {

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    private final RazorpayClient razorpayClient;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) throws RazorpayException {

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", request.getAmount() * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", request.getReceipt());

        Order order = razorpayClient.orders.create(orderRequest);

        return ResponseEntity.ok(order.toString());
    }
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        String razorpayOrderId = payload.get("razorpay_order_id");
        String razorpayPaymentId = payload.get("razorpay_payment_id");
        String razorpaySignature = payload.get("razorpay_signature");
        try {

            String generatedSignature = Utils.getHash(
                    razorpayOrderId + "|" + razorpayPaymentId,
                    razorpaySecret
            );

            if (generatedSignature.equals(razorpaySignature)) {
                return ResponseEntity.ok("Payment verified");
            }

            return ResponseEntity.status(400).body("Invalid payment");

        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
