use actix_web::{web, HttpResponse, Responder};

pub async fn index() -> impl Responder {
    HttpResponse::Ok().body("Welcome to the Convo server!")
}

pub async fn api_handler(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(format!("Received: {}", req_body))
}
