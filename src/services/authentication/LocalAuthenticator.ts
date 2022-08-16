import { Authenticator } from "./authenticator"
import { history } from "umi"
import { CurrentUser } from "@/services/ant-design-pro/typings"

export class LocalAuthenticator implements Authenticator {

	private sub? : CurrentUser

	constructor(public loginPath: string) {

	}

	login() {
		const { location } = history;
		if (location.pathname !== this.loginPath) {
			history.push(this.loginPath)
		}
	}

	logout() {
		// TODO: To move /pages/user/login/index.tsx logic here.
	}

	// private 
	// subject : CurrentUser | null = null
	get subject(): CurrentUser | undefined {
		return this.sub	
	}
	set subject(user: CurrentUser | undefined) {
		this.sub = user
	}

	get authenticated(): boolean {
		return this.subject !== null
	}
}