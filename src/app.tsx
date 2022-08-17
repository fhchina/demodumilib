import type { Settings as LayoutSettings } from '@ant-design/pro-layout'
import { SettingDrawer, PageLoading } from '@ant-design/pro-layout'
import type { RunTimeLayoutConfig } from 'umi'
import { /*history,*/ Link } from 'umi'
import RightContent from '@/components/RightContent'
import Footer from '@/components/Footer'

import { BookOutlined, LinkOutlined } from '@ant-design/icons'
import defaultSettings from './settings'
import { Authenticator } from '@/services/authentication/authenticator'
// import { LocalAuthenticator } from '@/services/authentication/localauthenticator'
import { /*loginPath,*/ isDev, keycloakOption } from '@/constants'
import { KeycloakAuthenticator } from './services/authentication/KeycloakAuthenticator'
import Keycloak from 'keycloak-js'
import { LoginRunner } from './services/authentication/LoginRunner'

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />
}

// const authenticator = new KeycloakAuthenticator(new Keycloak(keycloakOption))
export class ShellOption {
	url?: string = "http://localhost:8080/"
	realm: string = "master"
	clientId: string = "admin-cli"

}

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getShellInitialState(option: ShellOption): Promise<{
  settings?: Partial<LayoutSettings>
  authenticator?: Authenticator
  loading?: boolean
}> {
	console.log("getShellInitialState is calling")
	const keycloak = new Keycloak(option)
	const authenticator = new KeycloakAuthenticator(keycloak)
	// (window as any)["authenticator"] = authenticator as any
	window.keycloak = keycloak
    return {
	  settings: defaultSettings,
	//   authenticator: new LocalAuthenticator(loginPath),
	  authenticator//: authenticator
	}
}

// const loginRunner = new LoginRunner(authenticator, true)

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
    //   content: initialState?.currentUser?.name,
	  content: initialState?.authenticator?.subject?.name
    },
    footerRender: () => <Footer />,
    onPageChange: (location) => {
      
      // 如果没有登录，重定向到 login
	  console.log("RuntimeLayout onPageChange: ")
	  console.log(location?.pathname)
	  if (initialState && !initialState.authenticator?.authenticated) {
		// loginRunner.startLogin()
		new LoginRunner(initialState.authenticator!, true).startLogin()
	  }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState: any) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
