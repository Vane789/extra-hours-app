//package com.example.api_gestion_horas_extra.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//
//@Configuration
//public class CorsConfig {
//
//    @Bean
//    public WebMvcConfigurer webMvcConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedOrigins("https://extra-hours-app.vercel.app")
//                        .allowedMethods("*")
//                        .allowedHeaders("Authorization", "*")
//                        .allowCredentials(true)
//                        .maxAge(3600);
//            }
//        };
//    }
//
//}