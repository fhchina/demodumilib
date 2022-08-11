import { KeycloakConfig } from "keycloak-js"

export const loginPath = '/user/login'

export const isDev = process.env.NODE_ENV === 'development'

export const keycloakOption: KeycloakConfig = {
	url: "http://192.168.35.15:8080",
	realm: "company-services",
	clientId: "movies-app",
	// pkceMethod: "S256"
}