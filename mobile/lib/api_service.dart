import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'http://localhost:3000';

  Future<http.Response> signUp(String fullName, String email, String password, String referralCode) {
    return http.post(
      Uri.parse('$baseUrl/signup'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'fullName': fullName,
        'email': email,
        'password': password,
        'referralCode': referralCode,
      }),
    );
  }

  Future<http.Response> verifyOtp(String email, String otp) {
    return http.post(
      Uri.parse('$baseUrl/verify-otp'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'email': email,
        'otp': otp,
      }),
    );
  }

  Future<http.Response> login(String email, String password) {
    return http.post(
      Uri.parse('$baseUrl/login'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'email': email,
        'password': password,
      }),
    );
  }
}
