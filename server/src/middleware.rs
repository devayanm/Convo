use actix_web::{dev::ServiceRequest, Error, HttpMessage};
use actix_web::dev::{Service, ServiceResponse, Transform};
use futures::future::{ok, Ready, LocalBoxFuture};
use std::rc::Rc;
use crate::services::decode_jwt;
use crate::models::Claims;

pub struct AuthMiddleware;

impl<S, B> Transform<S, ServiceRequest> for AuthMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = AuthMiddlewareMiddleware<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(AuthMiddlewareMiddleware {
            service: Rc::new(service),
        })
    }
}

pub struct AuthMiddlewareMiddleware<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for AuthMiddlewareMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    fn poll_ready(
        &self,
        cx: &mut std::task::Context<'_>,
    ) -> std::task::Poll<Result<(), Self::Error>> {
        self.service.poll_ready(cx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let svc = Rc::clone(&self.service);

        Box::pin(async move {
            let headers = req.headers();
            if let Some(auth_header) = headers.get("Authorization") {
                if let Ok(auth_str) = auth_header.to_str() {
                    if auth_str.starts_with("Bearer ") {
                        let token = &auth_str[7..];
                        match decode_jwt(token) {
                            Ok(claims) => {
                                req.extensions_mut().insert::<Claims>(claims);
                                return svc.call(req).await;
                            }
                            Err(_) => {
                                return Err(actix_web::error::ErrorUnauthorized(
                                    "Invalid token",
                                ));
                            }
                        }
                    }
                }
            }

            Err(actix_web::error::ErrorUnauthorized(
                "Authorization token required",
            ))
        })
    }
}
