use crate::middleware::AuthMiddleware;
use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use dotenv::dotenv;
use env_logger;
use std::env;

mod handlers;
mod middleware;
mod models;
mod schema;
mod services;
mod utils;
mod ws;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

    log::info!("Starting server...");

    let server_port = env::var("SERVER_PORT").unwrap_or_else(|_| "8080".to_string());
    log::info!("Server port: {}", server_port);

    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![
                actix_web::http::header::AUTHORIZATION,
                actix_web::http::header::ACCEPT,
                actix_web::http::header::CONTENT_TYPE,
            ])
            .supports_credentials();

        log::debug!("Configuring CORS with allowed origin http://localhost:3000");

        App::new()
            .wrap(cors)
            .wrap(AuthMiddleware)
            .route("/", web::get().to(handlers::index))
            .route("/api", web::post().to(handlers::api_handler))
            .route("/register", web::post().to(handlers::register_handler))
            .route("/login", web::post().to(handlers::login_handler))
            .service(
                web::scope("")
                    .route("/user/{id}", web::get().to(handlers::get_user))
                    .route("/user", web::post().to(handlers::create_user_handler))
                    .route(
                        "/api/meetings",
                        web::post().to(handlers::create_meeting_handler),
                    )
                    .route(
                        "/api/meetings/{id}",
                        web::get().to(handlers::get_meeting_handler),
                    )
                    .route(
                        "/api/messages",
                        web::post().to(handlers::create_message_handler),
                    )
                    .route(
                        "/api/messages/{meeting_id}",
                        web::get().to(handlers::get_messages_handler),
                    )
                    .route("/ws/", web::get().to(ws::websocket_handler)),
            )
    })
    .bind(format!("0.0.0.0:{}", server_port))?
    .run()
    .await
}
