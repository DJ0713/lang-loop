package com.example.demo.config;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtService {

    private  final String SECRET_KEY="mysecretkeymysecretkeymysecretkey12345";

    private final Key key=Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    private static final long JWT_EXPIRATION=1000*60*60*24;

    public String generateToken(String username){
        return Jwts.builder()
              .setSubject(username)
              .setIssuedAt(new Date())
              .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
              .signWith(key)
              .compact();
    }
    public String extractUsername(String token){
        return extractAllClaims(token).getSubject();
    }
    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token,Function<Claims,T> claimsResolver){
        final Claims claims=extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
              .setSigningKey(key)
              .build()
              .parseClaimsJws(token)
              .getBody();
              
    }

    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token,UserDetails userDetails){
        final String username=extractUsername(token);

        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
    
}
