use actix::{Actor, StreamHandler};
use actix_web::{web, HttpRequest, HttpResponse, Result};
use actix_web_actors::ws::{self, WebsocketContext};

pub async fn websocket_handler(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, actix_web::Error> {
    ws::start(WsSession::new(), &req, stream).map_err(|e| {
        log::error!("WebSocket handshake failed: {:?}", e);
        e
    })
}

pub struct WsSession;

impl WsSession {
    fn new() -> Self {
        Self
    }
}

impl Actor for WsSession {
    type Context = WebsocketContext<Self>;
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WsSession {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Ping(ping)) => ctx.pong(&ping),
            Ok(ws::Message::Pong(_)) => (),
            Ok(ws::Message::Text(text)) => ctx.text(text),
            Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
            Ok(ws::Message::Close(reason)) => ctx.close(reason),
            Ok(ws::Message::Continuation(_)) => (), 
            Ok(ws::Message::Nop) => (), 
            Err(_) => (),
        }
    }
}
