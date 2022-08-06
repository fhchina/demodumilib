import { Authenticator } from "./authenticator"
import { history } from "umi"
import { CurrentUser } from "@/services/ant-design-pro/typings"

export class LocalAuthenticator implements Authenticator {

	constructor(public loginPath: string) {

	}

	login = () => {
		const { location } = history;
		if (location.pathname !== this.loginPath) {
			history.push(this.loginPath)
		}
	}

	logout(): void {
		
	}

	subject?: CurrentUser

	get authenticated(): boolean {
		return this.subject !== undefined
	}
}