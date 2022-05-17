package com.example.spm.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class ProtectedController {

    @GetMapping
    public String test() {
        return "hello world";
    }

    @PostMapping
    public String testPost() {
        return "hello world from post";
    }

    @GetMapping("/hello")
    public String printHello(){
        return "Hello from printHello function";
    }
}
