use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use dotenv::dotenv;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let server_port = env::var("SERVER_PORT").unwrap_or_else(|_| "8080".to_string());

    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(index))
            .route("/api", web::post().to(api_handler))
    })
    .bind(format!("0.0.0.0:{}", server_port))?
    .run()
    .await
}

async fn index() -> impl Responder {
    HttpResponse::Ok().body("Welcome to the Convo server!")
}

async fn api_handler(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(format!("Received: {}", req_body))
}
