import { CurrentUser  } from "@/services/ant-design-pro/typings"

export interface Authenticator {

	get authenticated(): boolean

	subject?: CurrentUser

	login(): void
	
	logout(): void

	

}