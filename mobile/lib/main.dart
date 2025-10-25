import 'package:flutter/material.dart';
import 'package:hybe_celebrity_connect/login_screen.dart';
import 'package:hybe_celebrity_connect/otp_screen.dart';
import 'package:hybe_celebrity_connect/chat_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HYBE Celebrity Connect',
      theme: ThemeData(
        primarySwatch: Colors.purple,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF121212),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1E1E1E),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const LoginScreen(),
        '/otp': (context) => const OtpScreen(),
        '/chat': (context) {
          final args = ModalRoute.of(context)!.settings.arguments as Map<String, int>;
          return ChatScreen(
            userId: args['userId']!,
            conversationId: args['conversationId']!,
          );
        },
      },
    );
  }
}
