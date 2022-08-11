import { Authenticator } from "./authenticator"

const storageKey = "keycloak-authenticator"

export class LoginRunner {

	constructor(private authenticator: Authenticator, private once: boolean) {

	}

	loginOnce = (authn?: Authenticator) => {
		if (!sessionStorage.getItem(storageKey)) {
			sessionStorage.setItem(storageKey, storageKey)
			authn?.login()
		}
	}
	
	login = (authn?: Authenticator) => authn?.login()

	// Login is a long running process crossing browser page, even crossing doamin e.g. OIDC protocol
	startLogin = () => this.once? this.loginOnce(this.authenticator) : this.login(this.authenticator)

	public static endLogin() {
		sessionStorage.removeItem(storageKey)
	}
}
