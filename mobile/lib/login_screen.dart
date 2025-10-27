import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hybe_celebrity_connect/api_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = ApiService();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _referralCodeController = TextEditingController();
  bool _isLogin = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text(
                  'HYBE Celebrity Connect',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 48),
                if (!_isLogin)
                  TextFormField(
                    controller: _fullNameController,
                    decoration: InputDecoration(
                      labelText: 'Full Name',
                      border: OutlineInputBorder(),
                    ),
                  ),
                if (!_isLogin) SizedBox(height: 16),
                TextFormField(
                  controller: _emailController,
                  decoration: InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(),
                  ),
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                  ),
                ),
                if (!_isLogin) SizedBox(height: 16),
                if (!_isLogin)
                  TextFormField(
                    controller: _referralCodeController,
                    decoration: InputDecoration(
                      labelText: 'Referral Code',
                      border: OutlineInputBorder(),
                    ),
                  ),
                SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () async {
                    if (_formKey.currentState!.validate()) {
                      if (_isLogin) {
                        final response = await _apiService.login(
                          _emailController.text,
                          _passwordController.text,
                        );
                        if (response.statusCode == 200) {
                          final userId = jsonDecode(response.body)['userId'];
                          final conversationResponse = await _apiService.createConversation(userId, 2); // RM is user ID 2
                          if (conversationResponse.statusCode == 201) {
                            final conversationId = jsonDecode(conversationResponse.body)['id'];
                            Navigator.pushNamed(context, '/chat', arguments: {
                              'userId': userId,
                              'conversationId': conversationId,
                            });
                          } else {
                            // Handle error
                          }
                        } else {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: Text('Error'),
                              content: Text('Invalid email or password.'),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: Text('OK'),
                                ),
                              ],
                            ),
                          );
                        }
                      } else {
                        final response = await _apiService.signUp(
                          _fullNameController.text,
                          _emailController.text,
                          _passwordController.text,
                          _referralCodeController.text,
                        );
                        if (response.statusCode == 201) {
                          Navigator.pushNamed(context, '/otp', arguments: _emailController.text);
                        } else {
                          // Handle error
                        }
                      }
                    }
                  },
                  child: Text(_isLogin ? 'Log In' : 'Sign Up'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6A5ACD),
                    padding: EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                  ),
                ),
                SizedBox(height: 16),
                TextButton(
                  onPressed: () {
                    setState(() {
                      _isLogin = !_isLogin;
                    });
                  },
                  child: Text(
                    _isLogin
                        ? 'Don\'t have an account? Sign up'
                        : 'Already have an account? Log in',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
