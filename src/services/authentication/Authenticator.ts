import { CurrentUser  } from "@/services/ant-design-pro/typings"

export interface Authenticator {

	get authenticated(): boolean

	get subject(): CurrentUser | undefined

	set subject(user: CurrentUser | undefined)

	login(): void
	
	logout(): void

}