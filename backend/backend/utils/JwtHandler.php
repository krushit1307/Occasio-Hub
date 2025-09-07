<?php
class JwtHandler {
    private $jwt_secret = "occassio_hub_secret_key_2024";
    private $jwt_refresh_secret = "occassio_hub_refresh_secret_2024";
    private $jwt_algorithm = 'HS256';
    private $jwt_expiry = 3600; // 1 hour
    private $jwt_refresh_expiry = 604800; // 7 days

    public function __construct() {
        date_default_timezone_set('Asia/Kolkata');
    }

    public function _jwt_encode_data($iss, $data) {
        global $jwt_secret, $jwt_algorithm;

        $secret = $this->jwt_secret;

        $issuer_claim = $iss;
        $audience_claim = "THE_AUDIENCE";
        $issuedat_claim = time();
        $notbefore_claim = $issuedat_claim + 10;
        $expire_claim = $issuedat_claim + $this->jwt_expiry;

        $token = array(
            "iss" => $issuer_claim,
            "aud" => $audience_claim,
            "iat" => $issuedat_claim,
            "nbf" => $notbefore_claim,
            "exp" => $expire_claim,
            "data" => $data
        );

        $jwt = $this->encode($token, $secret);
        return $jwt;
    }

    public function _jwt_encode_refresh_token($iss, $data) {
        $secret = $this->jwt_refresh_secret;

        $issuer_claim = $iss;
        $audience_claim = "THE_AUDIENCE";
        $issuedat_claim = time();
        $notbefore_claim = $issuedat_claim + 10;
        $expire_claim = $issuedat_claim + $this->jwt_refresh_expiry;

        $token = array(
            "iss" => $issuer_claim,
            "aud" => $audience_claim,
            "iat" => $issuedat_claim,
            "nbf" => $notbefore_claim,
            "exp" => $expire_claim,
            "data" => $data
        );

        $jwt = $this->encode($token, $secret);
        return $jwt;
    }

    public function _jwt_decode_data($jwt_token) {
        try {
            $secret = $this->jwt_secret;
            $decode_value = $this->decode($jwt_token, $secret);
            return $decode_value;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Access denied.", "error" => $e->getMessage()));
            exit();
        }
    }

    public function _jwt_decode_refresh_token($jwt_token) {
        try {
            $secret = $this->jwt_refresh_secret;
            $decode_value = $this->decode($jwt_token, $secret);
            return $decode_value;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Access denied.", "error" => $e->getMessage()));
            exit();
        }
    }

    private function encode($data, $secret) {
        $header = json_encode(['typ' => 'JWT', 'alg' => $this->jwt_algorithm]);
        $payload = json_encode($data);
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
        
        return $jwt;
    }

    private function decode($jwt, $secret) {
        $tokenParts = explode('.', $jwt);
        if (count($tokenParts) != 3) {
            throw new Exception('Invalid token format');
        }
        
        $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
        $signatureProvided = $tokenParts[2];
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        if ($base64UrlSignature !== $signatureProvided) {
            throw new Exception('Invalid signature');
        }
        
        $payloadObj = json_decode($payload);
        
        if ($payloadObj->exp < time()) {
            throw new Exception('Token expired');
        }
        
        return $payloadObj;
    }

    public function generateTokens($user_id, $user_email, $user_role) {
        $issued_at = time();
        $not_before = $issued_at + 10;
        $expire = $issued_at + $this->jwt_expiry;
        $refresh_expire = $issued_at + $this->jwt_refresh_expiry;

        $payload = array(
            "iss" => "occassio_hub",
            "aud" => "occassio_hub_users",
            "iat" => $issued_at,
            "nbf" => $not_before,
            "exp" => $expire,
            "data" => array(
                "id" => $user_id,
                "email" => $user_email,
                "role" => $user_role
            )
        );

        $refresh_payload = array(
            "iss" => "occassio_hub",
            "aud" => "occassio_hub_users",
            "iat" => $issued_at,
            "nbf" => $not_before,
            "exp" => $refresh_expire,
            "data" => array(
                "id" => $user_id,
                "email" => $user_email,
                "role" => $user_role
            )
        );

        $access_token = $this->encode($payload, $this->jwt_secret);
        $refresh_token = $this->encode($refresh_payload, $this->jwt_refresh_secret);

        return array(
            "access_token" => $access_token,
            "refresh_token" => $refresh_token,
            "expires_in" => $this->jwt_expiry
        );
    }
}
?>
