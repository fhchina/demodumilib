
import { Authenticator } from "./authenticator"
import type Keycloak from "keycloak-js"
import type { KeycloakError } from "keycloak-js"
import { CurrentUser } from "@/services/ant-design-pro/typings"
import { LoginRunner } from "./LoginRunner"
// import { useReducer } from "react"
// import { currentUser } from "../ant-design-pro/api"


export class KeycloakAuthenticator implements Authenticator {

	private logined = false
	private currentUser?: CurrentUser

	constructor(private keycloak: Keycloak) {
		console.log("KeycloakAuthenticator is constructing")
		this.install()
		// keycloak.
		keycloak.init({enableLogging: true, pkceMethod: 'S256'})
				.then((authenticated) => {
					this.logined = authenticated
					console.log(`keycloak init promise exeuting, authenticated: ${authenticated}`)
					console.log(this.keycloak)
				})
				.catch((reason) => {console.log(reason)})
	}

	get authenticated(): boolean {
		return this.logined || this.keycloak.authenticated || false
	}

	private install() {
		this.keycloak.onAuthError = (errorData: KeycloakError) => {
			console.log("Auth Error")
			LoginRunner.endLogin()
			console.error(errorData)
		}
		this.keycloak.onAuthSuccess = () => {
			console.log("Auth Success")
			// TODO: To unify into a UserService, to get the user profile.
			// const username = this.keycloak.idTokenParsed?.sub
			// this.subject = { name: username }
			console.log(this.keycloak)
			console.log(this.keycloak.idTokenParsed?.preferred_username)
			this.currentUser = {
				name: this.keycloak.idTokenParsed?.preferred_username
			}
			console.log(this.keycloak.profile)
			LoginRunner.endLogin()
			// currentUser().then()
		}
		this.keycloak.onAuthRefreshSuccess = () => {
			console.log("Auth Refresh Success")
		}
		this.keycloak.onAuthRefreshError = () => {
			console.log("Auth Refresh Error")
		}
		this.keycloak.onTokenExpired = () => {
			console.log("Token Expired")
		}
	}

	get subject(): CurrentUser | undefined {
		// return this.keycloak.profile?.
		console.log("get subject()")
		if (!this.keycloak.authenticated) {
			console.log("not authenticated, return undefined")
			return undefined
		}
		if (this.currentUser) {
			console.log("return non-null currentUser")
			return this.currentUser
		}

		console.log(`idTokenParsed: ${this.keycloak.idTokenParsed?.preferred_username}`)
		console.log(`TokenParsed: ${this.keycloak.tokenParsed?.preferred_username}`)
		return { name: this.keycloak.idTokenParsed?.preferred_username }

		// const profile = this.keycloak.profile 
		// if (!profile)
		// 	return undefined

		// const sub: CurrentUser = {
		// 	name: profile?.username,
		// 	// avatar: profile?
		// 	email: profile?.email,
		// 	userid: profile?.id,
		// 	// title: profile?.
		// }
		// return sub
	}

	set subject(_value: CurrentUser | undefined) {
   		// doesn't support this stuff
	}

	login() {
		this.keycloak.login()
	}

	logout(): void {
		this.keycloak.logout()
	}

}