use crate::models::{NewMeeting, NewMessage, NewUser};
use crate::services::{
    create_meeting, create_message, create_user, get_meeting_by_id, get_messages_for_meeting,
    hash_password, verify_password, generate_jwt, get_user_by_id, get_user_by_email,
};
use actix_web::{web, HttpMessage, HttpRequest, HttpResponse, Responder};
use crate::models::Claims;

pub async fn register_handler(users: web::Json<NewUser>) -> impl Responder {
    
    match hash_password(&users.password) {
        Ok(hashed_password) => {
            let new_user = NewUser {
                name: users.name.clone(),
                email: users.email.clone(),
                password: hashed_password,
            };
            match create_user(new_user) {
                Ok(user) => HttpResponse::Created().json(user),
                Err(_) => HttpResponse::InternalServerError().finish(),
            }
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}


pub async fn login_handler(user: web::Json<NewUser>) -> impl Responder {
    match get_user_by_email(&user.email) {
        Ok(existing_user) => {
            if verify_password(&user.password, &existing_user.password).unwrap_or(false) {
                match generate_jwt(&existing_user.id.to_string()) {
                    Ok(token) => HttpResponse::Ok().json(token),
                    Err(_) => HttpResponse::InternalServerError().finish(),
                }
            } else {
                HttpResponse::Unauthorized().finish()
            }
        }
        Err(_) => HttpResponse::Unauthorized().finish(),
    }
}

pub async fn index() -> impl Responder {
    HttpResponse::Ok().body("Welcome to the Convo server!")
}

pub async fn api_handler(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(format!("Received: {}", req_body))
}

pub async fn get_user(req: HttpRequest) -> impl Responder {
    if let Some(claims) = req.extensions().get::<Claims>() {
        match get_user_by_id(claims.sub.parse::<i32>().unwrap_or(0)) {
            Ok(user) => HttpResponse::Ok().json(user),
            Err(_) => HttpResponse::InternalServerError().finish(),
        }
    } else {
        HttpResponse::Unauthorized().finish()
    }
}


pub async fn create_user_handler(new_user: web::Json<NewUser>) -> impl Responder {
    match create_user(new_user.into_inner()) {
        Ok(user) => HttpResponse::Created().json(user),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}


pub async fn create_meeting_handler(meeting: web::Json<NewMeeting>) -> impl Responder {
    match create_meeting(meeting.into_inner()) {
        Ok(meeting) => HttpResponse::Created().json(meeting),
        Err(e) => {
            log::error!("Failed to create meeting: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to create meeting")
        }
    }
}


pub async fn get_meeting_handler(path: web::Path<i32>) -> impl Responder {
    match get_meeting_by_id(*path) {
        Ok(meeting) => HttpResponse::Ok().json(meeting),
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

pub async fn create_message_handler(message: web::Json<NewMessage>) -> impl Responder {
    match create_message(message.into_inner()) {
        Ok(message) => HttpResponse::Created().json(message),
        Err(e) => {
            log::error!("Failed to create message: {:?}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}


pub async fn get_messages_handler(path: web::Path<i32>) -> impl Responder {
    let meeting_id = path.into_inner();
    match get_messages_for_meeting(meeting_id) {
        Ok(messages) => HttpResponse::Ok().json(messages),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
