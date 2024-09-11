use crate::models::{Claims, LoginRequest, NewMeeting, NewMessage, NewUser};
use crate::services::{
    create_meeting, create_message, create_user, generate_jwt, get_meeting_by_id,
    get_messages_for_meeting, get_user_by_email, get_user_by_id, hash_password, verify_password,
};
use actix_web::{web, HttpMessage, HttpRequest, HttpResponse, Responder};
use log::{error, info};
use serde_json::json;

pub async fn register_handler(users: web::Json<NewUser>) -> impl Responder {
    info!("Registering new user with email: {}", users.email);

    match hash_password(&users.password) {
        Ok(hashed_password) => {
            let new_user = NewUser {
                name: users.name.clone(),
                email: users.email.clone(),
                password: hashed_password,
            };
            match create_user(new_user) {
                Ok(user) => {
                    info!("User created successfully: {:?}", user);
                    HttpResponse::Created().json(user)
                }
                Err(e) => {
                    error!("Error creating user: {:?}", e);
                    HttpResponse::InternalServerError().finish()
                }
            }
        }
        Err(e) => {
            error!("Error hashing password: {:?}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}

pub async fn login_handler(body: web::Json<LoginRequest>) -> impl Responder {
    let login_data = body.into_inner();
    info!("Attempting login for email: {}", login_data.email);

    match get_user_by_email(&login_data.email) {
        Ok(existing_user) => {
            if verify_password(&login_data.password, &existing_user.password).unwrap_or(false) {
                match generate_jwt(&existing_user.id.to_string()) {
                    Ok(token) => {
                        info!(
                            "Login successful, token generated for user: {}",
                            login_data.email
                        );
                        HttpResponse::Ok().json(json!({ "token": token }))
                    }
                    Err(e) => {
                        error!("Error generating token: {:?}", e);
                        HttpResponse::InternalServerError()
                            .json(json!({ "message": "Error generating token" }))
                    }
                }
            } else {
                info!("Invalid password attempt for email: {}", login_data.email);
                HttpResponse::Unauthorized().json(json!({ "message": "Invalid password" }))
            }
        }
        Err(_) => {
            info!("User not found for email: {}", login_data.email);
            HttpResponse::Unauthorized().json(json!({ "message": "User not found" }))
        }
    }
}

pub async fn index() -> impl Responder {
    info!("Index route called");
    HttpResponse::Ok().body("Welcome to the Convo server!")
}

pub async fn api_handler(req_body: String) -> impl Responder {
    info!("API handler received request body: {}", req_body);
    HttpResponse::Ok().body(format!("Received: {}", req_body))
}

pub async fn get_user(req: HttpRequest) -> impl Responder {
    if let Some(claims) = req.extensions().get::<Claims>() {
        let user_id = claims.sub.parse::<i32>().unwrap_or(0);
        info!("Fetching user with ID: {}", user_id);

        match get_user_by_id(user_id) {
            Ok(user) => {
                info!("User fetched successfully: {:?}", user);
                HttpResponse::Ok().json(user)
            }
            Err(e) => {
                error!("Error fetching user: {:?}", e);
                HttpResponse::InternalServerError().finish()
            }
        }
    } else {
        info!("Unauthorized access attempt");
        HttpResponse::Unauthorized().finish()
    }
}

pub async fn create_user_handler(new_user: web::Json<NewUser>) -> impl Responder {
    info!("Creating user with data: {:?}", new_user);

    match create_user(new_user.into_inner()) {
        Ok(user) => {
            info!("User created successfully: {:?}", user);
            HttpResponse::Created().json(user)
        }
        Err(e) => {
            error!("Error creating user: {:?}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}

pub async fn create_meeting_handler(meeting: web::Json<NewMeeting>) -> impl Responder {
    info!("Creating meeting with data: {:?}", meeting);

    match create_meeting(meeting.into_inner()) {
        Ok(meeting) => {
            info!("Meeting created successfully: {:?}", meeting);
            HttpResponse::Created().json(meeting)
        }
        Err(e) => {
            error!("Failed to create meeting: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to create meeting")
        }
    }
}

pub async fn get_meeting_handler(path: web::Path<i32>) -> impl Responder {
    let meeting_id = path.into_inner();
    info!("Fetching meeting with ID: {}", meeting_id);

    match get_meeting_by_id(meeting_id) {
        Ok(meeting) => {
            info!("Meeting fetched successfully: {:?}", meeting);
            HttpResponse::Ok().json(meeting)
        }
        Err(e) => {
            error!("Error fetching meeting: {:?}", e);
            HttpResponse::NotFound().finish()
        }
    }
}

pub async fn create_message_handler(message: web::Json<NewMessage>) -> impl Responder {
    info!("Creating message with data: {:?}", message);

    match create_message(message.into_inner()) {
        Ok(message) => {
            info!("Message created successfully: {:?}", message);
            HttpResponse::Created().json(message)
        }
        Err(e) => {
            error!("Failed to create message: {:?}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}

pub async fn get_messages_handler(path: web::Path<i32>) -> impl Responder {
    let meeting_id = path.into_inner();
    info!("Fetching messages for meeting with ID: {}", meeting_id);

    match get_messages_for_meeting(meeting_id) {
        Ok(messages) => {
            info!(
                "Messages fetched successfully for meeting ID: {}",
                meeting_id
            );
            HttpResponse::Ok().json(messages)
        }
        Err(e) => {
            error!(
                "Error fetching messages for meeting ID: {}: {:?}",
                meeting_id, e
            );
            HttpResponse::InternalServerError().finish()
        }
    }
}
